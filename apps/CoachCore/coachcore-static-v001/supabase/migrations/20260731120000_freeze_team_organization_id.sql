-- CoachCore: freeze teams.organization_id after insert.
-- Concrete bypass in 20260729190100_harden_security_definer_helpers.sql:
--   cc_teams_update USING/WITH CHECK both allow private.coachcore_is_team_staff(id).
--   Staff of Team T in Org O1 who also owns Org O2 can UPDATE teams SET
--   organization_id = O2. WITH CHECK still passes because is_team_staff only
--   checks team membership / org-owner-of-current-team-org via team id, and
--   staff membership survives the org reassignment. Attacker then controls
--   (and can delete via cc_teams_delete as O2 owner) another org's team.
--
-- Project: bfqfbkldxbojrrxeidcc

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create or replace function private.coachcore_guard_team_organization()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if new.organization_id is distinct from old.organization_id then
    raise exception 'teams.organization_id is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_coachcore_guard_team_organization on public.teams;
create trigger trg_coachcore_guard_team_organization
  before update on public.teams
  for each row
  execute function private.coachcore_guard_team_organization();

revoke all on function private.coachcore_guard_team_organization() from public;

comment on function private.coachcore_guard_team_organization() is
  'CoachCore authz: teams.organization_id cannot be reassigned via client UPDATE.';
