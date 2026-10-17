-- FishCrew UGC: freeze media_assets source scope after upload.
--
-- Concrete bypass (pre-fix), even after storage-path (#34) and visibility (#36) freezes:
--   1) Host uploads trip media with visibility='crew'; operator Approves.
--   2) media_assets / storage SELECT grants crew access via
--      trip_members.trip_id = media_assets.source_id.
--   3) Owner UPDATE still allowed changing source_id (owner_id-only RLS;
--      existing freezes only lock storage_path/public_url/visibility).
--   4) Owner SET source_id = <other_trip_id> where outsider X is an Approved member.
--   5) X can now read the approved crew media (row + storage object) without
--      re-moderation — private crew photo/video disclosure across trip boundaries.
--
-- Fix: non-admins cannot change source_id / source_type after upload.

CREATE OR REPLACE FUNCTION public.media_assets_freeze_source_scope()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.source_id IS DISTINCT FROM OLD.source_id THEN
    RAISE EXCEPTION 'source_id is immutable after upload';
  END IF;
  IF NEW.source_type IS DISTINCT FROM OLD.source_type THEN
    RAISE EXCEPTION 'source_type is immutable after upload';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_assets_freeze_source_scope ON public.media_assets;
CREATE TRIGGER trg_media_assets_freeze_source_scope
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.media_assets_freeze_source_scope();

COMMENT ON FUNCTION public.media_assets_freeze_source_scope() IS
  'FishCrew UGC: non-admins cannot retarget source_id/source_type on media_assets after upload (crew membership scope).';
