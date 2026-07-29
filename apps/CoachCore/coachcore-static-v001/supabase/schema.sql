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

-- v0.7.2 plugin layer (also applied via Supabase migration on staging)
create table if not exists user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider_id text not null,
  status text not null check (status in ('connected', 'requested', 'pending_oauth', 'disconnected')),
  display_name text not null default '',
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  requested_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, provider_id)
);

create table if not exists integration_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider_id text not null,
  provider_name text not null default '',
  message text not null default '',
  organization text not null default '',
  created_at timestamptz not null default now()
);

alter table user_integrations enable row level security;
alter table integration_access_requests enable row level security;

-- v0.7.3 community safety (apply in SQL editor; do not weaken existing policies)
create table if not exists user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null,
  blocked_id uuid not null,
  created_at timestamptz not null default now(),
  check (blocker_id <> blocked_id),
  unique (blocker_id, blocked_id)
);

create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null,
  target_type text not null check (target_type in ('channel', 'message', 'user')),
  target_id text not null,
  target_label text not null default '',
  category text not null,
  details text not null default '',
  status text not null default 'open'
    check (status in ('open', 'in_review', 'actioned', 'dismissed')),
  action_taken text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  audit_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_reports_status_idx on content_reports (status, created_at desc);
create index if not exists content_reports_dedupe_idx on content_reports (reporter_id, target_id, category, created_at);

alter table user_blocks enable row level security;
alter table content_reports enable row level security;

-- Private block relationships: owners manage their rows; admins can audit them.
drop policy if exists "blocks select own" on user_blocks;
create policy "blocks select own"
  on user_blocks for select to authenticated
  using (
    blocker_id = auth.uid()
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
drop policy if exists "blocks insert own" on user_blocks;
create policy "blocks insert own"
  on user_blocks for insert to authenticated
  with check (blocker_id = auth.uid() and blocked_id <> auth.uid());
drop policy if exists "blocks delete own" on user_blocks;
create policy "blocks delete own"
  on user_blocks for delete to authenticated
  using (blocker_id = auth.uid());

-- Reporters can submit/read their own reports but cannot pre-set moderation fields.
drop policy if exists "reports insert own" on content_reports;
create policy "reports insert own"
  on content_reports for insert to authenticated
  with check (
    reporter_id = auth.uid()
    and status = 'open'
    and action_taken is null
    and reviewed_by is null
    and reviewed_at is null
    and audit_note is null
  );
drop policy if exists "reports select own" on content_reports;
create policy "reports select own"
  on content_reports for select to authenticated
  using (reporter_id = auth.uid());

-- Admins can read all reports and moderate reports they did not submit.
drop policy if exists "reports moderate" on content_reports;
create policy "reports moderate"
  on content_reports for update to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and reporter_id <> auth.uid()
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and reporter_id <> auth.uid()
    and reviewed_by = auth.uid()
  );

drop policy if exists "reports select moderators" on content_reports;
drop policy if exists "reports select admins" on content_reports;
create policy "reports select admins"
  on content_reports for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Restrict authenticated updates to moderation fields so report ownership/targets stay immutable.
revoke update on content_reports from authenticated;
grant update (status, action_taken, reviewed_by, reviewed_at, audit_note, updated_at)
  on content_reports to authenticated;

