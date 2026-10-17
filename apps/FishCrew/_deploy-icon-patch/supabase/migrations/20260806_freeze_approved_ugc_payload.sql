-- FishCrew UGC: freeze moderated payload fields after approval/publish.
--
-- Concrete bypass (pre-fix):
--   1) Operator approves trip media (visibility='crew') or publishes a feed post.
--   2) Owner UPDATE still passed RLS with only owner_id checks, and the
--      self-approve triggers only blocked Pending→Approved/Live transitions.
--   3) Owner could then:
--        - SET media_assets.visibility = 'public' on an already-Approved crew row
--          (world-readable via media_assets SELECT without re-review)
--        - REPLACE feed_posts.media_url / trip_posts.media_url while status stays Live/Approved
--          (bait-and-switch past moderation)
--        - REPLACE profiles.avatar_url while avatar_moderation_status stays Approved
--          (the pending-avatar guard only froze URLs when status was NOT approved)

CREATE OR REPLACE FUNCTION public.media_assets_freeze_approved_payload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF public.media_is_publicly_approved(COALESCE(OLD.moderation_status, OLD.status)) THEN
    IF NEW.visibility IS DISTINCT FROM OLD.visibility THEN
      RAISE EXCEPTION 'visibility is immutable after approval';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_assets_freeze_approved_payload ON public.media_assets;
CREATE TRIGGER trg_media_assets_freeze_approved_payload
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.media_assets_freeze_approved_payload();

CREATE OR REPLACE FUNCTION public.feed_posts_freeze_published_media()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF OLD.status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text]) THEN
    IF NEW.media_url IS DISTINCT FROM OLD.media_url THEN
      RAISE EXCEPTION 'media_url is immutable after publish';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_feed_posts_freeze_published_media ON public.feed_posts;
CREATE TRIGGER trg_feed_posts_freeze_published_media
  BEFORE UPDATE ON public.feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.feed_posts_freeze_published_media();

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
    IF public.media_is_publicly_approved(COALESCE(OLD.media_moderation_status, 'Approved'))
       AND NEW.media_url IS DISTINCT FROM OLD.media_url THEN
      RAISE EXCEPTION 'media_url is immutable after approval';
    END IF;
    IF NOT public.media_is_publicly_approved(COALESCE(NEW.media_moderation_status, 'Approved')) THEN
      NEW.media_url := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

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
    IF public.media_is_publicly_approved(COALESCE(OLD.avatar_moderation_status, 'Approved'))
       AND NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
      RAISE EXCEPTION 'avatar_url is immutable after approval';
    END IF;
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

COMMENT ON FUNCTION public.media_assets_freeze_approved_payload() IS
  'FishCrew UGC: non-admins cannot change visibility on already-approved media_assets.';

COMMENT ON FUNCTION public.feed_posts_freeze_published_media() IS
  'FishCrew UGC: non-admins cannot replace media_url on Live/Approved/Sponsored feed posts.';
