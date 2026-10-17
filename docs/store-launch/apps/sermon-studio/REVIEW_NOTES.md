# Sermon Studio - Reviewer Notes

**Store listing name:** Sermon Studio  
**Package / Bundle:** `com.chrissims.sermonstudio`  
**SKU:** `sermonstudio-ios-001`  
**Play app ID:** `4972609657779602718`  
**Apple App ID:** TBD until ASC record is created  
**Web:** https://sermon-studio-beta.netlify.app/  

Demo credentials also tracked in [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access (login REQUIRED for full workspace)

1. Open the app (native shell) or https://sermon-studio-beta.netlify.app/
2. Sign in with the review account below to access the full sermon workspace
3. Play Console App access: **Some features restricted** — paste credentials into reviewer instructions

```
Sign-in required for full workspace.
Email: review.sermonstudio@macksims.com
Password: see DEMO_REVIEW_LOGINS.md (local only)
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Field | Value |
| --- | --- |
| Login required | **Yes** — full workspace |
| Demo email | `review.sermonstudio@macksims.com` |
| Demo password | `[see DEMO_REVIEW_LOGINS.md]` |
| Support contact | feedback@macksims.com / support@macksims.com |

## Reviewer Summary

Sermon Studio is a MackSims church productivity app for organizing sermon prep, notes, writing support, and calendar workflows. Reviewers should sign in, then evaluate the workspace dashboard, scripture / ideas / series surfaces, and legal pages. **Content and copyright responsibility remain with the user and their organization.** AI-assisted writing, export, collaboration, or cloud storage features may be limited during beta.

## Features To Test

1. Cold launch → sign-in with review credentials
2. **Dashboard** — sermon workspace / project organization
3. **Scripture / ideas / series** — planning and prep surfaces included in the build
4. Notes / productivity workflows available after sign-in
5. **Privacy** — https://macksims-public-site.netlify.app/privacy/
6. **Account deletion** — https://macksims-public-site.netlify.app/account-deletion/
7. **Support** — https://macksims-public-site.netlify.app/support/ · feedback@macksims.com

## Data & Privacy (confirmed)

- **Audience:** Productivity; target **18+** (store **12+**)
- **Account:** Required for full workspace
- **Data use:** App functionality / performance only; **not sold**; **no ads**; **no tracking**
- **Deletion:** privacy@macksims.com or account-deletion URL; 30 days live / ~90 days backups
- **Declared types (play-data-safety):** name, email, user_id, files, ugc, interactions, crash, diagnostics, device_id
- **Not declared:** political or religious beliefs demographics

## Disclaimers (must stay accurate in UI and listing)

- Content and copyright remain with the user and their organization
- AI / export / collaboration / cloud storage features may be limited in beta
- Do not overstate generated-content or ministry-workflow capabilities beyond the submitted build

## Known Limitations (this build)

- External beta: native shell loads live Sermon Studio web experience
- Full workspace requires sign-in (Play: some features restricted)
- Some export, collaboration, cloud storage, or AI-assisted writing features may be limited during beta
- Reviewer account should be seeded with minimal demo workspace data before submit

## Smoke-Test Checklist

- [ ] App opens on a clean install
- [ ] Sign-in works with review credentials
- [ ] Full workspace / dashboard loads after login
- [ ] Scripture / ideas / series (or equivalent) surfaces navigate
- [ ] Content/copyright and AI beta limitations language is accurate
- [ ] Support / privacy / account deletion links work
- [ ] No private user data or secrets appear in UI
- [ ] No unverified AI, storage, or copyright claims

## Pre-Submission Status

- [x] Identifiers filled
- [x] Privacy matrix filled from play-data-safety
- [x] Demo credentials documented (DEMO_REVIEW_LOGINS)
- [ ] Screenshots confirmed for ASC / Play
- [ ] AAB / TestFlight binary ready for submit
- [ ] Review account provisioned + seeded in auth
