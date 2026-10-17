# CoachCore - Reviewer Notes

**Version:** 0.7.1  
Source of truth for all review logins: [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access (no credentials required)

1. Open https://coachcore7.netlify.app/login
2. Tap **Enter Demo Dashboard** (primary path — no sign-in required)
3. Optional: **Continue with Google** / **GitHub**, or email/password review account below

```
Demo path (preferred): Open app → Enter Demo Dashboard (no login).
Optional signed-in review: see DEMO_REVIEW_LOGINS.md (local only)
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

DEMO_EMAIL=review.coachcore@macksims.com  
DEMO_PASSWORD=(see DEMO_REVIEW_LOGINS.md local only)  
(Only needed if testing signed-in / sync paths — demo dashboard does not require them.)

## Reviewer Summary

CoachCore is a MackSims coaching accountability app for **all sports**. Reviewers should evaluate the coach dashboard, accountability board, training/nutrition/video/chat surfaces, and legal pages.

## Features To Test

1. Landing → **Open Dashboard** or **Start Demo**
2. Dashboard — onboarding card, Athlete Today strip, accountability panel
3. **Accountability** — progress bars per athlete
4. **Training** — mark workout complete (local demo state)
5. **Chat** — send demo message (local storage)
6. **Privacy** / **Account deletion** / **Support** links

## Data & Privacy (confirmed)

- **Audience:** All sports — school, club, gym, team, individual
- **Data use:** App functionality only; not sold; no ads
- **Deletion:** privacy@macksims.com or account-deletion URL
- **Health/nutrition:** Coaching support only — not medical advice
- **Youth:** Programs may include minors; coaches/orgs responsible for local compliance

## Package ID note

- Capacitor / ASC docs target: `com.macksims.coachcore`
- Existing Play listing / Data Safety CSV: `com.chrissims.coachcore` (Play ID `4973388644367502581`)
- Do **not** change either ID without owner approval.

## Known Limitations (this build)

- Demo mode uses mock athletes; cloud team data requires org/team setup after OAuth
- Video upload is UI scaffold only
- Wearables, Hudl, payments not connected
- Native app is Capacitor hybrid loading production web URL

## Backend

Supabase with team-scoped RLS (v0.7.1). Users only see teams they belong to.
