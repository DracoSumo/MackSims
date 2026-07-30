# Aegis Intel - App Store Connect Readiness

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

Entity / disclaimer source: [`aegis-intel-v9-full/docs/COMPLIANCE_PRIVACY_PACKAGE.md`](../../../../aegis-intel-v9-full/docs/COMPLIANCE_PRIVACY_PACKAGE.md) (Florida LLC L26000335172).

---

**Updated:** 2026-07-14  
**Packaging:** **GO** — Capacitor native shell (iOS + Android) loading live Netlify PWA. Bundle/package **`com.macksims.aegisintel`**.

## App Identity

| Field | Answer |
| --- | --- |
| App name | **Aegis Intel** |
| Subtitle (30 chars max) | Public-market research desk |
| Bundle ID | `com.macksims.aegisintel` |
| SKU | `aegisintel-ios-001` |
| Primary category | **Finance** |
| Secondary category | Business |
| Age rating target | **17+** (store); audience **18+** |
| Support URL | https://macksims-public-site.netlify.app/support/ |
| Marketing URL | https://sprightly-lily-160925.netlify.app/ · https://macksims.com/ (product / beta hub when linked) |
| Privacy Policy URL | https://macksims-public-site.netlify.app/privacy/ |
| Terms URL | https://macksims-public-site.netlify.app/terms/ |
| Account deletion URL | https://macksims-public-site.netlify.app/account-deletion/ |
| Contact email | feedback@macksims.com |
| Copyright | (c) 2026 MackSims LLC |

## App Information (console fields)

| Field | Answer |
| --- | --- |
| Content rights | MackSims LLC owns or has rights to listing assets and product UI |
| App access | **Sign-in not required** — guest on-device watchlists work without login |
| Demo account | Optional — see [REVIEW_NOTES.md](./REVIEW_NOTES.md) and [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md) |
| Review contact | feedback@macksims.com |
| Export compliance | Uses standard HTTPS/TLS only; no custom crypto beyond system libraries (standard exemption) |

## Store Copy

### Subtitle (30 chars max)

Public-market research desk

### Promotional Text

Watchlists and public-market research in one desk — not a broker, not advice, not trade execution.

### Description (paste)

Aegis Intel is a MackSims public-market research desk for watchlists, dashboards, and publicly available market context.

Build and review watchlists, research notes, and public-market signals in a focused research workspace. Guest mode keeps data on-device; optional sign-in syncs preferences when you choose an account.

**Features in this build:**
- Guest on-device watchlists (login not required)
- Optional account sync for preferences and research state
- Public-market research surfaces and dashboards
- Privacy policy, support, and account deletion on request

**Important disclaimers — read carefully:**
- Aegis Intel is **not a broker** and does **not** provide brokerage services.
- Aegis Intel is **not financial advice** and is not a registered investment adviser.
- Aegis Intel does **not** execute trades and does **not** connect to brokerage accounts for trade execution.
- Information is based on **publicly available** market and filings data only.
- **No outcomes are guaranteed.** Always do your own research.

Feedback: feedback@macksims.com  
Web: https://sprightly-lily-160925.netlify.app/  
Support: https://macksims-public-site.netlify.app/support/

### Keywords

stocks, watchlist, research, finance, market, public data, dashboard, filings, MackSims, Aegis

### What's New

Initial store packaging readiness for Aegis Intel public-market research desk (web/PWA primary). Guest mode and optional sync; not a broker or trade execution tool.

## App Privacy (summary)

Aligned with [PRIVACY_DATA.md](./PRIVACY_DATA.md) and [`../../play-data-safety/data_safety_aegis.csv`](../../play-data-safety/data_safety_aegis.csv):

| Type | Collected | Linked to user? | Tracking? | Purpose |
| --- | --- | --- | --- | --- |
| Email | Yes (signed-in) | Yes | No | App Functionality / Account Management |
| User ID | Yes (signed-in) | Yes | No | App Functionality / Account Management |
| User content (watchlists / notes) | Yes if synced | Yes if account | No | App Functionality |
| App interactions | Yes | May be if signed-in | No | App Functionality |
| Crash logs | Yes (hosting) | May be | No | App Functionality |
| Diagnostics | Yes (hosting) | May be | No | App Functionality |
| Device ID | Yes | May be | No | App Functionality / Security |
| Payments / ads / Precise location | **No** | — | — | — |

**Tracking:** No. **Data not sold.** **No ads.** Deletion on request (30 days live / ~90 days backups). See also COMPLIANCE_PRIVACY_PACKAGE Apple App Privacy draft.

## Review Notes

See [REVIEW_NOTES.md](./REVIEW_NOTES.md) and [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Pre-Submission Status

- [x] Store copy filled (Finance / Business; 17+/18+; required disclaimers)
- [x] Bundle ID target filled (`com.macksims.aegisintel`)
- [x] Privacy / data answers aligned to PRIVACY_DATA.md + play-data-safety
- [x] Reviewer path documented (guest; optional demo login)
- [ ] **Owner packaging go/no-go** (native shell / store record creation)
- [ ] App Store Connect app record created (only after go)
- [ ] Screenshots captured from final packaged build
- [ ] TestFlight binary uploaded
