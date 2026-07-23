# Curbcue (FairShare) - Google Play Console Readiness

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
**Play listing name:** Curbcue · **Package / folder legacy name:** FairShare

## App Identity

| Field | Answer |
| --- | --- |
| App name | **Curbcue** |
| Play app ID | `4973784784637253598` |
| Package name | `com.chrissims.fairshare` |
| Category | **Maps & Navigation** |
| Short description (80 chars) | Compare local ride options and pickup pressure before you go. |
| Full description | See below (from TIER3) |
| Default language | English (United States) |
| Free or paid | **Free** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ |
| Web / marketing | https://fairshare-v03-20260624.netlify.app/ |

## Full description (Play store listing)

Curbcue is a MackSims mobility comparison app for reviewing local ride options, pickup pressure, and nearby transport context before you head out.

Compare rideshare, taxi, and local transport options with fare context and crowd-meter signals. This external beta build loads the live CurbCue web experience in a native shell. Optional sign-in is available under Settings.

Some features may be limited, demo, or preview behavior during beta testing. Curbcue does not represent official partnerships with ride providers and does not guarantee prices, pickup times, or availability.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

## Data Safety (Play Console form)

Import or mirror [`../../play-data-safety/data_safety_curbcue.csv`](../../play-data-safety/data_safety_curbcue.csv). See also [PRIVACY_DATA.md](./PRIVACY_DATA.md).

| Data type | Collected | Shared | Purpose | Optional |
| --- | --- | --- | --- | --- |
| Name | Yes | No | Account, profile | Yes (guest browse) |
| Email address | Yes (sign-in) | No | Account, support | Yes |
| User IDs | Yes | No | Account management | Yes |
| Approximate location | Yes | No | Ride/crowd context (foreground) | Yes |
| Precise location | **No** | — | — | — |
| App interactions | Yes | No | App functionality | Yes |
| Crash logs | Yes | No | App performance | Yes |
| Diagnostics | Yes | No | App performance | Yes |
| Device or other IDs | Yes | No | App functionality / security | Yes |
| Payment info | **No** | — | — | — |

**Data not sold.** **No ads.** **No tracking for ads.** Deletion on request via https://macksims-public-site.netlify.app/account-deletion/ (30 days live / ~90 days backups).

## App Content Declarations

| Area | Answer |
| --- | --- |
| App access | **All functionality available without sign-in** — guest browse compare / crowd-meter. Optional Settings sign-in for beta sync. See [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md) |
| Ads | **No** |
| Data safety | Completed per play-data-safety CSV / PRIVACY_DATA.md |
| Content rating | Maps & Navigation — complete IARC; expect low maturity |
| Target audience | **18+** (store age gate **12+** acceptable); not Directed at Children |
| Location permissions | Approximate / foreground for ride and crowd context; **not precise**; not background tracking as a product claim |
| Financial/payment features | **No** — comparison only; no booking/payments |
| Health features | **No** |
| Official partnerships | **None** — no official ride-provider partnerships; no price/ETA guarantees |

## Listing assets

Play Console → [Curbcue main store listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973784784637253598/main-store-listing)

See `../../TIER3_PLAY_STORE_LISTINGS.md` and `../../app-store-assets/curbcue/` for icon, feature graphic, and phone screenshots.

## Pre-Submission Status

- [x] Package name confirmed (`com.chrissims.fairshare`)
- [x] Play app ID filled (`4973784784637253598`)
- [x] Privacy / data safety matrix filled from play-data-safety
- [x] Store copy aligned to TIER3 Curbcue section
- [x] Privacy policy live
- [ ] AAB uploaded to internal / closed testing
- [ ] Screenshots + feature graphic confirmed on listing (see SCREENSHOTS.md)
