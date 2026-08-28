-- MotoCrew: block admin force-enroll from granting location share.
--
-- Bug (master 20260729191000):
--   crew_members INSERT allows motocrew_is_crew_admin(crew_id) to insert ANY
--   user_id with status='active' (default). location_share_settings SELECT
--   treats any mutual active crew as consent, so an admin who knows a victim
--   UUID can silently enroll them into a shadow crew and read lat/lng while
--   share_with_crew=true — even after the victim left every crew they chose.
--
-- Fix: cross-user membership inserts must be status='invited'; only the
-- invited user may activate. motocrew_is_crew_member / location SELECT already
-- require status='active', so invites grant no location until accepted.
--
-- Compatible with open PR #24 (admin-invite path kept; activation is opt-in).
-- Project: npmiwnxnqgonnmwvblyi

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

-- Allow invited status on existing databases (greenfield base migration already lists it).
alter table public.crew_members
  drop constraint if exists crew_members_status_check;

alter table public.crew_members
  add constraint crew_members_status_check
  check (status in ('active', 'left', 'invited'));

create or replace function private.motocrew_guard_crew_member_invite()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if tg_op = 'INSERT' then
    -- Founding owner / self rows may start active. Cross-user enroll cannot.
    if new.user_id is distinct from (select auth.uid())
       and new.status is distinct from 'invited' then
      raise exception
        'Cross-user crew enroll must use status=invited until the member accepts';
    end if;
    return new;
  end if;

  -- UPDATE: only the member themselves may move to active (accept / rejoin).
  -- Blocks admin force-activate of invited or left rows (location mutual-crew).
  if old.status is distinct from 'active'
     and new.status = 'active'
     and new.user_id is distinct from (select auth.uid()) then
    raise exception 'Only the invited user can accept crew membership';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_motocrew_guard_crew_member_invite on public.crew_members;
create trigger trg_motocrew_guard_crew_member_invite
  before insert or update on public.crew_members
  for each row
  execute function private.motocrew_guard_crew_member_invite();

revoke all on function private.motocrew_guard_crew_member_invite() from public;

comment on function private.motocrew_guard_crew_member_invite() is
  'MotoCrew authz: admin may nominate members as invited only; activation (and thus location mutual-crew SELECT) requires the member accept.';
