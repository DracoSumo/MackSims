-- 2026-10-04 security audit fixes (applied to project kkyuychvitrmtehvzqfd)
--
-- C2  login_identifier_for_username let anyone turn usernames into account
--     emails. Sign-in is now email-only in the app; the function is removed.
-- H1  Captains/businesses could self-publish ('Directory'/'Live' on insert,
--     or Directory -> Live on update). Guards now cover INSERT and every
--     public status.
-- H2  media_assets rows could be inserted already 'Approved'.
-- M1  Approved crew members could rewrite the host's private meetup details.
-- H3  website_url must be https (blocks javascript: links at the source).

-- C2: remove the username -> email oracle (all overloads).
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'login_identifier_for_username'
  loop
    execute format('drop function %s', f.sig);
  end loop;
end $$;

-- H1: charters. Non-admins can never move a listing into a public status.
create or replace function public.charters_owner_cannot_self_verify()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if public.is_admin() then
    if tg_op = 'UPDATE' then new.updated_at := now(); end if;
    return new;
  end if;
  if new.status = any (array['Live', 'Verified', 'Approved', 'Directory'])
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    new.status := 'Pending review';
  end if;
  if tg_op = 'UPDATE' then new.updated_at := now(); end if;
  return new;
end;
$$;

drop trigger if exists trg_charters_no_self_verify on public.charters;
create trigger trg_charters_no_self_verify
  before insert or update on public.charters
  for each row execute function public.charters_owner_cannot_self_verify();

-- H1: businesses, same rule.
create or replace function public.businesses_owner_cannot_self_verify()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.status = any (array['Live', 'Verified', 'Approved', 'Directory'])
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    new.status := 'Pending review';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_businesses_no_self_verify on public.businesses;
create trigger trg_businesses_no_self_verify
  before insert or update on public.businesses
  for each row execute function public.businesses_owner_cannot_self_verify();

-- H2: media cannot be inserted pre-approved by non-admins.
create or replace function public.media_assets_owner_cannot_self_approve()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if public.media_is_publicly_approved(coalesce(new.moderation_status, new.status)) then
      new.status := 'Review';
      new.moderation_status := 'Review';
    end if;
  elsif public.media_is_publicly_approved(coalesce(new.moderation_status, new.status))
     and not public.media_is_publicly_approved(coalesce(old.moderation_status, old.status)) then
    raise exception 'Only operators can approve media assets';
  end if;
  if new.moderation_status is null or new.moderation_status = '' then
    new.moderation_status := new.status;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_media_assets_no_self_approve on public.media_assets;
create trigger trg_media_assets_no_self_approve
  before insert or update on public.media_assets
  for each row execute function public.media_assets_owner_cannot_self_approve();

-- M1: members can read the meetup details; only the host (or admin) can write them.
drop policy if exists trip_private_details_members on public.trip_private_details;
drop policy if exists trip_private_details_read on public.trip_private_details;
drop policy if exists trip_private_details_host_write on public.trip_private_details;
create policy trip_private_details_read on public.trip_private_details
  for select to authenticated
  using (
    public.is_admin()
    or host_id = (auth.uid())::text
    or exists (
      select 1 from public.trip_members m
      where m.trip_id = trip_private_details.trip_id
        and m.user_id = (auth.uid())::text
        and m.status = 'Approved'
    )
  );
create policy trip_private_details_host_write on public.trip_private_details
  for all to authenticated
  using (public.is_admin() or host_id = (auth.uid())::text)
  with check (public.is_admin() or host_id = (auth.uid())::text);

-- H3: https-only website links (NOT VALID: existing rows are left as-is, new writes are checked).
do $$
declare t text;
begin
  foreach t in array array['charters', 'businesses', 'captain_waitlist'] loop
    if exists (select 1 from information_schema.columns
               where table_schema = 'public' and table_name = t and column_name = 'website_url')
       and not exists (select 1 from pg_constraint where conname = t || '_website_url_https') then
      execute format(
        'alter table public.%I add constraint %I check (website_url is null or website_url = '''' or website_url ~* ''^https://'') not valid',
        t, t || '_website_url_https');
    end if;
  end loop;
end $$;
