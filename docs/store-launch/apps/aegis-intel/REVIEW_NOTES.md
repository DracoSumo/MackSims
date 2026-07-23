# Aegis Intel - Reviewer Notes

**Product:** Aegis Intel  
**Package / Bundle target:** `com.chrissims.aegisintel`  
**Category:** Finance (secondary: Business)  
**Web / PWA:** https://sprightly-lily-160925.netlify.app/  
**Packaging:** Web/PWA primary; native shell TBD — use these notes when a store binary is submitted.

Demo credentials also tracked in [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access (login NOT required)

1. Open the packaged app, or https://sprightly-lily-160925.netlify.app/
2. Use **guest mode** — on-device watchlists and research surfaces work without sign-in
3. Optional: sign in with the review account below to exercise cloud sync

```
Guest mode works without login (on-device watchlists).
Optional signed-in sync: see DEMO_REVIEW_LOGINS.md (local only)
Not a broker or financial adviser. Public-market research only.
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Field | Value |
| --- | --- |
| Login required | **No** — guest on-device is the primary review path |
| Optional demo email | `review.aegis@macksims.com` |
| Optional demo password | `[see DEMO_REVIEW_LOGINS.md]` |
| Support contact | feedback@macksims.com / support@macksims.com |

## Reviewer Summary

Aegis Intel is a MackSims **public-market research desk** for watchlists, dashboards, and publicly available market context. Reviewers should evaluate guest watchlists, optional signed-in sync, research/dashboard flows, and legal pages.

**This app is not a broker, does not give financial advice, and does not execute trades.**

## Required disclaimers (listing + review notes)

Please treat the product as:

- **Not a broker** / not brokerage services
- **Not financial advice** / not a registered investment adviser
- **Not trade execution** / no brokerage account linking for trading
- **Public information only** (market/filings APIs; no non-public information claims)
- **No guarantees** of investment outcomes
- Users must **do their own research**

## Features To Test

1. Cold launch → home / desk loads in **guest mode** without login
2. **Watchlist** — add/view tickers; guest data stays on-device
3. **Research / dashboard** — public-market context surfaces load
4. Optional **Sign-in** — see DEMO_REVIEW_LOGINS.md (local only) for sync
5. **Privacy** — https://macksims-public-site.netlify.app/privacy/
6. **Terms** — https://macksims-public-site.netlify.app/terms/
7. **Account deletion** — https://macksims-public-site.netlify.app/account-deletion/
8. **Support** — https://macksims-public-site.netlify.app/support/ · feedback@macksims.com

## Data & Privacy (confirmed)

Aligned with [PRIVACY_DATA.md](./PRIVACY_DATA.md) and [`../../play-data-safety/data_safety_aegis.csv`](../../play-data-safety/data_safety_aegis.csv):

- **Audience:** Finance research tooling; store **17+** / target **18+**; not directed at children under 13
- **Account:** Optional; guest mode is full primary review path
- **Declared types:** email, user_id, ugc, interactions, crash, diagnostics, device_id
- **Data use:** App functionality / account / security only; **not sold**; **no ads**; **no tracking**
- **Encrypted in transit:** Yes
- **Deletion:** account-deletion URL or privacy@macksims.com / support@macksims.com; 30 days live / ~90 days backups
- **Payments / brokerage credentials:** Not collected

## Known Limitations (this build)

- Web / PWA is the live product; **native store shell is TBD** until owner packaging go/no-go
- Guest data is on-device — clearing site/app storage removes local guest state without deleting a cloud account
- Market data comes from public providers (e.g. SEC EDGAR and configured market APIs); figures are informational only
- Optional admin/ops unlocks on web are device-local convenience gates — not required for store review of public guest flow
- In-app Delete Account UI may still lean on the public deletion page for cloud accounts until native packaging ships the in-app flow (see COMPLIANCE_PRIVACY_PACKAGE)

## Smoke-Test Checklist

- [ ] App / PWA opens on a clean install
- [ ] Guest watchlists work without login
- [ ] Optional review account sign-in works when enabled
- [ ] Listing and in-app copy do **not** claim broker, advice, trade execution, or guaranteed outcomes
- [ ] Support / privacy / terms / account deletion links work
- [ ] No secrets, live brokerage credentials, or private user data appear in UI
- [ ] Financial features declaration (Play) remains informational-research-only

## Pre-Submission Status

- [x] Identifiers filled (`com.chrissims.aegisintel`)
- [x] Privacy matrix filled from play-data-safety / PRIVACY_DATA.md
- [x] Required financial disclaimers in reviewer notes
- [x] Demo path documented (guest + optional credentials)
- [ ] Owner packaging go/no-go
- [ ] Screenshots confirmed for ASC / Play
- [ ] AAB / TestFlight binary ready for submit
