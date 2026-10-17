# Aegis Intel - Google Play Console Readiness

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

Entity / disclaimer source: Aegis COMPLIANCE_PRIVACY_PACKAGE (MackSims LLC, Brandon FL). Play data safety CSV: [`../../play-data-safety/data_safety_aegis.csv`](../../play-data-safety/data_safety_aegis.csv).

---

**Updated:** 2026-07-14  
**Packaging:** **GO** — Capacitor native shell loading live Netlify PWA. Package **`com.macksims.aegisintel`**.

## App Identity

| Field | Answer |
| --- | --- |
| App name | **Aegis Intel** |
| Package name | `com.macksims.aegisintel` |
| Category | **Finance** (secondary tag / related: Business) |
| Short description (80 chars) | Watchlists and public-market research — not a broker. |
| Full description | See below |
| Default language | English (United States) |
| Free or paid | **Free** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Account deletion | https://macksims-public-site.netlify.app/account-deletion/ |
| Terms URL | https://macksims-public-site.netlify.app/terms/ |
| Web / marketing | https://sprightly-lily-160925.netlify.app/ · https://macksims.com/ |
| Contact email | feedback@macksims.com |

## Full description (Play store listing)

Aegis Intel is a MackSims public-market research desk for watchlists, dashboards, and publicly available market context.

Build and review watchlists, research notes, and public-market signals in a focused research workspace. Guest mode keeps data on-device; optional sign-in syncs preferences when you choose an account.

Features in this build:
- Guest on-device watchlists (login not required)
- Optional account sync for preferences and research state
- Public-market research surfaces and dashboards
- Privacy policy, support, and account deletion on request

Important disclaimers — read carefully:
- Aegis Intel is NOT a broker and does NOT provide brokerage services.
- Aegis Intel is NOT financial advice and is not a registered investment adviser.
- Aegis Intel does NOT execute trades and does NOT connect to brokerage accounts for trade execution.
- Information is based on publicly available market and filings data only.
- No outcomes are guaranteed. Always do your own research.

Feedback: feedback@macksims.com  
Web: https://sprightly-lily-160925.netlify.app/  
Support: https://macksims-public-site.netlify.app/support/  
Beta hub: https://macksims.com/beta

## Data Safety (Play Console form)

Import or mirror [`../../play-data-safety/data_safety_aegis.csv`](../../play-data-safety/data_safety_aegis.csv). See also [PRIVACY_DATA.md](./PRIVACY_DATA.md).

| Data type | Collected | Shared | Purpose | Optional |
| --- | --- | --- | --- | --- |
| Email address | Yes (sign-in) | Service providers only (Supabase) — not for ads | Account management / app functionality | Yes (guest mode) |
| User IDs | Yes | Service providers only | Account management / app functionality | Yes |
| Other user-generated content | Yes (watchlists / notes if synced) | Service providers only | App functionality | Yes |
| App interactions | Yes | Hosting logs / providers as needed for ops | App functionality | Yes |
| Crash logs | Yes | Hosting (Netlify) | App performance | Required for hosting |
| Diagnostics | Yes | Hosting (Netlify) | App performance / security | Required for hosting |
| Device or other IDs | Yes | May be in hosting/security context | App functionality / security | Yes |
| Location / media / health / payment info | **No** | — | — | — |

**Collects personal data:** Yes (when accounts used).  
**Encrypted in transit:** Yes.  
**Deletion available:** Yes — https://macksims-public-site.netlify.app/account-deletion/ (+ support@macksims.com / privacy@macksims.com).  
**Data not sold.** **No ads.** **No tracking for ads.** Deletion SLA: 30 days live / ~90 days backups.

Declared types (canonical): **email, user_id, ugc, interactions, crash, diagnostics, device_id**.

## App Content Declarations

| Area | Answer |
| --- | --- |
| App access | **All core research available without sign-in** — guest on-device watchlists. Optional signed-in sync. Paste from [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md): see DEMO_REVIEW_LOGINS.md (local only) |
| Ads | **No** |
| Data safety | Completed per `data_safety_aegis.csv` / PRIVACY_DATA.md |
| Content rating | Finance — complete IARC; target maturity **17+ / 18+** (not Directed at Children) |
| Target audience | Adults interested in public-market research; **not directed at children under 13** |
| News app | **No** — research / Finance tooling, not a news-publisher product |
| COVID-19 app | **No** |
| Health features | **No** |
| **Financial features** | **Yes** — informational public-market research and watchlists **ONLY**. Not a broker. Not financial advice. Not trade execution. No brokerage linking for trading. No payments/escrow. |
| User-generated content | Watchlists / research notes (on-device or synced); user-controlled; support moderation via email |

### Financial features declaration (paste for Play)

```
Yes — the app includes financial-related features limited to informational
public-market research and watchlists.

Aegis Intel is NOT a broker, does NOT provide financial advice, does NOT
execute trades, and does NOT connect to brokerage accounts for trading.
Data is based on publicly available market and filings information only.
No investment outcomes are guaranteed. Users must do their own research.
```

## Listing assets

See `../../app-store-assets/aegisintel/` for icon when packaging proceeds. Screenshots TBD from packaged build (see SCREENSHOTS.md).

## Pre-Submission Status

- [x] Package name filled (`com.macksims.aegisintel`)
- [x] Category Finance; short description with broker disclaimer
- [x] Privacy / data safety matrix filled from play-data-safety
- [x] Financial features declaration filled (informational research only)
- [x] Privacy policy / support / deletion URLs filled
- [ ] **Owner packaging go/no-go** (native shell / Play record creation)
- [ ] Play Console app record created (only after go)
- [ ] AAB uploaded to internal / closed testing
- [ ] Screenshots + feature graphic on listing
