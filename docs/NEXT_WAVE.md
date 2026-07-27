# MackSims hybrid apps — Next Wave

**Branch:** `cursor/portfolio-continuity-wave-a666`  
**Date:** 2026-07-27

## Wave 0 — Continuity + blank-screen (DONE this pass)

Cross-app polish shipped:

| App | Continuity |
|-----|------------|
| **CoachCore** | Trailing-slash nav highlight, mobile Chat/Profile, safe-area, fail-open AuthGate, safe storage, landing/demo CTAs, Save on playbook/training new, Mark film complete (demo) |
| **CurbCue** | OAuth callback outside BetaGate, CrowdMeter CTA, safe-area top, 44px taps, local-only auth copy, unknown-route Not Found |
| **MotoCrew** | Safe localStorage writes, chat/focus empty states, focus hides bottom nav, screen-stack safe-area |
| **Sermon Studio** | Safe persist writes, AuthCard dark tokens, font CSS vars, worship theme mapping, series-linked sermons |

Hybrid cold-start hardening (prior commits on this lineage): Capacitor `errorPath`, trailing-slash URLs, boot splash, `X-Frame-Options: SAMEORIGIN`.

### Swarm / dummy load

- `apps/CoachCore/coachcore-static-v001/src/services/swarmLoad.test.ts` — 750 sequential local “users” on check-in + action log stores
- `scripts/swarm-smoke.mjs` — 4 sites × 100 concurrent GETs (threshold 95%)
- Last run: **400/400 HTTP 200**, CoachCore vitest **4/4 pass**

## Wave 1 — Closed testing + feedback gates (NEXT)

1. Redeploy Netlify (`coachcore7`, FairShare, motocrewz, sermon-studio-beta) from this branch.
2. Rebuild Capacitor IPAs/AABs (Codemagic) with new `errorPath` / server URLs.
3. External beta invites per app `BETA_INVITE_PACKAGE.md` — fix blockers first; log concept feedback.

## Wave 2 — Product bones (in progress / next builds)

| App | Next product bone |
|-----|-------------------|
| **CoachCore** | Finish v0.5 static simulation (assignment status flips, richer live timeline); then v0.6 Supabase schema/RLS |
| **MotoCrew** | Roadmap **v0.2** ride-planning bones (create/edit draft rides already local — deepen checklist + pack readiness) |
| **CurbCue** | Keep mock adapters; gate live `FareDataAdapter` until Wave 1 feedback |
| **Sermon Studio** | Local library/series polish done; Supabase sync remains post-beta milestone |

## Wave 3 — Live data (later)

- Supabase auth + sync where configured
- Real fare/GPS/messaging only behind explicit feature flags
- Store listing hygiene (bundle IDs, keystores, ASC/Play records) in parallel — see `docs/NATIVE_EXTERNAL_TESTING.md`

## How to re-run swarm

```bash
cd apps/CoachCore/coachcore-static-v001 && npm test
node scripts/swarm-smoke.mjs
```
