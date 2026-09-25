-- FishCrew captain / charter-operator early-access waitlist.
-- Project only: kkyuychvitrmtehvzqfd (Fishcrew).
-- Extends public.captain_waitlist. Does not alter media_assets, feed_posts,
-- trip_posts, or any other UGC RLS.

CREATE TABLE IF NOT EXISTS public.captain_waitlist (
  id text PRIMARY KEY,
  user_id text,
  name text,
  email text,
  area text,
  note text,
  status text NOT NULL DEFAULT 'waitlist',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.captain_waitlist
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS home_port text,
  ADD COLUMN IF NOT EXISTS vessel_name text,
  ADD COLUMN IF NOT EXISTS trip_types text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.captain_waitlist
SET
  home_port = COALESCE(NULLIF(home_port, ''), area),
  status = CASE
    WHEN lower(COALESCE(status, '')) IN ('invited', 'accepted') THEN 'invited'
    WHEN lower(COALESCE(status, '')) IN ('listed', 'approved', 'live') THEN 'listed'
    ELSE 'waitlist'
  END
WHERE status IS NULL
   OR status IN ('New', 'Review', 'Accepted', 'Approved', 'Live');

ALTER TABLE public.captain_waitlist
  ALTER COLUMN status SET DEFAULT 'waitlist';

CREATE INDEX IF NOT EXISTS captain_waitlist_status_idx ON public.captain_waitlist (status);
CREATE INDEX IF NOT EXISTS captain_waitlist_created_idx ON public.captain_waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS captain_waitlist_user_idx ON public.captain_waitlist (user_id);

ALTER TABLE public.captain_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captain_waitlist FORCE ROW LEVEL SECURITY;

-- Replace sibling waitlist policies with public-insert / owner-or-admin-read / admin-status.
DROP POLICY IF EXISTS captain_waitlist_select_own ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_select ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_insert_auth ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_insert ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_insert_anon ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_update_admin ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_update ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_delete ON public.captain_waitlist;

CREATE POLICY captain_waitlist_select_own ON public.captain_waitlist
  FOR SELECT
  TO anon, authenticated
  USING (
    public.is_admin()
    OR (user_id IS NOT NULL AND user_id = (auth.uid())::text)
  );

CREATE POLICY captain_waitlist_insert_public ON public.captain_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    COALESCE(status, 'waitlist') = 'waitlist'
    AND consent IS TRUE
    AND char_length(COALESCE(name, '')) BETWEEN 1 AND 80
    AND char_length(COALESCE(email, '')) <= 120
    AND char_length(COALESCE(phone, '')) <= 32
    AND char_length(COALESCE(home_port, area, '')) BETWEEN 1 AND 80
    AND char_length(COALESCE(vessel_name, '')) <= 80
    AND char_length(COALESCE(trip_types, note, '')) <= 200
    AND char_length(COALESCE(website_url, '')) <= 200
    AND char_length(COALESCE(instagram, '')) <= 80
    AND char_length(COALESCE(note, '')) <= 400
    AND char_length(COALESCE(source, '')) <= 40
    AND (
      (email IS NOT NULL AND email <> '')
      OR (phone IS NOT NULL AND phone <> '')
    )
    AND (
      user_id IS NULL
      OR user_id = (auth.uid())::text
    )
  );

CREATE POLICY captain_waitlist_update_admin ON public.captain_waitlist
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (
    public.is_admin()
    AND status = ANY (ARRAY['waitlist'::text, 'invited'::text, 'listed'::text])
  );

CREATE OR REPLACE FUNCTION public.captain_waitlist_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  contact text;
BEGIN
  NEW.updated_at := now();
  NEW.name := left(btrim(COALESCE(NEW.name, '')), 80);
  NEW.email := left(btrim(COALESCE(NEW.email, '')), 120);
  NEW.phone := left(btrim(COALESCE(NEW.phone, '')), 32);
  NEW.home_port := left(btrim(COALESCE(NEW.home_port, NEW.area, '')), 80);
  NEW.area := left(btrim(COALESCE(NEW.area, NEW.home_port, '')), 80);
  NEW.vessel_name := left(btrim(COALESCE(NEW.vessel_name, '')), 80);
  NEW.trip_types := left(btrim(COALESCE(NEW.trip_types, NEW.note, '')), 200);
  NEW.website_url := left(btrim(COALESCE(NEW.website_url, '')), 200);
  NEW.instagram := left(btrim(regexp_replace(COALESCE(NEW.instagram, ''), '^@+', '')), 80);
  NEW.note := left(btrim(COALESCE(NEW.note, '')), 400);
  NEW.source := left(btrim(COALESCE(NEW.source, 'early-access')), 40);

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'waitlist';
    IF NEW.consent IS NOT TRUE THEN
      RAISE EXCEPTION 'Consent is required to join the captain waitlist';
    END IF;
    IF NEW.email = '' AND NEW.phone = '' THEN
      RAISE EXCEPTION 'Email or phone is required';
    END IF;
    contact := lower(NULLIF(NEW.email, ''));
    IF contact IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.captain_waitlist w
      WHERE lower(w.email) = contact
        AND w.created_at > now() - interval '24 hours'
    ) THEN
      RAISE EXCEPTION 'A waitlist request for this email was already received today';
    END IF;
    IF NEW.phone <> '' AND EXISTS (
      SELECT 1 FROM public.captain_waitlist w
      WHERE w.phone = NEW.phone
        AND w.created_at > now() - interval '24 hours'
    ) THEN
      RAISE EXCEPTION 'A waitlist request for this phone was already received today';
    END IF;
    RETURN NEW;
  END IF;

  IF public.is_admin() THEN
    IF NEW.status IS NULL OR NEW.status NOT IN ('waitlist', 'invited', 'listed') THEN
      NEW.status := COALESCE(OLD.status, 'waitlist');
    END IF;
    RETURN NEW;
  END IF;

  -- Non-admins cannot change status or rewrite someone else's row.
  NEW.status := COALESCE(OLD.status, 'waitlist');
  IF NEW.status IN ('invited', 'listed') THEN
    NEW.status := OLD.status;
  END IF;
  RAISE EXCEPTION 'Only operators can update waitlist status';
END;
$$;

DROP TRIGGER IF EXISTS trg_captain_waitlist_no_self_approve ON public.captain_waitlist;
DROP TRIGGER IF EXISTS trg_captain_waitlist_guard ON public.captain_waitlist;
CREATE TRIGGER trg_captain_waitlist_guard
  BEFORE INSERT OR UPDATE ON public.captain_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.captain_waitlist_guard();

COMMENT ON TABLE public.captain_waitlist IS
  'FishCrew captain/charter early-access waitlist. Anon may insert rate-safe fields with consent. Owner or admin can read. Only admin updates status (waitlist/invited/listed).';
