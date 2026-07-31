# CoachCore Next Steps

## Immediate Next Step

Ship **cloud roster sync** (Supabase `team_members` / athletes) on top of the v0.7.3 local roster loop — keep local-first until signed in.

## Completed: v0.7.3 — Local roster loop

Done:

1. Manual athlete roster (add one + paste list) on `/app/team/add`.
2. Team, accountability, check-in, notes, athlete detail read `resolveAthletes()`.
3. Assign video / workout → `assignmentStore` (local records, no fake recipients).
4. Nutrition board surfaces `mealLogStore`; log-meal can attach to an athlete.
5. Local data export includes roster, assignments, meals, notes.
6. Production builds stay empty until the coach adds athletes (fixtures flag only for demos).

## Completed earlier

- v0.5 static simulation + live local timeline
- v0.7.x Supabase auth + check-in / action-log sync when configured
- Assignment / meal / note local stores + schema stubs

## Next Build: cloud roster + assignment sync

Potential backend work:

- Persist roster rows to Supabase with RLS (coach owns team)
- Sync assignments, meal_logs, coach_notes (schema stubs already present)
- Organization / team / role tables

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

Do not add payments until legal pages, terms/privacy, auth/database stability, and beta feedback confirm value.

## Safety Rules

Do not touch:

- FishCrew
- ShutterBid
- MackSims public-site

Do not add:

- Real credentials
- Real API keys
- Real payments
- Fabricated production athletes

until explicitly approved.

## Current Demo URL

https://coachcore7.netlify.app

Label as live beta. Roster is coach-entered local data until cloud sync ships.
