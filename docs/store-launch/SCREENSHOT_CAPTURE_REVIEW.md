# Screenshot Capture Review

Date: July 3, 2026

Scope: Screenshot Fix + Demo Data Pass 006. Local screenshot capture and documentation only. No screenshots were uploaded to App Store Connect or Google Play.

## Source Paths

| App | Path | Notes |
| --- | --- | --- |
| FishCrew | `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070` | Preferred `fishcrew-static-v083` was **MISSING**. v0.7.0 used with possible version mismatch vs live `https://fishcrew.macksims.com/`. |
| ShutterBid | `C:\Users\draco\OneDrive\Documents\GitHub\shutterbid-ios` | Local Next.js dev at `http://127.0.0.1:3000`. |

## Capture Summary — Pass 006

| App | Scene | Store Folder | File Path | Size | Status | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| FishCrew | Home / local fishing hub | Apple | `docs/store-launch/apps/fishcrew/screenshots/apple/READY-fishcrew-home-local-fishing-hub-1242x2688.png` | `1242 x 2688` | READY | Local `?screenshot=1&screen=home`; beta hidden; demo seed loaded; viewport-only capture |
| FishCrew | Home / local fishing hub | Google Play | `docs/store-launch/apps/fishcrew/screenshots/google-play/READY-fishcrew-home-local-fishing-hub-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |
| FishCrew | Explore / local water | Apple | `docs/store-launch/apps/fishcrew/screenshots/apple/READY-fishcrew-explore-local-water-1242x2688.png` | `1242 x 2688` | READY | Local `?screenshot=1&screen=explore` with demo trips/partners |
| FishCrew | Explore / local water | Google Play | `docs/store-launch/apps/fishcrew/screenshots/google-play/READY-fishcrew-explore-local-water-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |
| FishCrew | Feed / trip activity | Apple | `docs/store-launch/apps/fishcrew/screenshots/apple/READY-fishcrew-feed-trip-activity-1242x2688.png` | `1242 x 2688` | READY | Local `?screenshot=1&screen=feed` with demo feed content |
| FishCrew | Feed / trip activity | Google Play | `docs/store-launch/apps/fishcrew/screenshots/google-play/READY-fishcrew-feed-trip-activity-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |
| ShutterBid | Marketplace / home | Apple | `docs/store-launch/apps/shutterbid/screenshots/apple/READY-shutterbid-marketplace-home-1242x2688.png` | `1242 x 2688` | READY | Local `/` from `shutterbid-ios` |
| ShutterBid | Marketplace / home | Google Play | `docs/store-launch/apps/shutterbid/screenshots/google-play/READY-shutterbid-marketplace-home-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |
| ShutterBid | Job detail | Apple | `docs/store-launch/apps/shutterbid/screenshots/apple/READY-shutterbid-job-detail-venue-content-1242x2688.png` | `1242 x 2688` | READY | Local `/jobs/venue-content-package` with sample job content |
| ShutterBid | Job detail | Google Play | `docs/store-launch/apps/shutterbid/screenshots/google-play/READY-shutterbid-job-detail-venue-content-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |
| ShutterBid | Client post-job | Apple | `docs/store-launch/apps/shutterbid/screenshots/apple/READY-shutterbid-client-post-job-1242x2688.png` | `1242 x 2688` | READY | Local `/post-job` prefilled with demo-safe job copy at capture time |
| ShutterBid | Client post-job | Google Play | `docs/store-launch/apps/shutterbid/screenshots/google-play/READY-shutterbid-client-post-job-1242x2688.png` | `1242 x 2688` | READY | Copy of Apple capture for Play review |

## Pass 006 Status Counts

| Status | Pass 006 Scene Count | Pass 006 File Count | Notes |
| --- | --- | --- | --- |
| READY | 6 | 12 | 6 Apple + 6 Google Play copies |
| NEEDS RETAKE | 0 | 0 | No new Pass 006 captures marked NEEDS RETAKE |
| REJECT | 0 | 0 | No new Pass 006 captures marked REJECT |

## Superseded Pass 005 Artifacts (retained locally, do not upload)

| App | File | Status | Notes |
| --- | --- | --- | --- |
| FishCrew | `NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png` | NEEDS RETAKE | Pass 005 live public route; superseded by Pass 006 local captures |
| ShutterBid | `REJECT-shutterbid-public-route-site-not-found-1242x2688.png` | REJECT | Pass 005 wrong page; superseded by Pass 006 local app captures |

## Route Confirmation Result

| App | Route | Result | Capture Decision |
| --- | --- | --- | --- |
| FishCrew | `https://fishcrew.macksims.com/` | Live route still shows beta/testing UI (Pass 005) | Pass 006 uses local static v0.7.0 with `?screenshot=1` instead of live public route |
| FishCrew | Local `http://127.0.0.1:8765/?screenshot=1&screen=home|explore|feed` | Store-safe with screenshot mode | READY for owner review before upload |
| ShutterBid | `https://macksims.com/shutterbid` | Still blocked / not verified in Pass 006 (Pass 005 showed Site not found) | Do not use for store assets |
| ShutterBid | Local `http://127.0.0.1:3000/` routes | Marketplace, job detail, post-job working | READY for owner review before upload |

## Demo Data Assumptions

| App | Assumption |
| --- | --- |
| FishCrew | `?screenshot=1` enables screenshot mode and merges `demoSeedContent()` locally when trips/feed are empty. Demo trips, feed posts, and partner listings only; no production users created. |
| ShutterBid | Uses built-in sample jobs/marketplace copy from `shutterbid-ios`. Post-job capture prefilled at capture time with fictional venue content package copy only. |

## Private Data And Secret Review

No passwords, API keys, Firebase service account material, Supabase service role keys, Apple private keys, Google signing credentials, `.p8` files, keystore material, private user data, private admin data, or reviewer credentials were visible in Pass 006 captures, changed source files, or screenshot filenames.

## Production Source Changes (Pass 006)

| File | Change | Why |
| --- | --- | --- |
| `fishcrew-static-v070/app.js` | Added `?screenshot=1` mode: hide beta banner, load local demo seed for empty state | Store-safe local captures only; reversible |
| `fishcrew-static-v070/styles.css` | Added `body.screenshot-mode` rules to hide beta/safe-note chrome and sticky repetition helpers | Store-safe local captures only; reversible |

Backups:

- `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070\.pass006-backups\20260703-074720\`
- `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070\.pass006-backups\20260703-075158-demo\`

Checks run:

- `node tests/v070-static-checks.js` in `fishcrew-static-v070` — passed
- `node docs/store-launch/scripts/pass006-capture-screenshots.mjs` from `shutterbid-ios` — 6 READY captures

No deploy, DNS, Netlify, Firebase, Supabase, signing, bundle ID, package name, or console record changes were made in Pass 006.

---

## Asset Approval + Build Match Pass 007 (July 3, 2026)

Scope: Verify files, build-match evidence, visual review, upload checklist prep. **No uploads. No source changes.**

### File Existence Verification

All 12 files confirmed present (6 scenes × Apple + Google Play copies). All measured **1242 × 2688**.

### Build-Match Results

| App | Submitted build (console docs) | Capture source | Result |
| --- | --- | --- | --- |
| FishCrew | iOS `1.0 (20260624034852)`; Play `1.0` / version code `1` (Jun 23–24, 2026) | `fishcrew-static-v070` internal `0.7.0`; `fishcrew-static-v083` **not found** | **POSSIBLE BUILD MISMATCH — OWNER REVIEW REQUIRED**. Marketing version `1.0` does not prove UI parity with internal `0.7.0`. No build artifact in workspace confirms submitted native build was packaged from v070 vs v083. Pass 005 live `fishcrew.macksims.com` UI resembled v070 design but still had beta banner. **Do not upload FishCrew screenshots until owner approves v0.7.0-derived captures.** |
| ShutterBid | iOS `1.0 (20260624035226)`; Play `1.0` / version code `1782330956` (Jun 23–24, 2026) | Current `shutterbid-ios` local dev (`package.json` `0.1.0`) | **LIKELY SOURCE-ALIGNED — OWNER REVIEW REQUIRED**. Captures came from the same repo used for the web/native shell, but Pass 007 captures show **desktop web layout** at phone portrait dimensions. Owner must confirm this represents the submitted TestFlight/Play UI (native shell) before upload. |

### Pass 007 Visual Approval By File

| App | File | Visual status | Visible issues | Upload gate |
| --- | --- | --- | --- | --- |
| FishCrew | `READY-fishcrew-home-local-fishing-hub-1242x2688.png` | APPROVED FOR OWNER REVIEW | No beta banner; demo Tampa Bay content; Port Window shows planning-estimate disclaimer (acceptable) | OWNER REVIEW REQUIRED (build match) |
| FishCrew | `READY-fishcrew-explore-local-water-1242x2688.png` | APPROVED FOR OWNER REVIEW | Demo trips/partners populated; no empty-state blocker | OWNER REVIEW REQUIRED (build match) |
| FishCrew | `READY-fishcrew-feed-trip-activity-1242x2688.png` | APPROVED FOR OWNER REVIEW | Minor overlay typo risk: `ST. PETS PIER` vs St. Pete; optional retake only | OWNER REVIEW REQUIRED (build match) |
| ShutterBid | `READY-shutterbid-marketplace-home-1242x2688.png` | OWNER REVIEW REQUIRED | Desktop-style web nav at phone size; dual nav bars | OWNER REVIEW REQUIRED |
| ShutterBid | `READY-shutterbid-job-detail-venue-content-1242x2688.png` | OWNER REVIEW REQUIRED | Footer exposes `Admin access` link; large empty lower viewport | OWNER REVIEW REQUIRED |
| ShutterBid | `READY-shutterbid-client-post-job-1242x2688.png` | OWNER REVIEW REQUIRED | Demo prefill: category `Family Portraits` vs title `Venue content package`; draft-account banner visible | OWNER REVIEW REQUIRED |

### Pass 007 Approval Counts

| Status | Scene count | File count |
| --- | --- | --- |
| APPROVED FOR OWNER REVIEW (visual) | 3 | 6 (FishCrew Apple + Play) |
| OWNER REVIEW REQUIRED | 6 | 12 (all scenes pending build-match and/or presentation sign-off) |
| NEEDS RETAKE | 0 | 0 |
| REJECT | 0 | 0 |

### Upload Package Status

See [ASSET_UPLOAD_PACKAGE_CHECKLIST.md](./ASSET_UPLOAD_PACKAGE_CHECKLIST.md). All four upload targets: **WAITING OWNER APPROVAL**.

### Pass 007 Secret Scan

No real passwords, API keys, signing material, or private user/admin data found in reviewed screenshots, filenames, or updated Pass 007 docs. Only `DO_NOT_COMMIT_PASSWORD` placeholder language in existing reviewer notes.

### Pass 007 Source Changes

**None.** Pass 007 was documentation and review only.

---

## Owner Approval + Native UI Verification Pass 008 (July 3, 2026)

Scope: Build-match verification, native/mobile UI check, owner approval decisions. **No uploads. No source changes.**

### Pass 008 Build-Match / Native Results

| App | Result | Upload approved? |
| --- | --- | --- |
| FishCrew | **LIKELY MATCH** — `EXTERNAL_TESTFLIGHT_CHECKLIST.md` maps TestFlight to `fishcrew-static-v070`; v083 not found; not MATCH CONFIRMED | **NO** |
| ShutterBid | **WEB-ONLY CAPTURE RISK** — 1242 CSS px captures show desktop shell (≥768px hides mobile nav) | **NO** |

### Pass 008 Final Screenshot Decisions

| File | Decision |
| --- | --- |
| `READY-fishcrew-home-local-fishing-hub-1242x2688.png` | OWNER REVIEW REQUIRED |
| `READY-fishcrew-explore-local-water-1242x2688.png` | OWNER REVIEW REQUIRED |
| `READY-fishcrew-feed-trip-activity-1242x2688.png` | OWNER REVIEW REQUIRED |
| `READY-shutterbid-marketplace-home-1242x2688.png` | RETAKE RECOMMENDED |
| `READY-shutterbid-job-detail-venue-content-1242x2688.png` | RETAKE RECOMMENDED |
| `READY-shutterbid-client-post-job-1242x2688.png` | RETAKE RECOMMENDED |

See [OWNER_ASSET_APPROVAL_DECISIONS.md](./OWNER_ASSET_APPROVAL_DECISIONS.md) and updated [ASSET_UPLOAD_PACKAGE_CHECKLIST.md](./ASSET_UPLOAD_PACKAGE_CHECKLIST.md).

### Pass 008 Secret Scan

Clean — no real credentials or private data in Pass 008 docs or screenshot references. Only `DO_NOT_COMMIT_PASSWORD` placeholder language in existing reviewer notes.

### Pass 008 Source Changes

**None.**

---

## ShutterBid Mobile-Shell Retake Pass 009 (July 3, 2026)

Scope: Retake ShutterBid screenshots at **414×896 CSS @ deviceScaleFactor 3** → **1242×2688** PNG. **No source changes. No uploads.**

Capture script: `docs/store-launch/scripts/pass009-shutterbid-mobile-capture.mjs`

### Pass 009 Capture Summary

| Scene | Store Folder | File | Size | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Marketplace home | Apple | `apps/shutterbid/screenshots/apple/READY-shutterbid-marketplace-home-mobile-1242x2688.png` | `1242 x 2688` | **READY** | Mobile shell: bottom nav visible; desktop top nav hidden; no admin footer in viewport; demo job board |
| Marketplace home | Google Play | `apps/shutterbid/screenshots/google-play/READY-shutterbid-marketplace-home-mobile-1242x2688.png` | `1242 x 2688` | **READY** | Copy of Apple capture |
| Job detail / venue content | Apple | `apps/shutterbid/screenshots/apple/READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` | `1242 x 2688` | **READY** | Mobile shell; clean job detail; no admin footer in viewport |
| Job detail / venue content | Google Play | `apps/shutterbid/screenshots/google-play/READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` | `1242 x 2688` | **READY** | Copy of Apple capture |
| Client post-job | Apple | `apps/shutterbid/screenshots/apple/READY-shutterbid-client-post-job-mobile-1242x2688.png` | `1242 x 2688` | **NEEDS RETAKE** | Mobile shell; category **Other** + title **Venue content package** aligned; guest draft banner still visible |
| Client post-job | Google Play | `apps/shutterbid/screenshots/google-play/READY-shutterbid-client-post-job-mobile-1242x2688.png` | `1242 x 2688` | **NEEDS RETAKE** | Copy of Apple capture |

### Pass 009 Status Counts (ShutterBid mobile retake)

| Status | Scene count | File count |
| --- | --- | --- |
| READY | 2 | 4 (Apple + Play) |
| NEEDS RETAKE | 1 | 2 |
| REJECT | 0 | 0 |

### Pass 006 ShutterBid Superseded

Pass 006 ShutterBid files (`READY-shutterbid-*-1242x2688.png` without `-mobile-`) remain on disk but are **SUPERSEDED** by Pass 009 mobile-shell captures for upload planning. Pass 006 used desktop web layout at 1242 CSS px width.

### Mobile Shell Verification

| Check | Pass 009 result |
| --- | --- |
| Mobile bottom nav visible | **YES** (all 3 scenes) |
| Desktop top nav links visible | **NO** |
| Physical PNG size | **1242 × 2688** (all 3) |
| Mobile shell achieved | **YES** |

### Pass 009 Secret Scan

Clean — no real credentials or private data in Pass 009 docs, filenames, or captures.

### Pass 009 Source Changes

**None.**

---

## Post-Job Retake + Final Approval Board Pass 010 (July 4, 2026)

Scope: Clean ShutterBid post-job capture; preserve Pass 009 READY home + job detail; final approval board. **No source changes. No uploads.**

Script: `docs/store-launch/scripts/pass010-shutterbid-postjob-capture.mjs`

### Pass 010 New Captures

| Scene | File | Size | Status | Notes |
| --- | --- | --- | --- | --- |
| Client post-job (clean) | `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` | `1242 x 2688` | **READY** | Option B scroll-to-form; no draft banner in viewport; category/title aligned |
| Jobs browse (backup) | `READY-shutterbid-jobs-browse-mobile-1242x2688.png` | `1242 x 2688` | **READY** | Option C fallback; not in primary 3-scene set |

Option A (auth/demo login) skipped — no safe credentials in repo/docs.

### Pass 010 ShutterBid Upload Set (3 scenes)

| Scene | File | Status |
| --- | --- | --- |
| Marketplace home | `READY-shutterbid-marketplace-home-mobile-1242x2688.png` | **READY** (Pass 009, preserved) |
| Job detail | `READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` | **READY** (Pass 009, preserved) |
| Post-job clean | `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` | **READY** (Pass 010) |

### Pass 010 Status Counts (current upload sets)

| App | READY scenes | NEEDS RETAKE | REJECT |
| --- | --- | --- | --- |
| FishCrew | 3 | 0 | 0 |
| ShutterBid (primary set) | 3 | 0 | 0 |

### Superseded in Pass 010

- `READY-shutterbid-client-post-job-mobile-1242x2688.png` (Pass 009 — draft banner)
- All Pass 006 ShutterBid desktop-width files

### Pass 010 Secret Scan

Clean — no real credentials or private data.

### Pass 010 Source Changes

**None.**

