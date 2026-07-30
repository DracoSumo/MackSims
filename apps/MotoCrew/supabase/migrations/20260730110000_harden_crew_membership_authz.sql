-- MotoCrew crew authz: close membership self-escalation and owner reassignment.
-- Concrete bypasses in 20260729191000_crew_circle_ride_sessions.sql:
--   1) Any active member could UPDATE crew_members.role to 'admin'/'owner'
--      because the UPDATE policy only checked user_id = auth.uid().
--   2) Any authenticated user who knew a crew_id could INSERT themselves
--      (any role) — invite_code was never enforced by RLS.
--   3) crews UPDATE WITH CHECK used owner_user_id = crews.owner_user_id,
--      which is a tautology on the NEW row, so admins could steal ownership.
--
-- Project: npmiwnxnqgonnmwvblyi

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

-- Immutable crew owner (OLD vs NEW). RLS WITH CHECK cannot see OLD.
create or replace function private.motocrew_guard_crew_owner()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if new.owner_user_id is distinct from old.owner_user_id then
    raise exception 'crews.owner_user_id is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_motocrew_guard_crew_owner on public.crews;
create trigger trg_motocrew_guard_crew_owner
  before update on public.crews
  for each row
  execute function private.motocrew_guard_crew_owner();

revoke all on function private.motocrew_guard_crew_owner() from public;

-- Membership role / join guard.
create or replace function private.motocrew_guard_crew_member_role()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
declare
  acting_admin boolean;
  founding_owner boolean;
begin
  acting_admin := private.motocrew_is_crew_admin(new.crew_id);
  founding_owner := exists (
    select 1 from public.crews c
    where c.id = new.crew_id
      and c.owner_user_id = (select auth.uid())
  );

  if tg_op = 'INSERT' then
    -- Founding owner row created immediately after crews insert.
    if new.user_id = (select auth.uid())
       and new.role = 'owner'
       and founding_owner then
      return new;
    end if;

    -- Existing admins may add member/admin rows (not a second owner).
    if acting_admin then
      if new.role = 'owner' then
        raise exception 'Cannot assign owner via membership insert';
      end if;
      if new.role not in ('admin', 'member') then
        raise exception 'Invalid crew membership role';
      end if;
      return new;
    end if;

    raise exception 'Crew joins require an admin invite';
  end if;

  -- UPDATE
  if acting_admin then
    if new.role = 'owner' and old.role is distinct from 'owner' then
      raise exception 'Cannot promote to owner via membership update';
    end if;
    -- Do not let admins rewrite the founding owner membership identity/role.
    if exists (
      select 1 from public.crews c
      where c.id = old.crew_id
        and c.owner_user_id = old.user_id
    ) then
      if new.role is distinct from old.role
         or new.user_id is distinct from old.user_id
         or new.crew_id is distinct from old.crew_id then
        raise exception 'Cannot alter the crew owner membership';
      end if;
    end if;
    return new;
  end if;

  -- Self updates: display_name / leave only — never role or rejoin.
  if old.user_id = (select auth.uid()) and new.user_id = (select auth.uid()) then
    if new.role is distinct from old.role then
      raise exception 'Cannot change own crew role';
    end if;
    if new.crew_id is distinct from old.crew_id then
      raise exception 'Cannot move crew membership';
    end if;
    if old.status = 'left' and new.status = 'active' then
      raise exception 'Rejoin requires an admin invite';
    end if;
    return new;
  end if;

  raise exception 'Not allowed to update crew membership';
end;
$$;

drop trigger if exists trg_motocrew_guard_crew_member_role on public.crew_members;
create trigger trg_motocrew_guard_crew_member_role
  before insert or update on public.crew_members
  for each row
  execute function private.motocrew_guard_crew_member_role();

revoke all on function private.motocrew_guard_crew_member_role() from public;

-- Tighten RLS to match the trigger contract.
drop policy if exists "crews update admin" on public.crews;
create policy "crews update admin" on public.crews for update to authenticated
  using (private.motocrew_is_crew_admin(id))
  with check (private.motocrew_is_crew_admin(id));

drop policy if exists "crew_members insert self or admin" on public.crew_members;
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

comment on function private.motocrew_guard_crew_member_role() is
  'MotoCrew authz: block membership self-escalation and open self-join; founding owner insert + admin invites only.';

comment on function private.motocrew_guard_crew_owner() is
  'MotoCrew authz: crews.owner_user_id cannot be reassigned via client UPDATE.';
