# ThrottleLink - Privacy Data Intake

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
**Baseline:** Filled from [`../../play-data-safety/data_safety_throttlelink.csv`](../../play-data-safety/data_safety_throttlelink.csv) + product behavior (guest after safety notice). Re-check if SDKs or location mode change before submit.

## Product scope

| Question | Answer |
| --- | --- |
| Store name | **ThrottleLink** (web/UI brand: **MotoCrew**) |
| Package / bundle | `com.chrissims.throttlelink` |
| Web | https://motocrewz.netlify.app |
| Login | **Not required** — open → accept safety notice → guest; optional account |
| Data purpose | App functionality only — ride planning, crew coordination, map/route context |
| Data sales / ads / tracking | **No / No / No** |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ + privacy@macksims.com |
| Location posture | **Approximate only**; **foreground** in beta — no background tracking declared |
| Safety posture | Not an emergency service; no guaranteed safety |

## Data Matrix

Aligned with Play Data Safety CSV (collected only; not shared for ads; encrypted in transit).

| Data category | Collected? | Linked to user? | Used for tracking? | Shared with third parties? | Purpose | Optional or required? | Encrypted in transit? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Name | Yes (when account/profile) | Yes | No | No (collected only; processors on our behalf) | App functionality, account management, security | Optional | Yes | Guest may have no name |
| Email address | Yes (when signed in) | Yes | No | Auth provider / backend only | App functionality, account, security | Optional | Yes | Guest path available |
| User IDs | Yes (when signed in) | Yes | No | Backend only | App functionality, account, security | Optional | Yes | |
| Approximate location | Yes when map/ride features use it | Often Yes if account | No | Map/hosting as needed to operate feature | Ride / map coordination | Optional | Yes | **Foreground approx only** in beta; no precise location |
| Precise location | **No** | — | No | — | N/A | N/A | N/A | Do not declare |
| Other in-app messages | Yes when messaging active | Yes | No | Backend only | Crew coordination | Optional | Yes | Limited in beta |
| Other user-generated content | Yes | Yes | No | Backend only | Routes, events, ride plans | Optional | Yes | |
| App interactions | Yes | May be | No | Hosting / backend | App functionality | Optional | Yes | |
| Crash logs | Yes | May be | No | Crash/ops tooling if enabled | Reliability, security | Required (ops) | Yes | |
| Diagnostics | Yes | May be | No | Hosting logs | Reliability, security | Required (ops) | Yes | |
| Device or other IDs | Yes | May be | No | Backend / device layer | App functionality, security | Required (ops) | Yes | Not advertising ID |
| Calls / intercom / audio | **No** (this beta) | — | No | — | N/A | N/A | N/A | Do not declare unless build adds them |
| Background location | **No** (this beta) | — | No | — | N/A | N/A | N/A | Do not claim live tracking |
| Payments / health / SMS | **No** | — | No | — | N/A | N/A | N/A | |
| Advertising ID / ads SDKs | **No** | No | No | No | N/A | N/A | N/A | |

## Account & deletion

| Item | Answer |
| --- | --- |
| Account creation methods | Other auth / OAuth (per CSV) when user opts in |
| Guest mode | Yes — after safety notice |
| User can request deletion | **Yes** |
| Deletion URL | https://macksims-public-site.netlify.app/account-deletion/ |
| Process | Email privacy@macksims.com or use deletion page → verify → remove cloud account + associated ride/account data (target 30 days); backups ~90 days; guest: clear app/site data |

## Compliance notes

- Store disclosures must match the **submitted binary**: no background tracking, emergency service, or guaranteed-safety claims for this beta.
- Data used only to operate ThrottleLink / MotoCrew — not sold, not used for ads.
- Messaging / UGC may be limited in beta but are declared because surfaces exist or may collect when used.
- Import Play form from `play-data-safety/data_safety_throttlelink.csv` when possible.

## In-app / shared URLs

- App: https://motocrewz.netlify.app
- Privacy: https://macksims-public-site.netlify.app/privacy/
- Support: https://macksims-public-site.netlify.app/support/
- Account deletion: https://macksims-public-site.netlify.app/account-deletion/
- Review logins: [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md)
