-- Archive generic lineup / help-shape drafts superseded by the app spotlight series.
-- Keep the published welcome post unchanged.

ALTER TABLE instagram_publish_queue
  DROP CONSTRAINT IF EXISTS instagram_publish_queue_state_check;

ALTER TABLE instagram_publish_queue
  ADD CONSTRAINT instagram_publish_queue_state_check
  CHECK (state IN ('draft', 'approved', 'processing', 'published', 'failed', 'archived'));

ALTER TABLE instagram_publish_queue
  DROP CONSTRAINT IF EXISTS instagram_publish_queue_approval_consistency;

ALTER TABLE instagram_publish_queue
  ADD CONSTRAINT instagram_publish_queue_approval_consistency
  CHECK (
    state IN ('draft', 'archived')
    OR (approved_at IS NOT NULL AND approved_by IS NOT NULL)
  );

WITH archived AS (
  UPDATE instagram_publish_queue
  SET state = 'archived',
      updated_at = now()
  WHERE id IN ('ms-ig-004-lineup', 'ms-ig-009-help-shape-apps')
    AND state = 'draft'
  RETURNING id, state
)
INSERT INTO instagram_publish_audit (
  queue_id,
  action,
  from_state,
  to_state,
  actor,
  details
)
SELECT
  id,
  'archived',
  'draft',
  'archived',
  'app-spotlight-series-2026-07-30',
  '{"reason":"replaced-by-community-led-app-weeks"}'::jsonb
FROM archived;
