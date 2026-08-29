-- MotoCrew: freeze crew_members identity columns (user_id, crew_id).
--
-- Bug (master 20260729191000, survives open #52 invite-accept):
--   crew_members UPDATE RLS allows admins to change user_id on any non-owner
--   active row (USING/WITH CHECK only require is_crew_admin(crew_id)).
--   An admin with a spare active membership (e.g. a second account that
--   accepted an invite) can SET user_id = <victim> and silently force-enroll
--   them. location_share_settings SELECT then exposes lat/lng whenever the
--   victim has share_with_crew=true — the same impact class as #52's INSERT
--   path, but via identity remapping that #52's status='invited' guard does
--   not cover (old.status and new.status stay 'active').
--
-- Also freezes crew_id so memberships cannot be transplanted across crews.
-- Compatible with open #24 / #38 / #52 triggers (additional BEFORE UPDATE).
-- Project: npmiwnxnqgonnmwvblyi

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create or replace function private.motocrew_guard_crew_member_identity()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if new.user_id is distinct from old.user_id then
    raise exception 'crew_members.user_id is immutable';
  end if;
  if new.crew_id is distinct from old.crew_id then
    raise exception 'crew_members.crew_id is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_motocrew_guard_crew_member_identity on public.crew_members;
create trigger trg_motocrew_guard_crew_member_identity
  before update on public.crew_members
  for each row
  execute function private.motocrew_guard_crew_member_identity();

revoke all on function private.motocrew_guard_crew_member_identity() from public;

comment on function private.motocrew_guard_crew_member_identity() is
  'MotoCrew authz: crew_members.user_id and crew_id cannot be reassigned; blocks admin identity remap force-enroll (location share bypass of invite-accept).';
