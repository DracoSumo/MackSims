# CoachCore Next Steps

## Immediate Next Step

Apply **both** Supabase migrations on project `bfqfbkldxbojrrxeidcc`, then redeploy Netlify `coachcore7`:

1. `supabase/migrations/20260731210000_coach_scoped_roster_sync.sql`
2. `supabase/migrations/20260731220000_org_team_bootstrap.sql`

Verify: sign in → Status shows team context + cloud roster counts → Sync now.

## Completed: v0.7.5 — Org / team bootstrap

Done:

1. `organizations` / `teams` / `team_members` bootstrap on sign-in (`teamContext.ts`).
2. Product upserts include `team_id` when context exists (still writes `owner_user_id`).
3. Soft-fail when org tables are missing — owner-scoped sync keeps working.
4. Sync now on Profile + Status panels.

## Completed: v0.7.4 — Coach-scoped cloud sync

- `athlete_roster` + owner RLS
- Push/pull roster, assignments, meals, notes on sign-in

## Completed: v0.7.3 — Local roster loop

- Manual athlete roster + Team add / paste import
- Check-in, notes, accountability, assign film/workout, nutrition on local stores

## Next Build

- Athlete auth accounts linked into `team_members`
- Multi-team picker when a coach owns more than one team
- Live partner integrations only after beta sync is stable

## Safety Rules

Do not add real credentials, payments, or fabricated production athletes.

## Current Demo URL

https://coachcore7.netlify.app
