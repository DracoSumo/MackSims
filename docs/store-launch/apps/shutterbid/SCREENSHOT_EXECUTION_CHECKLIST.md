# ShutterBid - Screenshot Execution Checklist

Date: July 3, 2026

Status: Pass 010 — **3 READY** mobile-shell scenes at `1242 x 2688`. Post-job cleaned via scroll-to-form. Pass 006 desktop and Pass 009 post-job superseded. No screenshots uploaded.

Apple accepted targets:

- Portrait: `1242 x 2688` or `1284 x 2778`
- Landscape: `2688 x 1242` or `2778 x 1284`

## Execution Checklist

| # | Scene Name | Route / Screen To Capture | Route / Screen Confirmation | Guest / Login Required | Required Test Data | Apple Target Size | Google Play Target Use | Capture Status | Capture Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home / marketplace value | `http://127.0.0.1:3000/` | CONFIRMED LOCAL ROUTE | Guest | Sample marketplace cards | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 2 | Client post-job flow | `http://127.0.0.1:3000/post-job` (prefilled demo copy at capture) | CONFIRMED LOCAL ROUTE | Guest draft | Demo job fields only | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 3 | Photographer profile or portfolio | `/photographers/maya-carter` has instructional placeholder copy | LOCAL ROUTE REVIEW | Guest | Sample bid data exists but page copy is meta/instructional | Portrait `1242 x 2688` | Phone screenshot | NOT CAPTURED FOR UPLOAD | NEEDS OWNER REVIEW |
| 4 | Bidding / job details | `http://127.0.0.1:3000/jobs/venue-content-package` | CONFIRMED LOCAL ROUTE | Guest | Sample job detail | Portrait `1242 x 2688` | Phone screenshot | CAPTURED | READY |
| 5 | Client dashboard | Client dashboard screen | NEEDS ROUTE CONFIRMATION | NEEDS LOGIN | Demo posted jobs/status data | Portrait `1242 x 2688` or `1284 x 2778` | Phone screenshot | NOT CAPTURED | NEEDS LOGIN |
| 6 | Photographer bookings/workload | Photographer dashboard, workload, or bookings screen | NEEDS ROUTE CONFIRMATION | NEEDS LOGIN | Demo workload only; avoid implying real bookings/payments | Portrait `1242 x 2688` or `1284 x 2778` | Phone screenshot | NOT CAPTURED | NEEDS LOGIN |
| 7 | Admin/moderation if appropriate | Admin, moderation, approval, or reporting screen | NEEDS ROUTE CONFIRMATION | Owner-approved admin/demo access only | Demo moderation data only | Portrait `1242 x 2688` or `1284 x 2778` | Optional phone screenshot | NOT CAPTURED | NOT AVAILABLE |
| 8 | Public route / support-safe view if needed | `https://macksims.com/shutterbid` or support/account-deletion route | NOT AVAILABLE | Guest/public | No private data | Portrait `1242 x 2688` or `1284 x 2778` | Optional phone screenshot or support evidence | REJECT | NOT AVAILABLE |

## Pass 004 Route Evidence

| Evidence | Result |
| --- | --- |
| Local public route | `public-site/public/shutterbid/index.html` exists |
| Live public route check | `https://macksims.com/shutterbid` returned a `Site not found` page during Pass 005 capture |
| Native app route/source evidence in this workspace | Not available in this documentation pass |
| App-specific capture scenes | NEEDS ROUTE CONFIRMATION before capture |
| Admin/moderation scene | NOT AVAILABLE unless owner explicitly approves capturing an admin/private screen |
| Store polish review | Public route capture is rejected because it shows the wrong page; do not use for store assets |

## Minimum Safe Test Data - Pass 005

Do not create production data unless explicitly approved. Local/demo data is acceptable for screenshots only after owner confirms it matches the submitted build and contains no private client, event, photographer, payment, or admin data.

| Data Need | Status | Notes |
| --- | --- | --- |
| Sample client job | LOCAL/DEMO DATA OK | Needed for Client post-job flow, job details, and dashboard scenes |
| Sample photographer profile/portfolio | LOCAL/DEMO DATA OK | Needed for Photographer profile or portfolio scene; use demo media only |
| Sample bid/job detail | LOCAL/DEMO DATA OK | Needed for bidding scene; avoid real pricing or live-booking claims until owner confirms marketplace scope |
| Sample client dashboard | LOCAL/DEMO DATA OK | Needed for client dashboard; use demo job statuses only |
| Sample booking/workload screen | LOCAL/DEMO DATA OK | Needed for photographer workload; avoid implying live bookings/payments unless owner confirms |
| Login/demo account state | NEEDS OWNER CONFIRMATION | Needed before authenticated client/photographer scenes can be captured |
| Admin/moderation demo state | NEEDS OWNER REVIEW | Do not capture admin/private screen unless explicitly approved |

## Retake Criteria

| Issue | Action |
| --- | --- |
| Shows real password, email, client, event, payment, or private data | NEEDS RETAKE |
| Implies unavailable bookings, payments, escrow, contracts, or verified production marketplace flows | NEEDS RETAKE |
| Uses wrong app, wrong bundle, or wrong build | NEEDS RETAKE |
| Wrong dimensions or blurry/cropped UI | NEEDS RETAKE |
| Privacy answers not owner-approved yet | Keep status `NOT CAPTURED` or `BLOCKED` |
| Route/screen cannot be confirmed in current build | Keep readiness `NEEDS OWNER REVIEW` or `NOT AVAILABLE` |
| Screen requires login but demo access is not owner-approved | Keep readiness `NEEDS LOGIN` |
| Admin/private screen is not explicitly approved | Keep readiness `NOT AVAILABLE` |

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
| READY TO CAPTURE | 3 | Marketplace home; Client post-job; Job detail |
| NEEDS TEST DATA | 0 | Sample marketplace/job data used locally |
| NEEDS LOGIN | 3 | Client dashboard; Photographer bookings/workload; authenticated bid flows |
| NEEDS OWNER REVIEW | 1 | Photographer profile/portfolio page copy |
| NOT AVAILABLE | 2 | Admin/moderation; live public route `https://macksims.com/shutterbid` |

## Pass 006 Capture Notes

| Item | Value |
| --- | --- |
| Source | `C:\Users\draco\OneDrive\Documents\GitHub\shutterbid-ios` |
| Public route | `https://macksims.com/shutterbid` remains blocked (Pass 005 Site not found) |
| READY files | `READY-shutterbid-marketplace-home-1242x2688.png`, `READY-shutterbid-job-detail-venue-content-1242x2688.png`, `READY-shutterbid-client-post-job-1242x2688.png` |

## Pass 007 Approval Summary

| Scene | Pass 007 visual status | Upload gate |
| --- | --- | --- |
| Marketplace home | OWNER REVIEW REQUIRED | Desktop web layout at phone size |
| Job detail | OWNER REVIEW REQUIRED | Footer `Admin access` visible |
| Client post-job | OWNER REVIEW REQUIRED | Demo prefill category/title mismatch; draft-account banner |

Upload status: **WAITING OWNER APPROVAL** — see `ASSET_UPLOAD_PACKAGE_CHECKLIST.md`.

## Pass 008 Approval Summary

| Scene | Pass 008 native/mobile | Pass 008 final decision | Upload allowed |
| --- | --- | --- | --- |
| Marketplace home | **WEB-ONLY CAPTURE RISK** | **RETAKE RECOMMENDED** | **NO** |
| Job detail | **WEB-ONLY CAPTURE RISK** | **RETAKE RECOMMENDED** | **NO** |
| Client post-job | **WEB-ONLY CAPTURE RISK** | **RETAKE RECOMMENDED** | **NO** |

Retake strategy (no source change): ~414×896 CSS @ `deviceScaleFactor: 3` → 1242×2688 mobile shell. See `OWNER_ASSET_APPROVAL_DECISIONS.md`.

## Pass 010 Final Upload Set

| Scene | File | Status | Upload allowed |
| --- | --- | --- | --- |
| Marketplace home | `READY-shutterbid-marketplace-home-mobile-1242x2688.png` | **READY** | **NO** |
| Job detail / venue content | `READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` | **READY** | **NO** |
| Client post-job (clean) | `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` | **READY** | **NO** |

Superseded: Pass 006 desktop files; `READY-shutterbid-client-post-job-mobile-1242x2688.png`. Backup alternate: `READY-shutterbid-jobs-browse-mobile-1242x2688.png`.
