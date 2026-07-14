# CoachCore - Release Notes

**Version:** 0.7.1  
**Build:** TBD (TestFlight / Play internal)  
**Platform:** iOS / Android (Capacitor hybrid) + Web PWA  
**Release type:** Internal test  
**Owner:** MackSims

## Short Notes

v0.7.1 tightens Supabase RLS for store readiness and completes privacy/store prep docs. Demo dashboard remains the primary reviewer path.

## What's New

- Team-scoped row-level security on all Supabase tables
- User-owned check-in and action log sync (`owner_user_id`)
- Coach notes visible to staff only
- Beta intake: anon insert with validation; users read own submissions only
- Bundle ID locked to `com.macksims.coachcore`
- Privacy policy, account deletion, and support pages live on production

## Tester Notes

1. Use **Enter Demo Dashboard** on login — no account needed
2. Dismiss demo walkthrough banner for cleaner screenshots
3. Test accountability → athlete profile → mark complete flows
4. Legal links in landing footer and Settings-adjacent pages

## Known Limitations

- Hybrid native shell loads https://coachcore7.netlify.app/app
- Mock roster until coach creates org/team via future onboarding flow
- OAuth requires Google/GitHub enabled in Supabase dashboard
