# CoachCore Next Steps

## Immediate Next Step

Apply **v0.7.4 migration** (`supabase/migrations/20260731210000_coach_scoped_roster_sync.sql`) on the live Supabase project, redeploy Netlify with anon key, then verify sign-in merge for roster + assignments.

## Completed: v0.7.4 — Cloud sync (coach-scoped)

Done:

1. `athlete_roster` table + owner-scoped RLS policies.
2. `owner_user_id` on assignments / meal_logs / coach_notes (+ meal athlete fields).
3. Push on save + pull/merge on sign-in for roster, assignments, meals, notes (with check-ins / action log).
4. Status panel shows local vs cloud counts for each store.

Still local-first when signed out. Sync skips cleanly when Supabase is not configured.

## Completed: v0.7.3 — Local roster loop

- Manual athlete roster + Team add / paste import
- Check-in, notes, accountability, assign film/workout, nutrition on local stores
- No fabricated production athletes

## Next Build: org / team bootstrap

Optional hardening once owner-scoped sync is live:

- Ensure default organization + team on first sign-in
- Also write `team_id` on product rows for staff/athlete membership policies
- Athlete auth accounts linked into `team_members`

## Future Integrations

Do not connect Hudl / wearables until auth, roster sync, and permissions are stable in beta.

## Safety Rules

Do not add real credentials, payments, or fabricated production athletes.

## Current Demo URL

https://coachcore7.netlify.app
