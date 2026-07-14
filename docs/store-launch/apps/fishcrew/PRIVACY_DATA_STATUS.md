# FishCrew - Privacy Data Status

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

Do not claim "no data collected", "not linked to user", or "not shared" unless owner-confirmed.

Use statuses: `READY`, `IN PROGRESS`, `NEEDS OWNER CONFIRMATION`, `BLOCKED`, `NOT APPLICABLE`.

## Privacy/Data Safety Matrix

| Area | Apple App Privacy Status | Google Data Safety Status | Notes |
| --- | --- | --- | --- |
| Account/profile data | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm auth provider, profile fields, and deletion path |
| Location | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm precise/approximate, foreground/background, storage, and sharing |
| Photos/camera/uploads | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm camera/photo library permissions and upload/storage behavior |
| User-generated content | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm feed/post/comment/media behavior |
| Social/feed behavior | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm public/private visibility and moderation |
| Messaging if active | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm whether messaging exists in submitted build |
| Weather/map integrations | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm providers and data sent to them |
| Notifications | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm push provider and notification categories |
| Moderation | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm report/block/admin tools |
| Account deletion | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm in-app, web, or support path |
| Analytics/diagnostics | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm SDKs, providers, retention, and linking |

## Current Audit Result

| Item | Status | Notes |
| --- | --- | --- |
| Privacy Policy URL reachable | READY | `https://macksims-public-site.netlify.app/privacy/` returned HTTP 200 on 2026-07-01 |
| Account deletion URL reachable | READY | `https://macksims-public-site.netlify.app/account-deletion/` returned HTTP 200 on 2026-07-01 |
| Support URL reachable | READY | `https://macksims-public-site.netlify.app/support/` returned HTTP 200 on 2026-07-01 |
| App Privacy answers complete | NEEDS OWNER CONFIRMATION | Console answers cannot be confirmed locally |
| Google Data safety answers complete | NEEDS OWNER CONFIRMATION | Console answers cannot be confirmed locally |
| Data provider inventory complete | NEEDS OWNER CONFIRMATION | Auth, maps/weather, analytics, storage, notifications need confirmation |
| Account deletion behavior confirmed | READY (shared SLA) | Email/web request; live cloud within 30 days; backups ~90 days — see `PUBLISHER_LEGAL_ENTITY.md` |

## Owner Confirmation Questions

- Is login required for normal use or review?
- Which auth providers are active?
- Which profile fields are public?
- Does FishCrew request location, and is it foreground only or background too?
- Are photos uploaded, stored, or only selected locally?
- Are feed/community posts user-generated?
- Is messaging active?
- Which weather/map providers are active?
- Are push notifications enabled?
- How does account deletion work?
