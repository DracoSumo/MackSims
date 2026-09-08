-- FishCrew UGC: server-side pending media / post visibility
-- Applied to project kkyuychvitrmtehvzqfd (Fishcrew) via Supabase MCP.
-- Public/anon may only read approved media and publicly live feed posts.

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS moderation_status text;

UPDATE public.media_assets
SET moderation_status = COALESCE(NULLIF(moderation_status, ''), status)
WHERE moderation_status IS NULL OR moderation_status = '';

ALTER TABLE public.media_assets
  ALTER COLUMN moderation_status SET DEFAULT 'Review';

ALTER TABLE public.trip_posts
  ADD COLUMN IF NOT EXISTS media_moderation_status text NOT NULL DEFAULT 'Approved';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_moderation_status text NOT NULL DEFAULT 'Approved';

CREATE OR REPLACE FUNCTION public.media_is_publicly_approved(status text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(status, '') IN ('Approved', 'Auto-approved');
$$;

DROP POLICY IF EXISTS media_select_visible ON public.media_assets;
CREATE POLICY media_select_visible ON public.media_assets
  FOR SELECT
  TO public
  USING (
    owner_id = (auth.uid())::text
    OR public.is_admin()
    OR (
      public.media_is_publicly_approved(COALESCE(moderation_status, status))
      AND visibility IN ('public', 'profile', 'crew')
      AND (
        visibility <> 'crew'
        OR owner_id = (auth.uid())::text
        OR public.is_admin()
        OR EXISTS (
          SELECT 1 FROM public.trip_members m
          WHERE m.trip_id = media_assets.source_id
            AND m.user_id = (auth.uid())::text
            AND m.status = 'Approved'
        )
      )
    )
  );

DROP POLICY IF EXISTS media_insert_owner ON public.media_assets;
CREATE POLICY media_insert_owner ON public.media_assets
  FOR INSERT
  TO public
  WITH CHECK (
    owner_id = (auth.uid())::text
    AND COALESCE(status, 'Review') NOT IN ('Removed')
  );

DROP POLICY IF EXISTS media_update_owner_or_admin ON public.media_assets;
CREATE POLICY media_update_owner_or_admin ON public.media_assets
  FOR UPDATE
  TO public
  USING (owner_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (owner_id = (auth.uid())::text OR public.is_admin());

CREATE OR REPLACE FUNCTION public.media_assets_owner_cannot_self_approve()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF public.media_is_publicly_approved(COALESCE(NEW.moderation_status, NEW.status))
     AND NOT public.media_is_publicly_approved(COALESCE(OLD.moderation_status, OLD.status)) THEN
    RAISE EXCEPTION 'Only operators can approve media assets';
  END IF;
  IF NEW.moderation_status IS NULL OR NEW.moderation_status = '' THEN
    NEW.moderation_status := NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_assets_no_self_approve ON public.media_assets;
CREATE TRIGGER trg_media_assets_no_self_approve
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.media_assets_owner_cannot_self_approve();

DROP POLICY IF EXISTS feed_select_public ON public.feed_posts;
CREATE POLICY feed_select_public ON public.feed_posts
  FOR SELECT
  TO public
  USING (
    author_id = (auth.uid())::text
    OR public.is_admin()
    OR status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text])
  );

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
  IF OLD.status IN ('Pending review', 'Review')
     AND NEW.status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text]) THEN
    RAISE EXCEPTION 'Only operators can publish pending feed posts';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_feed_posts_no_self_publish ON public.feed_posts;
CREATE TRIGGER trg_feed_posts_no_self_publish
  BEFORE UPDATE ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.feed_posts_owner_cannot_self_publish();

CREATE OR REPLACE FUNCTION public.trip_posts_guard_pending_media()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.media_url IS NOT NULL AND NEW.media_url <> ''
     AND NOT public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved'))
     AND NOT public.is_admin() THEN
    NEW.media_url := NULL;
  END IF;
  IF TG_OP = 'UPDATE' AND NOT public.is_admin() THEN
    IF NOT public.media_is_publicly_approved(COALESCE(OLD.media_moderation_status, 'Approved'))
       AND public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved')) THEN
      RAISE EXCEPTION 'Only operators can approve trip media';
    END IF;
    IF NOT public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved')) THEN
      NEW.media_url := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_trip_posts_guard_pending_media ON public.trip_posts;
CREATE TRIGGER trg_trip_posts_guard_pending_media
  BEFORE INSERT OR UPDATE ON public.trip_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.trip_posts_guard_pending_media();

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
  IF TG_OP = 'UPDATE' THEN
    IF NOT public.media_is_publicly_approved(COALESCE(NEW.avatar_moderation_status, OLD.avatar_moderation_status, 'Approved'))
       AND NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
      NEW.avatar_url := OLD.avatar_url;
    END IF;
    IF NOT public.media_is_publicly_approved(COALESCE(OLD.avatar_moderation_status, 'Approved'))
       AND public.media_is_publicly_approved(COALESCE(NEW.avatar_moderation_status, 'Approved')) THEN
      RAISE EXCEPTION 'Only operators can approve profile avatars';
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    IF NOT public.media_is_publicly_approved(COALESCE(NEW.avatar_moderation_status, 'Approved')) THEN
      NEW.avatar_url := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_guard_pending_avatar ON public.profiles;
CREATE TRIGGER trg_profiles_guard_pending_avatar
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_guard_pending_avatar();

DROP POLICY IF EXISTS fishcrew_media_select_public ON storage.objects;
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
        SELECT 1 FROM public.media_assets a
        WHERE a.storage_path = name
          AND public.media_is_publicly_approved(COALESCE(a.moderation_status, a.status))
      )
    )
  );

COMMENT ON FUNCTION public.media_is_publicly_approved(text) IS
  'FishCrew UGC: Approved or Auto-approved media may be read by the public.';
