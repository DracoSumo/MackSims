-- FishCrew safety: user blocks + report/moderation audit fields
-- Server-enforced block relationships; reporter identity stays private from reported users.

CREATE TABLE IF NOT EXISTS public.user_blocks (
  id text PRIMARY KEY,
  blocker_id text NOT NULL,
  blocked_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_blocks_no_self CHECK (blocker_id <> blocked_id),
  CONSTRAINT user_blocks_unique UNIQUE (blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS user_blocks_blocker_idx ON public.user_blocks (blocker_id);
CREATE INDEX IF NOT EXISTS user_blocks_blocked_idx ON public.user_blocks (blocked_id);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_blocks_select_own_or_admin ON public.user_blocks;
CREATE POLICY user_blocks_select_own_or_admin ON public.user_blocks
  FOR SELECT
  TO authenticated
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS user_blocks_insert_own ON public.user_blocks;
CREATE POLICY user_blocks_insert_own ON public.user_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    blocker_id = (auth.uid())::text
    AND blocked_id <> (auth.uid())::text
    AND id = blocker_id || '_' || blocked_id
  );

DROP POLICY IF EXISTS user_blocks_delete_own_or_admin ON public.user_blocks;
CREATE POLICY user_blocks_delete_own_or_admin ON public.user_blocks
  FOR DELETE
  TO authenticated
  USING (blocker_id = (auth.uid())::text OR public.is_admin());

-- Reports / moderation audit columns (safe if already present)
ALTER TABLE public.moderation_items
  ADD COLUMN IF NOT EXISTS reason_code text,
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS target_user_id text,
  ADD COLUMN IF NOT EXISTS acted_by text,
  ADD COLUMN IF NOT EXISTS acted_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolution_note text;

-- Owner may soft-remove own feed posts (status Removed); only operators may re-publish.
DROP POLICY IF EXISTS feed_update_owner_or_admin ON public.feed_posts;
CREATE POLICY feed_update_owner_or_admin ON public.feed_posts
  FOR UPDATE
  TO authenticated
  USING (author_id = (auth.uid())::text OR public.is_admin())
  WITH CHECK (author_id = (auth.uid())::text OR public.is_admin());

DROP POLICY IF EXISTS feed_delete_owner_or_admin ON public.feed_posts;
CREATE POLICY feed_delete_owner_or_admin ON public.feed_posts
  FOR DELETE
  TO authenticated
  USING (author_id = (auth.uid())::text OR public.is_admin());

COMMENT ON TABLE public.user_blocks IS
  'FishCrew user block list. Only blocker or admin can read/manage; not exposed to blocked users.';
