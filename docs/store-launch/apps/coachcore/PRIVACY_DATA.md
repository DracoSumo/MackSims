# CoachCore - Privacy Data Intake

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

**Updated:** 2026-07-11  
**Owner confirmed:** All sports · App-only use · No data sales · Deletion on request

## Product scope

| Question | Owner answer |
| --- | --- |
| Target audience | **All sports** — school, club, gym, team, and individual coaching |
| Data purpose | **App functionality only** — coaching, accountability, assignments, messaging |
| Data sales | **No** — MackSims does not sell user data |
| Advertising / tracking | **No** — not used for ads or cross-app tracking |
| Account deletion | **On request** — email privacy@macksims.com; see `/account-deletion` |

## Data matrix (store / compliance)

| Data category | Collected? | Linked to user? | Used for tracking? | Shared with third parties? | Purpose | Optional or required? | Encrypted in transit? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Account info (email, OAuth) | Yes when signed in | Yes | No | Supabase Auth, OAuth provider only | Sign-in, account management | Required for cloud accounts | Yes (HTTPS/TLS) | Demo bypass available |
| Profile & role | Yes | Yes | No | No (app backend only) | Coach / athlete / parent views | Required for role features | Yes | |
| Team & roster data | Yes | Yes | No | No | Rosters, groups, assignments | Required for team features | Yes | All sports programs |
| Training & playbook | Yes | Yes | No | No | Workouts, drills, installs | Optional per coach workflow | Yes | |
| Nutrition & readiness | Yes | Yes | No | No | Coaching accountability | Optional | Yes | **Not medical advice** |
| Video / film | Yes (when uploaded) | Yes | No | Storage provider only (Supabase when enabled) | Movement review, assignments | Optional | Yes | Demo scaffold in v0.7 |
| Team messaging | Yes | Yes | No | No | In-app communication | Optional | Yes | Local demo in v0.7 |
| Accountability & check-ins | Yes | Yes | No | No | Locked-in status, coach actions | Optional | Yes | |
| Beta intake | Yes | Yes (email) | No | Formspree/Netlify when configured | Early access requests | Optional | Yes | |
| Wearable imports | No (v0.7) | — | No | No | N/A | N/A | N/A | Not connected |
| Analytics / ad SDKs | No | No | No | No | N/A | N/A | N/A | None in v0.7 |
| Youth / minor data | Possible | Yes when provided | No | No | Same app purposes only | Depends on program | Yes | Programs must comply with local laws; parents/guardians where required |

## Deletion process

1. User emails **privacy@macksims.com** from account email (or uses `/account-deletion`).
2. MackSims verifies identity.
3. Cloud account + associated coaching data removed.
4. Confirmation sent when complete (target: within 30 days).
5. Local demo data: user clears browser/app site data.

## Compliance notes

- Nutrition and readiness = **coaching support only**, not diagnosis or treatment.
- No sale of personal data.
- Data used only to operate CoachCore — not for unrelated MackSims products without consent.
- Functional fitness copy: use "functional fitness" or "CrossFit-style"; no implied CrossFit affiliation.
- **Supabase RLS (v0.7.1):** team-scoped reads/writes; user-owned sync logs; staff-only coach notes. See `supabase/rls_tighten_v071.sql`.

## In-app URLs

- Privacy: `/privacy`
- Account deletion: `/account-deletion`
- Support: `/support`
- Terms: `/terms`
