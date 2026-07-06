# CurbCue (v0.3.0 — External Beta)

**Know where to ride before you book.**

Mobile-first ride comparison app. Compare rides, spot surge pressure, and choose smarter pickup
options before prices jump — with CrowdMeter pickup-pressure context and nightlife/event awareness.

> **Every number in this build is simulated.** There are no live fare quotes, no real demand data,
> no bookings, and no backend calls. Provider names are generic or example listings.

## Stack

- Vite 7 + React 19 + TypeScript
- Supabase optional (OAuth + saved comparisons sync when configured)
- Persistence: browser `localStorage` (saved places, recent searches, beta acknowledgement)

## Install / run / build

```powershell
cd C:\Users\draco\Downloads\MackSims\apps\FairShare
npm install          # only needed once / when dependencies change
npm run dev          # dev server at http://127.0.0.1:3000
npm run build        # type-check (tsc -b) + production build to dist/
npm run preview      # serve the production build locally
npm run test         # vitest unit tests
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` or `/curbcue` | Home (preferred public slug) |
| `/fairshare`, `/farewave` | Legacy aliases → same home view |
| `/compare` | Ride Compare |
| `/crowd-meter` | Crowd Cue / surge signals |
| `/settings` | Account and preferences |

## Project structure

```
src/
  adapters/          Data-source boundary (mock by default — see below)
  components/        UI cards, panels, shell, beta gate, demo banner
  data/              Types + bundled simulated demo data
  lib/               Selectors, formatting, localStorage helpers
  services/          Integration roadmap placeholders
  config.ts          App constants (market, version, feedback email)
_backup-20260705-curbcue-rename/   Pre-rename snapshots
```

## Swapping in real APIs later

All fare/crowd/venue/event reads go through `src/adapters`:

1. `src/adapters/types.ts` defines the `FareDataAdapter` interface
   (`getRideEstimates`, `getCrowdSignals`, `getNightlifeVenues`, `getLocalEvents`).
2. `src/adapters/mockAdapter.ts` is the current implementation — bundled demo data with simulated
   latency and a deliberate error trigger (type `error test` as the pickup) for testing failure UI.
3. `src/adapters/index.ts` exports the active adapter. To go live, implement the interface against
   real APIs in a new file (e.g. `liveAdapter.ts`) with `isSimulated: false`, then change that one
   export. Demo badges/banners key off `isSimulated` and disappear automatically.

## Future backend / API integrations (names and purposes only — none are connected)

| Integration | Purpose |
| --- | --- |
| Supabase (project ref `dsbwqxhqktzsdleeobbi`) | Accounts, saved data sync, crowd poll storage |
| Transport provider fare/ETA APIs | Real ride estimates per provider |
| Taxi dispatch / queue systems | Live queue depth for the Bermuda pilot |
| Maps + geocoding | Address autocomplete, routing, pickup-zone geofencing |
| Venue / event / flight / ferry calendars | Real demand-pressure windows |
| Crowd poll submission service | Voluntary, expiring rider crowd reports |
| Government reporting export | Aggregate-only pilot reports |

## Beta docs

- `FAIRSHARE_TESTING_NOTES.md` — what to test and how to trigger each state (filename legacy; content references CurbCue)
- `BETA_READINESS_REPORT.md` — current status and verdict
- `EXTERNAL_TESTING_CHECKLIST.md` — pass/fail checklist for testers
- `TESTER_FEEDBACK_TEMPLATE.md` — copy-paste template for feedback emails
- `docs/CURBCUE_RENAME_REPORT.md` — rename audit and preserved identifiers

Feedback: [feedback@macksims.com](mailto:feedback@macksims.com)
