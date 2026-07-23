# ThrottleLink - Google Play Console Readiness

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
**Web app:** https://motocrewz.netlify.app (UI brand: **MotoCrew**)  
**Play Console:** [ThrottleLink listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973807688393588463/main-store-listing)

## App Identity

| Field | Answer |
| --- | --- |
| App name | **ThrottleLink** |
| Package name | `com.chrissims.throttlelink` |
| Play app ID | `4973807688393588463` |
| Category | **Maps & Navigation** |
| Short description (80 chars) | Plan motorcycle rides, crew meetups, and local ride coordination. |
| Full description | See below (same as TIER3 / App Store description) |
| Default language | English (United States) |
| Free or paid | **Free** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ |

## Store Listing

### Short description

Plan motorcycle rides, crew meetups, and local ride coordination.

### Full description

ThrottleLink (MotoCrew) is a MackSims motorcycle group ride app for planning rides, coordinating with your crew, and reviewing route and event surfaces.

This external beta build loads the live MotoCrew web experience in a native shell. Guest mode is available — acknowledge the safety notice before ride features unlock.

Some coordination, messaging, or location features may be limited during beta. This app is not an emergency service and does not replace safe riding judgment, traffic laws, or official navigation tools.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

## Data Safety (Play Console form)

Import or mirror [`../../play-data-safety/data_safety_throttlelink.csv`](../../play-data-safety/data_safety_throttlelink.csv). Summary:

| Data type | Collected | Shared | Purpose | Optional |
| --- | --- | --- | --- | --- |
| Name | Yes | No (collected only) | App functionality, account, security | Optional |
| Email address | Yes | No | App functionality, account, security | Optional |
| User IDs | Yes | No | App functionality, account, security | Optional |
| Approximate location | Yes | No | App functionality (rides/map; foreground) | Optional |
| Other in-app messages | Yes | No | App functionality (limited in beta) | Optional |
| Other user-generated content | Yes | No | Routes / events / ride plans | Optional |
| App interactions | Yes | No | App functionality | Optional |
| Crash logs | Yes | No | App functionality, security | Required (ops) |
| Diagnostics | Yes | No | App functionality, security | Required (ops) |
| Device or other IDs | Yes | No | App functionality, security | Required (ops) |

**Not collected:** precise location, payments, health, SMS, advertising ID.  
**Data not sold. No ads.** Deletion on request via privacy@macksims.com / account-deletion URL.

## App Content Declarations

See also [`../../PLAY_CONSOLE_DECLARATIONS.md`](../../PLAY_CONSOLE_DECLARATIONS.md).

| Area | Answer |
| --- | --- |
| App access | **All functionality available without sign-in** — open → accept safety notice → guest rides/map. Optional sign-in under Settings. |
| Review credentials (optional) | See [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md): see DEMO_REVIEW_LOGINS.md (local only) |
| Ads | No |
| Advertising ID | No |
| Data safety | Per CSV / PRIVACY_DATA.md |
| Content rating | Teen / communication possible; messaging limited in beta |
| Target audience | 18+ primary; not directed at children under 13 |
| Health / financial / government | No |
| Location | Approximate, **foreground only** in beta — do not declare background tracking |
| Safety / emergency | Not an emergency service; no guaranteed safety |

## Assets

Play phone screenshots + graphics: `docs/store-launch/play-assets/motocrew/` (home, rides, map, safety).

## Pre-Submission Status

- [x] Package name confirmed (`com.chrissims.throttlelink`)
- [x] Play app ID confirmed (`4973807688393588463`)
- [x] Category + store copy filled from TIER3
- [x] Data safety CSV available
- [ ] AAB uploaded to internal/closed testing
- [ ] Screenshots + feature graphic uploaded
