-- FishCrew store-security RLS. Project kkyuychvitrmtehvzqfd only.
-- Coordinates with 20260727 UGC media rules and 20260925 charter marketplace.
-- Does not weaken pending-media or self-verify guards.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.media_is_publicly_approved(status text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(status, '') IN ('Approved', 'Auto-approved');
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_admin' AND pg_get_function_identity_arguments(p.oid) = ''
  ) THEN
    EXECUTE $fn$
      CREATE FUNCTION public.is_admin()
      RETURNS boolean
      LANGUAGE sql
      STABLE
      SECURITY INVOKER
      SET search_path TO 'public'
      AS $body$
        SELECT EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = (auth.uid())::text
            AND lower(COALESCE(p.role, '')) IN ('admin', 'operator')
        );
      $body$;
    $fn$;
  END IF;
END $$;

-- Remove leftover leaked-password / open DEFINER helpers if this project still has them.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('public', 'extensions')
      AND (
        p.proname ILIKE '%leaked_password%'
        OR p.proname ILIKE '%pwned%'
        OR p.proname ILIKE '%haveibeenpwned%'
      )
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s);', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- Enable RLS on marketplace / safety tables
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.charters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.charter_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.captain_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.moderation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trip_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trip_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trip_private_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.join_requests ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_select_visible ON public.profiles;
CREATE POLICY profiles_select_visible ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (
    id = (auth.uid())::text
    OR public.is_admin()
    OR COALESCE(status, 'Live') NOT IN ('Removed', 'Deleted', 'Banned')
  );

DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = (auth.uid())::text
    AND lower(COALESCE(role, 'angler')) NOT IN ('admin', 'operator')
  );

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (
      id = (auth.uid())::text
      AND lower(COALESCE(role, 'angler')) NOT IN ('admin', 'operator')
    )
  );

-- ---------------------------------------------------------------------------
-- Waitlist: signed-in create, New only, admin review
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS captain_waitlist_select ON public.captain_waitlist;
CREATE POLICY captain_waitlist_select ON public.captain_waitlist
  FOR SELECT
  TO authenticated
  USING (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS captain_waitlist_insert ON public.captain_waitlist;
CREATE POLICY captain_waitlist_insert ON public.captain_waitlist
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (auth.uid())::text
    AND COALESCE(status, 'New') IN ('New', 'waitlist')
    AND char_length(COALESCE(name, '')) <= 80
    AND char_length(COALESCE(email, '')) <= 120
    AND char_length(COALESCE(area, '')) <= 80
    AND char_length(COALESCE(note, '')) <= 400
  );

DROP POLICY IF EXISTS captain_waitlist_update ON public.captain_waitlist;
CREATE POLICY captain_waitlist_update ON public.captain_waitlist
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Reports / moderation
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS moderation_items_select ON public.moderation_items;
CREATE POLICY moderation_items_select ON public.moderation_items
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR reporter_id = (auth.uid())::text
    OR user_id = (auth.uid())::text
  );

DROP POLICY IF EXISTS moderation_items_insert ON public.moderation_items;
CREATE POLICY moderation_items_insert ON public.moderation_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (reporter_id = (auth.uid())::text OR user_id = (auth.uid())::text)
    AND COALESCE(status, 'Open') IN ('Open', 'New', 'Review')
    AND char_length(COALESCE(note, '')) <= 2000
  );

DROP POLICY IF EXISTS moderation_items_update ON public.moderation_items;
CREATE POLICY moderation_items_update ON public.moderation_items
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Blocks
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS user_blocks_select ON public.user_blocks;
CREATE POLICY user_blocks_select ON public.user_blocks
  FOR SELECT
  TO authenticated
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS user_blocks_insert ON public.user_blocks;
CREATE POLICY user_blocks_insert ON public.user_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    blocker_id = (auth.uid())::text
    AND blocked_id IS NOT NULL
    AND blocker_id <> blocked_id
  );

DROP POLICY IF EXISTS user_blocks_delete ON public.user_blocks;
CREATE POLICY user_blocks_delete ON public.user_blocks
  FOR DELETE
  TO authenticated
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS bookings_select ON public.bookings;
DROP POLICY IF EXISTS bookings_select_visible ON public.bookings;
DROP POLICY IF EXISTS bookings_select_public ON public.bookings;
DROP POLICY IF EXISTS bookings_select_all ON public.bookings;
CREATE POLICY bookings_select ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR customer_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = COALESCE(bookings.charter_id, bookings.business_id)
        AND c.owner_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS bookings_insert ON public.bookings;
DROP POLICY IF EXISTS bookings_insert_customer ON public.bookings;
CREATE POLICY bookings_insert ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = (auth.uid())::text
    AND COALESCE(status, 'New') IN ('New')
  );

DROP POLICY IF EXISTS bookings_update ON public.bookings;
DROP POLICY IF EXISTS bookings_update_parties ON public.bookings;
CREATE POLICY bookings_update ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = COALESCE(bookings.charter_id, bookings.business_id)
        AND c.owner_id = (auth.uid())::text
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id AND b.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = COALESCE(bookings.charter_id, bookings.business_id)
        AND c.owner_id = (auth.uid())::text
    )
  );

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS businesses_select ON public.businesses;
CREATE POLICY businesses_select ON public.businesses
  FOR SELECT
  TO anon, authenticated
  USING (
    owner_id = (auth.uid())::text
    OR public.is_admin()
    OR COALESCE(status, 'Live') IN ('Live', 'Verified', 'Directory', 'Approved')
  );

DROP POLICY IF EXISTS businesses_insert ON public.businesses;
CREATE POLICY businesses_insert ON public.businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = (auth.uid())::text
    AND COALESCE(status, 'Pending review') NOT IN ('Verified', 'Removed')
  );

DROP POLICY IF EXISTS businesses_update ON public.businesses;
CREATE POLICY businesses_update ON public.businesses
  FOR UPDATE
  TO authenticated
  USING (owner_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (owner_id = (auth.uid())::text OR public.is_admin());

-- ---------------------------------------------------------------------------
-- Account deletion requests
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS account_deletion_requests_select ON public.account_deletion_requests;
CREATE POLICY account_deletion_requests_select ON public.account_deletion_requests
  FOR SELECT
  TO authenticated
  USING (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS account_deletion_requests_insert ON public.account_deletion_requests;
CREATE POLICY account_deletion_requests_insert ON public.account_deletion_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (auth.uid())::text
    AND COALESCE(status, 'Requested') IN ('Requested', 'Pending server deletion', 'Local deletion complete')
  );

DROP POLICY IF EXISTS account_deletion_requests_update ON public.account_deletion_requests;
CREATE POLICY account_deletion_requests_update ON public.account_deletion_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Notifications / social tokens / trip private details
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS notifications_owner ON public.notifications;
CREATE POLICY notifications_owner ON public.notifications
  FOR ALL
  TO authenticated
  USING (user_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS social_connections_owner ON public.social_connections;
CREATE POLICY social_connections_owner ON public.social_connections
  FOR ALL
  TO authenticated
  USING (user_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS trip_private_details_members ON public.trip_private_details;
CREATE POLICY trip_private_details_members ON public.trip_private_details
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR host_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.trip_members m
      WHERE m.trip_id = trip_private_details.trip_id
        AND m.user_id = (auth.uid())::text
        AND m.status = 'Approved'
    )
  )
  WITH CHECK (
    public.is_admin()
    OR host_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.trip_members m
      WHERE m.trip_id = trip_private_details.trip_id
        AND m.user_id = (auth.uid())::text
        AND m.status = 'Approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: private unless media_assets row is approved
-- ---------------------------------------------------------------------------
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

DROP POLICY IF EXISTS fishcrew_media_insert_owner ON storage.objects;
CREATE POLICY fishcrew_media_insert_owner ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'fishcrew-media'
    AND owner = auth.uid()
    AND (
      name LIKE ('charter/' || (auth.uid())::text || '/%')
      OR name LIKE ('media/' || (auth.uid())::text || '/%')
      OR name LIKE ('feed/' || (auth.uid())::text || '/%')
      OR name LIKE ('trip/' || (auth.uid())::text || '/%')
      OR name LIKE ('trips/' || (auth.uid())::text || '/%')
      OR name LIKE ('profile/' || (auth.uid())::text || '/%')
      OR name LIKE ('avatars/' || (auth.uid())::text || '/%')
    )
  );

DROP POLICY IF EXISTS fishcrew_media_update_owner ON storage.objects;
CREATE POLICY fishcrew_media_update_owner ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()))
  WITH CHECK (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()));

DROP POLICY IF EXISTS fishcrew_media_delete_owner ON storage.objects;
CREATE POLICY fishcrew_media_delete_owner ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()));

-- ---------------------------------------------------------------------------
-- Account deletion RPC. DEFINER only to wipe owned rows; auth.uid() is required.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid text := (auth.uid())::text;
BEGIN
  IF uid IS NULL OR uid = '' THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  INSERT INTO public.account_deletion_requests (id, user_id, status)
  VALUES ('delete_' || uid || '_' || extract(epoch from now())::bigint, uid, 'Completed')
  ON CONFLICT DO NOTHING;

  UPDATE public.profiles
  SET
    email = NULL,
    name = 'Deleted user',
    username = 'deleted_' || left(uid, 8),
    bio = NULL,
    avatar_url = NULL,
    status = 'Deleted',
    role = 'Deleted'
  WHERE id = uid;

  DELETE FROM public.social_connections WHERE user_id = uid;
  DELETE FROM public.notifications WHERE user_id = uid;
  DELETE FROM public.user_blocks WHERE blocker_id = uid OR blocked_id = uid;
  DELETE FROM public.captain_waitlist WHERE user_id = uid;

  UPDATE public.feed_posts SET status = 'Removed' WHERE author_id = uid;
  UPDATE public.media_assets
  SET status = 'Removed', moderation_status = 'Removed', visibility = 'private'
  WHERE owner_id = uid;

  UPDATE public.charters SET status = 'Removed' WHERE owner_id = uid;
  UPDATE public.businesses SET status = 'Removed' WHERE owner_id = uid;

  RETURN jsonb_build_object('ok', true, 'user_id', uid);
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

COMMENT ON FUNCTION public.delete_own_account() IS
  'FishCrew in-app account wipe. Callers must be signed in. Auth user purge is a follow-up operator step if GoTrue admin is unavailable.';

-- Anonymize inquiry PII on account wipe (legal/fraud rows may remain).
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  uid text := (auth.uid())::text;
BEGIN
  IF uid IS NULL OR uid = '' THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  INSERT INTO public.account_deletion_requests (id, user_id, status)
  VALUES ('delete_' || uid || '_' || extract(epoch from now())::bigint, uid, 'Completed')
  ON CONFLICT DO NOTHING;

  UPDATE public.profiles
  SET
    email = NULL,
    name = 'Deleted user',
    username = 'deleted_' || left(uid, 8),
    bio = NULL,
    avatar_url = NULL,
    status = 'Deleted',
    role = 'Deleted'
  WHERE id = uid;

  DELETE FROM public.social_connections WHERE user_id = uid;
  DELETE FROM public.notifications WHERE user_id = uid;
  DELETE FROM public.user_blocks WHERE blocker_id = uid OR blocked_id = uid;
  DELETE FROM public.captain_waitlist WHERE user_id = uid;

  UPDATE public.feed_posts SET status = 'Removed' WHERE author_id = uid;
  UPDATE public.media_assets
  SET status = 'Removed', moderation_status = 'Removed', visibility = 'private'
  WHERE owner_id = uid;

  UPDATE public.charters SET status = 'Removed' WHERE owner_id = uid;
  UPDATE public.businesses SET status = 'Removed' WHERE owner_id = uid;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'phone') THEN
    UPDATE public.bookings SET phone = NULL WHERE customer_id = uid;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'customer_name') THEN
    UPDATE public.bookings SET customer_name = 'Deleted user' WHERE customer_id = uid;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'notes') THEN
    UPDATE public.bookings SET notes = NULL WHERE customer_id = uid;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'email') THEN
    UPDATE public.bookings SET email = NULL WHERE customer_id = uid;
  END IF;

  RETURN jsonb_build_object('ok', true, 'user_id', uid);
END;
$$;

-- Close leftover public waitlist/report policies from the companion migration.
DROP POLICY IF EXISTS captain_waitlist_select_own ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_insert_auth ON public.captain_waitlist;
DROP POLICY IF EXISTS captain_waitlist_update_admin ON public.captain_waitlist;
DROP POLICY IF EXISTS moderation_select_visible ON public.moderation_items;
DROP POLICY IF EXISTS moderation_insert_auth ON public.moderation_items;
DROP POLICY IF EXISTS moderation_update_admin ON public.moderation_items;
DROP POLICY IF EXISTS user_blocks_select_own ON public.user_blocks;
DROP POLICY IF EXISTS user_blocks_insert_own ON public.user_blocks;
DROP POLICY IF EXISTS user_blocks_delete_own ON public.user_blocks;
DROP POLICY IF EXISTS deletion_select_own ON public.account_deletion_requests;
DROP POLICY IF EXISTS deletion_insert_own ON public.account_deletion_requests;
DROP POLICY IF EXISTS deletion_update_admin ON public.account_deletion_requests;

-- Charters: authenticated writes only. No anon create.
DROP POLICY IF EXISTS charters_insert_owner ON public.charters;
CREATE POLICY charters_insert_owner ON public.charters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = (auth.uid())::text
    AND COALESCE(status, 'Pending review') NOT IN ('Removed', 'Verified', 'Live', 'Approved')
  );

-- Businesses cannot self-verify.
CREATE OR REPLACE FUNCTION public.businesses_owner_cannot_self_verify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.status = ANY (ARRAY['Verified'::text, 'Approved'::text])
     AND COALESCE(OLD.status, '') IS DISTINCT FROM NEW.status THEN
    NEW.status := COALESCE(OLD.status, 'Pending review');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_businesses_no_self_verify ON public.businesses;
CREATE TRIGGER trg_businesses_no_self_verify
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.businesses_owner_cannot_self_verify();

-- Profile email column grants stay in 20260828130000_profiles_hide_email_from_clients.sql.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS charter_id text;
