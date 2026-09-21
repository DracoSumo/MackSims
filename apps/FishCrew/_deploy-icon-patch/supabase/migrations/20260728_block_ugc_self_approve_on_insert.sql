-- FishCrew UGC: close INSERT-time moderation bypasses.
-- The 20260727 hardening blocked owners from approving on UPDATE, but a
-- non-admin could still INSERT media_assets / trip / feed / profile rows
-- already marked Approved/Live and make pending media publicly readable.
--
-- Concrete bypass (pre-fix):
--   insert into media_assets (..., status, moderation_status)
--   values (..., 'Approved', 'Approved');
-- Storage SELECT policy then treats the object as publicly readable.

-- 1) media_assets: never trust client-supplied approval on INSERT.
CREATE OR REPLACE FUNCTION public.media_assets_force_pending_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    IF NEW.moderation_status IS NULL OR NEW.moderation_status = '' THEN
      NEW.moderation_status := COALESCE(NEW.status, 'Review');
    END IF;
    RETURN NEW;
  END IF;
  -- Owners may upload, but only operators can make assets publicly approved.
  NEW.status := 'Review';
  NEW.moderation_status := 'Review';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_assets_force_pending_on_insert ON public.media_assets;
CREATE TRIGGER trg_media_assets_force_pending_on_insert
  BEFORE INSERT ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.media_assets_force_pending_on_insert();

-- Defense in depth: INSERT policy must not allow approved rows from non-admins.
DROP POLICY IF EXISTS media_insert_owner ON public.media_assets;
CREATE POLICY media_insert_owner ON public.media_assets
  FOR INSERT
  TO public
  WITH CHECK (
    (
      owner_id = (auth.uid())::text
      AND COALESCE(status, 'Review') NOT IN ('Removed')
      AND NOT public.media_is_publicly_approved(COALESCE(moderation_status, status))
    )
    OR public.is_admin()
  );

-- 2) feed_posts: inserting a media-bearing post as Live/Sponsored bypassed
--    the UPDATE-only "no self publish" trigger.
CREATE OR REPLACE FUNCTION public.feed_posts_owner_cannot_self_publish()
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
    IF NEW.media_url IS NOT NULL AND NEW.media_url <> ''
       AND NEW.status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text]) THEN
      NEW.status := 'Pending review';
    END IF;
    RETURN NEW;
  END IF;

  IF OLD.status IN ('Pending review', 'Review')
     AND NEW.status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text]) THEN
    RAISE EXCEPTION 'Only operators can publish pending feed posts';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_feed_posts_no_self_publish ON public.feed_posts;
CREATE TRIGGER trg_feed_posts_no_self_publish
  BEFORE INSERT OR UPDATE ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.feed_posts_owner_cannot_self_publish();

-- 3) trip_posts: do not trust client media_moderation_status='Approved' on INSERT.
CREATE OR REPLACE FUNCTION public.trip_posts_guard_pending_media()
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
    IF NEW.media_url IS NOT NULL AND NEW.media_url <> '' THEN
      NEW.media_moderation_status := 'Review';
      NEW.media_url := NULL;
    END IF;
    RETURN NEW;
  END IF;

  IF NOT public.media_is_publicly_approved(COALESCE(OLD.media_moderation_status, 'Approved'))
     AND public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved')) THEN
    RAISE EXCEPTION 'Only operators can approve trip media';
  END IF;
  IF NOT public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved')) THEN
    NEW.media_url := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- 4) profiles: do not trust client avatar_moderation_status='Approved' on INSERT.
CREATE OR REPLACE FUNCTION public.profiles_guard_pending_avatar()
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
    IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url <> '' THEN
      NEW.avatar_moderation_status := 'Review';
      NEW.avatar_url := NULL;
    END IF;
    RETURN NEW;
  END IF;

  IF NOT public.media_is_publicly_approved(COALESCE(NEW.avatar_moderation_status, OLD.avatar_moderation_status, 'Approved'))
     AND NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
    NEW.avatar_url := OLD.avatar_url;
  END IF;
  IF NOT public.media_is_publicly_approved(COALESCE(OLD.avatar_moderation_status, 'Approved'))
     AND public.media_is_publicly_approved(COALESCE(NEW.avatar_moderation_status, 'Approved')) THEN
    RAISE EXCEPTION 'Only operators can approve profile avatars';
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.media_assets_force_pending_on_insert() IS
  'FishCrew UGC: non-admin media_assets inserts are forced to Review so clients cannot self-approve.';
