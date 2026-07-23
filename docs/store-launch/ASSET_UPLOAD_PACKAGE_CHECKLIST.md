# Asset Upload Package Checklist

Date: July 4, 2026 (Pass 010 update)

Scope: Prepare upload packages only. **Do not upload** until owner explicitly approves each section below.

Reference: [OWNER_ASSET_APPROVAL_DECISIONS.md](./OWNER_ASSET_APPROVAL_DECISIONS.md)

## Global Hard Stops (Both Apps)

| Gate | FishCrew | ShutterBid |
| --- | --- | --- |
| Screenshots uploaded to Apple | NO | NO |
| Screenshots uploaded to Google Play | NO | NO |
| App submitted for review | NO | NO |
| App records / identifiers changed | NO | NO |
| **Upload allowed (any target)** | **NO** | **NO** |

---

## Per-Target Upload Readiness (Pass 010)

| Target | Screenshot files exist | Pixel size valid | Visual review | Build-match / native | Owner approval | Upload allowed |
| --- | --- | --- | --- | --- | --- | --- |
| FishCrew Apple | YES (3) | YES (`1242×2688`) | **3 READY** — pending build-match sign-off | **LIKELY MATCH** | **PENDING** | **NO** |
| FishCrew Google Play | YES (3) | YES (`1242×2688`) | **3 READY** — pending build-match sign-off | **LIKELY MATCH** | **PENDING** | **NO** |
| ShutterBid Apple | YES (3 mobile) | YES (`1242×2688`) | **3 READY** (Pass 010 post-job clean) | **LIKELY NATIVE MATCH** | **PENDING** | **NO** |
| ShutterBid Google Play | YES (3 mobile) | YES (`1242×2688`) | **3 READY** | **LIKELY NATIVE MATCH** | **PENDING** | **NO** |

### Console blockers still preventing upload (both apps)

| Blocker | FishCrew | ShutterBid |
| --- | --- | --- |
| Apple App Privacy | Not started | Not started |
| Apple build selected for review | `Add Build` | `Add Build` |
| Apple reviewer/demo access | Sign-in unchecked | Sign-in required; credentials in console only |
| Google Data Safety | Owner confirmation needed | Owner confirmation needed |
| Google category / contact / assets | Category, contact, icon, feature graphic missing | Privacy URL, descriptions, assets missing |
| Upload status | **WAITING OWNER APPROVAL** | **WAITING OWNER APPROVAL** |

Pass 006 ShutterBid desktop captures and Pass 009 post-job (without `-clean-`) are **SUPERSEDED**.

---

## Per-Target Upload Readiness (Pass 009 — historical)

---

## Per-Target Upload Readiness (Pass 008 — historical)

---

## FishCrew Apple App Store Connect

| Item | Status | Notes |
| --- | --- | --- |
| READY screenshots available locally | YES | 3 files at `1242 x 2688` |
| Apple copies present | YES | `apps/fishcrew/screenshots/apple/` |
| Google Play copies present | YES | `apps/fishcrew/screenshots/google-play/` |
| Build selected for App Review | NO | App Store version shows `Add Build` |
| App Privacy completed | NO | App Privacy page shows `Get Started` |
| Apple Privacy Policy URL populated | NO | Blank in console snapshot |
| Reviewer access confirmed | UNKNOWN | ASC sign-in required unchecked |
| Build-match (Pass 008) | **LIKELY MATCH** | `EXTERNAL_TESTFLIGHT_CHECKLIST.md` ties TestFlight to `fishcrew-static-v070`; v083 not found; not **MATCH CONFIRMED** |
| Visual approval | **APPROVED FOR OWNER REVIEW** | Pass 007; Pass 006 used `?screenshot=1` |
| Owner approval status | **PENDING** | Awaiting explicit owner sign-off |
| Upload status | **WAITING OWNER APPROVAL** | Upload allowed: **NO** |

### FishCrew Apple files

| File | Pass 008 decision | Upload allowed |
| --- | --- | --- |
| `READY-fishcrew-home-local-fishing-hub-1242x2688.png` | OWNER REVIEW REQUIRED | NO |
| `READY-fishcrew-explore-local-water-1242x2688.png` | OWNER REVIEW REQUIRED | NO |
| `READY-fishcrew-feed-trip-activity-1242x2688.png` | OWNER REVIEW REQUIRED | NO |

---

## FishCrew Google Play Console

| Item | Status | Notes |
| --- | --- | --- |
| READY screenshots available locally | YES | Same 3 Play copies |
| Data Safety completed | UNKNOWN | Owner confirmation required |
| Category selected | NO | `Select a category` |
| Contact details populated | NO | Empty in visible settings |
| App icon / feature graphic | NO | `Add assets` |
| Build-match (Pass 008) | **LIKELY MATCH** | Same as Apple |
| Owner approval status | **PENDING** | Upload allowed: **NO** |
| Upload status | **WAITING OWNER APPROVAL** | Complete category/contact/Data Safety first |

---

## ShutterBid Apple App Store Connect

| Item | Status | Notes |
| --- | --- | --- |
| READY screenshots available locally | YES | 3 Pass 010 mobile-shell files at `1242 x 2688` |
| Native/mobile verification (Pass 010) | **LIKELY NATIVE MATCH** | 414×896 CSS @3x; mobile shell on all 3 current scenes |
| Visual approval | **3 READY** | Post-job cleaned via scroll-to-form (Pass 010) |
| Upload status | **WAITING OWNER APPROVAL** | Use Pass 010 current set; see `OWNER_ASSET_APPROVAL_DECISIONS.md` |

### ShutterBid Apple files (Pass 010 — current upload set)

| File | Pass 010 status | Upload allowed |
| --- | --- | --- |
| `READY-shutterbid-marketplace-home-mobile-1242x2688.png` | **READY** | NO |
| `READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` | **READY** | NO |
| `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` | **READY** | NO |

### ShutterBid superseded files

| File | Status |
| --- | --- |
| Pass 006 desktop captures (`READY-shutterbid-*-1242x2688.png` without `-mobile-`) | **SUPERSEDED** |
| `READY-shutterbid-client-post-job-mobile-1242x2688.png` | **SUPERSEDED** by `-mobile-clean-` |

---

## ShutterBid Google Play Console

| Item | Status | Notes |
| --- | --- | --- |
| READY screenshots available locally | YES | Same 3 Play copies |
| Privacy URL / descriptions | NO | Blank in console |
| Category / contact / assets | NO | Incomplete |
| Data Safety / app access | UNKNOWN | Owner confirmation required |
| Native/mobile verification | **LIKELY NATIVE MATCH** | Pass 010 — 3 READY mobile-shell scenes |
| Owner approval status | **PENDING** | Upload allowed: **NO** |
| Upload status | **WAITING OWNER APPROVAL** | 3 READY mobile scenes; console listing/privacy gaps remain |

---

## Pass 010 Confirmations

- No screenshots uploaded to App Store Connect or Google Play.
- No console records, identifiers, bundle IDs, package names, signing config, Firebase, Supabase, DNS, Netlify settings, backend projects, or app records changed.
- No source code changed in Pass 010.

## Public-Site Blockers (Separate From Screenshot Upload)

| Route | Status | Notes |
| --- | --- | --- |
| `https://fishcrew.macksims.com/` | PUBLIC-SITE BLOCKER | Live beta banner; unchanged |
| `https://macksims.com/shutterbid` | PUBLIC-SITE BLOCKER | Pass 005 `Site not found`; unchanged |

Do **not** block FishCrew local screenshot owner review solely on public route, but keep documented.

---

## Historical — Pass 009 Post-Job Retake (Resolved in Pass 010)

Pass 010 Option B (scroll-to-form) produced `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` without draft banner in viewport. No further post-job retake required unless owner rejects the clean capture.

---

## Pass 009 Confirmations

- No screenshots uploaded to App Store Connect or Google Play.
- No console records, identifiers, bundle IDs, package names, signing config, Firebase, Supabase, DNS, Netlify settings, backend projects, or app records changed.
- No source code changed in Pass 009.

## Pass 008 Confirmations

- No screenshots uploaded to App Store Connect or Google Play.
- No console records, identifiers, bundle IDs, package names, signing config, Firebase, Supabase, DNS, Netlify settings, backend projects, or app records changed.
- No source code changed in Pass 008.

## Pass 007 Confirmations (Historical)

- No screenshots uploaded in Pass 007.
- No source code changed in Pass 007.
