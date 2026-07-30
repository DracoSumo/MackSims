# Aegis Intel - Privacy Data Intake

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
**Baseline:** Filled from product behavior + publisher entity. Re-check if SDKs change before store submit.

## Product scope

| Question | Answer |
| --- | --- |
| Packaging | Capacitor native shell (iOS + Android) → live Netlify PWA |
| Login | Optional (guest on-device; signed-in via Supabase) |
| Data sales / ads / tracking | No / No / No |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ + support@macksims.com |

## Data Matrix

| Data category | Collected? | Linked to user? | Used for tracking? | Shared with third parties? | Purpose | Optional or required? | Encrypted in transit? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Account info | Yes when signed in | Yes | No | Supabase Auth | Sign-in / sync | Optional (guest mode) | Yes | Email / user ID |
| Watchlists/preferences | Yes | Yes if synced | No | Supabase / Netlify Blobs | App functionality | Optional | Yes | Guest = on-device only |
| Alerts/notifications | Optional | Yes if account | No | Pushover (ops) if enabled | Alerts | Optional | Yes | Confirm product vs operator use |
| Search/research history | Product state / local | Often Yes if synced | No | Hosting logs possible | App functionality | Optional | Yes | |
| Market data provider usage | Ticker queries | Usually No (no identity to market APIs) | No | SEC EDGAR, Alpaca, Polygon, Dilutracker, etc. | Research data | Required for market features | Yes | Server-side |
| Analytics/diagnostics | Hosting logs | May be | No | Netlify | Security / reliability | Required for hosting | Yes | No ad SDK |

## Deletion

1. Email support@macksims.com / privacy@macksims.com or use account-deletion page.
2. Verify identity.
3. Delete cloud account + synced data within 30 days.
4. Backups age out ~90 days.
5. Guest: clear site storage.

## Store disclosure pointers

Use `STORE_CONSOLE_PRIVACY_FILL.md` shared baseline + this matrix for Apple / Play forms.
