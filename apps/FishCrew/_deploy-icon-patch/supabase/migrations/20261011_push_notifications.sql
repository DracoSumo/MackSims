-- FishCrew 0.10.0: iPhone push notifications.
--
-- 1. push_devices holds one row per APNs device token. RLS is on with no
--    policies and no client grants: the app only touches it through the two
--    security-definer RPCs below, and the push-dispatch edge function reads it
--    with the service role. No row for a user means no pushes, so turning
--    phone alerts off in the app (or signing out) is the opt-out.
-- 2. Charter inquiries and their status changes now create in-app
--    notifications (bookings had no notify trigger before).
-- 3. Every new notification for a user who has a registered device is handed
--    to the push-dispatch edge function through pg_net, signed with a shared
--    secret kept in Vault ('push_webhook_secret'). Without that secret the
--    trigger does nothing, and it never blocks or fails the insert.
--
-- Safe to run more than once.

create extension if not exists pg_net with schema extensions;

-- 1. Device tokens --------------------------------------------------------------
create table if not exists public.push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'ios',
  app_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_error text,
  constraint push_devices_platform_check check (platform in ('ios')),
  constraint push_devices_token_shape check (token ~ '^[0-9a-f]{32,200}$')
);

create index if not exists push_devices_user_id_idx on public.push_devices (user_id);

alter table public.push_devices enable row level security;
revoke all on table public.push_devices from public, anon, authenticated;
grant select, insert, update, delete on table public.push_devices to service_role;

create or replace function public.register_push_device(
  p_token text,
  p_platform text default 'ios',
  p_app_version text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_token text := lower(btrim(coalesce(p_token, '')));
  v_platform text := lower(btrim(coalesce(p_platform, 'ios')));
begin
  if v_uid is null then
    raise exception 'sign in to turn on phone alerts' using errcode = '42501';
  end if;
  if v_token !~ '^[0-9a-f]{32,200}$' then
    raise exception 'invalid device token' using errcode = '22023';
  end if;
  if v_platform <> 'ios' then
    raise exception 'unsupported platform' using errcode = '22023';
  end if;

  -- A token belongs to one phone; if someone else signed in on it before, it moves here.
  insert into public.push_devices (user_id, token, platform, app_version)
  values (v_uid, v_token, v_platform, left(nullif(btrim(coalesce(p_app_version, '')), ''), 32))
  on conflict (token) do update
    set user_id = excluded.user_id,
        platform = excluded.platform,
        app_version = excluded.app_version,
        last_error = null,
        updated_at = now();

  -- Keep the newest 10 devices per account.
  delete from public.push_devices d
  where d.user_id = v_uid
    and d.id in (
      select x.id from public.push_devices x
      where x.user_id = v_uid
      order by x.updated_at desc
      offset 10
    );
end;
$$;

create or replace function public.unregister_push_device(p_token text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null then
    return;
  end if;
  delete from public.push_devices
  where token = lower(btrim(coalesce(p_token, '')))
    and user_id = auth.uid();
end;
$$;

revoke all on function public.register_push_device(text, text, text) from public, anon, authenticated;
grant execute on function public.register_push_device(text, text, text) to authenticated;
revoke all on function public.unregister_push_device(text) from public, anon, authenticated;
grant execute on function public.unregister_push_device(text) to authenticated;

-- 2. Booking notifications --------------------------------------------------------
-- A booking points at its listing through charter_id (falling back to business_id,
-- as the bookings RLS policies do). The captain is charters.owner_id, or the owner
-- of the business row. Managed listings have no owner yet: the operator reads
-- those inquiries in the admin console, so nobody is notified.
create or replace function public.fc_trg_bookings_notify()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_owner text;
  v_listing text;
  v_actor text := coalesce(auth.uid()::text, '');
  v_body text;
begin
  select c.owner_id, c.name into v_owner, v_listing
  from public.charters c
  where c.id = coalesce(new.charter_id, new.business_id);

  if v_owner is null and new.business_id is not null then
    select b.owner_id, coalesce(v_listing, b.name) into v_owner, v_listing
    from public.businesses b
    where b.id = new.business_id;
  end if;

  if tg_op = 'INSERT' then
    -- Skip managed listings, and leads a captain types in for themselves.
    if coalesce(v_owner, '') = '' or v_owner = coalesce(new.customer_id, '') then
      return new;
    end if;
    perform public.fc_insert_notification(
      v_owner,
      new.customer_id,
      'booking_requested',
      'New charter inquiry',
      coalesce(nullif(btrim(new.customer_name), ''), 'An angler') || ' asked about '
        || coalesce(v_listing, 'your charter')
        || coalesce(' for ' || nullif(btrim(new.date_label), ''), '') || '.',
      'booking',
      new.id,
      '/?screen=home&open=leads',
      jsonb_build_object('booking_id', new.id, 'charter_id', new.charter_id),
      'booking_requested:' || new.id
    );
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    if coalesce(new.customer_id, '') = '' or new.customer_id = v_actor then
      return new;
    end if;
    v_body := case new.status
      when 'Contacted' then coalesce(v_listing, 'The captain') || ' started the conversation on your inquiry.'
      when 'Booked' then coalesce(v_listing, 'The captain') || ' marked your trip booked. Confirm the details with the captain.'
      when 'Closed' then coalesce(v_listing, 'The captain') || ' closed your inquiry. Rebook any time.'
      else null
    end;
    if v_body is null then
      return new;
    end if;
    perform public.fc_insert_notification(
      new.customer_id,
      nullif(v_actor, ''),
      'booking_status',
      'Charter inquiry: ' || new.status,
      v_body,
      'booking',
      new.id,
      '/?screen=explore&open=inquiries',
      jsonb_build_object('booking_id', new.id, 'status', new.status),
      'booking_status:' || new.id || ':' || to_char(now(), 'YYYY-MM-DD HH24:MI')
    );
  end if;

  return new;
exception
  when others then
    -- A notification is never worth losing the inquiry over.
    raise warning 'fc_trg_bookings_notify skipped: %', sqlerrm;
    return new;
end;
$function$;

revoke all on function public.fc_trg_bookings_notify() from public, anon, authenticated;

drop trigger if exists fc_bookings_notify on public.bookings;
create trigger fc_bookings_notify
  after insert or update of status on public.bookings
  for each row execute function public.fc_trg_bookings_notify();

-- 3. Hand new notifications to the push-dispatch edge function ----------------------
create or replace function public.fc_trg_notifications_push()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_secret text;
  v_url text;
begin
  -- Your own "trip posted" / "profile updated" notes stay in the app.
  if new.actor_id is not null and new.actor_id = new.user_id then
    return new;
  end if;
  if new.user_id !~ '^[0-9a-fA-F-]{36}$' then
    return new;
  end if;
  if not exists (select 1 from public.push_devices d where d.user_id = new.user_id::uuid) then
    return new;
  end if;

  select s.decrypted_secret into v_secret
  from vault.decrypted_secrets s
  where s.name = 'push_webhook_secret'
  limit 1;
  if coalesce(v_secret, '') = '' then
    return new;
  end if;

  select s.decrypted_secret into v_url
  from vault.decrypted_secrets s
  where s.name = 'push_dispatch_url'
  limit 1;
  v_url := coalesce(nullif(v_url, ''), 'https://kkyuychvitrmtehvzqfd.supabase.co/functions/v1/push-dispatch');

  -- pg_net queues the request and sends it after commit; this never waits on Apple.
  perform net.http_post(
    url := v_url,
    body := jsonb_build_object('notification_id', new.id),
    headers := jsonb_build_object('content-type', 'application/json', 'x-push-secret', v_secret),
    timeout_milliseconds := 10000
  );
  return new;
exception
  when others then
    raise warning 'fc_trg_notifications_push skipped: %', sqlerrm;
    return new;
end;
$function$;

revoke all on function public.fc_trg_notifications_push() from public, anon, authenticated;

drop trigger if exists fc_notifications_push on public.notifications;
create trigger fc_notifications_push
  after insert on public.notifications
  for each row execute function public.fc_trg_notifications_push();
