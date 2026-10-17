
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$ begin
  create type tempo_enum as enum ('slow','mid','up');
exception when duplicate_object then null; end $$;

create table if not exists songs (
  id int primary key,
  title text not null,
  artist text not null,
  themes text[] not null default '{}',
  tempo tempo_enum not null
);

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#3b82f6',
  created_at timestamptz not null default now()
);

create table if not exists sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled Sermon',
  theme text not null default 'faith',
  date date,
  passages text[] not null default '{}',
  notes text not null default '',
  setlist int[] not null default '{}',
  is_series_item boolean not null default false,
  series_id uuid references series(id) on delete set null,
  -- structured outline: { "keyPoints": [], "illustrations": [], "application": "" }
  outline jsonb not null default '{"keyPoints":[],"illustrations":[],"application":""}',
  created_at timestamptz not null default now()
);

-- Migration for databases created before the outline column existed:
alter table sermons add column if not exists outline jsonb not null default '{"keyPoints":[],"illustrations":[],"application":""}';

create table if not exists verses (
  ref text primary key,
  themes text[] not null default '{}'
);

create table if not exists verse_texts (
  ref text not null references verses(ref) on delete cascade,
  translation_id text not null,
  text_body text not null,
  primary key (ref, translation_id)
);

-- Fail closed on user content until owner-scoped policies exist.
-- See migrations/20260820110000_fail_closed_sermons_series_rls.sql.
alter table public.sermons enable row level security;
alter table public.series enable row level security;
alter table public.songs enable row level security;
alter table public.verses enable row level security;
alter table public.verse_texts enable row level security;

drop policy if exists "songs_read" on public.songs;
create policy "songs_read"
  on public.songs for select
  to anon, authenticated
  using (true);

drop policy if exists "verses_read" on public.verses;
create policy "verses_read"
  on public.verses for select
  to anon, authenticated
  using (true);

drop policy if exists "verse_texts_read" on public.verse_texts;
create policy "verse_texts_read"
  on public.verse_texts for select
  to anon, authenticated
  using (true);
