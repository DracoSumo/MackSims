-- MotoCrew ride session authz: block cross-crew session injection.
-- Concrete bypass in 20260729191000_crew_circle_ride_sessions.sql:
--   ride_sessions UPDATE WITH CHECK only required host_user_id = auth.uid()
--   (or admin on NEW.crew_id). A host could SET crew_id to any other crew
--   UUID while keeping themselves as host, injecting the session (and its
--   check-ins via ride_check_ins SELECT) into a crew they do not belong to.
--
-- Project: npmiwnxnqgonnmwvblyi

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, authenticated, service_role;

create or replace function private.motocrew_guard_ride_session()
returns trigger
language plpgsql
security definer
set search_path to pg_catalog, public
as $$
begin
  if new.crew_id is distinct from old.crew_id then
    raise exception 'ride_sessions.crew_id is immutable';
  end if;

  if new.host_user_id is distinct from old.host_user_id then
    if not private.motocrew_is_crew_admin(old.crew_id) then
      raise exception 'Only crew admins can reassign ride session host';
    end if;
    if not exists (
      select 1 from public.crew_members m
      where m.crew_id = old.crew_id
        and m.user_id = new.host_user_id
        and m.status = 'active'
    ) then
      raise exception 'Ride session host must be an active crew member';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_motocrew_guard_ride_session on public.ride_sessions;
create trigger trg_motocrew_guard_ride_session
  before update on public.ride_sessions
  for each row
  execute function private.motocrew_guard_ride_session();

revoke all on function private.motocrew_guard_ride_session() from public;

drop policy if exists "ride_sessions update" on public.ride_sessions;
create policy "ride_sessions update" on public.ride_sessions for update to authenticated
  using (
    host_user_id = (select auth.uid())
    or private.motocrew_is_crew_admin(crew_id)
  )
  with check (
    private.motocrew_is_crew_member(crew_id)
    and (
      host_user_id = (select auth.uid())
      or private.motocrew_is_crew_admin(crew_id)
    )
  );

comment on function private.motocrew_guard_ride_session() is
  'MotoCrew authz: ride_sessions.crew_id cannot be reassigned; host reassignment requires admin + active member.';
