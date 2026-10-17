-- FishCrew UGC: align storage.objects SELECT with media_assets visibility,
-- and freeze storage_path so an approved row cannot be retargeted at another object.
--
-- Concrete bypass (pre-fix):
--   1) Trip media is uploaded with visibility='crew' and later Approved.
--   2) media_assets SELECT correctly requires trip membership for crew rows, but
--      storage policy fishcrew_media_select_approved_or_owner only checked
--      "approved" — so anyone with the object path (public storage URL) could
--      read crew-only bytes without auth / without being on the trip.
--   3) Separately, media_assets UPDATE allowed owners to change storage_path on
--      an already-Approved row to another object's path, making that object
--      publicly readable via the same EXISTS clause.

CREATE OR REPLACE FUNCTION public.media_assets_freeze_storage_identity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.storage_path IS DISTINCT FROM OLD.storage_path THEN
    RAISE EXCEPTION 'storage_path is immutable after upload';
  END IF;
  IF COALESCE(OLD.public_url, '') <> ''
     AND NEW.public_url IS DISTINCT FROM OLD.public_url THEN
    RAISE EXCEPTION 'public_url is immutable after upload';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_assets_freeze_storage_identity ON public.media_assets;
CREATE TRIGGER trg_media_assets_freeze_storage_identity
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.media_assets_freeze_storage_identity();

DROP POLICY IF EXISTS fishcrew_media_select_approved_or_owner ON storage.objects;
CREATE POLICY fishcrew_media_select_approved_or_owner ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'fishcrew-media'
    AND (
      owner = auth.uid()
      OR public.is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.media_assets a
        WHERE a.storage_path = name
          AND public.media_is_publicly_approved(COALESCE(a.moderation_status, a.status))
          AND (
            a.visibility IN ('public', 'profile')
            OR (
              a.visibility = 'crew'
              AND EXISTS (
                SELECT 1
                FROM public.trip_members m
                WHERE m.trip_id = a.source_id
                  AND m.user_id = (auth.uid())::text
                  AND m.status = 'Approved'
              )
            )
          )
      )
    )
  );

COMMENT ON FUNCTION public.media_assets_freeze_storage_identity() IS
  'FishCrew UGC: non-admins cannot retarget storage_path/public_url on media_assets after upload.';

COMMENT ON POLICY fishcrew_media_select_approved_or_owner ON storage.objects IS
  'FishCrew UGC: approved public/profile media is readable; crew media requires trip membership; owners/admins always.';
