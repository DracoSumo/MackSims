# Beta Readiness Report — MotoCrew (Throttle / ThrottleLink)

Date: 2026-07-01
Build: MotoCrew v0.1 beta shell (web)
Note: MotoCrew is the current branding of the Throttle / ThrottleLink concept.

## Verdict: **Ready** (for external beta of a mocked shell)

Ready for external testers to evaluate flows, copy, and rider-facing UX — with the explicit
framing that this is a demo shell with no live features. Not ready (and not intended) for any
real-ride usage.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | Pass (0 errors, 0 warnings) |
| `npm run build` (`tsc -b && vite build`) | Pass |
| Map renders without API keys | Yes — styled placeholder panel |
| All live-looking surfaces marked not live | Yes — chat, comms, ride status, emergency |
| Safety copy present | First-load notice + persistent footer + Safety screen |
| Emergency disclaimer | Safety screen states no dispatch; call 911 |
| Tester feedback path | mailto feedback@macksims.com (footer + Safety screen) |
| User data | localStorage only; nothing transmitted |

## What ships in this beta

- Rider dashboard with hero ride, quick actions, and mocked ride-phase card
  (Staging / Rolling / Regroup / Fuel Stop / Complete).
- Ride feed, filters, detail, pack roster, join/leave with local persistence.
- Map placeholder (no keys required) with mocked route stops and stats.
- Chat mock + comms/intercom placeholders, all marked "Not live".
- Safety screen: rules, local emergency contacts (max 6), feedback link.
- Create-ride flow with local drafts.
- First-load safety acknowledgement gate, persisted locally.

## Known gaps / accepted for this beta

- All ride data is static mock content; ETAs never update.
- No accounts or sync — each browser/device is isolated.
- No service worker: the PWA manifest exists but the app is online-only.
- No automated tests; verification is lint + typecheck + build + manual pass.
- Profile emergency contact field on the Profile screen is mock copy; the real (local) contact
  list lives on the Safety screen.

## Blockers to any live release (future work, not beta blockers)

1. Backend + auth for rides, packs, and profiles.
2. Map provider selection and API key management.
3. Permissioned GPS via a native wrapper; app-store policy review for background location.
4. Realtime messaging and voice infrastructure (WebRTC or hosted).
5. Legal/regional review for road-awareness alert features.
6. Privacy policy, terms, and safety review before anything is called "live".

## Rollback

Backups of every significantly modified file are in `_backup-beta-prep/`
(App.tsx, App.css, types.ts, config.ts, index.css, mockData.ts, index.html, README.md).
