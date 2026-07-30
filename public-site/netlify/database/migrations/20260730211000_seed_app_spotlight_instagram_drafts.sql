-- Seed 12 community-led app spotlight drafts (FishCrew → ShutterBid → CurbCue → MotoCrew).
-- All records remain drafts until human approval. Week 1 should be approved only after visual review.

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-fc-01',
    'draft',
    '2026-08-04T19:00:00.000Z',
    $caption$Before a fishing trip, the plan usually lives in five different places.

Weather in one tab. Tide in another. A group chat that keeps changing the launch time. Somebody texts a pin. Somebody else forgets the cooler.

FishCrew is an external beta for putting that planning mess in one calmer place — water window, crew notes, and local tools — without pretending the ocean will cooperate.

What’s the first thing your crew always forgets to check?

#FishCrew #TampaBayFishing #FishingCommunity #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/01-community/01-cover.jpg',
        'altText', 'FishCrew community cover about fishing plans scattered across apps and chats.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/01-community/02-moment.jpg',
        'altText', 'FishCrew slide about changing launch times in group chat.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/01-community/03-calm.jpg',
        'altText', 'FishCrew slide introducing a calmer planning place.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/01-community/04-ask.jpg',
        'altText', 'FishCrew question slide asking what crews forget before launch.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-fc-01-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-fc-02',
    'draft',
    '2026-08-05T22:00:00.000Z',
    $caption$A simple FishCrew loop for trip planning:

1. Check the local water window.
2. Glance at tools and guides before you leave.
3. Browse open trips and local partners when you want company.

Conditions and ID tools are planning aids — always verify official marine forecasts and local regulations.

If you fish Tampa Bay, which step would save you the most time?

#FishCrew #FishingApp #TampaBayFishing #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/02-walkthrough/01-cover.jpg',
        'altText', 'FishCrew walkthrough cover: A simple trip-planning loop',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/02-walkthrough/02-step.jpg',
        'altText', 'FishCrew walkthrough step 1: Check the local water window',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/02-walkthrough/03-step.jpg',
        'altText', 'FishCrew walkthrough step 2: Glance at tools and guides',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/02-walkthrough/04-step.jpg',
        'altText', 'FishCrew walkthrough step 3: Browse open trips and partners',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/02-walkthrough/05-close.jpg',
        'altText', 'FishCrew walkthrough closing slide inviting feedback.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-fc-02-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-fc-03',
    'draft',
    '2026-08-06T16:30:00.000Z',
    $caption$FishCrew is open for gentle feedback from anglers and crews who actually plan trips.

The web demo is live. Native invites, if and when they open, depend on the app and availability — joining a list doesn’t guarantee one.

If you try it, tell us where the planning still feels messy.

#FishCrew #BetaTesters #FishingCommunity #TampaBayFishing$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/03-conversation/01-cover.jpg',
        'altText', 'FishCrew conversation cover inviting feedback.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/03-conversation/02-question.jpg',
        'altText', 'FishCrew question slide: Where does the planning still feel messy?',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/fishcrew/03-conversation/03-cta.jpg',
        'altText', 'FishCrew closing slide pointing to the link in bio.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-fc-03-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-sb-01',
    'draft',
    '2026-08-11T19:00:00.000Z',
    $caption$A photography job often starts as a vague DM, a half-written email, and three follow-ups nobody wants to send.

Clients can’t compare offers cleanly. Photographers lose context between chats. The quote process feels heavier than the shoot.

ShutterBid is testing a clearer post → compare → book path. The public beta still uses sample listings while the marketplace fills.

Photographers and clients: where does quoting break down for you?

#ShutterBid #PhotographyBusiness #CreativeTools #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/01-community/01-cover.jpg',
        'altText', 'ShutterBid community cover about vague photography job requests.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/01-community/02-moment.jpg',
        'altText', 'ShutterBid slide about messy quoting between clients and photographers.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/01-community/03-calm.jpg',
        'altText', 'ShutterBid slide introducing post, compare, book.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/01-community/04-ask.jpg',
        'altText', 'ShutterBid question slide about quoting friction.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-sb-01-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-sb-02',
    'draft',
    '2026-08-12T22:00:00.000Z',
    $caption$Inside the ShutterBid beta:

1. Post a job with the details that matter.
2. Compare bids side by side.
3. Move toward booking without losing the thread.

Sample listings are labeled sample. Payments are not live. No private customer data appears in public demos.

Would you rather start with a stronger brief or a clearer rate?

#ShutterBid #PhotographyMarketplace #PhotographyBusiness #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/02-walkthrough/01-cover.jpg',
        'altText', 'ShutterBid walkthrough cover: Inside the public beta',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/02-walkthrough/02-step.jpg',
        'altText', 'ShutterBid walkthrough step 1: Post a job with the details that matter',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/02-walkthrough/03-step.jpg',
        'altText', 'ShutterBid walkthrough step 2: Compare bids side by side',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/02-walkthrough/04-step.jpg',
        'altText', 'ShutterBid walkthrough step 3: Move toward booking without losing the thread',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/02-walkthrough/05-close.jpg',
        'altText', 'ShutterBid walkthrough closing slide inviting feedback.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-sb-02-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-sb-03',
    'draft',
    '2026-08-13T16:30:00.000Z',
    $caption$If you photograph, hire photographers, or both, your notes on ShutterBid would help.

Try the public beta through the link in bio. Tell us what felt clear, what felt slow, and what you’d never want to type twice again.

#ShutterBid #BetaTesters #PhotographyBusiness #CreativeTools$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/03-conversation/01-cover.jpg',
        'altText', 'ShutterBid conversation cover inviting feedback.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/03-conversation/02-question.jpg',
        'altText', 'ShutterBid question slide: What would you never want to type twice?',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/shutterbid/03-conversation/03-cta.jpg',
        'altText', 'ShutterBid closing slide pointing to the link in bio.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-sb-03-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-cc-01',
    'draft',
    '2026-08-18T19:00:00.000Z',
    $caption$Sometimes the hard part isn’t getting a ride. It’s deciding whether the price, wait, and pickup chaos are worth it.

One app shows a number. Another shows a different number. The curb looks worse than both.

CurbCue is an external beta for comparing ride context — not just a single fare. The current preview uses simulated demo data: no live fares, real demand, or bookings.

Before you book, what matters more: price or pickup pressure?

#CurbCue #RideshareTools #MobilityTech #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/01-community/01-cover.jpg',
        'altText', 'CurbCue community cover about fare jumps and curb chaos.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/01-community/02-moment.jpg',
        'altText', 'CurbCue slide about ride context beyond a single fare.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/01-community/03-calm.jpg',
        'altText', 'CurbCue slide clarifying simulated demo data.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/01-community/04-ask.jpg',
        'altText', 'CurbCue question slide about price versus pickup pressure.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-cc-01-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-cc-02',
    'draft',
    '2026-08-19T22:00:00.000Z',
    $caption$A calm CurbCue walkthrough with simulated data:

1. Enter a simple trip.
2. Compare fare, wait, and pickup context cards.
3. Check CrowdMeter-style pressure before you decide.

Every number in this preview is simulated. No booking happens here.

Which comparison would help you decide faster?

#CurbCue #RideshareTools #BetaTesting #TampaTech$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/02-walkthrough/01-cover.jpg',
        'altText', 'CurbCue walkthrough cover: A calm simulated walkthrough',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/02-walkthrough/02-step.jpg',
        'altText', 'CurbCue walkthrough step 1: Enter a simple trip',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/02-walkthrough/03-step.jpg',
        'altText', 'CurbCue walkthrough step 2: Compare fare, wait, and pickup cards',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/02-walkthrough/04-step.jpg',
        'altText', 'CurbCue walkthrough step 3: Check CrowdMeter-style pressure',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/02-walkthrough/05-close.jpg',
        'altText', 'CurbCue walkthrough closing slide inviting feedback.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-cc-02-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-cc-03',
    'draft',
    '2026-08-20T16:30:00.000Z',
    $caption$If you ride often enough to feel surge stress, CurbCue needs your eyes.

The mobile web demo is available through the link in bio. Because the numbers are simulated today, the most useful feedback is about clarity and decision-making — not “is this fare exact?”

#CurbCue #BetaTesters #MobilityTech #RideshareTools$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/03-conversation/01-cover.jpg',
        'altText', 'CurbCue conversation cover inviting feedback.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/03-conversation/02-question.jpg',
        'altText', 'CurbCue question slide: What still feels unclear before you book?',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/curbcue/03-conversation/03-cta.jpg',
        'altText', 'CurbCue closing slide pointing to the link in bio.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-cc-03-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-mc-01',
    'draft',
    '2026-08-25T19:00:00.000Z',
    $caption$Group rides fall apart in the same quiet way:

Meetup time gets buried under memes. The pin changes. Pace expectations never get said out loud. Someone is still asking “where are we?” at kickstands up.

MotoCrew is an external beta for keeping ride details in one place. The current demo uses sample ride information and is for planning only — never while riding.

Where do your ride changes usually get lost?

#MotoCrew #GroupRide #MotorcycleCommunity #BetaTesting$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/01-community/01-cover.jpg',
        'altText', 'MotoCrew community cover about ride details lost in group chat.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/01-community/02-moment.jpg',
        'altText', 'MotoCrew slide about confused meetup moments before rides.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/01-community/03-calm.jpg',
        'altText', 'MotoCrew slide clarifying sample data and planning-only use.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/01-community/04-ask.jpg',
        'altText', 'MotoCrew question slide about lost ride changes.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-mc-01-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-mc-02',
    'draft',
    '2026-08-26T22:00:00.000Z',
    $caption$Save this for the next group ride:

1. One source for meetup time and place.
2. Route and stops everyone can see.
3. Pace expectations before helmets go on.
4. A clear place for last-minute changes.
5. A safety reminder before departure.

MotoCrew’s current demo uses sample ride details. Plan before you roll. Never use the app while riding.

What does your crew coordinate in chat today?

#MotoCrew #RidePlanning #MotorcycleCommunity #GroupRide$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/02-walkthrough/01-cover.jpg',
        'altText', 'MotoCrew checklist cover for calmer group-ride planning.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/02-walkthrough/02-checklist.jpg',
        'altText', 'MotoCrew checklist of meetup, route, pace, changes, and safety.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/02-walkthrough/03-safety.jpg',
        'altText', 'MotoCrew safety reminder never to use the app while riding.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-mc-02-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;

WITH inserted AS (
  INSERT INTO instagram_publish_queue (
    id,
    state,
    scheduled_at,
    caption,
    content_type,
    media,
    idempotency_key
  )
  VALUES (
    'ms-ig-aw-mc-03',
    'draft',
    '2026-08-27T16:30:00.000Z',
    $caption$If you organize or join group rides, MotoCrew would benefit from your honesty.

Explore the demo through the link in bio and tell us which detail always disappears first: meetup, route, pace, stops, or safety notes.

#MotoCrew #BetaTesters #MotorcycleCommunity #RidePlanning$caption$,
    'CAROUSEL',
    jsonb_build_array(
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/03-conversation/01-cover.jpg',
        'altText', 'MotoCrew conversation cover inviting feedback.',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/03-conversation/02-question.jpg',
        'altText', 'MotoCrew question slide: Which detail disappears first?',
        'mediaType', 'IMAGE'
      ),
      jsonb_build_object(
        'url', 'https://www.macksims.com/social/instagram/app-weeks/motocrew/03-conversation/03-cta.jpg',
        'altText', 'MotoCrew closing slide pointing to the link in bio.',
        'mediaType', 'IMAGE'
      )
    ),
    'ms-ig-aw-mc-03-carousel-v1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id
)
INSERT INTO instagram_publish_audit (queue_id, action, from_state, to_state, actor, details)
SELECT id, 'created', NULL, 'draft', 'seed-migration', '{"source":"app-spotlight-series","campaign":"macksims-app-spotlight-2026-08"}'::jsonb
FROM inserted;
