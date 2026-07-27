# CoachCore Next Steps

## Immediate Next Step

Finish **CoachCore v0.6 — Backend Foundations** (auth + data model when ready).

## Completed: v0.5 — Static State Simulation

Done:

1. Success banners on mock action pages.
2. Local component state for mock actions.
3. Mark Complete / In progress buttons (film + training).
4. Live activity timeline (device actions + check-ins + sample seed).
5. Simulated assignment status changes via `assignmentStore`.
6. Mock AI generated workout output.
7. Mock note saved confirmation.
8. Mock meal log submitted confirmation.

Still local-only. No database writes for assignments.

## Next Build: v0.6 — Backend Foundations

Potential backend stack:

- Supabase auth
- Supabase database
- Supabase storage for video/image uploads
- Row-level security
- Organization/team/role tables

Core backend tables:

- users
- organizations
- teams
- team_members
- assignments
- workouts
- playbook_items
- meal_logs
- video_moments
- engagement_events
- coach_notes
- integrations

## Future Auth Rules

Roles:

- Coach
- Athlete
- Parent / Guardian
- Organization Admin
- Gym Owner
- Trainer

Rules:

- Coaches can manage assigned teams.
- Athletes can only see their teams and assignments.
- Parents can only see approved youth-athlete information.
- Admins can manage organization-level teams and settings.
- Coach notes should be private to authorized staff.

## Future Integrations

Important: Do not connect real integrations until auth, database, and permissions are stable.

Potential integrations:

- Hudl
- Apple Health
- Google Health Connect
- Garmin
- Fitbit
- WHOOP
- Oura
- Strava
- TeamSnap
- MaxPreps
- Google Calendar

Hudl language must stay careful:

"Supported where API, export, embed, or licensed integration access is available."

## Future Payments

Potential pricing:

- Solo coach
- Team plan
- Gym plan
- School / club plan
- Organization plan

Do not add payments until:

- Legal pages are drafted
- Terms/privacy are reviewed
- Auth and database are stable
- Beta feedback confirms value

## Safety Rules

Do not touch:

- FishCrew
- ShutterBid
- MackSims public-site

Do not add:

- Real credentials
- Real API keys
- Real payments
- Real production deploys
- Real customer/user data

until explicitly approved.

## Current Demo URL

Mobile demo:

https://coachcore7.netlify.app

Keep this labeled as a static demo until backend/auth/integrations are intentionally added.
