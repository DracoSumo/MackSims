# Sermon Studio - Privacy Data Intake

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
**Source:** [`../../play-data-safety/data_safety_sermonstudio.csv`](../../play-data-safety/data_safety_sermonstudio.csv) · [`../../play-data-safety/README.md`](../../play-data-safety/README.md)  
**Owner confirmed (CSV knowledge):** Account required for full workspace · files + UGC yes · **no** political/religious beliefs · No payments · No ads

## Product scope

| Question | Answer |
| --- | --- |
| Target audience | Adult church / ministry productivity users; store **12+**, target **18+** |
| Data purpose | **App functionality only** — sermon workspace, notes/files, account, diagnostics |
| Data sales | **No** — MackSims does not sell user data |
| Advertising / tracking | **No** — not used for ads or cross-app tracking |
| Account | **Required for full workspace** — sign-in |
| Account deletion | **On request** — privacy@macksims.com or account-deletion URL |
| Payments | **No** |
| Political or religious beliefs | **No** — do not declare belief demographics |
| Files / UGC | **Yes** — sermon drafts, notes, workspace content |

## Data matrix (store / compliance)

| Data category | Collected? | Linked to user? | Used for tracking? | Shared with third parties? | Purpose | Optional or required? | Encrypted in transit? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Name | Yes (when signed in) | Yes | No | No (collected only; backend processors on our behalf) | Account, profile | Required for full workspace | Yes (HTTPS/TLS) | play-data-safety: name |
| Email | Yes (when signed in) | Yes | No | No | Account, support | Required for full workspace | Yes | play-data-safety: email |
| User IDs | Yes (when signed in) | Yes | No | No | Account management | Required for full workspace | Yes | play-data-safety: user_id |
| Files and docs | Yes | Yes | No | No | Sermon drafts / workspace files | Optional per workflow | Yes | play-data-safety: files |
| User-generated content | Yes | Yes | No | No | Sermon notes / prep content | Optional per workflow | Yes | play-data-safety: ugc |
| App interactions | Yes | When signed in / session | No | No | App functionality | Optional | Yes | play-data-safety: interactions |
| Crash logs | Yes | Possibly via device/session | No | No | App performance | Optional | Yes | play-data-safety: crash |
| Diagnostics | Yes | Possibly via device/session | No | No | App performance | Optional | Yes | play-data-safety: diagnostics |
| Device or other IDs | Yes | Possibly | No | No | App functionality / security | Optional | Yes | play-data-safety: device_id |
| Political or religious beliefs | **No** | — | No | No | N/A | N/A | N/A | Explicitly **not** declared |
| Payment info | **No** | — | No | No | N/A | N/A | N/A | No commerce in this build |
| Ads / analytics SDKs for ads | **No** | No | No | No | N/A | N/A | N/A | No ads |
| Location | **No** | — | No | No | N/A | N/A | N/A | Not in CSV |

## Owner questions (resolved)

| Question | Answer |
| --- | --- |
| Accounts required? | **Yes** for full workspace (Play: some features restricted) |
| Sermon drafts / files? | **Yes** — files and UGC declared |
| AI / generated content? | May be limited in beta; content/copyright stay with user/org |
| Political / religious beliefs collected? | **No** — do not mark on Data safety / App Privacy |
| Payments? | **No** |
| Deletion available? | **Yes** — request via account-deletion URL / privacy@macksims.com |

## Deletion process

1. User emails **privacy@macksims.com** from account email (or uses `/account-deletion`).
2. MackSims verifies identity.
3. Cloud account + associated Sermon Studio data removed (target: within **30 days**).
4. Backups purge on ~**90-day** cycle.
5. Local/device data: user clears browser/app site data.

## Compliance notes

- No sale of personal data; no ads; no ad tracking.
- Sermon drafts/files as docs/UGC — **do not** mark Political or religious beliefs unless collecting belief demographics.
- Listing and UI: content/copyright with user; AI features may be limited in beta.
- Import Play Data safety from `data_safety_sermonstudio.csv` when completing App content.

## In-app / publisher URLs

- Privacy: https://macksims-public-site.netlify.app/privacy/
- Account deletion: https://macksims-public-site.netlify.app/account-deletion/
- Support: https://macksims-public-site.netlify.app/support/
- Product web: https://sermon-studio-beta.netlify.app/
