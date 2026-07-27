# CoachCore Version Notes

## v0.1 — Static Foundation Lock

Status: Locked

Included:

- Public landing page
- Coach dashboard
- Route structure
- Team page
- Chat page
- Playbook page
- Training page
- Nutrition page
- Video page
- Accountability page
- Integrations page
- Profile page
- Admin page
- Login shell
- Signup shell
- Beta shell
- Mock data foundation
- Mobile and desktop navigation

Safety:

- No backend
- No credentials
- No external APIs
- No deployment

## v0.2 — Real Demo Flow Lock

Status: Locked

Added:

- Clickable athlete profiles
- Clickable video moment detail pages
- Mock create workout page
- Mock create playbook item page
- Mock data IDs
- More realistic demo navigation

Safety:

- Still static
- Still mock data only
- No real auth or database

## v0.3 — Mock Interaction Layer

Status: Locked

Added:

- Send athlete nudge mock page
- Assign video mock page
- Assign workout mock page
- Log meal mock page
- AI workout draft mock page
- Save coach note mock page
- Action cards on dashboard
- Action buttons on athlete profiles
- Action buttons on video detail pages

Safety:

- Buttons do not write data
- No real notifications
- No real AI API
- No database writes

## v0.4 — Demo Polish + Handoff Docs

Status: Locked

Added:

- README
- Product brief
- Version notes
- Next steps
- App status page
- Handoff-ready documentation

## v0.5 — Static State Simulation

Status: Current working version

Goal: Make the static app feel more interactive without a backend.

Added:

- Live activity timeline (device action log + check-ins + mock seed)
- Simulated assignment status store (`assignmentStore`) with localStorage
- Film room mark in progress / complete / needs nudge
- Training board status cycle (Assigned → In progress → Complete)
- Dashboard and Timeline pages wired to live local data
- Desktop nav Timeline link
- Success banners and mock action confirmations from earlier v0.5 polish

Safety:

- Local device simulation only
- Optional Supabase auth when configured
- No payments, Hudl, wearable APIs, or production user data

## Future v0.6 — Backend Foundations

Potential features:

- Supabase auth hardening
- Core database tables
- Row-level security
- Organization / team / role model

## v0.4 Deployment Note

Mobile demo URL:

https://coachcore7.netlify.app

This is a static mobile demo. It is not production and does not include real auth, real data, payments, Hudl integration, wearable integrations, or external credentials.

## v0.6-bones (local)

- Assignment records (title/kind/status/assignee) in addition to status map
- Meal log + coach note stores feed LiveTimelinePanel
- Schema stubs: assignments, meal_logs, coach_notes (+ commented RLS)
- Cap appId `com.macksims.coachcore`

