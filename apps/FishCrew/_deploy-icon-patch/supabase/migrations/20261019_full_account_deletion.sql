-- Full account deletion (Google Play account-deletion policy, Apple 5.1.1(v)).
-- delete_own_account() now removes everything tied to the signed-in user, not only the profile:
-- their trips (members, private details, join requests and chat cascade), their memberships,
-- join requests, chat messages and charter reviews, and the profile row itself.
-- The login (auth.users row) is removed by the delete-account Edge Function right after this runs.

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid text := (auth.uid())::text;
BEGIN
  IF uid IS NULL OR uid = '' THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  INSERT INTO public.account_deletion_requests (id, user_id, status)
  VALUES ('delete_' || uid || '_' || extract(epoch from now())::bigint, uid, 'Completed')
  ON CONFLICT DO NOTHING;

  -- Trips this person hosts; members, private details, join requests and chat cascade.
  DELETE FROM public.trip_posts WHERE host_id = uid;
  -- Their part in other people's trips.
  DELETE FROM public.trip_members WHERE user_id = uid;
  DELETE FROM public.join_requests WHERE requester_id = uid;
  DELETE FROM public.trip_messages WHERE sender_id = uid;
  DELETE FROM public.charter_reviews WHERE reviewer_id = uid;

  IF to_regclass('public.social_connections') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.social_connections WHERE user_id = $1' USING uid;
  END IF;
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

  -- The profile itself (nothing references profiles by foreign key).
  DELETE FROM public.profiles WHERE id = uid;

  RETURN jsonb_build_object('ok', true, 'user_id', uid);
END;
$function$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
