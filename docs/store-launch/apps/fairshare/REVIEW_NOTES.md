# Curbcue (FairShare) - Reviewer Notes

**Store listing name:** Curbcue  
**Package / Bundle:** `com.chrissims.fairshare`  
**Play app ID:** `4973784784637253598`  
**Web:** https://fairshare-v03-20260624.netlify.app/  

Demo credentials also tracked in [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access (login NOT required)

1. Open the app (native shell) or https://fairshare-v03-20260624.netlify.app/
2. Browse **compare** and **crowd-meter** as a guest — no sign-in required
3. Optional: open **Settings** and sign in with the review account below

```
Sign-in not required. Open app and browse compare / crowd-meter.
Optional account: see DEMO_REVIEW_LOGINS.md (local only)
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Field | Value |
| --- | --- |
| Login required | **No** — guest browse |
| Optional demo email | `review.curbcue@macksims.com` |
| Optional demo password | `[see DEMO_REVIEW_LOGINS.md]` |
| Support contact | feedback@macksims.com / support@macksims.com |

## Reviewer Summary

Curbcue is a MackSims mobility comparison app. Reviewers should evaluate guest browse of local ride option comparison, pickup pressure / crowd-meter signals, optional Settings sign-in, and legal pages. **Do not expect official ride-provider partnerships, live dispatch, booking, payments, or guaranteed prices/ETAs.**

## Features To Test

1. Cold launch → compare / home surfaces load without login
2. **Compare** — review local ride options / fare context (informational only)
3. **Crowd meter** — pickup pressure / nearby transport context
4. **Settings** — optional sign-in path (review account above)
5. **Privacy** — https://macksims-public-site.netlify.app/privacy/
6. **Account deletion** — https://macksims-public-site.netlify.app/account-deletion/
7. **Support** — https://macksims-public-site.netlify.app/support/ · feedback@macksims.com

## Data & Privacy (confirmed)

- **Audience:** Maps & Navigation; target **18+** (store **12+**)
- **Location:** Approximate, foreground for ride/crowd context — **not precise**, not sold
- **Account:** Optional; guest browse is full review path
- **Data use:** App functionality / performance only; **not sold**; **no ads**; **no tracking**
- **Deletion:** privacy@macksims.com or account-deletion URL; 30 days live / ~90 days backups
- **Declared types (play-data-safety):** name, email, user_id, approx_location, interactions, crash, diagnostics, device_id

## Disclaimers (must stay accurate in UI and listing)

- No official partnerships with ride providers
- No guarantees of prices, pickup times, or availability
- Comparison / informational only — not a booking or payment product in this build

## Known Limitations (this build)

- External beta: native shell loads live CurbCue web experience
- Some features may be limited, demo, or preview during beta
- Fare / ETA figures are contextual estimates only — not live dispatch quotes
- Optional account sync may require reviewing Settings sign-in separately from guest path

## Smoke-Test Checklist

- [ ] App opens on a clean install
- [ ] Guest compare / crowd-meter works without login
- [ ] Optional Settings sign-in works with demo account
- [ ] Provider, pricing, and partnership language is accurate (no false guarantees)
- [ ] Support / privacy / account deletion links work
- [ ] No private user data or secrets appear in UI
- [ ] No unverified booking, payment, official partnership, or guaranteed price claims

## Pre-Submission Status

- [x] Identifiers filled
- [x] Privacy matrix filled from play-data-safety
- [ ] Screenshots confirmed for ASC / Play
- [ ] AAB / TestFlight binary ready for submit
