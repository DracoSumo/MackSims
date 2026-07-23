# MackSims LLC — Publisher Legal Entity (all App Store / Play apps)

**Last updated:** 14 July 2026  
**Use this file** for App Store Connect, Google Play Console, privacy policy footers, and account-deletion pages across every MackSims listed app.

**Do not publish the EIN on public web policies or store listing text.** Keep it for tax, banking, and internal records.

---

## Legal entity (from Florida Sunbiz + IRS CP575A)

| Field | Value |
| --- | --- |
| Legal name | **MackSims LLC** |
| Entity type | Florida Limited Liability Company |
| Document number | **L26000335172** |
| Status | Active |
| Date filed (FL) | 18 June 2026 |
| EIN (IRS CP575A, 23 June 2026) | **42-3329378** (name control: **MACK**) |
| Sole member | Christopher Sims |
| Principal / mailing address | **1211 Sweet Gum Drive, Brandon, FL 33511, United States** |
| Registered agent | **ZenBusiness Inc.**, 336 E. College Ave., Suite 301, Tallahassee, FL 32301 |

---

## Shared store URLs (paste into every console)

**Canonical host for store review:** Netlify public site (HTTP 200 verified).  
Use these, not `macksims.com`, until custom-domain routing is fixed.

| Field | Value |
| --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` |
| Support URL | `https://macksims-public-site.netlify.app/support/` |
| Terms URL | `https://macksims-public-site.netlify.app/terms/` |
| Marketing / website | `https://macksims-public-site.netlify.app/` |
| Beta hub | `https://macksims-public-site.netlify.app/beta/` |

App-specific product hosts (CoachCore, Aegis, etc.) may keep their own `/privacy` pages, but **App Store Connect and Google Play Console should use the Netlify URLs above** so review bots do not hit `macksims.com` 404s.

---

## Shared contacts

| Purpose | Email |
| --- | --- |
| Privacy / DSAR | `privacy@macksims.com` |
| Support / account deletion requests | `support@macksims.com` |
| Store / beta feedback | `feedback@macksims.com` |
| Legal notices | `legal@macksims.com` |

---

## Copyright / seller strings

- **Copyright (App Store Connect):** `© 2026 MackSims LLC`
- **Developer / seller display name:** `MackSims LLC`
- **Trade name on site:** MackSims

---

## Baseline privacy answers (all apps unless an app file says otherwise)

| Topic | Answer |
| --- | --- |
| Data sold | **No** |
| Data used for ads / cross-app tracking | **No** |
| Advertising ID / ATT tracking | **No** (confirm if any SDK is added later) |
| Children / under 13 | **Not directed to children** |
| Primary audience | **18+** (adult / general audience unless an app file changes this) |
| Users can request deletion | **Yes** — `https://macksims-public-site.netlify.app/account-deletion/` + email |
| Live cloud deletion SLA | **Within 30 days** of verified request |
| Backup residual purge | **About 90 days** |
| Encryption in transit | **Yes (HTTPS/TLS)** |
| Governing law (ops draft) | **Florida, United States** |

---

## Apps this applies to

| App (store name) | Notes |
| --- | --- |
| FishCrew | Existing Apple + Play records |
| ShutterBid | Existing Apple + Play records |
| Curbcue (FairShare) | Play listing; maps/mobility |
| ThrottleLink (MotoCrew) | Play listing; rides/crews |
| CoachCore | Apple + Play; fitness/coaching (not medical device) |
| Sermon Studio | Apple + Play pack |
| Aegis Intel | Research tool; optional accounts |

Also covered by the **site** Privacy Policy: MomentPick and any other MackSims beta products listed on macksims.com.

---

## Console paste checklist (do once per app)

### App Store Connect
1. App Information → Privacy Policy URL → `https://macksims-public-site.netlify.app/privacy/`
2. App Privacy → Nutrition labels per that app’s `PRIVACY_DATA*.md` (use baseline above for sell/track/ads)
3. If accounts exist → Account deletion URL → `https://macksims-public-site.netlify.app/account-deletion/`
4. Copyright → `© 2026 MackSims LLC`
5. Support URL → `https://macksims-public-site.netlify.app/support/`
6. Review contact → `support@macksims.com` or `feedback@macksims.com`

### Google Play Console
1. App content → Privacy policy → `https://macksims-public-site.netlify.app/privacy/`
2. Store settings → Email → `feedback@macksims.com` · Website → `https://macksims-public-site.netlify.app/support/`
3. Data safety → Deletion: Yes · URL `https://macksims-public-site.netlify.app/account-deletion/` · Sold: No · Tracking/ads: No · Encrypted in transit: Yes
4. Ads declaration → No ads
5. Target audience → 18+ · Not appealing primarily to children

Detail fill guide: [`STORE_CONSOLE_PRIVACY_FILL.md`](./STORE_CONSOLE_PRIVACY_FILL.md)
