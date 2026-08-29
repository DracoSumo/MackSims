-- FishCrew authz: bookings tenancy (partner lead inbox).
-- Concrete bypass (pre-fix): any authenticated Angler session could
--   SELECT * FROM bookings
--   INSERT INTO bookings (business_id, ...) -- any partner's listing
-- with the publishable anon key. Client saveBooking()/openBookingForm() are
-- Business/Captain-gated and PR #40 scopes the UI to owned listings, but RLS
-- did not enforce owner tenancy — so REST/bypass still leaked and polluted
-- every partner's lead inbox (customer_name, notes, value_cents).
--
-- Fix: replace bookings policies so only the listing owner (or operator)
-- can read/write leads for that business_id. Customers may still SELECT
-- rows where customer_id = auth.uid() (their own inquiry), but cannot INSERT
-- against arbitrary listings (product captures leads via partner tools).

CREATE OR REPLACE FUNCTION public.fishcrew_owns_business(p_business_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.businesses b
      WHERE b.id = p_business_id
        AND b.owner_id = (auth.uid())::text
    );
$$;

REVOKE ALL ON FUNCTION public.fishcrew_owns_business(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fishcrew_owns_business(text) TO authenticated;

COMMENT ON FUNCTION public.fishcrew_owns_business(text) IS
  'FishCrew authz: true when the session owns the business listing or is an operator.';

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', pol.policyname);
  END LOOP;
END
$$;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookings_select_owner_customer_or_admin
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    public.fishcrew_owns_business(business_id)
    OR (
      customer_id IS NOT NULL
      AND customer_id = (auth.uid())::text
    )
  );

CREATE POLICY bookings_insert_owner_or_admin
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.fishcrew_owns_business(business_id));

CREATE POLICY bookings_update_owner_or_admin
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.fishcrew_owns_business(business_id))
  WITH CHECK (public.fishcrew_owns_business(business_id));

CREATE POLICY bookings_delete_owner_or_admin
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.fishcrew_owns_business(business_id));
