-- Approve FishCrew Week 1 only after visual review of community-led carousel assets.
-- Keep planned Aug 4–6 ET schedule times. Leave Weeks 2–4 as drafts.

WITH approved AS (
  UPDATE instagram_publish_queue
  SET state = 'approved',
      approved_at = now(),
      approved_by = 'app-spotlight-week1-review-2026-07-30',
      updated_at = now()
  WHERE id IN (
    'ms-ig-aw-fc-01',
    'ms-ig-aw-fc-02',
    'ms-ig-aw-fc-03'
  )
    AND state = 'draft'
  RETURNING id, scheduled_at
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
  'app-spotlight-week1-review-2026-07-30',
  jsonb_build_object(
    'publishTiming', 'scheduled',
    'source', 'visual-review-after-app-spotlight-seed',
    'scheduledAt', scheduled_at
  )
FROM approved;
