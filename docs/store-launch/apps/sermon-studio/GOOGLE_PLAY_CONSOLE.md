# Sermon Studio - Google Play Console Readiness

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
**Play listing name:** Sermon Studio

## App Identity

| Field | Answer |
| --- | --- |
| App name | **Sermon Studio** |
| Play app ID | `4972609657779602718` |
| Package name | `com.chrissims.sermonstudio` |
| Category | **Productivity** |
| Short description (80 chars) | Organize sermon prep, notes, and church productivity workflows. |
| Full description | See below (from TIER3) |
| Default language | English (United States) |
| Free or paid | **Free** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ |
| Web / marketing | https://sermon-studio-beta.netlify.app/ |

## Full description (Play store listing)

Sermon Studio is a MackSims church productivity app for organizing sermon prep, notes, writing support, and calendar workflows.

This external beta build loads the live Sermon Studio web experience in a native shell. Create an account or sign in to explore sermon workspace features during testing.

Some export, collaboration, cloud storage, or AI-assisted writing features may be limited during beta. Content and copyright responsibility remain with the user and their organization.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

## Data Safety (Play Console form)

Import or mirror [`../../play-data-safety/data_safety_sermonstudio.csv`](../../play-data-safety/data_safety_sermonstudio.csv). See also [PRIVACY_DATA.md](./PRIVACY_DATA.md).

| Data type | Collected | Shared | Purpose | Optional |
| --- | --- | --- | --- | --- |
| Name | Yes | No | Account, profile | No (sign-in for full workspace) |
| Email address | Yes (sign-in) | No | Account, support | No |
| User IDs | Yes | No | Account management | No |
| Files and docs | Yes | No | Sermon drafts / workspace files | Yes per workflow |
| User-generated content | Yes | No | Sermon / notes / workspace content | Yes per workflow |
| App interactions | Yes | No | App functionality | Yes |
| Crash logs | Yes | No | App performance | Yes |
| Diagnostics | Yes | No | App performance | Yes |
| Device or other IDs | Yes | No | App functionality / security | Yes |
| Political or religious beliefs | **No** | — | — | — |
| Payment info | **No** | — | — | — |

**Data not sold.** **No ads.** **No tracking for ads.** Deletion on request via https://macksims-public-site.netlify.app/account-deletion/ (30 days live / ~90 days backups).

## App Content Declarations

| Area | Answer |
| --- | --- |
| App access | **Some features restricted** — sign-in required for full workspace. Credentials in [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md) and [REVIEW_NOTES.md](./REVIEW_NOTES.md) |
| Ads | **No** |
| Data safety | Completed per play-data-safety CSV / PRIVACY_DATA.md |
| Content rating | Productivity — complete IARC; expect low maturity |
| Target audience | **18+** (store age gate **12+** acceptable); not Directed at Children |
| Health features | **No** |
| Generated content / AI | May be limited in beta; do not overclaim capabilities |
| User content / copyright | **Content and copyright remain with the user and their organization** |
| Political / religious beliefs data | **Not collected / not declared** |

## Listing assets

Play Console → [Sermon Studio main store listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4972609657779602718/main-store-listing)

See `../../TIER3_PLAY_STORE_LISTINGS.md` and `../../app-store-assets/sermonstudio/` for icon, feature graphic, and phone screenshots.

## Pre-Submission Status

- [x] Package name confirmed (`com.chrissims.sermonstudio`)
- [x] Play app ID filled (`4972609657779602718`)
- [x] Privacy / data safety matrix filled from play-data-safety
- [x] Store copy aligned to TIER3 Sermon Studio section
- [x] Privacy policy live
- [ ] AAB uploaded to internal / closed testing
- [ ] Screenshots + feature graphic confirmed on listing (see SCREENSHOTS.md)
