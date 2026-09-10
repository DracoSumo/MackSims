-- CoachCore v0.7.4 — coach-scoped roster + product sync
-- Local-first stores push/pull when signed in via owner_user_id = auth.uid().
-- These policies OR with existing team_id staff policies when both apply.

-- Roster athletes (manual coach list; not auth users)
create table if not exists public.athlete_roster (
  id text primary key,
  name text not null,
  role text not null default 'Athlete',
  status text not null default 'Needs nudge',
  last_active text not null default 'Not yet',
  film text not null default '—',
  workouts text not null default '—',
  meals text not null default '—',
  readiness text not null default '—',
  note text not null default '',
  owner_user_id uuid not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists athlete_roster_owner_idx
  on public.athlete_roster (owner_user_id, updated_at desc);

alter table public.athlete_roster enable row level security;

drop policy if exists "cc_roster_select_own" on public.athlete_roster;
create policy "cc_roster_select_own"
  on public.athlete_roster for select to authenticated
  using (owner_user_id = (select auth.uid()));

drop policy if exists "cc_roster_insert_own" on public.athlete_roster;
create policy "cc_roster_insert_own"
  on public.athlete_roster for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

drop policy if exists "cc_roster_update_own" on public.athlete_roster;
create policy "cc_roster_update_own"
  on public.athlete_roster for update to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

drop policy if exists "cc_roster_delete_own" on public.athlete_roster;
create policy "cc_roster_delete_own"
  on public.athlete_roster for delete to authenticated
  using (owner_user_id = (select auth.uid()));

-- Owner columns so product tables sync without requiring team_id bootstrap
alter table public.assignments add column if not exists owner_user_id uuid;
alter table public.meal_logs add column if not exists owner_user_id uuid;
alter table public.coach_notes add column if not exists owner_user_id uuid;
alter table public.meal_logs add column if not exists athlete_id text;
alter table public.meal_logs add column if not exists athlete_name text;

create index if not exists assignments_owner_idx on public.assignments (owner_user_id);
create index if not exists meal_logs_owner_idx on public.meal_logs (owner_user_id);
create index if not exists coach_notes_owner_idx on public.coach_notes (owner_user_id);

-- Owner-scoped policies (OR with existing team policies)
drop policy if exists "cc_assignments_owner_all" on public.assignments;
create policy "cc_assignments_owner_all"
  on public.assignments for all to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

drop policy if exists "cc_meals_owner_all" on public.meal_logs;
create policy "cc_meals_owner_all"
  on public.meal_logs for all to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

drop policy if exists "cc_notes_owner_all" on public.coach_notes;
create policy "cc_notes_owner_all"
  on public.coach_notes for all to authenticated
  using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));
