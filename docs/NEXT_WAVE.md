# MackSims hybrid apps — Next Wave

**Active branch:** `cursor/catalog-prepare-no-filler-db2f`  
**Updated:** 2026-07-27

## Wave 0 — Continuity + blank-screen — DONE

Capacitor cold-start fixes, cross-app UX continuity, swarm harness (prior lineage).

## Wave 1 — Closed testing + feedback gates — READY TO RUN

Ops (not code):

1. Redeploy Netlify: `coachcore7`, FairShare (`fairshare-v03-20260624`), `motocrewz`, `sermon-studio-beta`
2. Rebuild Capacitor IPAs/AABs (Codemagic)
3. Send beta invites; log blockers vs concept feedback

## Wave 2 — Product bones — DONE (merged into this branch)

| App | Shipped |
|-----|---------|
| **CoachCore** | v0.5 assignment store + LiveTimelinePanel |
| **MotoCrew** | v0.2-demo ride checklist / draft template bones |
| **CurbCue** | Live fare adapter gated off |
| **Sermon Studio** | Local library polish held |

## Wave 2.5 — Catalog audit + no filler after login — THIS BRANCH

See `docs/CATALOG_AUDIT.md`. Signed-in / workspace sessions no longer show tourist demo chrome.

## Wave 3 — Live data (later)

- Supabase schema/RLS (CoachCore v0.6)
- Optional live fare adapter after Wave 1 feedback
- GPS/map foundation (MotoCrew 0.3+)
- Store listing hygiene — `docs/NATIVE_EXTERNAL_TESTING.md`
