# FishCrew - Screenshot Execution Checklist

Date: July 3, 2026

Status: Pass 006 captured 3 READY local app scenes at `1242 x 2688`. No screenshots uploaded. Pass 005 public-route artifact retained as superseded.

Apple accepted targets:

- Portrait: `1242 x 2688` or `1284 x 2778`
- Landscape: `2688 x 1242` or `2778 x 1284`

## Execution Checklist

| # | Scene Name | Route / Screen To Capture | Route / Screen Confirmation | Guest / Login Required | Required Test Data | Apple Target Size | Google Play Target Use | Capture Status | Capture Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home / local fishing hub | `http://127.0.0.1:8765/?screenshot=1&screen=home` (local v0.7.0) | CONFIRMED LOCAL ROUTE | Guest | Demo seed via screenshot mode | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 2 | Explore / local water activity | `http://127.0.0.1:8765/?screenshot=1&screen=explore` | CONFIRMED LOCAL ROUTE | Guest | Demo trips/partners | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 3 | Weather or Port Window | Home screen Port Window card (same local home route) | CONFIRMED LOCAL ROUTE | Guest | Demo conditions on home | Portrait `1242 x 2688` | Phone screenshot | CAPTURED IN HOME | READY (subset) |
| 4 | Feed / trip activity | `http://127.0.0.1:8765/?screenshot=1&screen=feed` | CONFIRMED LOCAL ROUTE | Guest | Demo feed posts | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 5 | Profile | Profile setup or completed profile screen | NEEDS ROUTE CONFIRMATION | NEEDS LOGIN CONFIRMATION | Demo profile, no real name/email/photo | Portrait `1242 x 2688` or `1284 x 2778` | Phone screenshot | NOT CAPTURED | NEEDS LOGIN |
| 6 | Tools / guides | Tools, guide, or beta utility screen | NEEDS ROUTE CONFIRMATION | UNKNOWN | Demo tool/guide content | Portrait `1242 x 2688` or `1284 x 2778` | Phone screenshot | NOT CAPTURED | NEEDS OWNER REVIEW |
| 7 | Auth or onboarding if needed | Auth, onboarding, or account setup screen | NEEDS ROUTE CONFIRMATION | Guest/pre-login if route exists | No password visible; no real email | Portrait `1242 x 2688` or `1284 x 2778` | Optional phone screenshot | NOT CAPTURED | NEEDS OWNER REVIEW |
| 8 | Public route / support-safe view if needed | `https://fishcrew.macksims.com` or support/account-deletion route | CONFIRMED PUBLIC ROUTE | Guest/public | No private data | Portrait `1242 x 2688` or `1284 x 2778` | Optional phone screenshot or support evidence | NEEDS RETAKE | DEFER |

## Pass 004 Route Evidence

| Evidence | Result |
| --- | --- |
| Local public route | `public-site/public/fishcrew/index.html` exists |
| Live public route check | `https://fishcrew.macksims.com/` loaded and captured during Pass 005 |
| Native app route/source evidence in this workspace | Not available in this documentation pass |
| App-specific capture scenes | NEEDS ROUTE CONFIRMATION before capture |
| Store polish review | Public route contains visible beta/testing banner and tall viewport capture produced repeated/sticky layout; defer store use until owner approves route/state or retake target |

## Minimum Safe Test Data - Pass 005

Do not create production data unless explicitly approved. Local/demo data is acceptable for screenshots only after owner confirms it matches the submitted build and contains no private user information.

| Data Need | Status | Notes |
| --- | --- | --- |
| Sample local fishing activity | LOCAL/DEMO DATA OK | Needed for Explore/local water activity scene |
| Sample Port Window/weather view | LOCAL/DEMO DATA OK | Needed for Weather or Port Window; avoid safety-critical claims |
| Sample profile | LOCAL/DEMO DATA OK | Needed for Profile; use fake profile with no real name/email/photo |
| Sample feed/trip post | LOCAL/DEMO DATA OK | Needed for Feed/trip activity; use demo posts only |
| Sample guide/tool screen | LOCAL/DEMO DATA OK | Needed for Tools/guides; use stable non-placeholder content |
| Login/demo account state | NEEDS OWNER CONFIRMATION | Needed before Profile or authenticated scenes can be captured |

## Retake Criteria

| Issue | Action |
| --- | --- |
| Shows real password, email, user, location, or private data | NEEDS RETAKE |
| Implies unavailable production features | NEEDS RETAKE |
| Uses wrong app, wrong bundle, or wrong build | NEEDS RETAKE |
| Wrong dimensions or blurry/cropped UI | NEEDS RETAKE |
| Privacy answers not owner-approved yet | Keep status `NOT CAPTURED` or `BLOCKED` |
| Route/screen cannot be confirmed in current build | Keep readiness `NEEDS OWNER REVIEW` or `NOT AVAILABLE` |
| Screen requires login but demo access is not owner-approved | Keep readiness `NEEDS LOGIN` |

## Capture Status Summary

| Store / Asset | Status |
| --- | --- |
| Apple iPhone screenshots | IN PROGRESS |
| Google Play phone screenshots | IN PROGRESS |
| Google Play tablet screenshots | NOT CAPTURED |
| Google Play feature graphic | NOT CAPTURED |
| Google Play app icon | NOT CAPTURED |

## Pass 004 Readiness Summary

| Readiness | Count | Scenes |
| --- | --- | --- |
| READY TO CAPTURE | 3 | Home; Explore; Feed |
| NEEDS TEST DATA | 0 | Demo seed handled in screenshot mode for Pass 006 |
| NEEDS LOGIN | 1 | Profile |
| NEEDS OWNER REVIEW | 3 | Tools/guides; Auth/onboarding; owner approval before upload |
| DEFER | 1 | Live public route / Pass 005 artifact superseded |
| NOT AVAILABLE | 0 | None marked unavailable in this pass |

## Pass 006 Capture Notes

| Item | Value |
| --- | --- |
| Source | `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070` |
| v083 status | MISSING; possible version mismatch vs live site |
| Capture script | `docs/store-launch/scripts/pass006-capture-screenshots.mjs` |
| READY files | `READY-fishcrew-home-local-fishing-hub-1242x2688.png`, `READY-fishcrew-explore-local-water-1242x2688.png`, `READY-fishcrew-feed-trip-activity-1242x2688.png` |

## Pass 007 Approval Summary

| Scene | Pass 007 visual status | Upload gate |
| --- | --- | --- |
| Home / local fishing hub | APPROVED FOR OWNER REVIEW | OWNER REVIEW REQUIRED (v0.7.0 vs submitted `1.0` build match) |
| Explore / local water | APPROVED FOR OWNER REVIEW | OWNER REVIEW REQUIRED (build match) |
| Feed / trip activity | APPROVED FOR OWNER REVIEW | OWNER REVIEW REQUIRED (build match; optional retake for `ST. PETS PIER` overlay typo) |

Upload status: **WAITING OWNER APPROVAL** — see `ASSET_UPLOAD_PACKAGE_CHECKLIST.md`.

## Pass 008 Approval Summary

| Scene | Pass 008 build-match | Pass 008 final decision | Upload allowed |
| --- | --- | --- | --- |
| Home / local fishing hub | **LIKELY MATCH** | **OWNER REVIEW REQUIRED** | **NO** |
| Explore / local water | **LIKELY MATCH** | **OWNER REVIEW REQUIRED** | **NO** |
| Feed / trip activity | **LIKELY MATCH** | **OWNER REVIEW REQUIRED** | **NO** |

Evidence: `docs/EXTERNAL_TESTFLIGHT_CHECKLIST.md` in `fishcrew-static-v070` ties TestFlight to v070; v083 not found; not **MATCH CONFIRMED**. See `OWNER_ASSET_APPROVAL_DECISIONS.md`.
