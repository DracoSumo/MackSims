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

Status: Current working version

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

Status: In progress

Goal:

- Add README
- Add product brief
- Add version notes
- Add next steps
- Add app status page
- Prepare project for handoff to another AI/dev later

## Future v0.5 — Static State Simulation

Potential features:

- Client-side success banners
- Mock state changes
- Mark film complete
- Mark workout complete
- Simulate nudge sent
- Simulate note saved
- Simulate AI workout output
- Simulate meal log submission
- Add fake activity timeline

## v0.7.2 — Plugin layer (live beta)

- Honest Integrations center: connect / disconnect / request-access
- Supabase `user_integrations` + `integration_access_requests` with RLS
- Google Calendar OAuth link via existing Google provider (scopes; no event sync yet)
- Strava authorize path when client id is configured (token exchange still needs server secret)
- Partner APIs (Hudl, WHOOP, etc.) waitlist only — never fake Connected

## v0.4 Deployment Note

Mobile demo URL:

https://coachcore7.netlify.app

Live beta staging. Auth + local-first sync + plugin connection state. No payments; partner APIs require real credentials.
