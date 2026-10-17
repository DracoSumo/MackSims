# ASC submission blockers — all MackSims apps

**Updated:** 2026-07-23  
**Source of truth for URLs / copyright:** [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md)  
**Demo / review logins:** [`DEMO_REVIEW_LOGINS.md`](./DEMO_REVIEW_LOGINS.md)  
**Screenshot packs:** `app-store-assets/<app>/`  
**Do not invent privacy or age-rating answers** — use per-app docs or mark **OWNER CONFIRM**.

ShutterBid Version 1.0 (Prepare for Submission) showed these blockers; treat them as required for **every** MackSims iOS app before “Add for Review”:

1. App Privacy Policy URL  
2. Screenshots for **12.9-inch iPad** (2048×2732)  
3. Content Rights information  
4. Age Ratings responses  
5. Primary Category  

Also fix if present: Support URL / Marketing URL must be **live https** (prefer Netlify public site until `macksims.com` routing is solid); Copyright → `© 2026 MackSims LLC` (not “2023 MackSims, LLC”).

---

## Paste these URLs in ASC for every app

| Field | Value |
| --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` |
| Support URL | `https://macksims-public-site.netlify.app/support/` |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` |
| Terms (if asked) | `https://macksims-public-site.netlify.app/terms/` |
| Copyright | `© 2026 MackSims LLC` |
| Contact / review | `feedback@macksims.com` |

**Still required after pasting Privacy Policy URL:** complete the **App Privacy** questionnaire (nutrition labels) from each app’s `PRIVACY_DATA*.md` / owner questionnaire — URL alone does not clear App Privacy.

Prefer marketing URLs that return HTTP 200. Canonical product hosts are listed per app below; if `macksims.com/<product>` 404s, use the Netlify app URL or `https://macksims-public-site.netlify.app/` until DNS/routes are fixed.

---

## Shared Age Ratings guidance (OWNER CONFIRM in ASC)

Apple’s Age Rating questionnaire must be answered in the console. Docs only give **target ratings** and Play-side content hints — **do not submit without owner review**.

Suggested baseline from [`PLAY_CONSOLE_DECLARATIONS.md`](./PLAY_CONSOLE_DECLARATIONS.md) (conservative beta) — map into ASC questionnaire and confirm:

| Topic | Suggested (OWNER CONFIRM) |
| --- | --- |
| Violence | None / No |
| Sexual content / nudity | None / No |
| Profanity / crude humor | None or Infrequent/Mild |
| Alcohol / tobacco / drugs | None / No |
| Gambling / contests | None / No |
| Horror / fear | None / No |
| Medical / treatment info | None (CoachCore is coaching, not a medical device — OWNER CONFIRM) |
| Unrestricted web access | Likely **Yes** for Capacitor/WebView shells loading live beta sites |
| User-generated content | App-dependent (see tables) |
| Messaging / chat | App-dependent (see tables) |
| Age-based parental controls | No (not child-directed); primary audience **18+** per publisher baseline |

---

## CoachCore

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` (App Information + App Privacy) | Paste in ASC; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` (docs also list coachcore support page — prefer shared Netlify for review bots) | Prefer shared URL |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | `https://coachcore7.netlify.app/` or `https://macksims.com/coachcore/` if live | Prefer live https |
| Primary category | **Sports** (secondary: Health & Fitness optional) — `apps/coachcore/APP_STORE_CONNECT.md` | Documented |
| Age rating | Target **12+** (team messaging / UGC in future builds); audience **18+** | OWNER CONFIRM questionnaire |
| Content Rights | Not explicitly answered in docs | **OWNER CONFIRM** (typical: No third-party content *or* Yes with rights to listing/UI) |
| iPhone 6.5 screenshots | `app-store-assets/coachcore/iphone-6.5/` — **5** PNGs @ 1242×2688 | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/coachcore/iphone-6.9/` — **5** PNGs @ 1320×2868 | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/coachcore/ipad-12.9/` — **5** PNGs @ 2048×2732 | Ready locally (**required** for submission) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Demo path preferred; optional `review.coachcore@macksims.com` — see `DEMO_REVIEW_LOGINS.md` | Docs ready; attach build in ASC |

---

## CurbCue (FairShare)

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` | Paste; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` | Paste |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | `https://fairshare-v03-20260624.netlify.app/` | Prefer live https |
| Primary category | **Maps & Navigation** (secondary: Travel optional) — `apps/fairshare/APP_STORE_CONNECT.md` | Documented |
| Age rating | Target **12+**; audience **18+**; location/maps context | OWNER CONFIRM questionnaire |
| Content Rights | Not explicitly answered | **OWNER CONFIRM** |
| iPhone 6.5 screenshots | `app-store-assets/curbcue/iphone-6.5/` — **4** PNGs | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/curbcue/iphone-6.9/` — **4** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/curbcue/ipad-12.9/` — **4** PNGs @ 2048×2732 | Ready locally (**required**) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Sign-in not required; optional `review.curbcue@macksims.com` — `DEMO_REVIEW_LOGINS.md` | Docs ready |

---

## ThrottleLink (MotoCrew)

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` | Paste; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` | Paste |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | Prefer live product host `https://motocrewz.netlify.app/` (docs mention `macksims.com/beta`) | Prefer live https |
| Primary category | **Maps & Navigation** (secondary: Lifestyle optional) — `apps/throttlelink/APP_STORE_CONNECT.md` | Documented |
| Age rating | Target **12+** (UGC routes/events; limited messaging may appear) | OWNER CONFIRM questionnaire |
| Content Rights | Not explicitly answered | **OWNER CONFIRM** |
| iPhone 6.5 screenshots | `app-store-assets/motocrew/iphone-6.5/` — **4** PNGs | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/motocrew/iphone-6.9/` — **4** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/motocrew/ipad-12.9/` — **4** PNGs @ 2048×2732 | Ready locally (**required**) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Guest after safety notice; optional `review.throttlelink@macksims.com` — `DEMO_REVIEW_LOGINS.md` | Docs ready |

---

## Sermon Studio

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` | Paste; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` | Paste |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | `https://sermon-studio-beta.netlify.app/` | Prefer live https |
| Primary category | **Productivity** (secondary: Reference optional) — `apps/sermon-studio/APP_STORE_CONNECT.md` | Documented |
| Age rating | Target **12+**; audience **18+** | OWNER CONFIRM questionnaire |
| Content Rights | Not explicitly answered (scripture/reference text — confirm rights) | **OWNER CONFIRM** |
| iPhone 6.5 screenshots | `app-store-assets/sermonstudio/iphone-6.5/` — **4** PNGs | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/sermonstudio/iphone-6.9/` — **4** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/sermonstudio/ipad-12.9/` — **4** PNGs @ 2048×2732 | Ready locally (**required**) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Sign-in **required**: `review.sermonstudio@macksims.com` — `DEMO_REVIEW_LOGINS.md` | Docs ready; provision before review |

---

## Aegis Intel

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` | Paste; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` | Paste |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | `https://sprightly-lily-160925.netlify.app/` | Prefer live https |
| Primary category | **Finance** (secondary: Business) — `apps/aegis-intel/APP_STORE_CONNECT.md` | Documented |
| Age rating | Target **17+**; audience **18+** | OWNER CONFIRM questionnaire |
| Content Rights | Docs: *MackSims LLC owns or has rights to listing assets and product UI* | Documented (paste Yes + rights statement, or console equivalent) |
| iPhone 6.5 screenshots | `app-store-assets/aegisintel/iphone-6.5/` — **3** PNGs | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/aegisintel/iphone-6.9/` — **3** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/aegisintel/ipad-12.9/` — **3** PNGs @ 2048×2732 | Ready locally (**required**) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Guest OK; optional `review.aegis@macksims.com` — `DEMO_REVIEW_LOGINS.md` | Docs ready |

---

## ShutterBid

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` (**was blank** on App Privacy) | **BLOCKER** — paste + complete App Privacy wizard |
| Support URL | `https://macksims-public-site.netlify.app/support/` (ASC may still show `http://macksims.com/support`) | Fix to https Netlify |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | Prefer live `https://shutterbid-web.netlify.app/` until `https://macksims.com/shutterbid` is reliable | Fix http / dead routes |
| Primary category | **Photo & Video** — `apps/shutterbid/APP_STORE_CONNECT.md` | Confirm in App Information if blank |
| Age rating | Docs: **12+** / target **18+**; UGC/marketplace/messaging — questionnaire **OWNER CONFIRM** | **BLOCKER** until answered |
| Content Rights | Not confirmed (marketplace UGC / portfolios likely) | **OWNER CONFIRM** / **BLOCKER** |
| iPhone 6.5 screenshots | `app-store-assets/shutterbid/iphone-6.5/` — **3** PNGs | Ready locally (upload still needed) |
| iPhone 6.9 screenshots | `app-store-assets/shutterbid/iphone-6.9/` — **3** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/shutterbid/ipad-12.9/` — **3** PNGs @ 2048×2732 | Ready locally (**BLOCKER cleared locally**; upload still needed) |
| Copyright | `© 2026 MackSims LLC` (replace any “2023 MackSims, LLC”) | Fix in ASC |
| Build / demo login | Sign-in **required**; client + photographer accounts in `DEMO_REVIEW_LOGINS.md`; select App Review build (`Add Build` previously shown) | **BLOCKER** until build attached |

**ASC errors from Prepare for Submission (ShutterBid 1.0):** Privacy Policy URL · 12.9" iPad screenshots · Content Rights · Age Ratings · Primary Category.

---

## FishCrew

| Field | Required value / where to paste | Status |
| --- | --- | --- |
| Privacy Policy URL | `https://macksims-public-site.netlify.app/privacy/` | Paste; App Privacy questionnaire still needed |
| Support URL | `https://macksims-public-site.netlify.app/support/` | Paste |
| Account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | Paste where supported |
| Marketing URL | Prefer live `https://fishcrew.macksims.com` (docs also list `macksims.com/fishcrew`) | Prefer live https |
| Primary category | **Sports** — `apps/fishcrew/APP_STORE_CONNECT.md` | Confirm if blank |
| Age rating | Docs: **12+** / target **18+**; UGC/location/messaging — OWNER CONFIRM | OWNER CONFIRM questionnaire |
| Content Rights | Not confirmed (social/UGC likely) | **OWNER CONFIRM** |
| iPhone 6.5 screenshots | `app-store-assets/fishcrew/iphone-6.5/` — **3** PNGs | Ready locally |
| iPhone 6.9 screenshots | `app-store-assets/fishcrew/iphone-6.9/` — **3** PNGs | Ready locally |
| iPad 12.9 screenshots | `app-store-assets/fishcrew/ipad-12.9/` — **3** PNGs @ 2048×2732 | Ready locally (**required**) |
| Copyright | `© 2026 MackSims LLC` | Documented |
| Build / demo login | Sign-in not required for basic review; optional `review.fishcrew@macksims.com` — `DEMO_REVIEW_LOGINS.md` | Docs ready |

---

## Capture command (iPad 12.9 only)

```bash
cd docs/store-launch
node scripts/capture-all-store-screens.mjs --forms=ipad-12.9
# optional: --apps=coachcore,shutterbid
```

Viewport: **1024×1366 @2x → 2048×2732**. Phone packs (`iphone-6.5`, `iphone-6.9`) are left intact when using `--forms=ipad-12.9`.

---

## Quick matrix

| App | Folder key | Primary category | Age target | iPhone 6.5 | iPhone 6.9 | iPad 12.9 |
| --- | --- | --- | --- | ---: | ---: | ---: |
| CoachCore | `coachcore` | Sports | 12+ | 5 | 5 | 5 |
| CurbCue | `curbcue` | Maps & Navigation | 12+ | 4 | 4 | 4 |
| ThrottleLink | `motocrew` | Maps & Navigation | 12+ | 4 | 4 | 4 |
| Sermon Studio | `sermonstudio` | Productivity | 12+ | 4 | 4 | 4 |
| Aegis Intel | `aegisintel` | Finance | 17+ | 3 | 3 | 3 |
| ShutterBid | `shutterbid` | Photo & Video | 12+ | 3 | 3 | 3 |
| FishCrew | `fishcrew` | Sports | 12+ | 3 | 3 | 3 |

All listed PNG packs verified **exact** pixel sizes for their slots. **Not uploaded** to App Store Connect by this pass.
