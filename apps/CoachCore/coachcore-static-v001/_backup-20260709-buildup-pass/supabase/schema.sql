-- CoachCore v0.6 schema (apply in Supabase SQL editor)
-- Enables auth, org/team structure, assignments, and RLS when env vars are set at build time.

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
  coach_profile_id uuid references coach_profiles(id) on delete set null
);

create table if not exists coach_action_log (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  detail text not null default '',
  logged_at timestamptz not null default now(),
  coach_profile_id uuid references coach_profiles(id) on delete set null
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

-- Policies (idempotent drops for re-apply during dev)
drop policy if exists "coach_profiles_self" on coach_profiles;
create policy "coach_profiles_self" on coach_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "orgs_member_read" on organizations;
create policy "orgs_member_read" on organizations
  for select to authenticated using (owner_user_id = auth.uid());

drop policy if exists "teams_member_read" on teams;
create policy "teams_member_read" on teams
  for select to authenticated using (true);

drop policy if exists "team_members_read" on team_members;
create policy "team_members_read" on team_members
  for select to authenticated using (true);

drop policy if exists "workouts_coach_rw" on workouts;
create policy "workouts_coach_rw" on workouts
  for all to authenticated using (created_by = auth.uid() or created_by is null)
  with check (created_by = auth.uid() or created_by is null);

drop policy if exists "assignments_coach_rw" on assignments;
create policy "assignments_coach_rw" on assignments
  for all to authenticated using (true) with check (true);

drop policy if exists "checkins_auth_rw" on athlete_check_ins;
create policy "checkins_auth_rw" on athlete_check_ins
  for all to authenticated using (true) with check (true);

drop policy if exists "action_log_auth_rw" on coach_action_log;
create policy "action_log_auth_rw" on coach_action_log
  for all to authenticated using (true) with check (true);

drop policy if exists "beta_requests_anon_insert" on beta_requests;
create policy "beta_requests_anon_insert" on beta_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "beta_requests_auth_read" on beta_requests;
create policy "beta_requests_auth_read" on beta_requests
  for select to authenticated using (submitted_by = auth.uid() or submitted_by is null);
