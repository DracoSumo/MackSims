-- MotoCrew: protect founding owner crew_members row.
-- Concrete bypass in 20260729191000_crew_circle_ride_sessions.sql (and still open
-- after 20260730110000_harden_crew_membership_authz.sql on PR #24):
--   crew_members DELETE allows any crew admin (or the owner themselves) to remove
--   the founding owner's membership. Admins can also UPDATE status to 'left'.
--   motocrew_is_crew_member / motocrew_is_crew_admin then fail for the owner, so
--   they lose ride sessions, check-ins, location share, and member management
--   while admins retain operational control of the circle.
--
-- Project: npmiwnxnqgonnmwvblyi

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create or replace function private.motocrew_is_founding_owner_membership(
  p_crew_id uuid,
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path to pg_catalog, public
as $$
  select exists (
    select 1 from public.crews c
    where c.id = p_crew_id
      and c.owner_user_id = p_user_id
  );
$$;

revoke all on function private.motocrew_is_founding_owner_membership(uuid, uuid) from public;
grant execute on function private.motocrew_is_founding_owner_membership(uuid, uuid)
  to authenticated, service_role;

create or replace function private.motocrew_guard_crew_owner_membership()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if tg_op = 'DELETE' then
    if private.motocrew_is_founding_owner_membership(old.crew_id, old.user_id) then
      raise exception 'Cannot remove the crew owner membership';
    end if;
    return old;
  end if;

  -- UPDATE: founding owner row must stay active with the same identity/role.
  if private.motocrew_is_founding_owner_membership(old.crew_id, old.user_id) then
    if new.status is distinct from 'active' then
      raise exception 'Cannot deactivate the crew owner membership';
    end if;
    if new.role is distinct from old.role
       or new.user_id is distinct from old.user_id
       or new.crew_id is distinct from old.crew_id then
      raise exception 'Cannot alter the crew owner membership';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_motocrew_guard_crew_owner_membership on public.crew_members;
create trigger trg_motocrew_guard_crew_owner_membership
  before update or delete on public.crew_members
  for each row
  execute function private.motocrew_guard_crew_owner_membership();

revoke all on function private.motocrew_guard_crew_owner_membership() from public;

-- RLS defense in depth: DELETE must not target the founding owner row.
drop policy if exists "crew_members delete" on public.crew_members;
create policy "crew_members delete" on public.crew_members for delete to authenticated
  using (
    (
      user_id = (select auth.uid())
      or private.motocrew_is_crew_admin(crew_id)
    )
    and not private.motocrew_is_founding_owner_membership(crew_id, user_id)
  );

comment on function private.motocrew_guard_crew_owner_membership() is
  'MotoCrew authz: founding owner crew_members row cannot be deleted or deactivated by clients.';
