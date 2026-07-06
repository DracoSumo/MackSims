# CurbCue — Beta Readiness Report

**Date:** 2026-07-01 (renamed to CurbCue in UI/docs 2026-07-05)
**Version:** 0.3.0 (npm package id `fairshare-mobility-platform` — unchanged; see rename report)
**Verdict:** Ready — for external beta with simulated data

## What existed before beta prep

A substantial v0.3 app was already in place: page-based navigation (Home, Compare, CrowdMeter,
Admin, Bermuda pilot, Driver, Government, Canyon, Settings), 9 ride providers with estimates,
15 crowd signals, 26 pickup zones, driver/admin mock data, scoring/sorting selectors, and a
Bermuda-pilot theme. Data was imported directly from `src/data/mockData.ts`; there was no beta
gate, no persistent storage, no loading/error states, and no adapter boundary.

## What beta prep added

| Area | Change |
| --- | --- |
| Beta gate | One-time landing screen with external-beta + simulated-data disclaimer (localStorage-acknowledged) |
| Demo banner | Persistent "Demo data" strip with feedback mailto on every page |
| Adapter boundary | `src/adapters/` — `FareDataAdapter` interface, mock implementation with simulated latency and error trigger, single swap point |
| Async states | Compare and nightlife panels now load through the adapter with loading / empty / error (+retry) states |
| Persistence | Saved places (from Compare) and recent searches (max 6) in localStorage, surfaced on Home |
| New options | Walking and Designated Driver (example) providers + estimates |
| Nightlife | 4 demo venues + 3 demo events with crowd chips and pickup-zone notes |
| Feedback | FeedbackPrompt panels (Home, Compare) with pre-filled mailto to feedback@macksims.com |
| Docs | README + testing notes + checklist + feedback template + this report |

Backups of all significantly modified files are in `_backups/src-pre-beta-prep/`.

## Verification

- `npm run build` (tsc -b + vite build): **passing** — 51 modules, no TS errors.
- Baseline build before changes also passed, confirming no pre-existing breakage.

## Safety posture

- No API keys, no network calls, no backend, no deploy performed.
- All data explicitly labeled simulated/demo in the gate, banner, panels, and card copy.
- Provider names generic or marked "(example)".

## Remaining blockers for beta

None for a simulated-data beta. Distribution (hosting the `dist/` build) is a separate decision —
no deploy was performed as part of this prep.

## Post-beta path (before any "real" launch)

1. Implement a live `FareDataAdapter` per approved provider API (see README swap path).
2. Accounts + synced storage (Supabase placeholder exists, not connected).
3. Real venue/event/crowd sources with the privacy guardrails already described in-app.
