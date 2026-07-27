# MackSims hybrid apps — Next Wave

**Active branch:** `cursor/next-wave-product-bones-a666`  
**Updated:** 2026-07-27

## Wave 0 — Continuity + blank-screen — DONE

See prior PR lineage (`cursor/portfolio-continuity-wave-a666`): Capacitor cold-start fixes, cross-app UX continuity, swarm harness.

## Wave 1 — Closed testing + feedback gates — READY TO RUN

Ops (not code):

1. Redeploy Netlify: `coachcore7`, FairShare, `motocrewz`, `sermon-studio-beta`
2. Rebuild Capacitor IPAs/AABs (Codemagic) with new `errorPath` / server URLs
3. Send beta invites; log blockers vs concept feedback

## Wave 2 — Product bones — IN PROGRESS (this branch)

| App | Shipped this wave |
|-----|-------------------|
| **CoachCore** | **v0.5 complete:** `assignmentStore`, film/training status flips, `LiveTimelinePanel` (mock + local actions + check-ins), Timeline in desktop nav, docs updated |
| **MotoCrew** | **v0.2-demo:** per-ride checklist map + migration, draft delete / use-as-template, home readiness chips, Safety meter per selected ride |
| **CurbCue** | Live fare adapter explicitly gated (`LIVE_FARE_ADAPTER_ENABLED = false`); composite tariff+demo companions remain active |
| **Sermon Studio** | Wave 0 local polish held; Supabase sync still Wave 3 |

### Verify

```bash
cd apps/CoachCore/coachcore-static-v001 && npm test && npm run build
cd apps/MotoCrew && npm run build
cd apps/FairShare && npm run build
node scripts/swarm-smoke.mjs
```

## Wave 3 — Live data (later)

- Supabase schema/RLS (CoachCore v0.6)
- Optional live fare adapter behind flag after Wave 1 feedback
- GPS/map foundation (MotoCrew 0.3+)
- Store listing hygiene — `docs/NATIVE_EXTERNAL_TESTING.md`
