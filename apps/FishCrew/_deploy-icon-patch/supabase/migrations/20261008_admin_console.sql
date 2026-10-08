-- 2026-10-08 FishCrew admin console
--
-- Server-side powers for the operator account (profiles.role = 'Admin'):
--   * moderation of trips, feed posts, chat messages, media and reports
--   * user restrictions (suspend for N days, ban), role changes
--   * announcements and featured trips
--   * stats and an audit log of every admin action (admin_events)
--
-- Every admin_* function checks is_admin() itself, and clients cannot write the
-- new tables directly. Restrictions are enforced by restrictive RLS policies
-- (no posting or editing) and by auth.users.banned_until (no sign-in or token
-- refresh). Users can no longer undo an admin decision on their own profile
-- status or on a trip an admin hid.

-- 0. Guard used by every admin RPC ------------------------------------------
create or replace function public.admin_assert()
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin only' using errcode = '42501';
  end if;
end;
$$;

-- 1. Audit log ---------------------------------------------------------------
alter table public.admin_events add column if not exists target_type text;
alter table public.admin_events add column if not exists target_id text;
alter table public.admin_events add column if not exists details jsonb not null default '{}'::jsonb;
create index if not exists admin_events_created_at_idx on public.admin_events (created_at desc);
create index if not exists admin_events_target_idx on public.admin_events (target_type, target_id, created_at desc);

create or replace function public.admin_log(
  p_event_type text,
  p_target_type text,
  p_target_id text,
  p_body text,
  p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.admin_events (id, actor_id, event_type, target_type, target_id, body, details, created_at)
  values (
    'adm_' || replace(gen_random_uuid()::text, '-', ''),
    (select auth.uid())::text,
    p_event_type,
    p_target_type,
    p_target_id,
    left(coalesce(p_body, ''), 500),
    coalesce(p_details, '{}'::jsonb),
    -- clock_timestamp keeps events in order even inside one transaction.
    clock_timestamp()
  );
end;
$$;

-- 2. Suspensions and bans ----------------------------------------------------
create table if not exists public.user_restrictions (
  user_id text primary key,
  status text not null check (status in ('Suspended', 'Banned')),
  reason text not null default '' check (char_length(reason) <= 500),
  restricted_until timestamptz,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_restrictions_suspension_has_end check (status = 'Banned' or restricted_until is not null)
);
comment on table public.user_restrictions is
  'FishCrew suspensions and bans. Written only by admin RPCs. A user can read their own row; the admin reads all.';

alter table public.user_restrictions enable row level security;
revoke all on table public.user_restrictions from anon, authenticated;
grant select on table public.user_restrictions to authenticated;
drop policy if exists user_restrictions_select_self_or_admin on public.user_restrictions;
create policy user_restrictions_select_self_or_admin on public.user_restrictions
  for select to authenticated
  using (user_id = (select auth.uid())::text or (select public.is_admin()));

create or replace function public.is_restricted()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.user_restrictions r
    where r.user_id = (select auth.uid())::text
      and (r.restricted_until is null or r.restricted_until > now())
  );
$$;

-- A restricted account can still read, report, block and delete itself, but
-- it cannot create or edit anything.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'trip_posts', 'trip_private_details', 'trip_members', 'join_requests',
    'trip_messages', 'feed_posts', 'media_assets', 'charters', 'charter_reviews',
    'businesses', 'bookings', 'campaigns'
  ] loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('drop policy if exists restricted_users_no_insert on public.%I', t);
    execute format(
      'create policy restricted_users_no_insert on public.%I as restrictive for insert to authenticated with check (not (select public.is_restricted()))',
      t
    );
    execute format('drop policy if exists restricted_users_no_update on public.%I', t);
    execute format(
      'create policy restricted_users_no_update on public.%I as restrictive for update to authenticated using (not (select public.is_restricted()))',
      t
    );
  end loop;
end;
$$;

-- 3. Only the admin changes a profile's status --------------------------------
-- (A user may still set their own profile to 'Deleted' through account deletion.)
create or replace function public.profiles_guard_status()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if coalesce(new.status, '') in ('Suspended', 'Banned', 'Removed') then
      new.status := 'Live';
    end if;
    return new;
  end if;
  if new.status is distinct from old.status and coalesce(new.status, '') <> 'Deleted' then
    new.status := old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_guard_status on public.profiles;
create trigger trg_profiles_guard_status
  before insert or update on public.profiles
  for each row execute function public.profiles_guard_status();

-- 4. Trips: featured flag, and Hidden/Removed are admin-only statuses ---------
alter table public.trip_posts add column if not exists featured boolean not null default false;

create or replace function public.trip_posts_admin_guard()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.featured := false;
    if coalesce(new.status, '') in ('Hidden', 'Removed') then
      new.status := 'Open';
    end if;
    return new;
  end if;
  new.featured := old.featured;
  -- A host keeps editing a trip the admin hid, but it stays hidden; and a
  -- host cannot use the admin-only statuses.
  if coalesce(old.status, '') in ('Hidden', 'Removed')
     or coalesce(new.status, '') in ('Hidden', 'Removed') then
    new.status := old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_trip_posts_admin_guard on public.trip_posts;
create trigger trg_trip_posts_admin_guard
  before insert or update on public.trip_posts
  for each row execute function public.trip_posts_admin_guard();

-- Same trip notifications as before, except that an admin hiding or restoring
-- a trip, and edits to a hidden trip, no longer send "Trip updated" to its crew.
create or replace function public.fc_trg_trip_posts_notify()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_actor text := coalesce(auth.uid()::text, new.host_id);
  v_title text;
begin
  if tg_op = 'INSERT' then
    perform public.fc_insert_notification(
      new.host_id, new.host_id, 'trip_posted', 'Trip posted',
      format('Your trip "%s" is now live on the board.', new.title), 'trip', new.id, '/?screen=explore',
      jsonb_build_object('trip_id', new.id), 'trip_posted:' || new.id
    );
    return new;
  end if;
  if tg_op = 'UPDATE' then
    if coalesce(new.status, '') in ('Hidden', 'Removed')
       or (old.status is distinct from new.status and coalesce(old.status, '') in ('Hidden', 'Removed')) then
      return new;
    end if;
    if old.status is distinct from new.status and new.status = 'Cancelled' then
      perform public.fc_notify_trip_members(new.id, v_actor, 'trip_canceled', 'Trip canceled',
        format('"%s" was canceled by the host.', new.title), '/?screen=crew', 'trip_canceled');
      return new;
    end if;
    if old.status is distinct from new.status and new.status = 'Completed' then
      return new;
    end if;
    if (
      old.title is distinct from new.title
      or old.start_label is distinct from new.start_label
      or old.public_location is distinct from new.public_location
      or old.open_spots is distinct from new.open_spots
      or old.area is distinct from new.area
      or old.status is distinct from new.status
    ) then
      v_title := format('Trip updated: %s', new.title);
      perform public.fc_notify_trip_members(new.id, v_actor, 'trip_updated', 'Trip updated', v_title, '/?screen=crew',
        'trip_updated:' || to_char(now(), 'YYYY-MM-DD HH24:MI'));
    end if;
  end if;
  return new;
end;
$function$;

-- 4b. Reports can point at any kind of content (trip, message, post, user) -----
alter table public.moderation_items add column if not exists target_type text;
alter table public.moderation_items add column if not exists target_id text;
create index if not exists moderation_items_status_created_idx on public.moderation_items (status, created_at desc);

-- 5. Chat messages the admin hides disappear for everyone else ----------------
alter table public.trip_messages add column if not exists hidden_at timestamptz;
alter table public.trip_messages add column if not exists hidden_by text;
drop policy if exists messages_hidden_admin_only on public.trip_messages;
create policy messages_hidden_admin_only on public.trip_messages
  as restrictive for select to public
  using (hidden_at is null or (select public.is_admin()));

-- 6. Announcements -------------------------------------------------------------
create table if not exists public.announcements (
  id text primary key default ('ann_' || replace(gen_random_uuid()::text, '-', '')),
  title text not null check (char_length(btrim(title)) between 1 and 80),
  body text not null default '' check (char_length(body) <= 400),
  link_url text check (link_url is null or link_url ~ '^https://[^[:space:]]+$'),
  level text not null default 'info' check (level in ('info', 'alert', 'promo')),
  active boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.announcements is
  'FishCrew announcement banners. Everyone reads live ones; only admin RPCs write.';

alter table public.announcements enable row level security;
revoke all on table public.announcements from anon, authenticated;
grant select on table public.announcements to anon, authenticated;
drop policy if exists announcements_select_live on public.announcements;
create policy announcements_select_live on public.announcements
  for select to anon, authenticated
  using (
    (active and starts_at <= now() and (ends_at is null or ends_at > now()))
    or (select public.is_admin())
  );

-- 7. Admin RPCs ---------------------------------------------------------------
create or replace function public.admin_stats()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform public.admin_assert();
  return jsonb_build_object(
    'users_total', (select count(*) from auth.users),
    'users_new_7d', (select count(*) from auth.users where created_at > now() - interval '7 days'),
    'users_active_7d', (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
    'profiles_total', (select count(*) from public.profiles where coalesce(status, 'Live') <> 'Deleted'),
    'restricted_users', (select count(*) from public.user_restrictions where restricted_until is null or restricted_until > now()),
    'trips_total', (select count(*) from public.trip_posts),
    'trips_open', (select count(*) from public.trip_posts where coalesce(status, 'Open') = 'Open'),
    'trips_hidden', (select count(*) from public.trip_posts where status in ('Hidden', 'Removed')),
    'trips_new_7d', (select count(*) from public.trip_posts where created_at > now() - interval '7 days'),
    'feed_live', (select count(*) from public.feed_posts where status in ('Live', 'Approved', 'Sponsored')),
    'feed_pending', (select count(*) from public.feed_posts where status in ('Pending review', 'Review')),
    'feed_new_7d', (select count(*) from public.feed_posts where created_at > now() - interval '7 days'),
    'messages_7d', (select count(*) from public.trip_messages where created_at > now() - interval '7 days'),
    'join_requests_pending', (select count(*) from public.join_requests where coalesce(status, 'Pending') = 'Pending'),
    'reports_open', (select count(*) from public.moderation_items where coalesce(status, 'Open') in ('Open', 'New', 'Review')),
    'media_pending', (select count(*) from public.media_assets where coalesce(moderation_status, status) in ('Review', 'Pending review')),
    'deletion_requests_open', (select count(*) from public.account_deletion_requests where coalesce(status, 'Requested') <> 'Completed'),
    'waitlist_new', (select count(*) from public.captain_waitlist where coalesce(status, 'New') = 'New'),
    'announcements_live', (select count(*) from public.announcements where active and starts_at <= now() and (ends_at is null or ends_at > now())),
    'generated_at', now()
  );
end;
$$;

create or replace function public.admin_list_users(
  p_search text default '',
  p_limit integer default 100,
  p_offset integer default 0
)
returns table (
  user_id text,
  email text,
  username text,
  full_name text,
  role text,
  profile_status text,
  restriction text,
  restricted_until timestamptz,
  restriction_reason text,
  joined_at timestamptz,
  last_sign_in_at timestamptz,
  has_profile boolean,
  trips_count bigint,
  posts_count bigint,
  reports_count bigint
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  q text := lower(btrim(coalesce(p_search, '')));
begin
  perform public.admin_assert();
  return query
  select
    u.id::text,
    u.email::text,
    p.username,
    p.full_name,
    p.role,
    p.status,
    r.status,
    r.restricted_until,
    r.reason,
    u.created_at,
    u.last_sign_in_at,
    (p.id is not null),
    (select count(*) from public.trip_posts t where t.host_id = u.id::text),
    (select count(*) from public.feed_posts f where f.author_id = u.id::text),
    (select count(*) from public.moderation_items m where m.target_user_id = u.id::text)
  from auth.users u
  left join public.profiles p on p.id = u.id::text
  left join public.user_restrictions r
    on r.user_id = u.id::text
   and (r.restricted_until is null or r.restricted_until > now())
  where q = ''
     or u.id::text = q
     or position(q in lower(coalesce(u.email::text, ''))) > 0
     or position(q in lower(coalesce(p.username, ''))) > 0
     or position(q in lower(coalesce(p.full_name, ''))) > 0
  order by u.created_at desc
  limit least(greatest(coalesce(p_limit, 100), 1), 500)
  offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

create or replace function public.admin_set_user_role(p_user_id text, p_role text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_old text;
begin
  perform public.admin_assert();
  if p_role is null or p_role not in ('Angler', 'Captain', 'Business') then
    raise exception 'Role must be Angler, Captain or Business' using errcode = '22023';
  end if;
  if p_user_id = (select auth.uid())::text then
    raise exception 'You cannot change your own role here' using errcode = '22023';
  end if;
  select p.role into v_old from public.profiles p where p.id = p_user_id for update;
  if not found then
    raise exception 'That account has no profile yet' using errcode = 'P0002';
  end if;
  if lower(coalesce(v_old, '')) in ('admin', 'operator') then
    raise exception 'Admin accounts cannot be changed here' using errcode = '22023';
  end if;
  update public.profiles set role = p_role, updated_at = now() where id = p_user_id;
  perform public.admin_log(
    'user_role_changed', 'user', p_user_id,
    format('Role %s to %s', coalesce(v_old, 'none'), p_role),
    jsonb_build_object('from', v_old, 'to', p_role)
  );
end;
$$;

create or replace function public.admin_restrict_user(
  p_user_id text,
  p_status text,
  p_days integer default null,
  p_reason text default '',
  p_hide_content boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_until timestamptz;
  v_role text;
  v_hidden_trips integer := 0;
  v_removed_posts integer := 0;
  r record;
begin
  perform public.admin_assert();
  if p_status is null or p_status not in ('Suspended', 'Banned') then
    raise exception 'Status must be Suspended or Banned' using errcode = '22023';
  end if;
  if p_user_id is null or p_user_id = (select auth.uid())::text then
    raise exception 'You cannot restrict your own account' using errcode = '22023';
  end if;
  if not exists (select 1 from auth.users u where u.id::text = p_user_id) then
    raise exception 'Account not found' using errcode = 'P0002';
  end if;
  select p.role into v_role from public.profiles p where p.id = p_user_id;
  if lower(coalesce(v_role, '')) in ('admin', 'operator') then
    raise exception 'Admin accounts cannot be restricted' using errcode = '22023';
  end if;
  if p_status = 'Suspended' then
    if p_days is null or p_days < 1 or p_days > 365 then
      raise exception 'A suspension needs 1 to 365 days' using errcode = '22023';
    end if;
    v_until := now() + make_interval(days => p_days);
  end if;

  insert into public.user_restrictions (user_id, status, reason, restricted_until, created_by, created_at, updated_at)
  values (p_user_id, p_status, left(coalesce(p_reason, ''), 500), v_until, (select auth.uid())::text, now(), now())
  on conflict (user_id) do update
    set status = excluded.status,
        reason = excluded.reason,
        restricted_until = excluded.restricted_until,
        created_by = excluded.created_by,
        updated_at = now();

  update public.profiles set status = p_status, updated_at = now() where id = p_user_id;

  -- Supabase Auth refuses sign-in and token refresh until banned_until.
  update auth.users
     set banned_until = coalesce(v_until, now() + interval '100 years')
   where id::text = p_user_id;

  if p_hide_content then
    for r in
      select t.id, t.status from public.trip_posts t
      where t.host_id = p_user_id and coalesce(t.status, '') not in ('Hidden', 'Removed', 'Deleted')
    loop
      update public.trip_posts set status = 'Hidden', updated_at = now() where id = r.id;
      perform public.admin_log('trip_hidden', 'trip', r.id, 'Hidden with account restriction',
        jsonb_build_object('prev_status', r.status, 'with_restriction', true));
      v_hidden_trips := v_hidden_trips + 1;
    end loop;
    for r in
      select f.id, f.status from public.feed_posts f
      where f.author_id = p_user_id and coalesce(f.status, '') not in ('Removed', 'Deleted')
    loop
      update public.feed_posts set status = 'Removed', updated_at = now() where id = r.id;
      perform public.admin_log('feed_removed', 'feed', r.id, 'Removed with account restriction',
        jsonb_build_object('prev_status', r.status, 'with_restriction', true));
      v_removed_posts := v_removed_posts + 1;
    end loop;
  end if;

  perform public.admin_log(
    case when p_status = 'Banned' then 'user_banned' else 'user_suspended' end,
    'user', p_user_id, left(coalesce(p_reason, ''), 300),
    jsonb_build_object('until', v_until, 'hidden_trips', v_hidden_trips, 'removed_posts', v_removed_posts)
  );
  return jsonb_build_object('until', v_until, 'hidden_trips', v_hidden_trips, 'removed_posts', v_removed_posts);
end;
$$;

-- Lifting a restriction also brings back the trips and posts that were hidden
-- together with it (unless an admin hid them again separately since).
create or replace function public.admin_lift_restriction(p_user_id text, p_restore_content boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_restored_trips integer := 0;
  v_restored_posts integer := 0;
  v_status text;
  r record;
begin
  perform public.admin_assert();
  delete from public.user_restrictions where user_id = p_user_id;
  update public.profiles set status = 'Live', updated_at = now()
   where id = p_user_id and status in ('Suspended', 'Banned');
  update auth.users set banned_until = null where id::text = p_user_id;

  if coalesce(p_restore_content, true) then
    for r in
      select t.id, e.details
        from public.trip_posts t
        cross join lateral (
          select ev.event_type, ev.details
            from public.admin_events ev
           where ev.target_type = 'trip' and ev.target_id = t.id
             and ev.event_type in ('trip_hidden', 'trip_restored')
           order by ev.created_at desc
           limit 1
        ) e
       where t.host_id = p_user_id and t.status = 'Hidden'
         and e.event_type = 'trip_hidden'
         and coalesce((e.details ->> 'with_restriction')::boolean, false)
    loop
      v_status := coalesce(nullif(r.details ->> 'prev_status', ''), 'Open');
      if v_status in ('Hidden', 'Removed', 'Deleted') then
        v_status := 'Open';
      end if;
      update public.trip_posts set status = v_status, updated_at = now() where id = r.id;
      perform public.admin_log('trip_restored', 'trip', r.id, 'Restored with lifted restriction',
        jsonb_build_object('prev_status', 'Hidden', 'new_status', v_status, 'with_restriction', true));
      v_restored_trips := v_restored_trips + 1;
    end loop;

    for r in
      select f.id, e.details
        from public.feed_posts f
        cross join lateral (
          select ev.event_type, ev.details
            from public.admin_events ev
           where ev.target_type = 'feed' and ev.target_id = f.id
             and ev.event_type in ('feed_removed', 'feed_restored', 'feed_approved')
           order by ev.created_at desc
           limit 1
        ) e
       where f.author_id = p_user_id and f.status = 'Removed'
         and e.event_type = 'feed_removed'
         and coalesce((e.details ->> 'with_restriction')::boolean, false)
    loop
      v_status := coalesce(nullif(r.details ->> 'prev_status', ''), 'Live');
      if v_status not in ('Live', 'Approved', 'Sponsored', 'Pending review', 'Review') then
        v_status := 'Live';
      end if;
      update public.feed_posts set status = v_status, updated_at = now() where id = r.id;
      perform public.admin_log('feed_restored', 'feed', r.id, 'Restored with lifted restriction',
        jsonb_build_object('prev_status', 'Removed', 'new_status', v_status, 'with_restriction', true));
      v_restored_posts := v_restored_posts + 1;
    end loop;
  end if;

  perform public.admin_log('user_restriction_lifted', 'user', p_user_id, 'Restriction lifted',
    jsonb_build_object('restored_trips', v_restored_trips, 'restored_posts', v_restored_posts));
  return jsonb_build_object('restored_trips', v_restored_trips, 'restored_posts', v_restored_posts);
end;
$$;

create or replace function public.admin_moderate(
  p_target_type text,
  p_target_id text,
  p_action text,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid text := (select auth.uid())::text;
  v_prev text;
  v_new text;
  v_event text;
  v_media public.media_assets%rowtype;
begin
  perform public.admin_assert();
  if coalesce(p_target_id, '') = '' then
    raise exception 'Missing target' using errcode = '22023';
  end if;

  if p_target_type = 'trip' then
    select t.status into v_prev from public.trip_posts t where t.id = p_target_id for update;
    if not found then
      raise exception 'Trip not found' using errcode = 'P0002';
    end if;
    if p_action = 'hide' then
      if coalesce(v_prev, '') in ('Hidden', 'Removed') then
        -- Already hidden: keep the first hide's prev_status for a later restore.
        return jsonb_build_object('target_type', p_target_type, 'target_id', p_target_id, 'action', p_action, 'prev', v_prev, 'new', v_prev, 'unchanged', true);
      end if;
      v_new := 'Hidden';
      update public.trip_posts set status = v_new, updated_at = now() where id = p_target_id;
      v_event := 'trip_hidden';
    elsif p_action = 'restore' then
      select e.details ->> 'prev_status' into v_new
        from public.admin_events e
       where e.target_type = 'trip' and e.target_id = p_target_id and e.event_type = 'trip_hidden'
       order by e.created_at desc
       limit 1;
      if coalesce(v_new, '') = '' or v_new in ('Hidden', 'Removed', 'Deleted') then
        v_new := 'Open';
      end if;
      update public.trip_posts set status = v_new, updated_at = now() where id = p_target_id;
      v_event := 'trip_restored';
    elsif p_action in ('feature', 'unfeature') then
      update public.trip_posts set featured = (p_action = 'feature'), updated_at = now() where id = p_target_id;
      v_new := v_prev;
      v_event := case when p_action = 'feature' then 'trip_featured' else 'trip_unfeatured' end;
    else
      raise exception 'Unknown trip action %', p_action using errcode = '22023';
    end if;

  elsif p_target_type = 'feed' then
    select f.status into v_prev from public.feed_posts f where f.id = p_target_id for update;
    if not found then
      raise exception 'Post not found' using errcode = 'P0002';
    end if;
    if p_action = 'remove' then
      if v_prev = 'Removed' then
        return jsonb_build_object('target_type', p_target_type, 'target_id', p_target_id, 'action', p_action, 'prev', v_prev, 'new', v_prev, 'unchanged', true);
      end if;
      v_new := 'Removed';
      v_event := 'feed_removed';
    elsif p_action = 'restore' then
      -- Back to what it was before removal (a post still in review goes back to review).
      select e.details ->> 'prev_status' into v_new
        from public.admin_events e
       where e.target_type = 'feed' and e.target_id = p_target_id and e.event_type = 'feed_removed'
       order by e.created_at desc
       limit 1;
      if coalesce(v_new, '') not in ('Live', 'Approved', 'Sponsored', 'Pending review', 'Review') then
        v_new := 'Live';
      end if;
      v_event := 'feed_restored';
    elsif p_action = 'approve' then
      v_new := 'Live';
      v_event := 'feed_approved';
    else
      raise exception 'Unknown post action %', p_action using errcode = '22023';
    end if;
    update public.feed_posts set status = v_new, updated_at = now() where id = p_target_id;

  elsif p_target_type = 'message' then
    select case when m.hidden_at is null then 'Visible' else 'Hidden' end
      into v_prev
      from public.trip_messages m where m.id = p_target_id for update;
    if not found then
      raise exception 'Message not found' using errcode = 'P0002';
    end if;
    if p_action = 'hide' then
      update public.trip_messages set hidden_at = now(), hidden_by = v_uid where id = p_target_id;
      v_new := 'Hidden';
      v_event := 'message_hidden';
    elsif p_action = 'restore' then
      update public.trip_messages set hidden_at = null, hidden_by = null where id = p_target_id;
      v_new := 'Visible';
      v_event := 'message_restored';
    else
      raise exception 'Unknown message action %', p_action using errcode = '22023';
    end if;

  elsif p_target_type = 'media' then
    select * into v_media from public.media_assets a where a.id = p_target_id for update;
    if not found then
      raise exception 'Media not found' using errcode = 'P0002';
    end if;
    v_prev := coalesce(v_media.moderation_status, v_media.status);
    if p_action = 'approve' then
      v_new := 'Approved';
      v_event := 'media_approved';
      update public.media_assets set status = v_new, moderation_status = v_new, updated_at = now() where id = p_target_id;
      if v_media.source_type = 'feed' then
        update public.feed_posts
           set status = case when status in ('Pending review', 'Review') then 'Live' else status end,
               media_url = coalesce(nullif(v_media.public_url, ''), media_url),
               updated_at = now()
         where id = v_media.source_id;
      elsif v_media.source_type = 'trip' and coalesce(v_media.public_url, '') <> '' then
        update public.trip_posts
           set media_url = v_media.public_url, media_moderation_status = 'Approved', updated_at = now()
         where id = v_media.source_id;
      elsif v_media.source_type = 'profile' and coalesce(v_media.public_url, '') <> '' then
        update public.profiles
           set avatar_url = v_media.public_url, avatar_moderation_status = 'Approved', updated_at = now()
         where id = coalesce(nullif(v_media.owner_id, ''), v_media.source_id);
      end if;
    elsif p_action = 'reject' then
      v_new := 'Removed';
      v_event := 'media_rejected';
      update public.media_assets set status = v_new, moderation_status = v_new, updated_at = now() where id = p_target_id;
      if v_media.source_type = 'feed' then
        update public.feed_posts set status = 'Removed', updated_at = now()
         where id = v_media.source_id and status in ('Pending review', 'Review');
      end if;
    else
      raise exception 'Unknown media action %', p_action using errcode = '22023';
    end if;

  elsif p_target_type = 'report' then
    select m.status into v_prev from public.moderation_items m where m.id = p_target_id for update;
    if not found then
      raise exception 'Report not found' using errcode = 'P0002';
    end if;
    if p_action in ('resolve', 'dismiss') then
      v_new := 'Resolved';
      v_event := case when p_action = 'resolve' then 'report_resolved' else 'report_dismissed' end;
    elsif p_action = 'reopen' then
      v_new := 'Open';
      v_event := 'report_reopened';
    else
      raise exception 'Unknown report action %', p_action using errcode = '22023';
    end if;
    update public.moderation_items
       set status = v_new,
           acted_by = v_uid,
           acted_at = now(),
           resolution_note = case
             when p_action = 'reopen' then resolution_note
             else nullif(left(coalesce(nullif(btrim(p_note), ''), case when p_action = 'dismiss' then 'No action needed' else '' end), 500), '')
           end,
           updated_at = now()
     where id = p_target_id;

  else
    raise exception 'Unknown target type %', p_target_type using errcode = '22023';
  end if;

  perform public.admin_log(v_event, p_target_type, p_target_id, coalesce(p_note, ''),
    jsonb_build_object('prev_status', v_prev, 'new_status', v_new));
  return jsonb_build_object('target_type', p_target_type, 'target_id', p_target_id, 'action', p_action, 'prev', v_prev, 'new', v_new);
end;
$$;

create or replace function public.admin_save_announcement(
  p_id text,
  p_title text,
  p_body text default '',
  p_link_url text default null,
  p_level text default 'info',
  p_active boolean default true,
  p_ends_at timestamptz default null
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id text := nullif(btrim(coalesce(p_id, '')), '');
  v_link text := nullif(btrim(coalesce(p_link_url, '')), '');
begin
  perform public.admin_assert();
  if coalesce(btrim(p_title), '') = '' then
    raise exception 'Add a title' using errcode = '22023';
  end if;
  if v_link is not null and v_link !~ '^https://[^[:space:]]+$' then
    raise exception 'Links must start with https://' using errcode = '22023';
  end if;
  if coalesce(p_level, 'info') not in ('info', 'alert', 'promo') then
    raise exception 'Unknown banner style' using errcode = '22023';
  end if;
  if v_id is null then
    insert into public.announcements (title, body, link_url, level, active, ends_at, created_by)
    values (btrim(p_title), coalesce(p_body, ''), v_link, coalesce(p_level, 'info'), coalesce(p_active, true), p_ends_at, (select auth.uid())::text)
    returning id into v_id;
    perform public.admin_log('announcement_created', 'announcement', v_id, btrim(p_title), '{}'::jsonb);
  else
    update public.announcements
       set title = btrim(p_title),
           body = coalesce(p_body, ''),
           link_url = v_link,
           level = coalesce(p_level, 'info'),
           active = coalesce(p_active, true),
           ends_at = p_ends_at,
           updated_at = now()
     where id = v_id;
    if not found then
      raise exception 'Announcement not found' using errcode = 'P0002';
    end if;
    perform public.admin_log('announcement_updated', 'announcement', v_id, btrim(p_title),
      jsonb_build_object('active', coalesce(p_active, true)));
  end if;
  return v_id;
end;
$$;

create or replace function public.admin_delete_announcement(p_id text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_title text;
begin
  perform public.admin_assert();
  delete from public.announcements where id = p_id returning title into v_title;
  if not found then
    raise exception 'Announcement not found' using errcode = 'P0002';
  end if;
  perform public.admin_log('announcement_deleted', 'announcement', p_id, coalesce(v_title, ''), '{}'::jsonb);
end;
$$;

-- 8. Who may call what --------------------------------------------------------
-- Supabase grants EXECUTE on new functions to anon and authenticated by
-- default, so revoke first. Internal helpers get no client grant at all.
revoke all on function public.admin_assert() from public, anon, authenticated;
revoke all on function public.admin_log(text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.profiles_guard_status() from public, anon, authenticated;
revoke all on function public.trip_posts_admin_guard() from public, anon, authenticated;

revoke all on function public.is_restricted() from public, anon, authenticated;
grant execute on function public.is_restricted() to anon, authenticated;

revoke all on function public.admin_stats() from public, anon, authenticated;
revoke all on function public.admin_list_users(text, integer, integer) from public, anon, authenticated;
revoke all on function public.admin_set_user_role(text, text) from public, anon, authenticated;
revoke all on function public.admin_restrict_user(text, text, integer, text, boolean) from public, anon, authenticated;
revoke all on function public.admin_lift_restriction(text, boolean) from public, anon, authenticated;
revoke all on function public.admin_moderate(text, text, text, text) from public, anon, authenticated;
revoke all on function public.admin_save_announcement(text, text, text, text, text, boolean, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_delete_announcement(text) from public, anon, authenticated;

grant execute on function public.admin_stats() to authenticated;
grant execute on function public.admin_list_users(text, integer, integer) to authenticated;
grant execute on function public.admin_set_user_role(text, text) to authenticated;
grant execute on function public.admin_restrict_user(text, text, integer, text, boolean) to authenticated;
grant execute on function public.admin_lift_restriction(text, boolean) to authenticated;
grant execute on function public.admin_moderate(text, text, text, text) to authenticated;
grant execute on function public.admin_save_announcement(text, text, text, text, text, boolean, timestamptz) to authenticated;
grant execute on function public.admin_delete_announcement(text) to authenticated;
