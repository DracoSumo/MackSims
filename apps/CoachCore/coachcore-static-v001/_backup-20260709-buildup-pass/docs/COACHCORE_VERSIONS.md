# CoachCore Version Notes

## v0.1 — Static Foundation Lock

Status: Locked

## v0.2 — Real Demo Flow Lock

Status: Locked

## v0.3 — Mock Interaction Layer

Status: Locked

## v0.4 — Demo Polish + Handoff Docs

Status: Locked

## v0.5 — Static State Simulation

Status: Locked

Added local action log, check-ins, mock action runner, timeline scaffolding.

## v0.6 — Backend Scaffold

Status: Locked (schema + adapter layer)

Added:

- Expanded `supabase/schema.sql` with orgs, teams, assignments, RLS policies
- `src/services/data/` adapter layer (mock + Supabase)
- `AuthGate` on `/app/*` when Supabase env is configured
- Anonymous beta intake insert policy

## v0.7 — Build-Up Pass (current)

Status: **Current working version**

Added:

- Wave 1 UX: coach onboarding, Athlete Today strip, Today's loop, progress bars, demo-mode clarity
- `assignmentStore`, mark-complete flows, live timeline from local events
- Demo messaging (`messageStore`), local notifications (`notificationStore`)
- Video upload scaffold, AI workout review workflow
- Vitest coverage for assignment store and athlete progress

Safety:

- No production deploy in this pass unless explicitly authorized
- No real Hudl, wearables, payments, or external AI APIs
- Nutrition/readiness copy remains coaching support only

## Demo URL

https://coachcore7.netlify.app

Static demo. Redeploy only when authorized.
