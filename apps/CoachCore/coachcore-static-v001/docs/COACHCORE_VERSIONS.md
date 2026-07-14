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

## v0.7 — Build-Up Pass

Status: Locked

Added:

- Wave 1 UX: coach onboarding, Athlete Today strip, Today's loop, progress bars, demo-mode clarity
- `assignmentStore`, mark-complete flows, live timeline from local events
- Demo messaging (`messageStore`), local notifications (`notificationStore`)
- Video upload scaffold, AI workout review workflow
- Vitest coverage for assignment store and athlete progress

## v0.7.1 — RLS Tighten + Store Prep (current)

Status: **Current working version**

Added:

- Team-scoped Supabase RLS (orgs, teams, members, content tables)
- User-owned sync logs (`owner_user_id` on check-ins and action log)
- Staff-only coach notes; validated beta anon insert
- Store launch docs, screenshot capture script, bundle ID `com.macksims.coachcore`
- Auth shell copy updated for demo + Supabase sign-in

Production: https://coachcore7.netlify.app
