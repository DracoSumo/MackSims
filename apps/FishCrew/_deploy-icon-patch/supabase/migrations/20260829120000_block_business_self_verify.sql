-- FishCrew authz: block partner self-verification on businesses.status.
-- Concrete bypass (pre-fix): any signed-in owner could INSERT or UPDATE
--   businesses.status = 'Verified'
-- with the publishable anon key. Client saveBusiness() only sets Verified for
-- isAdmin(), and verifyBusiness() is operator-gated, but RLS/triggers did not
-- enforce that — fake Verified listings appeared on the public partner board.

CREATE OR REPLACE FUNCTION public.businesses_guard_verified_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.status, '') = 'Verified' THEN
      NEW.status := 'Pending review';
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE: never allow a non-admin session to become Verified.
  IF COALESCE(NEW.status, '') = 'Verified'
     AND COALESCE(OLD.status, '') IS DISTINCT FROM 'Verified' THEN
    RAISE EXCEPTION 'Only operators can verify businesses';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_businesses_guard_verified_status ON public.businesses;
CREATE TRIGGER trg_businesses_guard_verified_status
  BEFORE INSERT OR UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.businesses_guard_verified_status();

COMMENT ON FUNCTION public.businesses_guard_verified_status() IS
  'FishCrew authz: non-admin sessions cannot set businesses.status to Verified.';
