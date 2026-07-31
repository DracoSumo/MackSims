WITH updated AS (
  UPDATE instagram_publish_queue
  SET caption = $caption$Hi, I’m Chris — the person building MackSims.

Most of these apps started the same way: I noticed a real group of people juggling too many tabs, messages, or half-fitting tools and thought, “There has to be a cleaner way.”

That idea has grown into nine small, focused products for anglers, photographers, riders, coaches, ministry teams, creators, and researchers. Eight are in external beta; Aegis Intel is in early access. They’re works in progress, and I’d rather be honest about that than pretend they’re finished.

Swipe through and tell me: which one feels closest to your world?

#MackSims #BuildInPublic #AppDevelopment #BetaTesting$caption$,
      updated_at = now()
  WHERE id = 'ms-ig-004-lineup'
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
  'caption_updated',
  'draft',
  'draft',
  'content-review-2026-07-30',
  '{"tone":"warmer-founder-led","source":"explicit-owner-request"}'::jsonb
FROM updated;

WITH updated AS (
  UPDATE instagram_publish_queue
  SET caption = $caption$I don’t want to build these apps in a vacuum.

FishCrew and ShutterBid are leading our first testing push, and I’m also gathering interest for CurbCue, MotoCrew, CoachCore, and Sermon Studio.

The web demos are ready to explore now. Native TestFlight and Google Play invites come in smaller waves, depending on the app, so joining the list doesn’t guarantee an immediate invite.

If one of these fits your day-to-day life, I’d genuinely value your perspective — especially the moments that feel confusing, slow, or unnecessary.

Choose an app through the link in bio and tell me what you’d want it to do better.

#MackSims #BetaTesters #BuildInPublic #AppTesting$caption$,
      updated_at = now()
  WHERE id = 'ms-ig-009-help-shape-apps'
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
  'caption_updated',
  'draft',
  'draft',
  'content-review-2026-07-30',
  '{"tone":"warmer-founder-led","source":"explicit-owner-request"}'::jsonb
FROM updated;
