# ShutterBid - App Store Connect Audit

## Publisher (shared - all MackSims store apps)

See [`../../PUBLISHER_LEGAL_ENTITY.md`](../../PUBLISHER_LEGAL_ENTITY.md) and [`../../STORE_CONSOLE_PRIVACY_FILL.md`](../../STORE_CONSOLE_PRIVACY_FILL.md).

| Field | Value |
| --- | --- |
| Legal name | MackSims LLC |
| Address | 1211 Sweet Gum Drive, Brandon, FL 33511, United States |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Account deletion URL | https://macksims-public-site.netlify.app/account-deletion/ |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Privacy email | privacy@macksims.com |
| Support / feedback | support@macksims.com / feedback@macksims.com |
| Copyright | (c) 2026 MackSims LLC |
| Sell / share / ads / tracking | No / No / No |
| Deletion SLA | 30 days live / ~90 days backups |

---

ShutterBid is treated as an existing App Store Connect record. Do not create a duplicate app record, change the bundle ID, or create a second listing without explicit owner approval.

Use statuses: `READY`, `IN PROGRESS`, `NEEDS OWNER CONFIRMATION`, `BLOCKED`, `NOT APPLICABLE`.

## Existing Console Audit

| Item | Status | Notes |
| --- | --- | --- |
| App record exists? | READY | Existing console flow per v001.1 request; do not duplicate |
| App name confirmed? | READY | Locally documented as ShutterBid; verify exact App Store Connect display before submit |
| Bundle ID confirmed? | NEEDS OWNER CONFIRMATION | Do not change without owner approval |
| SKU confirmed? | NEEDS OWNER CONFIRMATION | Audit existing value |
| Category confirmed? | NEEDS OWNER CONFIRMATION | Candidate categories: Photo & Video, Business, Productivity |
| Age rating started? | NEEDS OWNER CONFIRMATION | Must reflect uploads, marketplace, messaging/contact, and UGC if active |
| Privacy Policy URL added? | NEEDS OWNER CONFIRMATION | URL reachable on 2026-07-01: https://macksims-public-site.netlify.app/privacy/; confirm added in console |
| Terms URL added? | NEEDS OWNER CONFIRMATION | URL reachable on 2026-07-01: https://macksims-public-site.netlify.app/terms/; confirm added in console if required |
| Support URL added? | NEEDS OWNER CONFIRMATION | URL reachable on 2026-07-01: https://macksims-public-site.netlify.app/support/; confirm added in console |
| Account deletion URL added if accounts exist? | NEEDS OWNER CONFIRMATION | URL reachable on 2026-07-01: https://macksims-public-site.netlify.app/account-deletion/; confirm added in console |
| App privacy started? | NEEDS OWNER CONFIRMATION | See `PRIVACY_DATA_STATUS.md` |
| Screenshots uploaded? | NEEDS OWNER CONFIRMATION | See `SCREENSHOT_STATUS.md` |
| App icon uploaded? | NEEDS OWNER CONFIRMATION | Verify current console asset |
| Store copy complete? | IN PROGRESS | Editable draft below |
| Review notes complete? | IN PROGRESS | See `REVIEW_NOTES.md` |
| Demo/reviewer account needed? | NEEDS OWNER CONFIRMATION | Do not commit passwords |
| Login/auth providers documented? | NEEDS OWNER CONFIRMATION | Required before review |
| TestFlight / iOS tester status? | NEEDS OWNER CONFIRMATION | Prior docs say external testing candidate; audit current TestFlight group/build |
| Build uploaded? | NEEDS OWNER CONFIRMATION | Prior docs say next native/store build pending; confirm current console state |
| Review blockers? | IN PROGRESS | See `SUBMISSION_BLOCKERS.md` |
| Next action? | IN PROGRESS | See `NEXT_ACTIONS.md` |

## Audit Evidence

- Existing console status: supplied by v001.1 request.
- Local readiness note: ShutterBid is an external testing candidate; older notes say focused smoke expectation passed and next native/store build was pending.
- Public URL check on 2026-07-01 returned HTTP 200 for support, privacy, terms, account deletion, and `https://macksims.com/shutterbid`.
- Console-only values still require owner confirmation: bundle ID, SKU, age rating, uploaded build, TestFlight state, screenshots/assets, app privacy answers, and reviewer/demo access.

## Editable App Store Copy Draft

### App Name

ShutterBid

### Subtitle

Photo jobs, bids, and pro profiles.

### Promotional Text

Review a MackSims marketplace experience for local photo jobs, client requests, photographer profiles, and trusted approval flows.

### Description

ShutterBid is a MackSims photographer and client marketplace app for reviewing local photo job workflows, bid surfaces, photographer profiles, and business or venue profile paths.

The app is designed to help clients and photographers explore a cleaner marketplace flow for creative work. Depending on the submitted build, testers may be able to review guest browsing, client requests, photographer profiles, job or bid flows, and admin approval or trust signals.

If this build is still in beta or testing, some jobs, bids, profiles, reviews, approval states, or marketplace content may be limited, demo, or preview behavior. Final store copy must match the exact submitted build.

### Keywords

photography, photographer, client, jobs, bids, portfolio, marketplace, venue, business, local, MackSims

### What's New

TBD.

## Copy Safety Notes

- Do not claim live payments, escrow, contracts, verified bookings, dispute handling, production moderation, or guaranteed work outcomes unless confirmed.
- Do not imply business/venue verification or admin approval beyond what is active in the submitted build.
- Keep beta/testing language if the build is not production-complete.
