# Store Console Privacy Fill — All MackSims Apps

**Last updated:** 14 July 2026  
**Source of truth:** [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md)

Paste these shared values into **every** App Store Connect and Google Play Console listing. App-specific data types still come from each app’s `PRIVACY_DATA*.md`.

---

## Shared identity (both stores)

```
Legal / developer name: MackSims LLC
Copyright: © 2026 MackSims LLC
Address: 1211 Sweet Gum Drive, Brandon, FL 33511, United States
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Account deletion URL: https://macksims-public-site.netlify.app/account-deletion/
Support URL: https://macksims-public-site.netlify.app/support/
Terms URL: https://macksims-public-site.netlify.app/terms/
Privacy email: privacy@macksims.com
Support email: support@macksims.com
Store/feedback email: feedback@macksims.com
```

**Why Netlify:** `macksims.com/privacy` and `/account-deletion` have been returning 404 / inconsistent routing. Store consoles and review bots need stable HTTPS 200 URLs — use the Netlify public site until the custom domain is fixed.

**Internal only (do not paste into public policy or listing body):** EIN `42-3329378` · FL Doc `L26000335172` · Registered agent ZenBusiness Inc., Tallahassee.

---

## Google Play — Data safety (shared baseline)

**Import-ready CSVs:** [`play-data-safety/`](./play-data-safety/) (generated from your RetroArch export template).

| Field | Value |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** (for apps with accounts / cloud sync / location / UGC — see per-app CSV) |
| Is all user data encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **Yes** |
| Deletion URL / instructions | `https://macksims-public-site.netlify.app/account-deletion/` |
| Data sold | **No** |
| Data used for advertising | **No** |
| Families / children | **Not directed to children** |

### Data types often declared when signed-in or cloud features exist

- Email address — Account management / App functionality — Linked to user — Not for ads  
- User IDs / name — App functionality — Linked — Not for ads  
- App interactions — App functionality / Analytics (only if actually collected)  
- Crash logs / diagnostics — App functionality / Fraud prevention — often via hosting  

### App-extra declarations

| App | Extra types to review |
| --- | --- |
| Curbcue / FairShare | Approximate or precise location (foreground) if enabled |
| ThrottleLink / MotoCrew | Location; messages/UGC if live |
| CoachCore | Photos/video if upload live; messages; health-related coaching notes (not clinical) |
| FishCrew | Photos, location, UGC/feed if live |
| ShutterBid | Photos, contact info, marketplace UGC if live |
| Sermon Studio | User content / drafts if cloud |
| Aegis Intel | Account email; watchlist content if synced |

---

## App Store Connect — App Privacy (shared baseline)

| Question | Baseline |
| --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` |
| Do you or third parties collect data? | **Yes** when accounts/cloud/location/UGC exist |
| Data used to track user? | **No** (unless a tracking SDK is later added) |
| Data linked to user? | **Yes** for account/email and synced content |
| Product improvement / analytics | Only if a real analytics SDK is present (current baseline: hosting logs only for several apps) |
| Third-party advertising | **No** |
| Account deletion URL (if account creation) | `https://macksims-public-site.netlify.app/account-deletion/` |

### Common Apple data types (when applicable)

| Data type | Collected? | Linked? | Tracking? | Purpose |
| --- | --- | --- | --- | --- |
| Email Address | Yes if accounts | Yes | No | App Functionality |
| Name / User ID | Yes if profiles | Yes | No | App Functionality |
| User Content | Yes if UGC/sync | Yes | No | App Functionality |
| Location | Only if app uses it | Usually Yes | No | App Functionality |
| Photos or Videos | Only if upload | Yes | No | App Functionality |
| Product Interaction | If measured | Often Yes | No | App Functionality / Analytics |
| Crash Data / Diagnostics | If collected | May be | No | App Functionality |
| Advertising Data | **No** | — | — | — |
| Purchase History | **No** unless IAP lives | — | — | — |

---

## Account deletion copy (both stores / review notes)

```
Users can request deletion at https://macksims-public-site.netlify.app/account-deletion/
or by emailing support@macksims.com / privacy@macksims.com from
the account email (subject: Account Deletion Request).
Verified cloud account data is deleted within 30 days.
Backup residual copies age out within about 90 days.
Guest/local-only data is cleared by the user via device/site storage.
```

---

## Per-app console doc pointers

| App folder | Apple doc | Play doc |
| --- | --- | --- |
| `apps/fishcrew/` | `APP_STORE_CONNECT_AUDIT.md` | `GOOGLE_PLAY_CONSOLE_AUDIT.md` |
| `apps/shutterbid/` | `APP_STORE_CONNECT_AUDIT.md` | `GOOGLE_PLAY_CONSOLE_AUDIT.md` |
| `apps/fairshare/` | `APP_STORE_CONNECT.md` | `GOOGLE_PLAY_CONSOLE.md` |
| `apps/throttlelink/` | `APP_STORE_CONNECT.md` | `GOOGLE_PLAY_CONSOLE.md` |
| `apps/coachcore/` | `APP_STORE_CONNECT.md` | `GOOGLE_PLAY_CONSOLE.md` |
| `apps/sermon-studio/` | `APP_STORE_CONNECT.md` | `GOOGLE_PLAY_CONSOLE.md` |
| `apps/aegis-intel/` | `APP_STORE_CONNECT.md` | `GOOGLE_PLAY_CONSOLE.md` |

Tier-3 listing drafts: `TIER3_PLAY_STORE_LISTINGS.md` · Declarations: `PLAY_CONSOLE_DECLARATIONS.md`
