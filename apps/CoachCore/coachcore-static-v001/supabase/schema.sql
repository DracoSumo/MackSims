-- CoachCore v0.7.1 schema (apply in Supabase SQL editor)
-- Team-scoped RLS — see also supabase/rls_tighten_v071.sql for incremental migration on existing projects.

create extension if not exists pgcrypto;

-- Core identity
create table if not exists coach_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'coach',
  organization text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  sport text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  athlete_name text not null default '',
  role text not null default 'athlete',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Assignments and programming
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text not null,
  type text not null default '',
  duration text not null default '',
  group_name text not null default '',
  status text not null default 'Assigned',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists playbook_items (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text not null,
  item_type text not null default '',
  assigned_group text not null default '',
  status text not null default 'Active',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  athlete_id text not null,
  item_type text not null,
  item_id text not null,
  label text not null,
  status text not null default 'pending',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists meal_logs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  athlete_id text not null,
  athlete_name text not null,
  hydration text not null default '',
  breakfast text not null default '',
  lunch text not null default '',
  dinner text not null default '',
  logged_at timestamptz not null default now()
);

create table if not exists video_moments (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  title text not null,
  tag text not null default '',
  assigned_group text not null default '',
  storage_path text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists coach_notes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  athlete_id text not null,
  author_user_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists engagement_events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  athlete_id text not null default '',
  event_type text not null,
  detail text not null default '',
  logged_at timestamptz not null default now()
);

-- Existing v0.5 tables
create table if not exists athlete_check_ins (
  id uuid primary key default gen_random_uuid(),
  athlete_id text not null,
  athlete_name text not null,
  readiness text not null,
  checked_in_at timestamptz not null default now(),
  coach_profile_id uuid references coach_profiles(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete cascade
);

create table if not exists coach_action_log (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  detail text not null default '',
  logged_at timestamptz not null default now(),
  coach_profile_id uuid references coach_profiles(id) on delete set null,
  owner_user_id uuid references auth.users(id) on delete cascade
);

create table if not exists beta_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text not null default '',
  lane text not null default '',
  message text not null default '',
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now()
);

-- RLS
alter table coach_profiles enable row level security;
alter table organizations enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table workouts enable row level security;
alter table playbook_items enable row level security;
alter table assignments enable row level security;
alter table meal_logs enable row level security;
alter table video_moments enable row level security;
alter table coach_notes enable row level security;
alter table engagement_events enable row level security;
alter table athlete_check_ins enable row level security;
alter table coach_action_log enable row level security;
alter table beta_requests enable row level security;

alter table beta_requests add column if not exists submitted_by uuid references auth.users(id) on delete set null;

-- v0.7.1 team-scoped RLS (replaces permissive beta policies)
alter table athlete_check_ins add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;
alter table coach_action_log add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

create index if not exists athlete_check_ins_owner_idx on athlete_check_ins(owner_user_id);
create index if not exists coach_action_log_owner_idx on coach_action_log(owner_user_id);
create index if not exists team_members_user_team_idx on team_members(user_id, team_id);
create index if not exists teams_org_idx on teams(organization_id);

create or replace function public.coachcore_is_staff_role(role text)
returns boolean language sql immutable as $$
  select role in ('coach', 'org_admin', 'gym_owner', 'trainer', 'organization_admin');
$$;

create or replace function public.coachcore_is_org_owner(org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from organizations o where o.id = org_id and o.owner_user_id = auth.uid()
  );
$$;

create or replace function public.coachcore_is_team_member(p_team_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from team_members tm where tm.team_id = p_team_id and tm.user_id = auth.uid()
  );
$$;

create or replace function public.coachcore_is_team_staff(p_team_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from team_members tm
    where tm.team_id = p_team_id and tm.user_id = auth.uid() and public.coachcore_is_staff_role(tm.role)
  ) or exists (
    select 1 from teams t join organizations o on o.id = t.organization_id
    where t.id = p_team_id and o.owner_user_id = auth.uid()
  );
$$;

create or replace function public.coachcore_can_read_team(p_team_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.coachcore_is_team_member(p_team_id) or public.coachcore_is_team_staff(p_team_id);
$$;

grant execute on function public.coachcore_is_staff_role(text) to authenticated, anon;
grant execute on function public.coachcore_is_org_owner(uuid) to authenticated;
grant execute on function public.coachcore_is_team_member(uuid) to authenticated;
grant execute on function public.coachcore_is_team_staff(uuid) to authenticated;
grant execute on function public.coachcore_can_read_team(uuid) to authenticated;
revoke execute on function public.coachcore_is_org_owner(uuid) from anon;
revoke execute on function public.coachcore_is_team_member(uuid) from anon;
revoke execute on function public.coachcore_is_team_staff(uuid) from anon;
revoke execute on function public.coachcore_can_read_team(uuid) from anon;

drop policy if exists "assignments_coach_rw" on assignments;
drop policy if exists "auth insert checkins" on athlete_check_ins;
drop policy if exists "auth select checkins" on athlete_check_ins;
drop policy if exists "checkins_auth_rw" on athlete_check_ins;
drop policy if exists "anon insert beta" on beta_requests;
drop policy if exists "auth insert beta" on beta_requests;
drop policy if exists "beta_requests_anon_insert" on beta_requests;
drop policy if exists "beta_requests_auth_read" on beta_requests;
drop policy if exists "action_log_auth_rw" on coach_action_log;
drop policy if exists "auth insert action log" on coach_action_log;
drop policy if exists "auth select action log" on coach_action_log;
drop policy if exists "coach_notes_auth_rw" on coach_notes;
drop policy if exists "auth insert profiles" on coach_profiles;
drop policy if exists "auth select profiles" on coach_profiles;
drop policy if exists "coach_profiles_self" on coach_profiles;
drop policy if exists "engagement_events_auth_rw" on engagement_events;
drop policy if exists "meal_logs_auth_rw" on meal_logs;
drop policy if exists "orgs_member_read" on organizations;
drop policy if exists "playbook_items_auth_rw" on playbook_items;
drop policy if exists "team_members_read" on team_members;
drop policy if exists "teams_member_read" on teams;
drop policy if exists "video_moments_auth_rw" on video_moments;
drop policy if exists "workouts_coach_rw" on workouts;

create policy "cc_profiles_self_select" on coach_profiles for select to authenticated using (user_id = auth.uid());
create policy "cc_profiles_self_insert" on coach_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "cc_profiles_self_update" on coach_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cc_profiles_self_delete" on coach_profiles for delete to authenticated using (user_id = auth.uid());

create policy "cc_orgs_select" on organizations for select to authenticated using (
  owner_user_id = auth.uid() or exists (
    select 1 from teams t join team_members tm on tm.team_id = t.id
    where t.organization_id = organizations.id and tm.user_id = auth.uid()
  )
);
create policy "cc_orgs_insert" on organizations for insert to authenticated with check (owner_user_id = auth.uid());
create policy "cc_orgs_update" on organizations for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy "cc_orgs_delete" on organizations for delete to authenticated using (owner_user_id = auth.uid());

create policy "cc_teams_select" on teams for select to authenticated using (
  public.coachcore_can_read_team(id) or (organization_id is not null and public.coachcore_is_org_owner(organization_id))
);
create policy "cc_teams_insert" on teams for insert to authenticated with check (
  organization_id is not null and public.coachcore_is_org_owner(organization_id)
);
create policy "cc_teams_update" on teams for update to authenticated using (
  public.coachcore_is_team_staff(id) or (organization_id is not null and public.coachcore_is_org_owner(organization_id))
) with check (
  public.coachcore_is_team_staff(id) or (organization_id is not null and public.coachcore_is_org_owner(organization_id))
);
create policy "cc_teams_delete" on teams for delete to authenticated using (
  organization_id is not null and public.coachcore_is_org_owner(organization_id)
);

create policy "cc_team_members_select" on team_members for select to authenticated using (public.coachcore_can_read_team(team_id));
create policy "cc_team_members_insert" on team_members for insert to authenticated with check (public.coachcore_is_team_staff(team_id));
create policy "cc_team_members_update" on team_members for update to authenticated using (public.coachcore_is_team_staff(team_id)) with check (public.coachcore_is_team_staff(team_id));
create policy "cc_team_members_delete" on team_members for delete to authenticated using (public.coachcore_is_team_staff(team_id));

create policy "cc_workouts_select" on workouts for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_workouts_write" on workouts for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (
  team_id is not null and public.coachcore_is_team_staff(team_id) and (created_by is null or created_by = auth.uid())
);
create policy "cc_playbook_select" on playbook_items for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_playbook_write" on playbook_items for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_assignments_select" on assignments for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_assignments_write" on assignments for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_meals_select" on meal_logs for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_meals_write" on meal_logs for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_video_select" on video_moments for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_video_write" on video_moments for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_engagement_select" on engagement_events for select to authenticated using (team_id is not null and public.coachcore_can_read_team(team_id));
create policy "cc_engagement_write" on engagement_events for all to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id)) with check (team_id is not null and public.coachcore_is_team_staff(team_id));

create policy "cc_notes_select" on coach_notes for select to authenticated using (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_notes_insert" on coach_notes for insert to authenticated with check (
  team_id is not null and public.coachcore_is_team_staff(team_id) and (author_user_id is null or author_user_id = auth.uid())
);
create policy "cc_notes_update" on coach_notes for update to authenticated using (
  team_id is not null and public.coachcore_is_team_staff(team_id) and (author_user_id is null or author_user_id = auth.uid())
) with check (team_id is not null and public.coachcore_is_team_staff(team_id));
create policy "cc_notes_delete" on coach_notes for delete to authenticated using (
  team_id is not null and public.coachcore_is_team_staff(team_id) and (author_user_id is null or author_user_id = auth.uid())
);

create policy "cc_checkins_select" on athlete_check_ins for select to authenticated using (owner_user_id = auth.uid());
create policy "cc_checkins_insert" on athlete_check_ins for insert to authenticated with check (owner_user_id = auth.uid());
create policy "cc_checkins_update" on athlete_check_ins for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy "cc_checkins_delete" on athlete_check_ins for delete to authenticated using (owner_user_id = auth.uid());

create policy "cc_action_log_select" on coach_action_log for select to authenticated using (owner_user_id = auth.uid());
create policy "cc_action_log_insert" on coach_action_log for insert to authenticated with check (owner_user_id = auth.uid());
create policy "cc_action_log_update" on coach_action_log for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy "cc_action_log_delete" on coach_action_log for delete to authenticated using (owner_user_id = auth.uid());

create policy "cc_beta_insert_anon" on beta_requests for insert to anon with check (
  length(trim(name)) > 0 and length(trim(email)) > 3 and position('@' in email) > 1
);
create policy "cc_beta_insert_auth" on beta_requests for insert to authenticated with check (
  length(trim(name)) > 0 and length(trim(email)) > 3 and (submitted_by is null or submitted_by = auth.uid())
);
create policy "cc_beta_select_own" on beta_requests for select to authenticated using (submitted_by = auth.uid());
