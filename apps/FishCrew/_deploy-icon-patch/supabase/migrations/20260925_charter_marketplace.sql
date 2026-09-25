-- FishCrew charter marketplace: listings + angler reviews.
-- Applied to project kkyuychvitrmtehvzqfd (Fishcrew).
-- Does not weaken existing UGC media / feed RLS.

-- Extra listing fields on existing partner rows (safe if already present).
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS species text,
  ADD COLUMN IF NOT EXISTS boat_type text,
  ADD COLUMN IF NOT EXISTS trip_types text,
  ADD COLUMN IF NOT EXISTS availability_notes text,
  ADD COLUMN IF NOT EXISTS price_from_cents integer,
  ADD COLUMN IF NOT EXISTS price_to_cents integer,
  ADD COLUMN IF NOT EXISTS listing_kind text,
  ADD COLUMN IF NOT EXISTS cover_url text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS customer_id text;

-- First-class charter listings. Operator-owned. Public reads live/verified only.
CREATE TABLE IF NOT EXISTS public.charters (
  id text PRIMARY KEY,
  owner_id text,
  business_id text,
  name text NOT NULL,
  area text,
  species text,
  boat_type text,
  trip_types text,
  availability_notes text,
  price_from_cents integer,
  price_to_cents integer,
  website_url text,
  bio text,
  status text NOT NULL DEFAULT 'Pending review',
  listing_kind text NOT NULL DEFAULT 'operator',
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS charters_area_idx ON public.charters (area);
CREATE INDEX IF NOT EXISTS charters_status_idx ON public.charters (status);
CREATE INDEX IF NOT EXISTS charters_owner_idx ON public.charters (owner_id);

ALTER TABLE public.charters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS charters_select_visible ON public.charters;
CREATE POLICY charters_select_visible ON public.charters
  FOR SELECT
  TO public
  USING (
    owner_id = (auth.uid())::text
    OR public.is_admin()
    OR status = ANY (ARRAY['Live'::text, 'Verified'::text, 'Directory'::text, 'Approved'::text])
  );

DROP POLICY IF EXISTS charters_insert_owner ON public.charters;
CREATE POLICY charters_insert_owner ON public.charters
  FOR INSERT
  TO public
  WITH CHECK (
    owner_id = (auth.uid())::text
    AND COALESCE(status, 'Pending review') NOT IN ('Removed')
  );

DROP POLICY IF EXISTS charters_update_owner_or_admin ON public.charters;
CREATE POLICY charters_update_owner_or_admin ON public.charters
  FOR UPDATE
  TO public
  USING (owner_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (owner_id = (auth.uid())::text OR public.is_admin());

CREATE OR REPLACE FUNCTION public.charters_owner_cannot_self_verify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.status = ANY (ARRAY['Live'::text, 'Verified'::text, 'Approved'::text])
     AND COALESCE(OLD.status, '') IS DISTINCT FROM NEW.status
     AND COALESCE(OLD.status, '') NOT IN ('Live', 'Verified', 'Approved', 'Directory') THEN
    NEW.status := 'Pending review';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_charters_no_self_verify ON public.charters;
CREATE TRIGGER trg_charters_no_self_verify
  BEFORE UPDATE ON public.charters
  FOR EACH ROW
  EXECUTE FUNCTION public.charters_owner_cannot_self_verify();

-- Trip reviews. Pending stays private (same UGC posture as media).
CREATE TABLE IF NOT EXISTS public.charter_reviews (
  id text PRIMARY KEY,
  charter_id text,
  business_id text,
  reviewer_id text NOT NULL,
  reviewer_name text,
  rating smallint,
  body text,
  trip_date text,
  status text NOT NULL DEFAULT 'Review',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS charter_reviews_charter_idx ON public.charter_reviews (charter_id);
CREATE INDEX IF NOT EXISTS charter_reviews_status_idx ON public.charter_reviews (status);

ALTER TABLE public.charter_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS charter_reviews_select_visible ON public.charter_reviews;
CREATE POLICY charter_reviews_select_visible ON public.charter_reviews
  FOR SELECT
  TO public
  USING (
    reviewer_id = (auth.uid())::text
    OR public.is_admin()
    OR status = 'Live'
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = charter_reviews.charter_id
        AND c.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = charter_reviews.business_id
        AND b.owner_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS charter_reviews_insert_reviewer ON public.charter_reviews;
CREATE POLICY charter_reviews_insert_reviewer ON public.charter_reviews
  FOR INSERT
  TO public
  WITH CHECK (
    reviewer_id = (auth.uid())::text
    AND COALESCE(status, 'Review') IN ('Review', 'Pending')
  );

DROP POLICY IF EXISTS charter_reviews_update_owner_or_admin ON public.charter_reviews;
CREATE POLICY charter_reviews_update_owner_or_admin ON public.charter_reviews
  FOR UPDATE
  TO public
  USING (
    public.is_admin()
    OR reviewer_id = (auth.uid())::text
  )
  WITH CHECK (
    public.is_admin()
    OR (
      reviewer_id = (auth.uid())::text
      AND COALESCE(status, 'Review') NOT IN ('Live', 'Approved')
    )
  );

CREATE OR REPLACE FUNCTION public.charter_reviews_no_self_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE'
     AND COALESCE(OLD.status, '') IN ('Review', 'Pending')
     AND NEW.status = ANY (ARRAY['Live'::text, 'Approved'::text]) THEN
    RAISE EXCEPTION 'Only operators can publish charter reviews';
  END IF;
  IF TG_OP = 'INSERT' AND NEW.status = ANY (ARRAY['Live'::text, 'Approved'::text]) THEN
    NEW.status := 'Review';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_charter_reviews_no_self_publish ON public.charter_reviews;
CREATE TRIGGER trg_charter_reviews_no_self_publish
  BEFORE INSERT OR UPDATE ON public.charter_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.charter_reviews_no_self_publish();

COMMENT ON TABLE public.charters IS
  'FishCrew charter listings. Public reads live/verified/directory rows only.';
COMMENT ON TABLE public.charter_reviews IS
  'FishCrew after-trip reviews. Pending reviews stay private until an operator publishes them.';
