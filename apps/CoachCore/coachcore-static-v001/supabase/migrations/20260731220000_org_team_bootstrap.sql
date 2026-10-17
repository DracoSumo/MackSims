-- CoachCore v0.7.5 — org/team bootstrap tables + team_id on product rows
-- Safe to re-run. Aligns with private.coachcore_* helpers in prior migration.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  name text not null default 'My organization',
  created_at timestamptz not null default now()
);

create index if not exists organizations_owner_idx
  on public.organizations (owner_user_id);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null default 'Primary team',
  created_at timestamptz not null default now()
);

create index if not exists teams_org_idx on public.teams (organization_id);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null,
  role text not null default 'coach',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create index if not exists team_members_user_idx on public.team_members (user_id);
create index if not exists team_members_team_idx on public.team_members (team_id);

alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- Organizations: owners manage their rows; any signed-in user can create one they own.
drop policy if exists "cc_orgs_select_own" on public.organizations;
create policy "cc_orgs_select_own"
  on public.organizations for select to authenticated
  using (owner_user_id = (select auth.uid()));

drop policy if exists "cc_orgs_insert_own" on public.organizations;
create policy "cc_orgs_insert_own"
  on public.organizations for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

drop policy if exists "cc_orgs_update_own" on public.organizations;
create policy "cc_orgs_update_own"
  on public.organizations for update to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

-- Product team_id columns (used by staff policies + bootstrap upserts)
alter table public.assignments add column if not exists team_id uuid;
alter table public.meal_logs add column if not exists team_id uuid;
alter table public.coach_notes add column if not exists team_id uuid;
alter table public.athlete_roster add column if not exists team_id uuid;

create index if not exists assignments_team_idx on public.assignments (team_id);
create index if not exists meal_logs_team_idx on public.meal_logs (team_id);
create index if not exists coach_notes_team_idx on public.coach_notes (team_id);
create index if not exists athlete_roster_team_idx on public.athlete_roster (team_id);

-- Reaffirm teams / team_members policies when helpers exist (no-op if already applied).
-- Org owners can create teams; staff (including org owner via helper) manage members.
drop policy if exists "cc_teams_insert" on public.teams;
create policy "cc_teams_insert"
  on public.teams for insert to authenticated
  with check (
    organization_id is not null
    and exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and o.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "cc_teams_select" on public.teams;
create policy "cc_teams_select"
  on public.teams for select to authenticated
  using (
    exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and o.owner_user_id = (select auth.uid())
    )
    or exists (
      select 1 from public.team_members tm
      where tm.team_id = teams.id
        and tm.user_id = (select auth.uid())
    )
  );

drop policy if exists "cc_teams_update" on public.teams;
create policy "cc_teams_update"
  on public.teams for update to authenticated
  using (
    exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and o.owner_user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and o.owner_user_id = (select auth.uid())
    )
  );

-- First member insert: org owner of the team's org (avoids chicken/egg before helper staff row)
drop policy if exists "cc_team_members_insert" on public.team_members;
create policy "cc_team_members_insert"
  on public.team_members for insert to authenticated
  with check (
    exists (
      select 1
      from public.teams t
      join public.organizations o on o.id = t.organization_id
      where t.id = team_id
        and o.owner_user_id = (select auth.uid())
    )
    or user_id = (select auth.uid())
  );

drop policy if exists "cc_team_members_select" on public.team_members;
create policy "cc_team_members_select"
  on public.team_members for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1
      from public.teams t
      join public.organizations o on o.id = t.organization_id
      where t.id = team_id
        and o.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "cc_team_members_update" on public.team_members;
create policy "cc_team_members_update"
  on public.team_members for update to authenticated
  using (
    exists (
      select 1
      from public.teams t
      join public.organizations o on o.id = t.organization_id
      where t.id = team_id
        and o.owner_user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.teams t
      join public.organizations o on o.id = t.organization_id
      where t.id = team_id
        and o.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "cc_team_members_delete" on public.team_members;
create policy "cc_team_members_delete"
  on public.team_members for delete to authenticated
  using (
    exists (
      select 1
      from public.teams t
      join public.organizations o on o.id = t.organization_id
      where t.id = team_id
        and o.owner_user_id = (select auth.uid())
    )
  );
