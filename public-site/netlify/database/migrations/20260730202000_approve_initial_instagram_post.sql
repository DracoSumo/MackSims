WITH approved AS (
  UPDATE instagram_publish_queue
  SET state = 'approved',
      scheduled_at = now(),
      approved_at = now(),
      approved_by = 'owner-request-2026-07-30',
      updated_at = now()
  WHERE id = 'ms-ig-001-welcome'
    AND state = 'draft'
  RETURNING id
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
  'approved',
  'draft',
  'approved',
  'owner-request-2026-07-30',
  '{"publishTiming":"immediate","source":"explicit-owner-request"}'::jsonb
FROM approved;
