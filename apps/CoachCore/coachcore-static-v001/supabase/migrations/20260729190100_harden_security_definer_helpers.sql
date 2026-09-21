-- CoachCore: harden SECURITY DEFINER helpers (project bfqfbkldxbojrrxeidcc)
-- Move RLS helper functions to non-exposed `private` schema with fixed search_path.
-- Policies keep the same authorization semantics; RPC exposure of membership checks is removed.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create or replace function private.coachcore_is_staff_role(role text)
returns boolean
language sql
immutable
set search_path to pg_catalog
as $function$
  select role in ('coach', 'org_admin', 'gym_owner', 'trainer', 'organization_admin');
$function$;

create or replace function private.coachcore_is_org_owner(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $function$
  select exists (
    select 1
    from public.organizations o
    where o.id = org_id
      and o.owner_user_id = (select auth.uid())
  );
$function$;

create or replace function private.coachcore_is_team_member(p_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $function$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = p_team_id
      and tm.user_id = (select auth.uid())
  );
$function$;

create or replace function private.coachcore_is_team_staff(p_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $function$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = p_team_id
      and tm.user_id = (select auth.uid())
      and private.coachcore_is_staff_role(tm.role)
  )
  or exists (
    select 1
    from public.teams t
    join public.organizations o on o.id = t.organization_id
    where t.id = p_team_id
      and o.owner_user_id = (select auth.uid())
  );
$function$;

create or replace function private.coachcore_can_read_team(p_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $function$
  select private.coachcore_is_team_member(p_team_id)
      or private.coachcore_is_team_staff(p_team_id);
$function$;

revoke all on function private.coachcore_is_staff_role(text) from public;
revoke all on function private.coachcore_is_org_owner(uuid) from public;
revoke all on function private.coachcore_is_team_member(uuid) from public;
revoke all on function private.coachcore_is_team_staff(uuid) from public;
revoke all on function private.coachcore_can_read_team(uuid) from public;

grant execute on function private.coachcore_is_staff_role(text) to authenticated, service_role;
grant execute on function private.coachcore_is_org_owner(uuid) to authenticated, service_role;
grant execute on function private.coachcore_is_team_member(uuid) to authenticated, service_role;
grant execute on function private.coachcore_is_team_staff(uuid) to authenticated, service_role;
grant execute on function private.coachcore_can_read_team(uuid) to authenticated, service_role;

-- Rebind policies that referenced public helpers (same checks, private schema).
drop policy if exists "cc_assignments_select" on public.assignments;
create policy "cc_assignments_select"
  on public.assignments for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_assignments_write" on public.assignments;
create policy "cc_assignments_write"
  on public.assignments for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_notes_delete" on public.coach_notes;
create policy "cc_notes_delete"
  on public.coach_notes for delete to authenticated
  using (
    (team_id is not null)
    and private.coachcore_is_team_staff(team_id)
    and ((author_user_id is null) or (author_user_id = (select auth.uid())))
  );

drop policy if exists "cc_notes_insert" on public.coach_notes;
create policy "cc_notes_insert"
  on public.coach_notes for insert to authenticated
  with check (
    (team_id is not null)
    and private.coachcore_is_team_staff(team_id)
    and ((author_user_id is null) or (author_user_id = (select auth.uid())))
  );

drop policy if exists "cc_notes_select" on public.coach_notes;
create policy "cc_notes_select"
  on public.coach_notes for select to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_notes_update" on public.coach_notes;
create policy "cc_notes_update"
  on public.coach_notes for update to authenticated
  using (
    (team_id is not null)
    and private.coachcore_is_team_staff(team_id)
    and ((author_user_id is null) or (author_user_id = (select auth.uid())))
  )
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_engagement_select" on public.engagement_events;
create policy "cc_engagement_select"
  on public.engagement_events for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_engagement_write" on public.engagement_events;
create policy "cc_engagement_write"
  on public.engagement_events for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_meals_select" on public.meal_logs;
create policy "cc_meals_select"
  on public.meal_logs for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_meals_write" on public.meal_logs;
create policy "cc_meals_write"
  on public.meal_logs for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_playbook_select" on public.playbook_items;
create policy "cc_playbook_select"
  on public.playbook_items for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_playbook_write" on public.playbook_items;
create policy "cc_playbook_write"
  on public.playbook_items for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_team_members_delete" on public.team_members;
create policy "cc_team_members_delete"
  on public.team_members for delete to authenticated
  using (private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_team_members_insert" on public.team_members;
create policy "cc_team_members_insert"
  on public.team_members for insert to authenticated
  with check (private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_team_members_select" on public.team_members;
create policy "cc_team_members_select"
  on public.team_members for select to authenticated
  using (private.coachcore_can_read_team(team_id));

drop policy if exists "cc_team_members_update" on public.team_members;
create policy "cc_team_members_update"
  on public.team_members for update to authenticated
  using (private.coachcore_is_team_staff(team_id))
  with check (private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_teams_delete" on public.teams;
create policy "cc_teams_delete"
  on public.teams for delete to authenticated
  using ((organization_id is not null) and private.coachcore_is_org_owner(organization_id));

drop policy if exists "cc_teams_insert" on public.teams;
create policy "cc_teams_insert"
  on public.teams for insert to authenticated
  with check ((organization_id is not null) and private.coachcore_is_org_owner(organization_id));

drop policy if exists "cc_teams_select" on public.teams;
create policy "cc_teams_select"
  on public.teams for select to authenticated
  using (
    private.coachcore_can_read_team(id)
    or ((organization_id is not null) and private.coachcore_is_org_owner(organization_id))
  );

-- organization_id immutability is enforced by trg_coachcore_guard_team_organization
-- (see 20260731120000_freeze_team_organization_id.sql). Do not rely on WITH CHECK
-- alone — is_team_staff(id) remains true after an org reassignment.
drop policy if exists "cc_teams_update" on public.teams;
create policy "cc_teams_update"
  on public.teams for update to authenticated
  using (
    private.coachcore_is_team_staff(id)
    or ((organization_id is not null) and private.coachcore_is_org_owner(organization_id))
  )
  with check (
    private.coachcore_is_team_staff(id)
    or ((organization_id is not null) and private.coachcore_is_org_owner(organization_id))
  );

drop policy if exists "cc_video_select" on public.video_moments;
create policy "cc_video_select"
  on public.video_moments for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_video_write" on public.video_moments;
create policy "cc_video_write"
  on public.video_moments for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check ((team_id is not null) and private.coachcore_is_team_staff(team_id));

drop policy if exists "cc_workouts_select" on public.workouts;
create policy "cc_workouts_select"
  on public.workouts for select to authenticated
  using ((team_id is not null) and private.coachcore_can_read_team(team_id));

drop policy if exists "cc_workouts_write" on public.workouts;
create policy "cc_workouts_write"
  on public.workouts for all to authenticated
  using ((team_id is not null) and private.coachcore_is_team_staff(team_id))
  with check (
    (team_id is not null)
    and private.coachcore_is_team_staff(team_id)
    and ((created_by is null) or (created_by = (select auth.uid())))
  );

-- Remove exposed public helpers (CASCADE not used; policies already rebound)
drop function if exists public.coachcore_can_read_team(uuid);
drop function if exists public.coachcore_is_team_staff(uuid);
drop function if exists public.coachcore_is_team_member(uuid);
drop function if exists public.coachcore_is_org_owner(uuid);
drop function if exists public.coachcore_is_staff_role(text);
