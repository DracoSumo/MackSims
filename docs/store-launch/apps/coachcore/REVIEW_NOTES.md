# CoachCore - Reviewer Notes

**Version:** 0.7.1  
**Do not commit real passwords.**

## Demo Access (no credentials required)

1. Open https://coachcore7.netlify.app/login
2. Tap **Enter Demo Dashboard** (primary path — no sign-in required)
3. Optional: **Continue with Google** or **Continue with GitHub** if OAuth is enabled in Supabase

DEMO_EMAIL=not required for demo path  
DEMO_PASSWORD=not required for demo path

## Reviewer Summary

CoachCore is a MackSims coaching accountability app for **all sports**. Reviewers should evaluate the coach dashboard, accountability board, training/nutrition/video/chat surfaces, and legal pages.

## Features To Test

1. Landing → **Open Dashboard** or **Start Demo**
2. Dashboard — onboarding card, Athlete Today strip, accountability panel
3. **Accountability** — progress bars per athlete
4. **Training** — mark workout complete (local demo state)
5. **Chat** — send demo message (local storage)
6. **Privacy** — https://coachcore7.netlify.app/privacy
7. **Account deletion** — https://coachcore7.netlify.app/account-deletion
8. **Support** — feedback@macksims.com

## Data & Privacy (confirmed)

- **Audience:** All sports — school, club, gym, team, individual
- **Data use:** App functionality only; not sold; no ads
- **Deletion:** privacy@macksims.com or in-app account deletion page
- **Health/nutrition:** Coaching support only — not medical advice
- **Youth:** Programs may include minors; coaches/orgs responsible for local compliance

## Known Limitations (this build)

- Demo mode uses mock athletes; cloud team data requires org/team setup after OAuth
- Video upload is UI scaffold only (no Supabase Storage wired yet)
- Wearables, Hudl, payments not connected
- Native app is Capacitor hybrid loading production web URL

## Backend

Supabase project with **team-scoped RLS** (v0.7.1). Users only see teams they belong to; coach notes are staff-only; sync logs are user-owned.
