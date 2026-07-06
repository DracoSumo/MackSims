# Throttle / ThrottleLink — Testing Notes (MotoCrew build)

MotoCrew is the current branding of the Throttle / ThrottleLink concept. These notes tell testers
what this build actually is, what to test, and what to ignore.

## What this build is

A **mocked app shell** for a motorcycle group-ride coordination app. All rides, riders, routes,
chats, and statuses are demo data defined in `src/data/mockData.ts`. There is no server: the app
is a static Vite/React bundle.

## Safety rules for testers

- **Do not use this app while riding.** Test it on a couch, not a bike.
- The app never contacts emergency services. The emergency contacts list is a local reference
  only. **In a real emergency, call 911.**
- Nothing marked "Not live", "demo", or "mock" does anything real. If a surface looks live and
  is NOT marked, that is a bug — report it.

## What works (and should be tested)

| Area | Behavior |
| --- | --- |
| First-load safety notice | Shown until acknowledged; acknowledgement persists across reloads |
| Home dashboard | Hero ride card, quick actions, mocked ride-phase status card |
| Rides | Feed with status/pace filters, ride detail, pack roster, safety notes |
| Join/Leave ride | Toggles and persists locally (disabled for completed rides) |
| Create ride | Form saves drafts to localStorage (max 8), shown on Home and Create screens |
| Map screen | "Map view not configured" placeholder + mocked route stops and stats |
| Chat screen | Mock messages and checklist; input intentionally disabled ("Not live") |
| Comms panel | Disabled Voice Room / Push-to-Talk / Call buttons, all marked demo |
| Safety screen | Safety rules, emergency contacts add/remove (localStorage, max 6), feedback link |
| Footer | Safety copy, demo notice, feedback mailto on every screen |

## What does NOT work (by design — do not report as bugs)

- No live GPS, location sharing, or pack tracking.
- No real messaging, voice, intercom, or calling.
- No emergency dispatch or SOS of any kind.
- No real maps (no provider key is bundled).
- No accounts, login, or data sync between devices.
- Ride data does not change over time; ETAs are static mock strings.

## Environments

- Tested as a desktop browser app and a phone-sized viewport (the shell renders a phone stage
  with a desktop rail ≥860px wide).
- PWA metadata exists (`manifest.webmanifest`) but there is no service worker/offline support.

## Resetting

Clear the browser's site data (or localStorage keys prefixed `motocrew.`) to reset joined rides,
drafts, contacts, and the safety acknowledgement.

## Reporting feedback

Use `TESTER_FEEDBACK_TEMPLATE.md` and email **feedback@macksims.com**.
