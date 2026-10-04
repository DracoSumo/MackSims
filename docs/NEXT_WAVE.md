# MackSims hybrid apps — Next Wave

**Active branch:** `cursor/catalog-prepare-no-filler-db2f`  
**Updated:** 2026-07-27

## Wave 0 — Continuity + blank-screen — DONE

Capacitor cold-start fixes, cross-app UX continuity, swarm harness (prior lineage).

## Wave 1 — Closed testing + feedback gates — READY TO RUN

Ops (not code):

1. Redeploy Netlify: `coachcore7`, FairShare (`fairshare-v03-20260624`), `motocrewz`, `sermon-studio-beta`
2. Rebuild Capacitor IPAs/AABs (Codemagic) with `com.macksims.*` Cap / package IDs
3. Send beta invites; log blockers vs concept feedback

## Wave 2 — Product bones — DONE

| App | Shipped |
|-----|---------|
| **CoachCore** | v0.5 assignment store + LiveTimelinePanel |
| **MotoCrew** | v0.2-demo ride checklist / draft template bones |
| **CurbCue** | Live fare adapter gated off |
| **Sermon Studio** | Local library polish held |

## Wave 2.5 — Catalog audit + no filler after login — DONE

See `docs/CATALOG_AUDIT.md`.

## Wave 3 — Build-up (in progress on this branch)

Local-first product depth + Cap ID alignment (no live provider keys required):

| App | This pass |
|-----|-----------|
| **CoachCore** | **v0.7.5:** roster cloud sync + org/team bootstrap (`team_id` on product rows); apply v0.7.4 + v0.7.5 migrations |
| **CurbCue** | Re-open saved trips, fare snapshot on save, auto-push + remote delete when signed in |
| **MotoCrew** | **v0.3-map:** typed route stops + SVG static route map behind `mapAdapter` |
| **Sermon Studio** | Series upsert, series→editor deep link, remote sermon delete, push local series on merge |
| **All hybrids** | Capacitor `appId` + Codemagic Android `PACKAGE_NAME` → `com.macksims.*` |

## Still later

- Apply Supabase schema/RLS in live projects
- Live fare / GPS tiles behind flags after Wave 1 feedback
- Store listing hygiene — `docs/NATIVE_EXTERNAL_TESTING.md`
