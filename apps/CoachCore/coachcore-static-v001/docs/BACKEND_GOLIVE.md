# CoachCore — Backend Go-Live (Step 2)

**Date:** 2026-07-09  
**Project:** Coach Core (`bfqfbkldxbojrrxeidcc`)  
**Production:** https://coachcore7.netlify.app

## Netlify env (already configured)

| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bfqfbkldxbojrrxeidcc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set (legacy anon JWT) |
| `SUPABASE_URL` | Set |

| **Production redeploy** | `6a4f9181b4d46d8d7a7f5806` — Supabase env baked at build |

## Supabase migrations applied

1. `coachcore_v07_expand_tables` — orgs, teams, assignments, programming tables; `beta_requests.submitted_by`
2. `coachcore_v07_rls_policies` — core RLS policies
3. `coachcore_v07_rls_remaining` — policies for playbook, meals, video, notes, engagement

## Tables (14, all RLS enabled)

`coach_profiles`, `organizations`, `teams`, `team_members`, `workouts`, `playbook_items`, `assignments`, `meal_logs`, `video_moments`, `coach_notes`, `engagement_events`, `athlete_check_ins`, `coach_action_log`, `beta_requests`

## Manual Supabase dashboard steps

Confirm in **Authentication → URL Configuration**:

- Site URL: `https://coachcore7.netlify.app`
- Redirect URLs: `https://coachcore7.netlify.app/auth/callback`, `http://localhost:3000/auth/callback`

Enable **Google** and/or **GitHub** OAuth providers if not already enabled (see `docs/OAUTH_SETUP.md`).

## Verify

1. Open https://coachcore7.netlify.app/login — OAuth buttons should appear
2. Sign in → lands on `/app` (or auth gate with demo bypass)
3. `/app/status` — Supabase panel should show connected
4. Submit beta form — should insert into `beta_requests` (anon allowed)
5. Athlete check-in / mock action — syncs when signed in

## Security note (v0.7.1)

Permissive beta RLS replaced with team-scoped policies. See `supabase/rls_tighten_v071.sql` and migrations:

- `coachcore_v071_rls_tighten`
- `coachcore_v071_rls_policies`
- `coachcore_v071_rls_content`
- `coachcore_v071_revoke_anon_rpc`
