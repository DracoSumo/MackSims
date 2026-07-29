-- MotoCrew v0.2 schema stub (apply in Supabase SQL editor for project npmiwnxnqgonnmwvblyi)
-- Supports future ride sync, pack roster, and rider profiles.

create extension if not exists pgcrypto;

create table if not exists rider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  display_name text not null default '',
  riding_style text not null default '',
  bike text not null default '',
  home_area text not null default '',
  experience_level text not null default '',
  emergency_contact text not null default '',
  garage jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists ride_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  meet_location text not null default '',
  route_summary text not null default '',
  estimated_miles int not null default 0,
  pace text not null default 'Moderate',
  difficulty text not null default 'Easy',
  created_at timestamptz not null default now()
);

create table if not exists joined_rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  ride_id text not null,
  joined_at timestamptz not null default now(),
  unique (user_id, ride_id)
);

alter table rider_profiles enable row level security;
alter table ride_drafts enable row level security;
alter table joined_rides enable row level security;

-- Community safety (apply in SQL editor; do not weaken existing policies)
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
  target_type text not null check (target_type in ('message', 'ride', 'user')),
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

create index if not exists motocrew_reports_status_idx on content_reports (status, created_at desc);

alter table user_blocks enable row level security;
alter table content_reports enable row level security;

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

revoke update on content_reports from authenticated;
grant update (status, action_taken, reviewed_by, reviewed_at, audit_note, updated_at)
  on content_reports to authenticated;
