-- FairShare v0.4 schema stub (apply in Supabase SQL editor for project dsbwqxhqktzsdleeobbi)
-- Supports future accounts, saved comparisons, and crowd polls.

create extension if not exists pgcrypto;

create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  display_name text not null default 'FairShare user',
  role text not null default 'rider',
  home_market_id text not null default 'bermuda',
  created_at timestamptz not null default now()
);

create table if not exists saved_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  label text not null,
  pickup text not null,
  dropoff text not null,
  zone_id text not null,
  estimate_id text not null,
  saved_at timestamptz not null default now()
);

create table if not exists crowd_polls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  location_name text not null,
  level text not null check (level in ('Low', 'Medium', 'High')),
  note text not null default '',
  submitted_at timestamptz not null default now()
);

alter table user_profiles enable row level security;
alter table saved_comparisons enable row level security;
alter table crowd_polls enable row level security;
