-- FishCrew store-grade security for charter loop.
-- Project only: kkyuychvitrmtehvzqfd (Fishcrew).
-- Does not weaken existing UGC media / feed RLS.

-- Waitlist (sibling UI may attach). No anon read. No self-approve.
CREATE TABLE IF NOT EXISTS public.captain_waitlist (
  id text PRIMARY KEY,
  user_id text,
  name text,
  email text,
  area text,
  note text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS captain_waitlist_user_idx ON public.captain_waitlist (user_id);
ALTER TABLE public.captain_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS captain_waitlist_select_own ON public.captain_waitlist;
CREATE POLICY captain_waitlist_select_own ON public.captain_waitlist
  FOR SELECT TO public
  USING (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS captain_waitlist_insert_auth ON public.captain_waitlist;
CREATE POLICY captain_waitlist_insert_auth ON public.captain_waitlist
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (auth.uid())::text
    AND COALESCE(status, 'New') IN ('New', 'Review')
  );

DROP POLICY IF EXISTS captain_waitlist_update_admin ON public.captain_waitlist;
CREATE POLICY captain_waitlist_update_admin ON public.captain_waitlist
  FOR UPDATE TO public
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.captain_waitlist_no_self_approve()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.status = ANY (ARRAY['Accepted'::text, 'Approved'::text, 'Live'::text]) THEN
    NEW.status := 'New';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_captain_waitlist_no_self_approve ON public.captain_waitlist;
CREATE TRIGGER trg_captain_waitlist_no_self_approve
  BEFORE INSERT OR UPDATE ON public.captain_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.captain_waitlist_no_self_approve();

-- Account deletion requests for store compliance.
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  email text,
  username text,
  status text NOT NULL DEFAULT 'Requested',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deletion_select_own ON public.account_deletion_requests;
CREATE POLICY deletion_select_own ON public.account_deletion_requests
  FOR SELECT TO public
  USING (user_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS deletion_insert_own ON public.account_deletion_requests;
CREATE POLICY deletion_insert_own ON public.account_deletion_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (auth.uid())::text);

DROP POLICY IF EXISTS deletion_update_admin ON public.account_deletion_requests;
CREATE POLICY deletion_update_admin ON public.account_deletion_requests
  FOR UPDATE TO public
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Server-side blocks. No public directory of blocked IDs.
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id text PRIMARY KEY,
  blocker_id text NOT NULL,
  blocked_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_blocks_select_own ON public.user_blocks;
CREATE POLICY user_blocks_select_own ON public.user_blocks
  FOR SELECT TO public
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS user_blocks_insert_own ON public.user_blocks;
CREATE POLICY user_blocks_insert_own ON public.user_blocks
  FOR INSERT TO authenticated
  WITH CHECK (blocker_id = (auth.uid())::text AND blocked_id <> (auth.uid())::text);

DROP POLICY IF EXISTS user_blocks_delete_own ON public.user_blocks;
CREATE POLICY user_blocks_delete_own ON public.user_blocks
  FOR DELETE TO public
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

-- Bookings / inquiries: no anon dump, no leaked phones.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS customer_id text,
  ADD COLUMN IF NOT EXISTS charter_id text;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bookings_select_public ON public.bookings;
DROP POLICY IF EXISTS bookings_select_all ON public.bookings;
DROP POLICY IF EXISTS bookings_select_visible ON public.bookings;
CREATE POLICY bookings_select_visible ON public.bookings
  FOR SELECT TO public
  USING (
    public.is_admin()
    OR customer_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id
        AND b.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = COALESCE(bookings.charter_id, bookings.business_id)
        AND c.owner_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS bookings_insert_customer ON public.bookings;
CREATE POLICY bookings_insert_customer ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = (auth.uid())::text
    AND COALESCE(status, 'New') IN ('New')
  );

DROP POLICY IF EXISTS bookings_update_parties ON public.bookings;
CREATE POLICY bookings_update_parties ON public.bookings
  FOR UPDATE TO public
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = bookings.business_id
        AND b.owner_id = (auth.uid())::text
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
      WHERE b.id = bookings.business_id
        AND b.owner_id = (auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.charters c
      WHERE c.id = COALESCE(bookings.charter_id, bookings.business_id)
        AND c.owner_id = (auth.uid())::text
    )
  );

-- Reports stay operator/author scoped if table exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'moderation_items'
  ) THEN
    EXECUTE 'ALTER TABLE public.moderation_items ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS moderation_select_visible ON public.moderation_items';
    EXECUTE $p$
      CREATE POLICY moderation_select_visible ON public.moderation_items
        FOR SELECT TO public
        USING (reporter_id = (auth.uid())::text OR public.is_admin())
    $p$;
    EXECUTE 'DROP POLICY IF EXISTS moderation_insert_auth ON public.moderation_items';
    EXECUTE $p$
      CREATE POLICY moderation_insert_auth ON public.moderation_items
        FOR INSERT TO authenticated
        WITH CHECK (reporter_id = (auth.uid())::text OR reporter_id = 'system')
    $p$;
    EXECUTE 'DROP POLICY IF EXISTS moderation_update_admin ON public.moderation_items';
    EXECUTE $p$
      CREATE POLICY moderation_update_admin ON public.moderation_items
        FOR UPDATE TO public
        USING (public.is_admin())
        WITH CHECK (public.is_admin())
    $p$;
  END IF;
END
$$;

-- Storage: authenticated writes into owner prefix only. Public reads approved media only.
DROP POLICY IF EXISTS fishcrew_media_insert_owner ON storage.objects;
CREATE POLICY fishcrew_media_insert_owner ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'fishcrew-media'
    AND (
      name LIKE ('charter/' || (auth.uid())::text || '/%')
      OR name LIKE ('media/' || (auth.uid())::text || '/%')
      OR name LIKE ('feed/' || (auth.uid())::text || '/%')
      OR name LIKE ('trip/' || (auth.uid())::text || '/%')
      OR name LIKE ('profile/' || (auth.uid())::text || '/%')
    )
  );

DROP POLICY IF EXISTS fishcrew_media_update_owner ON storage.objects;
CREATE POLICY fishcrew_media_update_owner ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()))
  WITH CHECK (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()));

DROP POLICY IF EXISTS fishcrew_media_delete_owner ON storage.objects;
CREATE POLICY fishcrew_media_delete_owner ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'fishcrew-media' AND (owner = auth.uid() OR public.is_admin()));

COMMENT ON TABLE public.captain_waitlist IS
  'FishCrew captain early-access waitlist. Owner/admin read only. No self-approve.';
COMMENT ON TABLE public.account_deletion_requests IS
  'Store deletion requests. User inserts own row; operators complete removal.';
COMMENT ON POLICY bookings_select_visible ON public.bookings IS
  'Inquiries stay between angler, charter owner, and operators. No anon PII dump.';
