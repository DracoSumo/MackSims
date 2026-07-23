# ShutterBid - Existing Console Status

ShutterBid is an existing console-flow app. Audit current setup and complete missing pieces; do not create duplicate Apple or Google records.

| Area | Status | Notes |
| --- | --- | --- |
| Console status | EXISTING CONSOLE RECORDS | Per v001.1 request |
| App Store Connect | IN PROGRESS | Existing Apple app record, visible app name, bundle ID, TestFlight build upload, and App Store version metadata confirmed; screenshots, submission build selection, App Privacy, app info/category, and some URL fields still need work/confirmation |
| Google Play Console | IN PROGRESS | Existing Play record, package, AAB, and internal testing confirmed; store listing/privacy/assets still incomplete or unconfirmed |
| Bundle/package confirmed | READY | Apple bundle ID and Google Play package both confirmed as `com.chrissims.shutterbid` |
| Store copy | BLOCKED | Apple promotional text, description, keywords, support URL, marketing URL, version, copyright, and review notes are populated; Google Play short description and full description are blank; Pass 004 added draft Play listing copy for owner review only |
| Privacy/data safety | BLOCKED | Google Play Privacy Policy URL is blank; Google Data safety and Apple App Privacy still need owner/console confirmation |
| Screenshots/assets | IN PROGRESS | Pass 006: 3 READY local scenes; Pass 007: upload **WAITING OWNER APPROVAL** (web layout vs native presentation, footer admin link, post-job demo prefill mismatch) |
| Reviewer notes | IN PROGRESS | Apple sign-in required is checked and reviewer account fields are populated; password is intentionally not recorded in docs |
| Tester track | IN PROGRESS | Apple TestFlight approved build and tester groups confirmed; Google Play internal testing is available to internal testers |
| Backend readiness | NEEDS OWNER CONFIRMATION | Confirm auth, uploads, marketplace, contact/messaging, admin approval, moderation |
| Public URLs | BLOCKED | Support, privacy, terms, and account deletion were previously reachable; Pass 005 live capture of `https://macksims.com/shutterbid` showed `Site not found` |
| Build upload status | READY | Apple TestFlight build and Google Play AAB are uploaded/active |
| App Store submission build selection | BLOCKED | App Store version page shows `Add Build`; no build is selected for App Review submission |

## July 2, 2026 Console Confirmation Note

Owner Console Action Pass 001. Console cleanup was limited to correcting the Apple Marketing URL from `https://macksims.com/fishcrew` to `https://macksims.com/shutterbid`. Privacy + Asset Prep Pass 002 added owner privacy questionnaires, screenshot planning, Play asset checklist, account deletion clarification, and reviewer/demo access clarification. Owner Answers + Screenshot Execution Pass 003 added store-form drafts and screenshot execution checklist. Asset Capture + Owner Decision Pass 004 added owner decision tables, screenshot route/readiness review, screenshot output folders, and draft Google Play listing copy for owner review only. Route/Test Data + Screenshot Capture Pass 005 captured the public/support-safe route locally and marked it `REJECT` because the live route showed `Site not found`. No screenshots were uploaded. No app records, identifiers, bundle IDs, package names, signing config, source code, DNS, Firebase, Supabase, Netlify settings, public routes, or backend projects were changed.

## Apple Submission-Prep Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Confirmed identity | READY | ShutterBid, ASC app ID `6783551944`, bundle ID `com.chrissims.shutterbid` |
| Confirmed TestFlight build | READY | `1.0 (20260624035226)`, Approved |
| Build selected for App Review | NOT DONE | App Store version page shows `Add Build` |
| Screenshots uploaded | NOT DONE | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes shown: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| App Privacy completed | NEEDS OWNER CONFIRMATION | App Privacy page shows `Get Started`; Apple Privacy Policy URL and User Privacy Choices URL show blank/dash values |
| Reviewer notes/demo access | NEEDS OWNER CONFIRMATION | Sign-in required is checked and credential fields are populated in console; docs must use `DO_NOT_COMMIT_PASSWORD` only |
| Console URL fields | NEEDS REVIEW | Support URL visible; Marketing URL corrected to `https://macksims.com/shutterbid`; Apple privacy/account deletion URL fields still need owner confirmation where supported |
| Ready to submit | NO | Do not submit until build selection, screenshots, App Privacy, URL review, and owner confirmations are complete |

## ShutterBid Owner Actions

- Complete [PRIVACY_OWNER_QUESTIONNAIRE.md](./PRIVACY_OWNER_QUESTIONNAIRE.md) before submitting Apple App Privacy or Google Data Safety.
- Review [STORE_FORM_DRAFTS.md](./STORE_FORM_DRAFTS.md) and fill owner-confirmed answers only.
- Review [SCREENSHOT_PLAN.md](./SCREENSHOT_PLAN.md) and approve demo-safe screenshot scenes.
- Use [SCREENSHOT_EXECUTION_CHECKLIST.md](./SCREENSHOT_EXECUTION_CHECKLIST.md) to track capture status.
- Confirm app-specific screenshot routes/screens before capture; only the public/support-safe route is ready to capture from local evidence.
- Place approved captures under `screenshots/apple` and `screenshots/google-play`.
- Review the draft Google Play short description, full description, and privacy URL candidate in `STORE_FORM_DRAFTS.md`.
- Confirm Apple App Privacy answers.
- Confirm reviewer/demo account requirements.
- Upload/select iPhone screenshots.
- Select approved TestFlight build `1.0 (20260624035226)` for App Review only after screenshots and privacy are ready.

## Privacy + Asset Prep Pass 002

| Prep Area | Status | Notes |
| --- | --- | --- |
| Apple App Privacy questionnaire | NEEDS OWNER CONFIRMATION | Created in `PRIVACY_OWNER_QUESTIONNAIRE.md`; all answers remain owner-confirmed only |
| Google Data Safety questionnaire | NEEDS OWNER CONFIRMATION | Created in `PRIVACY_OWNER_QUESTIONNAIRE.md`; do not submit answers without owner confirmation |
| Screenshot plan | READY | Created in `SCREENSHOT_PLAN.md`; uploads remain blocked until assets are captured and approved |
| Apple screenshot scenes | BLOCKED | Planned 8 scenes: home/marketplace value, client post-job flow, photographer profile or portfolio, bidding/job details, client dashboard, photographer bookings/workload, admin/moderation if appropriate, public route/support-safe view if needed |
| Google Play missing assets | BLOCKED | Privacy URL, short description, full description, category, contact details, app icon, screenshots, and feature graphic are missing |
| Account deletion workflow | NEEDS OWNER CONFIRMATION | Public URL is available; actual deletion workflow must be confirmed as manual support-based, in-app request-based, or backend self-service |
| Reviewer/demo access | NEEDS OWNER CONFIRMATION | ASC sign-in required is checked; docs must use `DO_NOT_COMMIT_PASSWORD` only |

## Owner Answers + Screenshot Execution Pass 003

| Prep Area | Status | Notes |
| --- | --- | --- |
| Store form drafts | READY | Created in `STORE_FORM_DRAFTS.md`; no unconfirmed privacy answers were invented |
| Apple App Privacy draft | NEEDS OWNER CONFIRMATION | Draft separates known console state from unconfirmed data practices |
| Google Data Safety draft | NEEDS OWNER CONFIRMATION | Draft leaves data collection/sharing/deletion answers unresolved |
| Reviewer/demo access draft | NEEDS OWNER CONFIRMATION | Apple ASC sign-in required is checked; password placeholder only |
| Account deletion draft | NEEDS OWNER CONFIRMATION | Public URL exists; actual workflow still unconfirmed |
| Screenshot execution checklist | READY | Created in `SCREENSHOT_EXECUTION_CHECKLIST.md`; all scenes are `NOT CAPTURED` |
| Asset checklist | BLOCKED | App icon, Apple screenshots, Play screenshots, Play feature graphic, Play privacy URL, Play descriptions, Play category, and Play contact details remain blocked |

## Asset Capture + Owner Decision Pass 004

| Prep Area | Status | Notes |
| --- | --- | --- |
| Screenshot output folders | READY | `screenshots/apple` and `screenshots/google-play` created for ShutterBid |
| Screenshot route confirmation | BLOCKED | App-specific native scenes need route/screen confirmation; public/support-safe route is rejected after Pass 005 live capture showed `Site not found` |
| Screenshot capture readiness | IN PROGRESS | 1 scene `READY TO CAPTURE`; 1 scene `NEEDS TEST DATA`; 4 scenes `NEEDS LOGIN`; 1 scene `NEEDS OWNER REVIEW`; 1 scene `NOT AVAILABLE` |
| Screenshot capture status | BLOCKED | No screenshots captured or uploaded; admin/moderation is `NOT AVAILABLE` unless owner explicitly approves a private/admin capture |
| Owner privacy decision sheet | NEEDS OWNER CONFIRMATION | Added to `STORE_FORM_DRAFTS.md`; all listed data categories remain `NEEDS OWNER CONFIRMATION` |
| Account deletion decision | NEEDS OWNER CONFIRMATION | Public deletion URL is confirmed available; actual deletion method and compliance readiness remain unconfirmed |
| Reviewer/demo access decision | NEEDS OWNER CONFIRMATION | Apple ASC requires reviewer login; Play app access, guest availability, and owner-approved demo email remain unresolved |
| Google Play listing draft | DRAFT - OWNER REVIEW REQUIRED | Draft short description, full description, and privacy URL candidate added to `STORE_FORM_DRAFTS.md`; not entered into Play |
| Asset blockers | BLOCKED | App icon, Apple screenshots, Play screenshots, Play feature graphic, Play privacy URL, Play descriptions, Play category, and Play contact details remain blocked |

## Route/Test Data + Screenshot Capture Pass 005

| Area | Status | Notes |
| --- | --- | --- |
| Public route capture attempt | REJECT | Captured `https://macksims.com/shutterbid`, but live page displayed `Site not found` |
| Captured files | REJECT | `REJECT-shutterbid-public-route-site-not-found-1242x2688.png` in both Apple and Google Play screenshot folders |
| Screenshot dimensions | READY | Captured size is `1242 x 2688`, but content is rejected |
| Store polish | REJECT | Wrong page; no ShutterBid branding or app content |
| App-specific route confirmation | BLOCKED | Scenes 1-7 still need native route/screen confirmation |
| Minimum safe test data | IN PROGRESS | Documented in `SCREENSHOT_EXECUTION_CHECKLIST.md`; local/demo data is OK only after owner confirms it matches the submitted build |
| Screenshot upload status | BLOCKED | No screenshots uploaded to App Store Connect or Google Play |

## Screenshot Fix + Demo Data Pass 006

| Area | Status | Notes |
| --- | --- | --- |
| ShutterBid source path | READY | `C:\Users\draco\OneDrive\Documents\GitHub\shutterbid-ios` |
| Local capture routes | READY | `/`, `/jobs/venue-content-package`, `/post-job` (prefilled demo copy at capture) |
| Captured scenes | READY | Marketplace home, job detail, client post-job at `1242 x 2688` |
| Live public route | BLOCKED | `https://macksims.com/shutterbid` remains blocked; not used in Pass 006 |
| Source changes | NONE | No ShutterBid source edits required for Pass 006 captures |
| Screenshot upload status | BLOCKED | No screenshots uploaded to App Store Connect or Google Play |

## Asset Approval + Build Match Pass 007

| Area | Status | Notes |
| --- | --- | --- |
| File verification | READY | 3 scenes × Apple + Play copies confirmed; all `1242 x 2688` |
| Visual review | OWNER REVIEW REQUIRED | Desktop web layout at phone size; footer `Admin access`; post-job category/title mismatch from demo prefill |
| Build-match | OWNER REVIEW REQUIRED | Same `shutterbid-ios` repo likely aligned; owner must confirm captures match submitted native shell |
| Upload package | WAITING OWNER APPROVAL | See `docs/store-launch/ASSET_UPLOAD_PACKAGE_CHECKLIST.md` |
| Public route blocker | SEPARATE | `https://macksims.com/shutterbid` still blocked from Pass 005 |
| Pass 007 source changes | NONE | Review/docs only |

## Asset Approval + Native UI Verification Pass 008

| Area | Status | Notes |
| --- | --- | --- |
| Native/mobile verification | **WEB-ONLY CAPTURE RISK** | 1242 CSS px width triggers desktop shell per `globals.css` (mobile nav hidden ≥768px) |
| Build-match | **LIKELY SOURCE-ALIGNED** | Capacitor/web wrapper in `codemagic.yaml`; not native-layout confirmed |
| Screenshot decisions | **RETAKE RECOMMENDED** (all 3 scenes) | Retake at ~414×896 @3x suggested without source changes |
| Owner approval | **PENDING** | Upload allowed: **NO** |
| Pass 008 source changes | NONE | Verification/docs only |

## Mobile-Shell Screenshot Retake Pass 009

| Area | Status | Notes |
| --- | --- | --- |
| Capture method | **414×896 CSS @ 3x** | Outputs **1242×2688** PNG |
| Mobile shell | **ACHIEVED** | Bottom nav visible; desktop top nav hidden on all 3 scenes |
| Pass 009 captures | **2 READY / 1 NEEDS RETAKE** | Post-job guest draft banner still visible |
| Pass 006 files | **SUPERSEDED** | Retained on disk; do not upload |
| Native/mobile verification | **LIKELY NATIVE MATCH** | Mobile-shell captures align with Capacitor WebView width |
| Owner approval | **PENDING** | Upload allowed: **NO** |
| Pass 009 source changes | NONE | Capture script only |

## Post-Job Retake + Final Approval Pass 010

| Area | Status | Notes |
| --- | --- | --- |
| Post-job retake | **CLEANED** | Option B scroll-to-form → `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` |
| Current upload set | **3 READY** | Home + job detail (Pass 009) + post-job clean (Pass 010) |
| Pass 009 post-job | **SUPERSEDED** | `READY-shutterbid-client-post-job-mobile-1242x2688.png` |
| Owner approval | **PENDING** | Upload allowed: **NO** |
| Pass 010 source changes | NONE | Capture script only |

## Google Play Confirmation Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Google Play app record exists | READY | Visible app: ShutterBid |
| Package name | READY | `com.chrissims.shutterbid` |
| AAB uploaded | READY | Version code `1782330956`, version name `1.0`, Active |
| Internal/closed/open testing track status | READY | Internal testing available to internal testers |
| Data Safety status | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed data answers still required |
| Privacy policy URL | BLOCKED | Blank in Play Console privacy policy field |
| Account deletion URL | NEEDS OWNER CONFIRMATION | Public URL is live; Play App content/account-deletion field not directly confirmed |
| App icon | BLOCKED | Play listing shows `Add assets` |
| Screenshots | BLOCKED | Play listing shows `Add assets` |
| Feature graphic | BLOCKED | Play listing shows `Add assets` |
| Short description | BLOCKED | Blank in Play default store listing |
| Full description | BLOCKED | Blank in Play default store listing |
| Contact details | BLOCKED | Store settings shows Email address, Phone number, and Website with no visible values |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION | Play App content/app-access field not directly confirmed; confirm review access path before submission |

## Google Play Owner Console Action Pass 001 Snapshot

| Field | Value | Notes |
| --- | --- | --- |
| Google Play app record exists | YES | App list shows ShutterBid |
| Package name | `com.chrissims.shutterbid` | App list confirms package |
| AAB uploaded | YES | Latest app bundle is active |
| Latest version/build | Version code `1782330956`, version name `1.0` | Uploaded Jun 24, 2026, 7:58 PM |
| Testing track status | Internal testing | `ShutterBid Android 1`, available to internal testers, full rollout |
| Data Safety status | UNKNOWN | Play App content/Data Safety route stalled; owner confirmation required |
| Privacy policy URL | NO | Privacy policy URL field is blank |
| Account deletion URL | UNKNOWN | Public URL is live; Play console field not directly confirmed |
| App icon uploaded | NO | Default listing shows `Add assets` |
| Screenshots uploaded | NO | Phone and tablet screenshot sections show `Add assets` |
| Feature graphic uploaded | NO | Default listing shows `Add assets` |
| Short description populated | NO | Default listing field is blank |
| Full description populated | NO | Default listing field is blank |
| Category populated | NO | Store settings show `Select a category` |
| Contact details populated | NO | Store settings show no visible email/phone/website values |
| App access/reviewer instructions populated | UNKNOWN | Play App content/app-access field not directly confirmed |

### Directly Confirmed In Google Play Console

| Field | Status | Confirmation |
| --- | --- | --- |
| Existing Google Play app record | READY | Visible app: ShutterBid |
| Package name | READY | `com.chrissims.shutterbid` |
| Package/build expectation | READY | Current uploaded Play AAB is in the ShutterBid record for `com.chrissims.shutterbid`; future build expectations still require owner control |
| App status | IN PROGRESS | Draft, Internal testing |
| Android AAB uploaded | READY | App bundle version code `1782330956`, version name `1.0`, uploaded Jun 24, 2026, 7:58 PM, Active |
| Latest release | READY | `ShutterBid Android 1`, latest version `1782330956`, Internal testing, Available to internal testers, Full rollout, last updated Jun 24, 2026, 3:58 PM |
| Google Play testing status | READY | Internal testing active/available to internal testers |
| App name | READY | ShutterBid |
| Short description | BLOCKED | Blank in Play default store listing |
| Full description | BLOCKED | Blank in Play default store listing |
| Privacy Policy URL | BLOCKED | Blank in Play Console privacy policy field |
| App icon | BLOCKED | Play listing shows `Add assets` |
| Feature graphic | BLOCKED | Play listing shows `Add assets` |
| Phone screenshots | BLOCKED | Play listing shows `Add assets` |
| 7-inch tablet screenshots | BLOCKED | Play listing shows `Add assets` |
| 10-inch tablet screenshots | BLOCKED | Play listing shows `Add assets` |
| Category | BLOCKED | Store settings show `Select a category` |
| Contact fields | BLOCKED | Store settings show Email address, Phone number, and Website with no visible values |
| Data safety | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed answers required |
| Support URL in Play Console | NEEDS OWNER CONFIRMATION | Public URL is live, but Play support/contact field was not directly confirmed |
| Terms URL in Play Console | NOT APPLICABLE | No Play terms field was directly visible in checked pages |
| Account deletion URL in Play Console | NEEDS OWNER CONFIRMATION | Public URL is live; Play account deletion field was not directly confirmed |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION | Play App content/app-access field not directly confirmed |

### App Store Connect Confirmation Result

| Field | Status | Confirmation |
| --- | --- | --- |
| App Store Connect access | READY | Logged-in browser session accessible on retry |
| Existing Apple app record | READY | Visible app: ShutterBid, App Store Connect app ID `6783551944` |
| Visible app name | READY | ShutterBid |
| Bundle ID | READY | `com.chrissims.shutterbid` from TestFlight build metadata |
| iOS build uploaded | READY | Latest visible build `1.0 (20260624035226)`, upload complete/validated, uploaded Jun 23, 2026 at 11:55 PM |
| Latest TestFlight build status | READY | Build `20260624035226` is Approved and expires in 82 days |
| TestFlight groups | IN PROGRESS | Internal `ShutterBid Testers` has 1 tester; external `ShutterBid Testers` shows no tester count |
| App Store version status | IN PROGRESS | iOS App Version `1.0` is Prepare for Submission |
| App Store submission build selected | BLOCKED | App Store version page shows `Add Build`; a build is not selected for App Review submission |
| Apple screenshots/assets | BLOCKED | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes shown: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| Apple promotional text | READY | Populated |
| Apple description | READY | Populated |
| Apple keywords | READY | Populated |
| Apple Support URL | READY | `https://macksims-public-site.netlify.app/support/` |
| Apple Marketing URL | READY | Corrected and saved as `https://macksims.com/shutterbid` |
| Apple reviewer notes/contact | IN PROGRESS | Sign-in required is checked and reviewer account fields are populated; use `DO_NOT_COMMIT_PASSWORD` placeholder only in docs |
| App Privacy answers | NEEDS OWNER CONFIRMATION | App Privacy page shows `Get Started`; Privacy Policy URL and User Privacy Choices URL show blank/dash values; do not submit answers until owner confirms data collection details |
| App Information/category/SKU | NEEDS OWNER CONFIRMATION | App Information page not directly confirmed |

### Account Deletion Workflow

| Field | Status | Confirmation |
| --- | --- | --- |
| Public account deletion URL | READY | `https://macksims-public-site.netlify.app/account-deletion/` is present in local public site docs and previously returned HTTP 200 |
| Workflow type | IN PROGRESS | Public page is informational/manual support request: users email `support@macksims.com` from the account email with "Account Deletion Request" |
| In-app deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Backend deletion automation | NEEDS OWNER CONFIRMATION | Not confirmed |

## Next Action

Select an Apple build for the App Store version only after screenshots and privacy are ready; upload screenshots/assets, complete Apple App Privacy owner review, and fill Google Play listing/privacy/assets/category/contact/Data Safety before any submission.

---

## 2026-07-05 — Bulk UI Polish + Mismatch Audit append

| Area | Status | Notes |
| --- | --- | --- |
| Source edits | **NONE** | Audit-only this pass — no ShutterBid source changes (store binaries separate from `shutterbid-starter`) |
| Version mismatch | **POSSIBLE** | Local `shutterbid-starter` package `0.1.0` vs submitted store `1.0` |
| Pass 010 JSON vs STATUS | **POSSIBLE DOC MISMATCH** | STATUS says 3 READY; `pass010-shutterbid-postjob-capture-results.json` still marks NEEDS RETAKE with admin footer — owner reconcile |
| Public route | **MISMATCH CONFIRMED** | `https://macksims.com/shutterbid` still broken (unchanged; DNS out of scope) |
| Screenshot assets | On OneDrive paths per capture JSON — not verified in Downloads workspace |

See `docs/BULK_UI_POLISH_REPORT.md` — **no console or identifier changes this pass**.

