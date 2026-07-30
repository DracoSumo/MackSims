# ThrottleLink - App Store Connect Readiness

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
**Web app:** https://motocrewz.netlify.app (product brand in UI: **MotoCrew**; store listing name: **ThrottleLink**)  
**ASC app ID:** TBD — create after owner approves iOS submit (do not invent)

## App Identity

| Field | Answer |
| --- | --- |
| App name | **ThrottleLink** (web/UI brand also **MotoCrew**) |
| Subtitle | Group rides for your pack |
| Bundle ID | `com.chrissims.throttlelink` |
| SKU | `throttlelink-ios-001` |
| Primary category | **Maps & Navigation** |
| Secondary category | Lifestyle (optional) |
| Age rating target | **12+** (UGC routes/events; limited messaging may appear in beta) |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Marketing URL | https://macksims.com/beta |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Terms URL | https://macksims-public-site.netlify.app/terms/ |
| Account deletion URL | https://macksims-public-site.netlify.app/account-deletion/ |
| Contact email | feedback@macksims.com |
| Copyright | (c) 2026 MackSims LLC |

## Store Copy

### Subtitle (30 chars max)

Group rides for your pack

### Promotional Text

Plan rides with your pack — meetups, routes, and crew coordination in one place.

### Description

ThrottleLink (MotoCrew) is a MackSims motorcycle group ride app for planning rides, coordinating with your crew, and reviewing route and event surfaces.

This external beta build loads the live MotoCrew web experience in a native shell. Guest mode is available — acknowledge the safety notice before ride features unlock.

Some coordination, messaging, or location features may be limited during beta. This app is not an emergency service and does not replace safe riding judgment, traffic laws, or official navigation tools.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

### Keywords

motorcycle, rides, group, route, map, crew, meetup, MotoCrew, MackSims, navigation

## Disclaimers (must stay true to build)

- Not an emergency service; no guaranteed safety outcomes.
- No live background location / continuous tracking claims for this beta — **approximate location, foreground only** when used.
- Do not claim turn-by-turn navigation, intercom/calls, or production push unless the submitted binary includes them.

## Review Notes

Paste block and walkthrough: see [REVIEW_NOTES.md](./REVIEW_NOTES.md) and [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

**Sign-in required:** No — guest after safety notice.  
Optional account: see DEMO_REVIEW_LOGINS.md (local only)

## App Privacy

Fill App Privacy from [PRIVACY_DATA.md](./PRIVACY_DATA.md) (aligned with `play-data-safety/data_safety_throttlelink.csv`).

Collected (when used / signed in): name, email, user ID, approximate location, UGC (routes/events), messages, app interactions, crash logs, diagnostics, device ID.  
Not sold / no ads / no tracking for ads. Deletion on request.

## Pre-Submission Status

- [x] Store name confirmed: ThrottleLink (MotoCrew alias documented)
- [x] Bundle ID confirmed (`com.chrissims.throttlelink`)
- [x] SKU confirmed (`throttlelink-ios-001`)
- [x] Category: Maps & Navigation
- [x] Privacy/data answers filled from Play Data Safety CSV
- [ ] TestFlight build uploaded
- [ ] Screenshots from final build (see SCREENSHOTS.md / `app-store-assets/motocrew/`)
