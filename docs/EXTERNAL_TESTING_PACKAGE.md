# MackSims — External Testing Package

**Prepared:** 2026-07-06  
**Scope:** FairShare (CurbCue), MotoCrew / Throttle, CoachCore, Sermon Studio, MackSims public-site product pages  
**Excluded:** ShutterBid, FishCrew, Aegis Intel (out of scope for this package)

---

## Owner copy-paste summary

Share these **live beta URLs** with external testers today. No invite codes or beta passwords — each app uses a one-time on-screen acknowledgement (guest access).

| App | Tester URL | Access mode | Build status | Ready | Blockers |
|-----|------------|-------------|--------------|-------|----------|
| **CurbCue** (FairShare repo) | https://fairshare-v03-20260624.netlify.app | Guest + optional OAuth (Settings) | `npm run check` **PASS** (2026-07-06) | **YES** | None — CurbCue branding live (deploy `6a4b4a2b4150b70ef07a92e7`) |
| **MotoCrew** (Throttle / ThrottleLink) | https://motocrewz.netlify.app | Guest only | `npm run check` **PASS** (2026-07-06) | **YES** | None |
| **CoachCore** | https://coachcore7.netlify.app/app | Guest demo (mock auth surfaces) | `npm run check` **PASS** (2026-07-06) | **YES** | None |
| **Sermon Studio** | https://sermon-studio-beta.netlify.app | Guest only (localStorage) | `npm run check` **PASS** (2026-07-06) | **YES** | None |
| **MomentPick** | — | — | Not verified this pass | **NO** | No Netlify staging URL; Firebase unset; no `check` script |
| **MackSims public site** (product pages) | https://macksims-public-site.netlify.app/ | Marketing only | Static — HTTP **200** | **YES** (links) | Copy says “not yet in public beta” — send testers to app URLs above, not product pages alone |

**Feedback email (all apps):** feedback@macksims.com  
**Native store testing:** Not configured for these four apps (see [Store / TestFlight status](#store--testflight-status)). External testing = Netlify URLs.

---

## Verification run (2026-07-06)

| Check | Result |
|-------|--------|
| FairShare `npm run check` | PASS |
| MotoCrew `npm run check` | PASS |
| CoachCore `npm run check` | PASS |
| Sermon Studio `npm run check` | PASS |
| HTTP smoke (HEAD) — all four app URLs | **200** |
| HTTP smoke — public-site `/`, `/fairshare/`, `/motocrew/`, `/coachcore/` | **200** |
| Fresh Netlify prod trigger (`netlify deploy --prod --trigger`) | Triggered for all four app sites |
| Live UI smoke (content fetch) | Beta disclaimers visible; main flows load |

---

## Per-app tester instructions

### FairShare / CurbCue

**Tester URL:** https://fairshare-v03-20260624.netlify.app  
**Also valid:** `/curbcue`, `/fairshare`, `/farewave` (legacy aliases), `/compare`, `/crowd-meter`, `/settings`  
**Marketing page (context only):** https://macksims-public-site.netlify.app/fairshare/

**Access:** Guest — tap **“I understand — explore the demo”** on first visit (stored in browser). **No password.** Optional Google/Apple OAuth under **Settings → Account** (not required for core flows).

**What to test (3–5 bullets):**
- Beta gate + orange “Demo data” banner on every screen after acknowledgement
- Home → **Check ride options** → Compare: provider cards, sort modes, fare panel
- Crowd Cue tab: venue cards, surge risk, pickup suggestions
- Saved places & recent searches persist after reload
- Type `error test` as pickup to verify error state + **Try again**

**Known limitations:**
- All fares, crowds, and venues are **simulated** — no live quotes or bookings
- OAuth cloud sync requires Supabase env on Netlify; local-only mode works without sign-in
- `/admin` and `/admin/bermuda` are **public demo operator shells** (intentional for beta)

**Mobile:** Test at **390px** width (bottom nav: Home, Compare, Crowd, Account).

**Checklist:** `apps/FairShare/EXTERNAL_TESTING_CHECKLIST.md`

---

### MotoCrew (Throttle / ThrottleLink beta)

**Tester URL:** https://motocrewz.netlify.app  
**Marketing page:** https://macksims-public-site.netlify.app/motocrew/

**Access:** Guest — acknowledge red **“Do not use MotoCrew while riding”** safety notice once per device. **No login.**

**What to test (3–5 bullets):**
- Home dashboard: tonight’s ride hero, quick actions, mocked ride-phase status card
- Rides tab: filters, join/leave (persists locally), completed ride join disabled
- Map tab: “Map view not configured” placeholder (no API keys) + mocked route outline
- Safety screen: emergency contacts (local only, max 6), disclaimer visible
- Create ride: draft saves locally and appears on Home

**Known limitations:**
- **No live tracking, chat, intercom, or emergency dispatch**
- Map requires future API keys — placeholder only
- Brand docs may say ThrottleLink; UI says **MotoCrew**

**Mobile:** **390px** — 6-tab bottom nav must be tappable. Desktop ≥860px shows side rail.

**Checklist:** `apps/MotoCrew/EXTERNAL_TESTING_CHECKLIST.md`

---

### CoachCore

**Tester URL:** https://coachcore7.netlify.app/app  
**Landing:** https://coachcore7.netlify.app/  
**Marketing page:** https://macksims-public-site.netlify.app/coachcore/

**Access:** Guest demo — open `/app`, dismiss **“Demo walkthrough”** banner. `/login` and `/signup` exist but are **mock** (no real auth backend). **No password.**

**What to test (3–5 bullets):**
- Coach dashboard: “Who is locked in?” readiness cards and athlete list
- Navigate Team, Training, Nutrition, Video, Accountability, Playbook
- Mock actions: send nudge, assign video/workout, log meal, AI workout draft
- Athlete detail pages from team list
- `/app/status` — confirms no real auth, payments, or external APIs

**Known limitations:**
- Static mock athletes only; actions log to **this device**
- Integrations (Hudl, wearables) are placeholders
- `/beta` request form does not submit to a backend yet
- `/app/admin` is a **public mock org stats** page (intentional demo)

**Mobile:** **390px** — bottom nav (Home, Team, Train, Fuel, Proof).

**Checklist:** `apps/CoachCore/EXTERNAL_TESTING_CHECKLIST.md`

---

### Sermon Studio (Pastor's Sermon Studio)

**Tester URL:** https://sermon-studio-beta.netlify.app

**Access:** Guest only — everything saves in **browser localStorage**. **No account.** Clearing browser data clears the library.

**What to test (3–5 bullets):**
- Edit sermon title, theme, key points, illustrations, application, notes
- Scripture tab: search, translations, **Add to Sermon**
- Ideas tab: local template suggestions (not live AI)
- Worship tab: build a setlist; Series tab: create/link a series
- Library: Save Draft, Edit, Delete; **Copy Sermon Notes** exports readable text

**Known limitations:**
- Idea suggestions are **local templates**, not live AI
- No cloud sync or multi-device library
- `/auth/callback` exists for future OAuth — not required for beta editor

**Mobile:** **390px** — verify tab/action buttons do not overflow horizontally.

**Checklist:** `apps/SermonStudio/EXTERNAL_TESTING_CHECKLIST.md`

---

### MomentPick (not ready — do not share)

**Status:** Present in repo at `apps/momentpick-web` but **not included** in this external testing wave.

| Gap | Detail |
|-----|--------|
| Deploy URL | None configured |
| Pre-deploy | `npm run build && npm run lint` — lint was failing in prior audit |
| Firebase | Project setup required (`apps/momentpick-web/docs/SETUP_FIREBASE.md`) |
| Public page | https://macksims-public-site.netlify.app/momentpick/ (marketing only; “Join beta” has no live app behind it) |

Revisit when a staging Netlify site and Firebase env are owner-approved.

---

### MackSims public site (tester context links)

| Page | URL | Use for testers |
|------|-----|-----------------|
| Home | https://macksims-public-site.netlify.app/ | Portfolio context |
| FairShare product | `/fairshare/` | Background only — **send app URL for actual testing** |
| MotoCrew product | `/motocrew/` | Background only |
| CoachCore product | `/coachcore/` | Background only |
| MomentPick product | `/momentpick/` | Not ready for app testing |
| Privacy | `/privacy/` | Shared policy |
| Terms / Support | `/terms/`, `/support/` | Reference |

**Note:** Custom domain `macksims.com` apex may 404 intermittently (dual A records). Prefer `macksims-public-site.netlify.app` for tester links until DNS is fixed (see `docs/UNIFORM_DEPLOY.md`).

---

## Guest vs login required

| App | Login required for core beta? | Optional sign-in |
|-----|------------------------------|------------------|
| FairShare / CurbCue | **No** | OAuth in Settings (sync saved comparisons) |
| MotoCrew | **No** | None in this build |
| CoachCore | **No** | Mock login/signup pages (non-functional backend) |
| Sermon Studio | **No** | None |

**Beta gate passwords:** None. Use `DO_NOT_COMMIT_PASSWORD` placeholder in any future gated docs — never commit real secrets.

---

## Store / TestFlight status

Checked `docs/store-launch/apps/*/STATUS.md` and root `codemagic.yaml` (store publishing **OFF** by default).

| App | iOS TestFlight | Android Play testing | Web external testing |
|-----|----------------|----------------------|----------------------|
| CurbCue (FairShare repo) | NOT STARTED — **web-only**; no native build in repo | NOT STARTED — **web-only** | **Netlify URL** — **ready** |
| MotoCrew / ThrottleLink | NOT STARTED — **web-only** | NOT STARTED — **web-only** | **Netlify URL** — **ready** |
| CoachCore | NOT STARTED — **web-only** | NOT STARTED — **web-only** | **Netlify URL** — **ready** |
| Sermon Studio | NOT STARTED — **web-only** | NOT STARTED — **web-only** | **Netlify URL** — **ready** |

**Do not** create new App Store / Play Console records or submit for App Review as part of external web beta.

---

## Operator commands (pre-share)

```powershell
# Per app — run before any manual deploy (all PASS on 2026-07-06)
cd MackSims\apps\FairShare; npm run check
cd MackSims\apps\MotoCrew; npm run check
cd MackSims\apps\CoachCore\coachcore-static-v001; npm run check
cd MackSims\apps\SermonStudio; npm run check

# Trigger fresh Git-connected production build (no local upload)
cd <app-dir>; netlify deploy --prod --trigger
```

---

## Suggested email to external testers

```text
Subject: MackSims beta apps — your test links

Thanks for helping test our beta web apps. Each link works in Chrome/Safari on phone or desktop — no install required.

CurbCue (ride compare demo): https://fairshare-v03-20260624.netlify.app
MotoCrew (group ride demo): https://motocrewz.netlify.app
CoachCore (coaching demo): https://coachcore7.netlify.app/app
Sermon Studio (sermon editor): https://sermon-studio-beta.netlify.app

On first open, read the beta/safety notice and tap "I understand."
All data in these builds is simulated or stored only in your browser.
Please test on a phone-sized window (~390px) if you can.

Send feedback to feedback@macksims.com with the app name in the subject.
```

---

*See also: `docs/UNIFORM_DEPLOY.md`, `docs/POST_DEPLOY_TESTS.md`, per-app `EXTERNAL_TESTING_CHECKLIST.md` files.*

---

## CurbCue rename deploy 2026-07-06

| Step | Result | Detail |
|------|--------|--------|
| Source audit | **PASS** | No `FairShare` strings in active `src/`; `APP_NAME` = **CurbCue**; internal keys (`fairshare-icon.svg`, storage keys, `/fairshare` route alias) preserved |
| `npm run check` | **PASS** | 5 tests + production build |
| Git commit | **PASS** | `44fcae8` — "Rename user-facing FairShare branding to CurbCue" |
| Git push | **PASS** | `https://github.com/DracoSumo/FairShare.git` → `main` |
| `netlify deploy --prod --trigger` | **FAIL** | Builds `6a4b49efd80258c9343ba7ab` (and prior triggers) errored: `Build script returned non-zero exit code: 2` on Netlify CI (stale commit ref `9864966…` on remote builder) |
| `netlify deploy --prod` (CLI upload) | **PASS** | Deploy `6a4b4a2b4150b70ef07a92e7` — production live with CurbCue |
| Live branding check | **PASS** | HTTP **200**; `<title>CurbCue — Know where to ride before you book.</title>`; manifest `"name": "CurbCue"` |

**Owner follow-up (non-blocking):** Fix Netlify Git-connected builds so future pushes auto-deploy. In Netlify → **fairshare-v03-20260624** → Deploys, open the failed build log and confirm Node version + `npm run build` (`tsc -b && vite build`) succeed on CI. Re-link repo branch `main` if commit SHA stays stale after push.

---

## Native external testing status 2026-07-06

**Capacitor hybrid shells added** for all four apps — each loads its production Netlify URL in the native WebView. Full operator guide: **`docs/NATIVE_EXTERNAL_TESTING.md`**.

| App | Capacitor in repo | Codemagic signed workflows | Hybrid URL | External native status |
|-----|-------------------|---------------------------|------------|------------------------|
| **CurbCue** | YES — `apps/FairShare/capacitor.config.ts` | `curbcue-ios-signed`, `curbcue-android-signed` | https://fairshare-v03-20260624.netlify.app | **PARTIAL** — config + CI ready; owner must confirm bundle ID, create store records, provision signing |
| **MotoCrew** | YES — `apps/MotoCrew/` | `motocrew-ios-signed`, `motocrew-android-signed` | https://motocrewz.netlify.app | **PARTIAL** |
| **CoachCore** | YES — `apps/CoachCore/coachcore-static-v001/` | `coachcore-ios-signed`, `coachcore-android-signed` | https://coachcore7.netlify.app/app | **PARTIAL** |
| **Sermon Studio** | YES — `apps/SermonStudio/` | `sermon-studio-ios-signed`, `sermon-studio-android-signed` | https://sermon-studio-beta.netlify.app | **PARTIAL** |

**Web external testing (Netlify URLs):** still **ready** — share URLs in the table at the top of this document.

**Native external testing:** **PARTIAL** until owner completes store records, bundle IDs, signing, and first Codemagic signed build upload to TestFlight / Play closed testing.

### Native build commands (per app)

```powershell
cd apps\<AppDir>
npm install
npm run check
npm run cap:sync       # npx cap add ios|android on first run (iOS needs macOS)
npm run build:native   # check + cap sync
```

### Owner checklist — native external testing

1. Confirm bundle IDs / package names (all **TBD** in `docs/store-launch/apps/*/APP_STORE_CONNECT.md`).
2. Create App Store Connect + Play Console app records (manual).
3. Upload Android keystores to Codemagic; configure Apple signing integration.
4. Set env vars listed in `docs/NATIVE_EXTERNAL_TESTING.md` (names only).
5. Run signed Codemagic workflows → download IPA/AAB → upload to TestFlight / Play **Closed testing**.
6. Enable **TestFlight External Testing** group + **Play closed** tester emails (see `docs/NATIVE_EXTERNAL_TESTING.md`).

Do **not** submit for App Store / Play production release as part of external beta.

---

## Beta testing hub on MackSims web (2026-07-07)

**Public page:** https://macksims-public-site.netlify.app/beta/  
**Custom domain (when DNS stable):** https://macksims.com/beta/

The beta page lists **all external tester URLs** for CurbCue, MotoCrew, CoachCore, and Sermon Studio:

| App | Web | iOS | Android |
|-----|-----|-----|---------|
| CurbCue | https://fairshare-v03-20260624.netlify.app | TestFlight invite via feedback@macksims.com | Play closed — invite pending |
| MotoCrew | https://motocrewz.netlify.app | TestFlight invite via feedback@macksims.com | Play closed — invite pending |
| CoachCore | https://coachcore7.netlify.app/app | TestFlight invite via feedback@macksims.com | Play closed — invite pending |
| Sermon Studio | https://sermon-studio-beta.netlify.app | TestFlight invite via feedback@macksims.com | Play closed — invite pending |

**Owner:** After TestFlight public links and Play opt-in URLs exist, paste them into `public-site/public/beta/index.html` and redeploy. See `docs/STORE_EXTERNAL_TESTING_RUNBOOK.md`.
