-- FishCrew authz: block Operator/Admin self-escalation on profiles.
-- Concrete bypass (pre-fix): any signed-in user could upsert
--   profiles.role = 'Admin'
-- via Edit Profile (Operator option) or a crafted profiles upsert.
-- Client isAdmin() and (typically) public.is_admin() trust that column,
-- so self-assigning Admin unlocked moderation / UGC approval paths.

CREATE OR REPLACE FUNCTION public.profiles_guard_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Existing operators may keep or assign Admin (e.g. operator tooling).
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.role, '') = 'Admin' THEN
      NEW.role := 'Angler';
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE: never allow a non-admin session to become Admin.
  IF COALESCE(NEW.role, '') = 'Admin'
     AND COALESCE(OLD.role, '') IS DISTINCT FROM 'Admin' THEN
    RAISE EXCEPTION 'Only operators can assign the Admin role';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_guard_admin_role ON public.profiles;
CREATE TRIGGER trg_profiles_guard_admin_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_guard_admin_role();

COMMENT ON FUNCTION public.profiles_guard_admin_role() IS
  'FishCrew authz: non-admin sessions cannot set profiles.role to Admin.';
