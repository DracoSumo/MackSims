# MackSims Owner Upload Kit (ASC + Play)

**Updated:** 2026-07-23  
**Audience:** Chris (owner) — copy/paste into App Store Connect and Google Play Console.  
**Do not upload or submit from this kit** unless you choose to. Agents do **not** upload or submit for review.

**Rules**
- Shared legal URLs always use the Netlify public site (stable HTTPS 200).
- Do **not** invent App Privacy / Data Safety / age-rating answers — paste from existing docs or mark **OWNER CONFIRM**.
- Screenshot packs are local and ready; upload is owner-controlled.
- iPad 12.9 captures verified **2048×2732** for all seven apps (2026-07-23).
- **404 audit (2026-07-23):** OCR of all store PNGs found Netlify “Page not found” only on legacy Aegis `iphone-6.7` watchlist/settings; those (plus 6.5 / 6.9 / iPad / Play Aegis packs) were recaptured via SPA nav. Details: [`SCREENSHOT_404_FIX.md`](./SCREENSHOT_404_FIX.md).

**Companion docs**
- Routing sheet: [`CONSOLE_PASTE_INDEX.md`](./CONSOLE_PASTE_INDEX.md)
- Shared entity / URLs: [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md)
- Review logins: [`DEMO_REVIEW_LOGINS.md`](./DEMO_REVIEW_LOGINS.md)
- ASC blockers overview: [`ASC_SUBMISSION_BLOCKERS_ALL_APPS.md`](./ASC_SUBMISSION_BLOCKERS_ALL_APPS.md)
- Play declarations: [`PLAY_CONSOLE_DECLARATIONS.md`](./PLAY_CONSOLE_DECLARATIONS.md)

**Asset root**
```
C:\Users\draco\Downloads\MackSims\docs\store-launch\
```

---

## Shared paste (every app)

```
Legal / developer: MackSims LLC
Address: 1211 Sweet Gum Drive, Brandon, FL 33511, United States
Copyright: © 2026 MackSims LLC
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Support URL: https://macksims-public-site.netlify.app/support/
Account deletion URL: https://macksims-public-site.netlify.app/account-deletion/
Terms URL: https://macksims-public-site.netlify.app/terms/
Marketing (fallback): https://macksims-public-site.netlify.app/
Contact / review: feedback@macksims.com
Privacy email: privacy@macksims.com
Support email: support@macksims.com
```

### Shared Age Ratings suggestions (OWNER CONFIRM in ASC)

From [`PLAY_CONSOLE_DECLARATIONS.md`](./PLAY_CONSOLE_DECLARATIONS.md) — map carefully; **owner must confirm before submit**:

| Topic | Suggested |
| --- | --- |
| Violence | None / No |
| Sexual content / nudity | None / No |
| Profanity / crude humor | None or Infrequent/Mild |
| Alcohol / tobacco / drugs | None / No |
| Gambling / contests | None / No |
| Horror / fear | None / No |
| Medical / treatment info | None (CoachCore = coaching only, not medical device — OWNER CONFIRM) |
| Unrestricted web access | Likely **Yes** (Capacitor/WebView → live beta) |
| Primary audience | **18+**; not directed to children |
| Age-based parental controls | No |

### Content Rights (shared guidance)

| App | Suggested answer | Status |
| --- | --- | --- |
| Aegis Intel | MackSims LLC owns or has rights to listing assets and product UI | Documented |
| All others | Typical: Yes — rights to listing/UI; user UGC remains user’s responsibility where applicable | **OWNER CONFIRM** |

### Screenshot count summary

| App (folder) | iPhone 6.5 | iPhone 6.9 | iPad 12.9 | Play phone | Icon 1024 | Icon 512 | Feature 1024×500 |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| coachcore | 5 | 5 | 5 | 5 | Y | Y | Y |
| curbcue | 4 | 4 | 4 | 8* | Y | Y | Y |
| motocrew | 4 | 4 | 4 | 4 | Y | Y | Y |
| sermonstudio | 4 | 4 | 4 | 4 | Y | Y | Y |
| aegisintel | 3 | 3 | 3 | 3 | Y | Y | **NEEDED** |
| shutterbid | 3 | 3 | 3 | 5* | Y | Y | Y |
| fishcrew | 3 | 3 | 3 | 4* | Y | Y | Y |

\*Extra Play phone files exist; prefer the numbered set matching iOS scenes unless owner picks otherwise.  
Legacy `iphone-6.7/` folders also exist (optional; ASC primary slots here are 6.5 / 6.9 / iPad 12.9).

---

# 1) CoachCore

**Status:** READY TO PASTE (listing + assets) · OWNER CONFIRM (age questionnaire, content rights, App Privacy wizard, package ID split)  
**ASC app ID:** `6787821608` · Bundle docs: `com.macksims.coachcore` · Play package CSV: `com.chrissims.coachcore` (**OWNER CONFIRM** — do not change IDs without approval)  
**Detail docs:** [`apps/coachcore/APP_STORE_CONNECT.md`](./apps/coachcore/APP_STORE_CONNECT.md) · [`apps/coachcore/GOOGLE_PLAY_CONSOLE.md`](./apps/coachcore/GOOGLE_PLAY_CONSOLE.md)

## App Store Connect — paste blocks

**App name**
```
CoachCore
```

**Subtitle** (≤30 chars — use one)
```
Who is locked in?
```
```
Team accountability for coaches
```

**Primary / secondary category**
```
Primary: Sports
Secondary: Health & Fitness (optional)
```

**Promotional text**
```
See film, training, fueling, and chat completion in one coach dashboard — all sports.
```

**Description**
```
CoachCore is a MackSims coaching command center for all sports — school, club, gym, team, and individual programs.

Coaches see who is locked in: film watched, workouts completed, fueling logged, and team messages checked. Athletes get a clear daily loop. Parents and staff see only what their program shares.

Features in this build:
- Coach dashboard and accountability board
- Training, nutrition, video, and team chat surfaces
- Demo mode for evaluation; optional Google/GitHub sign-in when configured
- Privacy policy, support, and account deletion on request

CoachCore is coaching support only — not medical advice. We use your data only to run the app. We do not sell your data.
```

**Keywords**
```
coach, team, athlete, accountability, training, sports, film, workout, MackSims
```

**URLs / copyright / contact**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://coachcore7.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Account deletion: https://macksims-public-site.netlify.app/account-deletion/
Copyright: © 2026 MackSims LLC
Review contact: feedback@macksims.com
```

**Age rating (suggested → OWNER CONFIRM)**  
Target **12+**; audience **18+**. Shared questionnaire table above + team messaging / future UGC → declare messaging/UGC as present if live in submitted build.

**Content Rights** → **OWNER CONFIRM** (suggested: Yes — MackSims rights to listing/UI).

**Review notes**
```
Demo path (preferred): Open app → Enter Demo Dashboard (no login).
Optional signed-in review: review.coachcore@macksims.com / CcReview2026!Mack
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**

| Slot | Full path folder | Files |
| --- | --- | --- |
| iPhone 6.5" (1242×2688) | `C:\Users\draco\Downloads\MackSims\docs\store-launch\app-store-assets\coachcore\iphone-6.5\` | `01-landing.png` … `05-chat.png` |
| iPhone 6.9" (1320×2868) | `...\coachcore\iphone-6.9\` | same 5 names |
| iPad 12.9" (2048×2732) | `...\coachcore\ipad-12.9\` | same 5 names |
| App icon source | `...\coachcore\icon-1024.png` | (comes from build; keep for reference) |

**Still blocking Add for Review**
- [ ] Privacy Policy URL + App Privacy questionnaire
- [ ] Upload iPhone 6.5 / 6.9 + **iPad 12.9** screenshots
- [ ] Content Rights (**OWNER CONFIRM**)
- [ ] Age Ratings questionnaire (**OWNER CONFIRM**)
- [ ] Primary category = Sports
- [ ] Select App Review / TestFlight build

## Google Play Console — paste blocks

**App name / category**
```
CoachCore
Category: Sports (Play listings also document Health & Fitness — OWNER CONFIRM which console value to keep)
```

**Short description**
```
Coach accountability — film, training, fueling, and team chat in one place.
```

**Full description** (alternate short Play variant also in TIER3)
```
CoachCore is a MackSims coaching command center for all sports — school, club, gym, team, and individual programs.

Coaches see who is locked in: film watched, workouts completed, fueling logged, and team messages checked. Athletes get a clear daily loop. Parents and staff see only what their program shares.

CoachCore is coaching support only — not medical advice. We do not sell your data.

Feedback: feedback@macksims.com
```

**Contact / privacy**
```
Contact email: feedback@macksims.com
Privacy policy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Assets**
| Asset | Path |
| --- | --- |
| Feature graphic | `C:\Users\draco\Downloads\MackSims\docs\store-launch\play-assets\coachcore\feature-1024x500.png` |
| Icon 512 | `...\play-assets\coachcore\icon-512.png` |
| Phone screenshots | `...\play-assets\coachcore\phone\` (`01-landing` … `05-chat`) |

**Data safety / content rating**  
CSV: `play-data-safety/data_safety_coachcore.csv` · Declarations: [`PLAY_CONSOLE_DECLARATIONS.md`](./PLAY_CONSOLE_DECLARATIONS.md) · Privacy: [`apps/coachcore/PRIVACY_DATA.md`](./apps/coachcore/PRIVACY_DATA.md)  
Health features: coaching/fitness only — **not** a medical device (**OWNER CONFIRM** on health declaration if prompted).  
Audience: 18+ primary; not directed at children.

---

# 2) CurbCue (FairShare)

**Status:** READY TO PASTE · OWNER CONFIRM (age, content rights, App Privacy)  
**ASC:** `6787820297` · Bundle/package: `com.chrissims.fairshare` · Play ID: `4973784784637253598`  
**Folder key:** `curbcue` / docs folder `apps/fairshare/`

## App Store Connect — paste blocks

**App name / subtitle**
```
Curbcue
Local rides before you go
```

**Categories**
```
Primary: Maps & Navigation
Secondary: Travel (optional)
```

**Promotional text**
```
Compare local ride options and pickup pressure before you head out — no booking required.
```

**Description**
```
Curbcue is a MackSims mobility comparison app for reviewing local ride options, pickup pressure, and nearby transport context before you head out.

Compare rideshare, taxi, and local transport options with fare context and crowd-meter signals. This external beta build loads the live CurbCue web experience in a native shell. Optional sign-in is available under Settings.

Features in this build:
- Guest browse — login not required for compare / crowd-meter
- Local ride option comparison with fare context
- Pickup pressure / crowd-meter signals
- Optional Settings sign-in for beta sync
- Privacy policy, support, and account deletion on request

Some features may be limited, demo, or preview behavior during beta testing. Curbcue does not represent official partnerships with ride providers and does not guarantee prices, pickup times, or availability.

Feedback: feedback@macksims.com
Web: https://fairshare-v03-20260624.netlify.app/
```

**Keywords**
```
rideshare, taxi, fare, pickup, compare, mobility, navigation, local, MackSims, Curbcue
```

**URLs**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://fairshare-v03-20260624.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → Target **12+**; audience **18+**; location/maps · **OWNER CONFIRM** questionnaire.  
**Content Rights** → **OWNER CONFIRM**.

**Review notes**
```
Sign-in not required. Open app and browse compare / crowd-meter.
Optional account: review.curbcue@macksims.com / FsReview2026!Mack
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 | `...\app-store-assets\curbcue\iphone-6.5\` | `01-compare.png`, `02-crowd-meter.png`, `03-settings.png`, `04-saved.png` |
| iPhone 6.9 | `...\curbcue\iphone-6.9\` | same 4 |
| iPad 12.9 | `...\curbcue\ipad-12.9\` | same 4 |

**Still blocking Add for Review:** privacy URL + App Privacy · iPad/iPhone uploads · content rights · age rating · primary category · build select.

## Google Play Console — paste blocks

```
App name: Curbcue
Category: Maps & Navigation
Short: Compare local ride options and pickup pressure before you go.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description** — same as ASC description block above (or TIER3 Play text).

**Assets**
| Asset | Path |
| --- | --- |
| Feature | `...\play-assets\curbcue\feature-1024x500.png` |
| Icon | `...\play-assets\curbcue\icon-512.png` |
| Phone (prefer) | `01-compare.png`, `02-crowd-meter.png`, `03-settings.png`, `04-saved.png` under `...\play-assets\curbcue\phone\` (ignore duplicate-named extras unless you prefer them) |

**Data safety:** `play-data-safety/data_safety_curbcue.csv` · [`apps/fairshare/PRIVACY_DATA.md`](./apps/fairshare/PRIVACY_DATA.md)  
**Content rating / audience:** IARC low maturity expected; target **18+**; not child-directed; approx location foreground only.

---

# 3) ThrottleLink (MotoCrew)

**Status:** READY TO PASTE · OWNER CONFIRM (final public name ThrottleLink vs MotoCrew, age, content rights)  
**ASC:** `6787821088` · Package: `com.chrissims.throttlelink` · Play ID: `4973807688393588463`  
**Asset folder:** `motocrew`

## App Store Connect — paste blocks

```
App name: ThrottleLink
Subtitle: Group rides for your pack
Primary: Maps & Navigation
Secondary: Lifestyle (optional)
```

**Promotional text**
```
Plan rides with your pack — meetups, routes, and crew coordination in one place.
```

**Description**
```
ThrottleLink (MotoCrew) is a MackSims motorcycle group ride app for planning rides, coordinating with your crew, and reviewing route and event surfaces.

This external beta build loads the live MotoCrew web experience in a native shell. Guest mode is available — acknowledge the safety notice before ride features unlock.

Some coordination, messaging, or location features may be limited during beta. This app is not an emergency service and does not replace safe riding judgment, traffic laws, or official navigation tools.

Feedback: feedback@macksims.com
Web: https://motocrewz.netlify.app/
```

**Keywords**
```
motorcycle, rides, group, route, map, crew, meetup, MotoCrew, MackSims, navigation
```

**URLs**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://motocrewz.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → Target **12+** (UGC routes/events; limited messaging) · **OWNER CONFIRM**.  
**Content Rights** → **OWNER CONFIRM**.

**Review notes**
```
Sign-in not required. Open app → accept safety notice → use guest rides/map.
Optional account: review.throttlelink@macksims.com / TlReview2026!Mack
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 / 6.9 / iPad 12.9 | `...\app-store-assets\motocrew\{iphone-6.5\|iphone-6.9\|ipad-12.9}\` | `01-home.png`, `02-rides.png`, `03-map.png`, `04-safety.png` |

**Still blocking Add for Review:** privacy + App Privacy · screenshots upload · content rights · age · primary category · build.

## Google Play Console — paste blocks

```
App name: ThrottleLink
Category: Maps & Navigation
Short: Plan motorcycle rides, crew meetups, and local ride coordination.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description** — same as ASC description.

**Assets:** `...\play-assets\motocrew\feature-1024x500.png` · `icon-512.png` · `phone\` (4 shots).  
**Data safety:** `data_safety_throttlelink.csv` · [`apps/throttlelink/PRIVACY_DATA.md`](./apps/throttlelink/PRIVACY_DATA.md)  
**Audience:** 18+; Teen/IARC if messaging present; not emergency service; approx location foreground only.

---

# 4) Sermon Studio

**Status:** READY TO PASTE · OWNER CONFIRM (age, content rights / scripture rights, App Privacy, provision review login)  
**ASC:** `6787823019` · Package: `com.chrissims.sermonstudio` · Play ID: `4972609657779602718`

## App Store Connect — paste blocks

```
App name: Sermon Studio
Subtitle: Sermon prep stays organized
Primary: Productivity
Secondary: Reference (optional)
```

**Promotional text**
```
Organize sermon prep, notes, and church productivity workflows in one place.
```

**Description**
```
Sermon Studio is a MackSims church productivity app for organizing sermon prep, notes, writing support, and calendar workflows.

This external beta build loads the live Sermon Studio web experience in a native shell. Create an account or sign in to explore sermon workspace features during testing.

Features in this build:
- Sign-in required for full workspace
- Sermon prep dashboard and project organization
- Scripture, ideas, and series workflow surfaces
- Notes and church productivity workflows included in the build
- Privacy policy, support, and account deletion on request

Some export, collaboration, cloud storage, or AI-assisted writing features may be limited during beta. Content and copyright responsibility remain with the user and their organization.

Feedback: feedback@macksims.com
Web: https://sermon-studio-beta.netlify.app/
```

**Keywords**
```
sermon, church, ministry, notes, writing, prep, productivity, calendar, MackSims, studio
```

**URLs**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://sermon-studio-beta.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → **12+** / audience **18+** · **OWNER CONFIRM**.  
**Content Rights** → **OWNER CONFIRM** (user/org owns sermon content; confirm listing/UI rights + any scripture source rights).

**Review notes**
```
Sign-in required for full workspace.
Email: review.sermonstudio@macksims.com
Password: SsReview2026!Mack
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 / 6.9 / iPad 12.9 | `...\app-store-assets\sermonstudio\{…}\` | `01-dashboard.png`, `02-scripture.png`, `03-ideas.png`, `04-series.png` |

## Google Play Console — paste blocks

```
App name: Sermon Studio
Category: Productivity
Short: Organize sermon prep, notes, and church productivity workflows.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description** — same as ASC.  
**Assets:** `...\play-assets\sermonstudio\` feature + icon + phone (4).  
**Data safety:** `data_safety_sermonstudio.csv` · do **not** declare political/religious belief demographics.  
**App access:** Some features restricted — paste review credentials.

---

# 5) Aegis Intel

**Status:** READY TO PASTE (copy + iOS shots) · OWNER CONFIRM (ASC/Play record creation, age 17+, financial declaration) · Play feature graphic **NEEDED**  
**Bundle/package:** `com.macksims.aegisintel` · ASC/Play records: create after owner packaging go

## App Store Connect — paste blocks

```
App name: Aegis Intel
Subtitle: Public-market research desk
Primary: Finance
Secondary: Business
```

**Promotional text**
```
Watchlists and public-market research in one desk — not a broker, not advice, not trade execution.
```

**Description**
```
Aegis Intel is a MackSims public-market research desk for watchlists, dashboards, and publicly available market context.

Build and review watchlists, research notes, and public-market signals in a focused research workspace. Guest mode keeps data on-device; optional sign-in syncs preferences when you choose an account.

Features in this build:
- Guest on-device watchlists (login not required)
- Optional account sync for preferences and research state
- Public-market research surfaces and dashboards
- Privacy policy, support, and account deletion on request

Important disclaimers — read carefully:
- Aegis Intel is not a broker and does not provide brokerage services.
- Aegis Intel is not financial advice and is not a registered investment adviser.
- Aegis Intel does not execute trades and does not connect to brokerage accounts for trade execution.
- Information is based on publicly available market and filings data only.
- No outcomes are guaranteed. Always do your own research.

Feedback: feedback@macksims.com
Web: https://sprightly-lily-160925.netlify.app/
Support: https://macksims-public-site.netlify.app/support/
```

**Keywords**
```
stocks, watchlist, research, finance, market, public data, dashboard, filings, MackSims, Aegis
```

**URLs**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://sprightly-lily-160925.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → Target **17+**; audience **18+** · **OWNER CONFIRM**.  
**Content Rights**
```
MackSims LLC owns or has rights to listing assets and product UI
```

**Review notes**
```
Guest mode works without login (on-device watchlists).
Optional signed-in sync: review.aegis@macksims.com / AiReview2026!Mack
Not a broker or financial adviser. Public-market research only.
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 / 6.9 / iPad 12.9 | `...\app-store-assets\aegisintel\{…}\` | `01-home.png`, `02-watchlist.png`, `03-settings.png` |

**Still blocking Add for Review:** create ASC record · privacy + App Privacy · screenshots upload · content rights (paste above) · age · primary Finance · build.

## Google Play Console — paste blocks

```
App name: Aegis Intel
Category: Finance
Short: Watchlists and public-market research — not a broker.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description** — same as ASC (keep disclaimers).

**Assets**
| Asset | Path / note |
| --- | --- |
| Icon 512 | `...\play-assets\aegisintel\icon-512.png` |
| Feature graphic | **NEEDED** — missing `feature-1024x500.png` |
| Phone | `...\play-assets\aegisintel\phone\` (3 shots) |

**Data safety:** `play-data-safety/data_safety_aegis.csv` · [`apps/aegis-intel/PRIVACY_DATA.md`](./apps/aegis-intel/PRIVACY_DATA.md)  
**Financial features (paste):**
```
Yes — the app includes financial-related features limited to informational
public-market research and watchlists.

Aegis Intel is NOT a broker, does NOT provide financial advice, does NOT
execute trades, and does NOT connect to brokerage accounts for trading.
Data is based on publicly available market and filings information only.
No investment outcomes are guaranteed. Users must do their own research.
```

---

# 6) ShutterBid

**Status:** READY TO PASTE (copy + local shots) · OWNER CONFIRM (App Privacy, age, content rights, asset approval, provision review accounts)  
**ASC:** `6783551944` · Package: `com.chrissims.shutterbid` · **Do not create a duplicate record**

### OWNER ACTION — Support URL in ASC

ASC may still show **`http://macksims.com/support`**.  
**Update Support URL to:**
```
https://macksims-public-site.netlify.app/support/
```
Also paste Privacy Policy URL into **App Privacy** (was blank):
```
https://macksims-public-site.netlify.app/privacy/
```
Prefer marketing `https://shutterbid-web.netlify.app/` until `https://macksims.com/shutterbid` is reliable (previously “Site not found”).

## App Store Connect — paste blocks

```
App name: ShutterBid
Subtitle: Photo jobs, bids, and pro profiles.
Primary: Photo & Video
```

**Promotional text**
```
Review a MackSims marketplace experience for local photo jobs, client requests, photographer profiles, and trusted approval flows.
```

**Description**
```
ShutterBid is a MackSims photographer and client marketplace app for reviewing local photo job workflows, bid surfaces, photographer profiles, and business or venue profile paths.

The app is designed to help clients and photographers explore a cleaner marketplace flow for creative work. Depending on the submitted build, testers may be able to review guest browsing, client requests, photographer profiles, job or bid flows, and admin approval or trust signals.

If this build is still in beta or testing, some jobs, bids, profiles, reviews, approval states, or marketplace content may be limited, demo, or preview behavior. This beta does not process live payments or escrow.

Feedback: feedback@macksims.com
```

**Keywords**
```
photography, photographer, client, jobs, bids, portfolio, marketplace, venue, business, local, MackSims
```

**URLs / copyright**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://shutterbid-web.netlify.app/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → Docs **12+** / audience **18+**; UGC / marketplace / messaging → **OWNER CONFIRM** questionnaire (BLOCKER until answered).  
**Content Rights** → **OWNER CONFIRM** (marketplace UGC / portfolios likely).

**Review notes**
```
Sign-in required.
Client: review.shutterbid.client@macksims.com / SbClient2026!Mack
Photographer: review.shutterbid.photo@macksims.com / SbPhoto2026!Mack
Test client job post + photographer profile/bid surfaces.
No live payments/escrow in this beta.
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 / 6.9 / iPad 12.9 | `...\app-store-assets\shutterbid\{…}\` | `01-marketplace.png`, `02-job-detail.png`, `03-post-job.png` |

**Still blocking Add for Review (ShutterBid 1.0 checklist)**
1. Privacy Policy URL (+ App Privacy wizard)  
2. Upload **iPad 12.9** (+ iPhone) screenshots  
3. Content Rights (**OWNER CONFIRM**)  
4. Age Ratings (**OWNER CONFIRM**)  
5. Primary Category = Photo & Video  
Also: fix Support URL away from `http://macksims.com/support` · select App Review build · sync ASC review credentials to DEMO_REVIEW_LOGINS.

## Google Play Console — paste blocks

```
App name: ShutterBid
Category: Photography
Short: Photographer and client marketplace for local photo jobs and bids.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description**
```
ShutterBid is a MackSims marketplace for clients to post photo jobs and photographers to share profiles and bids. This beta build does not process live payments or escrow. Features may use demo or seed data. Feedback: feedback@macksims.com
```

**Assets:** `...\play-assets\shutterbid\feature-1024x500.png` · `icon-512.png` · phone (`01-marketplace` … `03-post-job`; extras `04-photographer`, `05-jobs-browse` optional).  
**Data safety:** `data_safety_shutterbid.csv` — **OWNER CONFIRM** before submit ([`PRIVACY_OWNER_QUESTIONNAIRE.md`](./apps/shutterbid/PRIVACY_OWNER_QUESTIONNAIRE.md)).  
**App access:** sign-in required — paste client + photographer credentials.  
**Audience:** 18+; not child-directed; no live payments in beta.

---

# 7) FishCrew

**Status:** READY TO PASTE (copy + local shots) · OWNER CONFIRM (App Privacy / Data Safety questionnaires, age, content rights, asset approval)  
**ASC:** `6783567028` · Package: `com.chrissims.fishcrew` · **Do not duplicate**

## App Store Connect — paste blocks

```
App name: FishCrew
Subtitle: Fishing community and local water tools.
Primary: Sports
```

**Promotional text**
```
Explore a MackSims fishing community experience for anglers, captains, charters, and local water awareness.
```

**Description**
```
FishCrew is a MackSims fishing community app for anglers, captains, charters, and crews who want a cleaner way to stay connected around local water activity.

Use FishCrew to review community surfaces, profile paths, local trip coordination direction, and water-aware tools included in the current build. The app is designed around fishing utility, local awareness, and social coordination while MackSims prepares store-ready mobile releases.

If this build is still in beta or testing, some content, weather/water surfaces, social features, or coordination workflows may be limited, demo, or preview behavior. Final store copy must match the exact submitted build.

Feedback: feedback@macksims.com
```

**Keywords**
```
fishing, anglers, charter, captain, crew, water, community, weather, trips, local, MackSims
```

**URLs**
```
Support URL: https://macksims-public-site.netlify.app/support/
Marketing URL: https://fishcrew.macksims.com/
Privacy Policy URL: https://macksims-public-site.netlify.app/privacy/
Copyright: © 2026 MackSims LLC
```

**Age rating** → **12+** / audience **18+**; UGC/location/messaging → **OWNER CONFIRM**.  
**Content Rights** → **OWNER CONFIRM**.

**Review notes**
```
Sign-in not required for basic review (ASC flag unchecked).
Optional account if gated: review.fishcrew@macksims.com / FcReview2026!Mack
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

**Screenshot upload map**
| Slot | Folder | Files |
| --- | --- | --- |
| iPhone 6.5 / 6.9 / iPad 12.9 | `...\app-store-assets\fishcrew\{…}\` | `01-home.png`, `02-explore.png`, `03-feed.png` |

**Still blocking Add for Review:** Privacy Policy URL in App Privacy · screenshots upload · content rights · age · primary Sports · select build.

## Google Play Console — paste blocks

```
App name: FishCrew
Category: Sports
Short: Fishing crew community — trips, feed, and tools for anglers.
Contact: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Website: https://macksims-public-site.netlify.app/support/
```

**Full description** — use ASC description (or existing populated Play listing if already live).  
**Assets:** `...\play-assets\fishcrew\feature-1024x500.png` · `icon-512.png` · phone (`01-home`, `02-explore`, `03-feed`; optional `04-tools`).  
**Data safety:** `data_safety_fishcrew.csv` — **OWNER CONFIRM** ([`PRIVACY_OWNER_QUESTIONNAIRE.md`](./apps/fishcrew/PRIVACY_OWNER_QUESTIONNAIRE.md)).  
**Audience:** 18+; Sports/Outdoors; not child-directed.

---

## Quick owner checklist (all apps)

1. Paste shared Netlify privacy / support / deletion / copyright.  
2. **ShutterBid:** replace `http://macksims.com/support` with https public-site support URL.  
3. Upload iPhone 6.5 + 6.9 + iPad 12.9 from `app-store-assets/<key>/`.  
4. Upload Play icon + feature (+ phone) from `play-assets/<key>/` — generate Aegis feature graphic first.  
5. Complete Age Ratings + Content Rights (**OWNER CONFIRM** gaps).  
6. Complete App Privacy / Data Safety from existing CSVs + `PRIVACY_DATA*` — do not invent.  
7. Provision review accounts from [`DEMO_REVIEW_LOGINS.md`](./DEMO_REVIEW_LOGINS.md).  
8. Select builds — **do not submit for review until you decide**.
