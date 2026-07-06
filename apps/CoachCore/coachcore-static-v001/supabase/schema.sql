-- CoachCore v0.6 schema stub (apply in Supabase SQL editor for project bfqfbkldxbojrrxeidcc)
-- Not wired to the static demo yet — establishes tables for future auth/sync.

create extension if not exists pgcrypto;

create table if not exists coach_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  display_name text not null default '',
  role text not null default 'coach',
  organization text not null default '',
  created_at timestamptz not null default now()
);

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
  submitted_at timestamptz not null default now()
);

-- RLS placeholders (enable after Supabase Auth wiring)
alter table coach_profiles enable row level security;
alter table athlete_check_ins enable row level security;
alter table coach_action_log enable row level security;
alter table beta_requests enable row level security;

-- Optional policies (run in SQL editor after enabling Google/GitHub Auth):
-- create policy "auth insert checkins" on athlete_check_ins for insert to authenticated with check (true);
-- create policy "auth select checkins" on athlete_check_ins for select to authenticated using (true);
-- create policy "anon insert beta" on beta_requests for insert with check (true);
