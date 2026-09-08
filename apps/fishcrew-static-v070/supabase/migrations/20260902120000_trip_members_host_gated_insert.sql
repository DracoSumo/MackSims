-- FishCrew authz: block open trip_members self-enroll (meetup pin / crew chat bypass).
-- Concrete bypass (pre-fix): any authenticated Angler session could
--   INSERT INTO trip_members (trip_id, user_id, member_role, status)
--     VALUES ('<foreign trip>', auth.uid(), 'member'|'host', 'Approved')
-- with the publishable anon key. Client approveRequest() is host-gated, but
-- RLS allowed self-INSERT — so REST/bypass unlocked trip_private_details
-- (private meetup pins) and trip_messages for trips the user was never
-- approved into.
--
-- Live repro (project kkyuychvitrmtehvzqfd): non-host JWT inserted
-- member_role=member and even member_role=host on foreign Open trips → 201,
-- then SELECT trip_private_details / trip_messages returned meetup secrets.
--
-- Fix: only the trip host (or operator) may INSERT/UPDATE membership rows.
-- Creating a trip still works (host inserts own host row); approving a join
-- request still works (host inserts the requester). Members may DELETE
-- themselves to leave.

CREATE OR REPLACE FUNCTION public.fishcrew_is_trip_host(p_trip_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.trip_posts t
      WHERE t.id = p_trip_id
        AND t.host_id::text = (auth.uid())::text
    );
$$;

CREATE OR REPLACE FUNCTION public.fishcrew_is_approved_trip_member(p_trip_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trip_members m
    WHERE m.trip_id = p_trip_id
      AND m.user_id = (auth.uid())::text
      AND COALESCE(m.status, '') = 'Approved'
  );
$$;

REVOKE ALL ON FUNCTION public.fishcrew_is_trip_host(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fishcrew_is_approved_trip_member(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fishcrew_is_trip_host(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fishcrew_is_approved_trip_member(text) TO authenticated;

COMMENT ON FUNCTION public.fishcrew_is_trip_host(text) IS
  'FishCrew authz: true when the session hosts the trip or is an operator.';

COMMENT ON FUNCTION public.fishcrew_is_approved_trip_member(text) IS
  'FishCrew authz: true when the session has an Approved trip_members row (security definer; avoids RLS recursion).';

-- Immutable membership identity on UPDATE (cannot remap onto another trip/user).
CREATE OR REPLACE FUNCTION public.fishcrew_guard_trip_member_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.trip_id IS DISTINCT FROM OLD.trip_id
       OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'trip_members.trip_id and user_id are immutable';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_fishcrew_guard_trip_member_identity ON public.trip_members;
CREATE TRIGGER trg_fishcrew_guard_trip_member_identity
  BEFORE UPDATE ON public.trip_members
  FOR EACH ROW
  EXECUTE FUNCTION public.fishcrew_guard_trip_member_identity();

REVOKE ALL ON FUNCTION public.fishcrew_guard_trip_member_identity() FROM PUBLIC;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'trip_members'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.trip_members', pol.policyname);
  END LOOP;
END
$$;

ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY trip_members_select_member_host_or_admin
  ON public.trip_members
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR user_id = (auth.uid())::text
    OR public.fishcrew_is_trip_host(trip_id::text)
    OR public.fishcrew_is_approved_trip_member(trip_id::text)
  );

CREATE POLICY trip_members_insert_host_or_admin
  ON public.trip_members
  FOR INSERT
  TO authenticated
  WITH CHECK (public.fishcrew_is_trip_host(trip_id::text));

CREATE POLICY trip_members_update_host_or_admin
  ON public.trip_members
  FOR UPDATE
  TO authenticated
  USING (public.fishcrew_is_trip_host(trip_id::text))
  WITH CHECK (public.fishcrew_is_trip_host(trip_id::text));

CREATE POLICY trip_members_delete_self_host_or_admin
  ON public.trip_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = (auth.uid())::text
    OR public.fishcrew_is_trip_host(trip_id::text)
  );
