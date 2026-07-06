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
