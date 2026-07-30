# ShutterBid - Privacy Data Status

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
| Client/photographer roles | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm role fields and visibility |
| Photo uploads/portfolio | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm camera/photo library and storage behavior |
| Marketplace bids/jobs | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm whether live, demo, or preview |
| Contact info | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm email/phone/contact form behavior |
| Messaging/contact behavior if active | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm if direct messaging exists |
| Business/venue profiles | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm profile fields and admin approval |
| Admin approval/moderation | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm trust flow, reporting, and blocking |
| Account deletion | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm in-app, web, or support path |
| Analytics/diagnostics | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm SDKs, providers, retention, and linking |
| Payments if active | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Confirm before making any commerce claims |

## Current Audit Result

| Item | Status | Notes |
| --- | --- | --- |
| Privacy Policy URL reachable | READY | `https://macksims-public-site.netlify.app/privacy/` returned HTTP 200 on 2026-07-01 |
| Account deletion URL reachable | READY | `https://macksims-public-site.netlify.app/account-deletion/` returned HTTP 200 on 2026-07-01 |
| Support URL reachable | READY | `https://macksims-public-site.netlify.app/support/` returned HTTP 200 on 2026-07-01 |
| App Privacy answers complete | NEEDS OWNER CONFIRMATION | Console answers cannot be confirmed locally |
| Google Data safety answers complete | NEEDS OWNER CONFIRMATION | Console answers cannot be confirmed locally |
| Data provider inventory complete | NEEDS OWNER CONFIRMATION | Auth, uploads/storage, marketplace, contact/messaging, analytics, admin tooling need confirmation |
| Account deletion behavior confirmed | READY (shared SLA) | Email/web request; live cloud within 30 days; backups ~90 days — see `PUBLISHER_LEGAL_ENTITY.md` |
| Payment/commerce data status confirmed | NEEDS OWNER CONFIRMATION | Prior docs warn production payments are not ready unless a specific build says otherwise |

## Owner Confirmation Questions

- Is login required for client or photographer flows?
- Which auth providers are active?
- What role/profile fields are collected and public?
- Are photo uploads stored, processed, or demo-only?
- Are jobs and bids real marketplace records or preview content?
- Is direct messaging active, or only contact/request flow?
- What admin approval/moderation tools exist?
- Are payments, deposits, subscriptions, tips, payouts, escrow, or contracts active?
- How does account deletion work?
