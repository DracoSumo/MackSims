# Curbcue (FairShare) - Privacy Data Intake

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
**Source:** [`../../play-data-safety/data_safety_curbcue.csv`](../../play-data-safety/data_safety_curbcue.csv) · [`../../play-data-safety/README.md`](../../play-data-safety/README.md)  
**Owner confirmed (CSV knowledge):** Optional account · Approx location yes / precise no · No payments · No ads

## Product scope

| Question | Answer |
| --- | --- |
| Target audience | Adults comparing local mobility options; store **12+**, target **18+** |
| Data purpose | **App functionality only** — compare/crowd context, optional account, diagnostics |
| Data sales | **No** — MackSims does not sell user data |
| Advertising / tracking | **No** — not used for ads or cross-app tracking |
| Account | **Optional** — guest browse; Settings sign-in for beta sync |
| Account deletion | **On request** — privacy@macksims.com or account-deletion URL |
| Payments | **No** |
| Precise location | **No** |
| Approximate location | **Yes** — foreground ride / crowd context |

## Data matrix (store / compliance)

| Data category | Collected? | Linked to user? | Used for tracking? | Shared with third parties? | Purpose | Optional or required? | Encrypted in transit? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Name | Yes (when signed in) | Yes | No | No (collected only; backend processors on our behalf) | Account, profile | Optional (guest OK) | Yes (HTTPS/TLS) | play-data-safety: name |
| Email | Yes (when signed in) | Yes | No | No | Account, support | Optional | Yes | play-data-safety: email |
| User IDs | Yes (when signed in) | Yes | No | No | Account management | Optional | Yes | play-data-safety: user_id |
| Approximate location | Yes | When signed in / session | No | No | Ride options & crowd-meter context | Optional | Yes | Foreground; **not precise** |
| Precise location | **No** | — | No | No | N/A | N/A | N/A | Not declared |
| App interactions | Yes | When signed in / session | No | No | App functionality | Optional | Yes | play-data-safety: interactions |
| Crash logs | Yes | Possibly via device/session | No | No | App performance | Optional | Yes | play-data-safety: crash |
| Diagnostics | Yes | Possibly via device/session | No | No | App performance | Optional | Yes | play-data-safety: diagnostics |
| Device or other IDs | Yes | Possibly | No | No | App functionality / security | Optional | Yes | play-data-safety: device_id |
| Payment info | **No** | — | No | No | N/A | N/A | N/A | Comparison only |
| Ads / analytics SDKs for ads | **No** | No | No | No | N/A | N/A | N/A | No ads |
| Search/trip booking | No live booking | — | No | No | Informational compare only | N/A | N/A | No price/ETA guarantees |
| Crowd/event signals | Aggregate / contextual UI | Not sold | No | No | Pickup pressure context | Optional | Yes | Privacy: no official venue partnerships claimed |

## Owner questions (resolved)

| Question | Answer |
| --- | --- |
| Precise location? | **No** — approximate only |
| Background location as a product claim? | **No** — foreground approx for compare/crowd context |
| Ride prices live / guaranteed? | **No** — estimated / informational / beta; no guarantees |
| Official ride-provider partnerships? | **No** |
| Accounts required? | **No** — optional Settings sign-in |
| Deletion available? | **Yes** — request via account-deletion URL / privacy@macksims.com |

## Deletion process

1. User emails **privacy@macksims.com** from account email (or uses `/account-deletion`).
2. MackSims verifies identity.
3. Cloud account + associated Curbcue data removed (target: within **30 days**).
4. Backups purge on ~**90-day** cycle.
5. Local/guest data: user clears browser/app site data.

## Compliance notes

- No sale of personal data; no ads; no ad tracking.
- Listing and UI must not claim official partnerships or guaranteed prices/ETAs/availability.
- Import Play Data safety from `data_safety_curbcue.csv` when completing App content.

## In-app / publisher URLs

- Privacy: https://macksims-public-site.netlify.app/privacy/
- Account deletion: https://macksims-public-site.netlify.app/account-deletion/
- Support: https://macksims-public-site.netlify.app/support/
- Product web: https://fairshare-v03-20260624.netlify.app/
