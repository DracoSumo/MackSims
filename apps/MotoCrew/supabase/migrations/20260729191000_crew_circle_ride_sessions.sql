-- MotoCrew crew/circle + ride session vertical slice (project npmiwnxnqgonnmwvblyi)
-- Honest capabilities only: crews, memberships, ride sessions/check-ins,
-- location-share consent/status, emergency contacts, crew activity alerts.
-- No crash detection, dispatch, background GPS, or hardware intercom.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create table if not exists public.crews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  invite_code text not null unique,
  owner_user_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crew_members (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'admin', 'member')),
  display_name text not null default '',
  status text not null default 'active' check (status in ('active', 'left')),
  joined_at timestamptz not null default now(),
  unique (crew_id, user_id)
);

create table if not exists public.ride_sessions (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  host_user_id uuid not null,
  title text not null default 'Pack ride',
  status text not null default 'planning'
    check (status in ('planning', 'active', 'ended')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ride_check_ins (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ride_sessions(id) on delete cascade,
  user_id uuid not null,
  status text not null check (status in ('ok', 'delayed', 'need_help', 'off_bike', 'arrived')),
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.location_share_settings (
  user_id uuid primary key,
  precision_mode text not null default 'off'
    check (precision_mode in ('off', 'approximate', 'precise')),
  share_with_crew boolean not null default false,
  presence_status text not null default 'available'
    check (presence_status in ('off', 'available', 'riding', 'delayed', 'need_help')),
  approx_label text not null default '',
  -- Precise coordinates only when user opts in; never public outside authorized crew RLS.
  lat double precision,
  lng double precision,
  session_expires_at timestamptz,
  updated_at timestamptz not null default now(),
  check (
    (precision_mode = 'off' and lat is null and lng is null)
    or precision_mode in ('approximate', 'precise')
  )
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  relation text not null default 'Contact',
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crew_alerts (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid not null references public.crews(id) on delete cascade,
  actor_user_id uuid not null,
  kind text not null check (kind in (
    'member_joined', 'member_left', 'session_started', 'session_ended',
    'check_in', 'location_consent_changed'
  )),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists crews_owner_idx on public.crews (owner_user_id);
create index if not exists crew_members_user_idx on public.crew_members (user_id);
create index if not exists crew_members_crew_idx on public.crew_members (crew_id);
create index if not exists ride_sessions_crew_idx on public.ride_sessions (crew_id, status);
create index if not exists ride_check_ins_session_idx on public.ride_check_ins (session_id, created_at desc);
create index if not exists emergency_contacts_user_idx on public.emergency_contacts (user_id);
create index if not exists crew_alerts_crew_idx on public.crew_alerts (crew_id, created_at desc);

create or replace function private.motocrew_is_crew_member(p_crew_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $$
  select exists (
    select 1 from public.crew_members m
    where m.crew_id = p_crew_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
  );
$$;

create or replace function private.motocrew_is_crew_admin(p_crew_id uuid)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $$
  select exists (
    select 1 from public.crew_members m
    where m.crew_id = p_crew_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'admin')
  );
$$;

revoke all on function private.motocrew_is_crew_member(uuid) from public;
revoke all on function private.motocrew_is_crew_admin(uuid) from public;
grant execute on function private.motocrew_is_crew_member(uuid) to authenticated, service_role;
grant execute on function private.motocrew_is_crew_admin(uuid) to authenticated, service_role;

alter table public.crews enable row level security;
alter table public.crew_members enable row level security;
alter table public.ride_sessions enable row level security;
alter table public.ride_check_ins enable row level security;
alter table public.location_share_settings enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.crew_alerts enable row level security;

-- crews
drop policy if exists "crews select member" on public.crews;
create policy "crews select member" on public.crews for select to authenticated
  using (private.motocrew_is_crew_member(id) or owner_user_id = (select auth.uid()));

drop policy if exists "crews insert owner" on public.crews;
create policy "crews insert owner" on public.crews for insert to authenticated
  with check (owner_user_id = (select auth.uid()));

-- owner_user_id immutability is enforced by trg_motocrew_guard_crew_owner
-- (see 20260730110000_harden_crew_membership_authz.sql). Do not compare
-- owner_user_id = crews.owner_user_id in WITH CHECK — that is a NEW-row tautology.
drop policy if exists "crews update admin" on public.crews;
create policy "crews update admin" on public.crews for update to authenticated
  using (private.motocrew_is_crew_admin(id))
  with check (private.motocrew_is_crew_admin(id));

drop policy if exists "crews delete owner" on public.crews;
create policy "crews delete owner" on public.crews for delete to authenticated
  using (owner_user_id = (select auth.uid()));

-- crew_members
drop policy if exists "crew_members select" on public.crew_members;
create policy "crew_members select" on public.crew_members for select to authenticated
  using (private.motocrew_is_crew_member(crew_id) or user_id = (select auth.uid()));

-- Open self-insert (any role) was an authz hole; founding owner + admin invite only.
-- Role self-escalation on UPDATE is blocked by trg_motocrew_guard_crew_member_role.
drop policy if exists "crew_members insert self or admin" on public.crew_members;
drop policy if exists "crew_members insert founding owner or admin" on public.crew_members;
create policy "crew_members insert founding owner or admin" on public.crew_members
  for insert to authenticated
  with check (
    (
      user_id = (select auth.uid())
      and role = 'owner'
      and exists (
        select 1 from public.crews c
        where c.id = crew_id
          and c.owner_user_id = (select auth.uid())
      )
    )
    or private.motocrew_is_crew_admin(crew_id)
  );

drop policy if exists "crew_members update" on public.crew_members;
create policy "crew_members update" on public.crew_members for update to authenticated
  using (user_id = (select auth.uid()) or private.motocrew_is_crew_admin(crew_id))
  with check (user_id = (select auth.uid()) or private.motocrew_is_crew_admin(crew_id));

drop policy if exists "crew_members delete" on public.crew_members;
create policy "crew_members delete" on public.crew_members for delete to authenticated
  using (
    user_id = (select auth.uid())
    or private.motocrew_is_crew_admin(crew_id)
  );

-- ride_sessions
drop policy if exists "ride_sessions select" on public.ride_sessions;
create policy "ride_sessions select" on public.ride_sessions for select to authenticated
  using (private.motocrew_is_crew_member(crew_id));

drop policy if exists "ride_sessions insert" on public.ride_sessions;
create policy "ride_sessions insert" on public.ride_sessions for insert to authenticated
  with check (
    host_user_id = (select auth.uid())
    and private.motocrew_is_crew_member(crew_id)
  );

drop policy if exists "ride_sessions update" on public.ride_sessions;
create policy "ride_sessions update" on public.ride_sessions for update to authenticated
  using (
    host_user_id = (select auth.uid())
    or private.motocrew_is_crew_admin(crew_id)
  )
  with check (
    host_user_id = (select auth.uid())
    or private.motocrew_is_crew_admin(crew_id)
  );

-- ride_check_ins
drop policy if exists "ride_check_ins select" on public.ride_check_ins;
create policy "ride_check_ins select" on public.ride_check_ins for select to authenticated
  using (
    exists (
      select 1 from public.ride_sessions s
      where s.id = session_id and private.motocrew_is_crew_member(s.crew_id)
    )
  );

drop policy if exists "ride_check_ins insert own" on public.ride_check_ins;
create policy "ride_check_ins insert own" on public.ride_check_ins for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.ride_sessions s
      where s.id = session_id
        and s.status = 'active'
        and private.motocrew_is_crew_member(s.crew_id)
    )
  );

-- location_share_settings: owner writes; crew can read only when share_with_crew and not off
drop policy if exists "location settings select" on public.location_share_settings;
create policy "location settings select" on public.location_share_settings for select to authenticated
  using (
    user_id = (select auth.uid())
    or (
      share_with_crew = true
      and precision_mode <> 'off'
      and (session_expires_at is null or session_expires_at > now())
      and exists (
        select 1
        from public.crew_members me
        join public.crew_members them on them.crew_id = me.crew_id
        where me.user_id = (select auth.uid())
          and me.status = 'active'
          and them.user_id = location_share_settings.user_id
          and them.status = 'active'
      )
    )
  );

drop policy if exists "location settings upsert own" on public.location_share_settings;
create policy "location settings upsert own" on public.location_share_settings for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "location settings update own" on public.location_share_settings;
create policy "location settings update own" on public.location_share_settings for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "location settings delete own" on public.location_share_settings;
create policy "location settings delete own" on public.location_share_settings for delete to authenticated
  using (user_id = (select auth.uid()));

-- emergency contacts: owner only
drop policy if exists "emergency contacts select own" on public.emergency_contacts;
create policy "emergency contacts select own" on public.emergency_contacts for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "emergency contacts insert own" on public.emergency_contacts;
create policy "emergency contacts insert own" on public.emergency_contacts for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "emergency contacts update own" on public.emergency_contacts;
create policy "emergency contacts update own" on public.emergency_contacts for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "emergency contacts delete own" on public.emergency_contacts;
create policy "emergency contacts delete own" on public.emergency_contacts for delete to authenticated
  using (user_id = (select auth.uid()));

-- crew alerts: members read; actors insert own
drop policy if exists "crew alerts select" on public.crew_alerts;
create policy "crew alerts select" on public.crew_alerts for select to authenticated
  using (private.motocrew_is_crew_member(crew_id));

drop policy if exists "crew alerts insert" on public.crew_alerts;
create policy "crew alerts insert" on public.crew_alerts for insert to authenticated
  with check (
    actor_user_id = (select auth.uid())
    and private.motocrew_is_crew_member(crew_id)
  );

revoke insert, update, delete on public.crews from anon;
revoke insert, update, delete on public.crew_members from anon;
revoke insert, update, delete on public.ride_sessions from anon;
revoke insert, update, delete on public.ride_check_ins from anon;
revoke insert, update, delete on public.location_share_settings from anon;
revoke insert, update, delete on public.emergency_contacts from anon;
revoke insert, update, delete on public.crew_alerts from anon;
