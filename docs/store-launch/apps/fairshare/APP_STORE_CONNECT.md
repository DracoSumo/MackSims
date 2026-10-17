# Curbcue (FairShare) - App Store Connect Readiness

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

**Updated:** 2026-07-14  
**Store listing name:** Curbcue (legacy folder / Play package: FairShare)

## App Identity

| Field | Answer |
| --- | --- |
| App name | **Curbcue** |
| Subtitle | Local ride options, before you go |
| Bundle ID | `com.chrissims.fairshare` |
| SKU | `fairshare-ios-001` |
| Apple App ID | TBD — create after owner approves iOS submit (do not invent) |
| Primary category | **Maps & Navigation** |
| Secondary category | Travel (optional) |
| Age rating target | **12+** (store); target audience **18+** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Marketing URL | https://fairshare-v03-20260624.netlify.app/ |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Terms URL | https://macksims-public-site.netlify.app/terms/ |
| Account deletion URL | https://macksims-public-site.netlify.app/account-deletion/ |
| Contact email | feedback@macksims.com |
| Copyright | (c) 2026 MackSims LLC |

## Store Copy

### Subtitle (30 chars max)

Local rides before you go

### Promotional Text

Compare local ride options and pickup pressure before you head out — no booking required.

### Description

Curbcue is a MackSims mobility comparison app for reviewing local ride options, pickup pressure, and nearby transport context before you head out.

Compare rideshare, taxi, and local transport options with fare context and crowd-meter signals. This external beta build loads the live CurbCue web experience in a native shell. Optional sign-in is available under Settings.

**Features in this build:**
- Guest browse — login not required for compare / crowd-meter
- Local ride option comparison with fare context
- Pickup pressure / crowd-meter signals
- Optional Settings sign-in for beta sync
- Privacy policy, support, and account deletion on request

Some features may be limited, demo, or preview behavior during beta testing. **Curbcue does not represent official partnerships with ride providers and does not guarantee prices, pickup times, or availability.**

Feedback: feedback@macksims.com  
Web: https://fairshare-v03-20260624.netlify.app/

### Keywords

rideshare, taxi, fare, pickup, compare, mobility, navigation, local, MackSims, Curbcue

## Review Notes

See [REVIEW_NOTES.md](./REVIEW_NOTES.md) and [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## App Privacy (summary)

Filled from [`../../play-data-safety/data_safety_curbcue.csv`](../../play-data-safety/data_safety_curbcue.csv) / [PRIVACY_DATA.md](./PRIVACY_DATA.md):

| Type | Collected | Notes |
| --- | --- | --- |
| Name, email, user ID | Yes (optional account) | Account management / app functionality |
| Approximate location | Yes | Foreground ride/crowd context; **not precise** |
| App interactions | Yes | App functionality |
| Crash logs / diagnostics / device ID | Yes | App performance / security |
| Payments / ads / tracking | **No** | — |

**Data not sold.** **No ads.** Deletion on request (30 days live / ~90 days backups).

## Pre-Submission Status

- [x] Identifiers filled (bundle `com.chrissims.fairshare`, SKU `fairshare-ios-001`)
- [x] Privacy / data matrix filled from play-data-safety
- [x] Store copy aligned to TIER3 Curbcue listing
- [x] Reviewer path documented (guest browse; optional demo login)
- [ ] Screenshots captured from final store build (see SCREENSHOTS.md / app-store-assets)
- [ ] TestFlight / native binary confirmed for submit
