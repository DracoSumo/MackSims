# ShutterBid - Reviewer Notes

**ASC app ID:** `6783551944` · Bundle/package: `com.chrissims.shutterbid`  
**Sign-in required:** YES (ASC checked)  
Source of truth: [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access (required)

Use these review accounts (provision in ShutterBid auth if not already created). Prefer these over any prior ASC-only password so docs and console stay aligned.

```
Sign-in required.
Client: review.shutterbid.client@macksims.com / SbClient2026!Mack
Photographer: review.shutterbid.photo@macksims.com / SbPhoto2026!Mack
Test client job post + photographer profile/bid surfaces.
No live payments/escrow in this beta.
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Role | Email | Password |
| --- | --- | --- |
| Client | `review.shutterbid.client@macksims.com` | `SbClient2026!Mack` |
| Photographer | `review.shutterbid.photo@macksims.com` | `SbPhoto2026!Mack` |

**Action:** Update ASC App Review Information username/password fields to match this table (replace any older credentials). Same paste for Play **App access** if sign-in is required on Android.

## Reviewer Summary

ShutterBid is a MackSims photographer/client marketplace for local photo jobs, bids, profiles, and approval/trust flows present in the beta build. Not a live payment or escrow product in this external beta.

## Features To Test

1. Sign in as **client** → browse/post job surfaces
2. Sign in as **photographer** → profile / portfolio / bid surfaces
3. Support / privacy / account-deletion links
4. Do **not** expect live payments, escrow, contracts, or payouts unless explicitly enabled in the build notes

## Console paste checklist (remaining)

| Item | Status |
| --- | --- |
| Apple Privacy Policy URL | Paste `https://macksims-public-site.netlify.app/privacy/` (currently blank) |
| Play Privacy Policy URL | Paste same (currently blank) |
| Play short/full description | Use drafts in `STORE_FORM_DRAFTS.md` |
| Play Data Safety | Import `../../play-data-safety/data_safety_shutterbid.csv` |
| Play category | Select (Photography / Lifestyle recommended) |
| Play contact | `feedback@macksims.com` |
| Review credentials in ASC | Replace with table above after provisioning |
| Screenshots | Upload only after owner asset approval |
| App Review build | Select TestFlight build on version page |

## Known Limitations

- `macksims.com/shutterbid` public marketing route may be broken — use in-app + shared legal URLs
- Privacy questionnaire still needs owner sign-off before final App Privacy submit
- Beta marketplace features may be demo/seed data
