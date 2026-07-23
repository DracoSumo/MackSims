# FishCrew - Existing Console Status

FishCrew is an existing console-flow app. Audit current setup and complete missing pieces; do not create duplicate Apple or Google records.

| Area | Status | Notes |
| --- | --- | --- |
| Console status | EXISTING CONSOLE RECORDS | Per v001.1 request |
| App Store Connect | IN PROGRESS | Existing Apple app record, visible app name, bundle ID, TestFlight build upload, App Store version metadata, screenshot requirements, reviewer sign-in state, and App Privacy not-started state confirmed; screenshots, submission build selection, App Privacy answers, and Apple privacy URL still need work/confirmation |
| Google Play Console | IN PROGRESS | Existing Play record, package, AAB, and internal testing confirmed; listing assets/category/contact/Data safety still incomplete or unconfirmed |
| Bundle/package confirmed | READY | Apple bundle ID and Google Play package both confirmed as `com.chrissims.fishcrew` |
| Store copy | IN PROGRESS | Apple promotional text, description, keywords, support URL, marketing URL, version, copyright, and review notes are populated; Google Play app name, short description, and full description are populated |
| Privacy/data safety | BLOCKED | Apple App Privacy page shows `Get Started` with blank Apple Privacy Policy URL; Google Play Privacy Policy URL is populated; Google Data safety still needs owner confirmation |
| Screenshots/assets | IN PROGRESS | Pass 006: 3 READY local scenes at `1242 x 2688`; Pass 007: visual approval ready, **upload blocked pending owner build-match sign-off** (v0.7.0 vs submitted `1.0`); not uploaded |
| Reviewer notes | IN PROGRESS | Apple review notes/contact info populated; sign-in required is not checked in App Store Connect; owner must confirm whether the actual app build requires login |
| Tester track | IN PROGRESS | Apple TestFlight approved build and tester groups confirmed; FishCrew external TestFlight group was renamed from `ShutterBid Testers` to `FishCrew Testers`; Google Play internal testing is available to internal testers |
| Backend readiness | NEEDS OWNER CONFIRMATION | Confirm auth, storage, location, UGC, weather/maps, notifications |
| Public URLs | READY | Support, privacy, terms, account deletion, and FishCrew web target returned HTTP 200 on 2026-07-01 |
| Build upload status | READY | Apple TestFlight build and Google Play AAB are uploaded/active |
| App Store submission build selection | BLOCKED | App Store version page shows `Add Build`; no build is selected for App Review submission |

## July 2, 2026 Console Confirmation Note

Owner Console Action Pass 001. Console cleanup was limited to renaming the FishCrew external TestFlight group from `ShutterBid Testers` to `FishCrew Testers`. Privacy + Asset Prep Pass 002 added owner privacy questionnaires, screenshot planning, Play asset checklist, account deletion clarification, and reviewer/demo access clarification. Owner Answers + Screenshot Execution Pass 003 added store-form drafts and screenshot execution checklist. Asset Capture + Owner Decision Pass 004 added owner decision tables, screenshot route/readiness review, and screenshot output folders. Route/Test Data + Screenshot Capture Pass 005 captured the public/support-safe route locally and marked it `NEEDS RETAKE`. No screenshots were uploaded. No app records, identifiers, bundle IDs, package names, signing config, source code, DNS, Firebase, Supabase, Netlify settings, public routes, or backend projects were changed.

## Apple Submission-Prep Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Confirmed identity | READY | FishCrew, ASC app ID `6783567028`, bundle ID `com.chrissims.fishcrew` |
| Confirmed TestFlight build | READY | `1.0 (20260624034852)`, Approved |
| Build selected for App Review | NOT DONE | App Store version page shows `Add Build` |
| Screenshots uploaded | NOT DONE | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes shown: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| App Privacy completed | NEEDS OWNER CONFIRMATION | App Privacy page shows `Get Started`; Apple Privacy Policy URL and User Privacy Choices URL show blank/dash values |
| Reviewer notes/demo access | NEEDS OWNER CONFIRMATION | Review notes/contact populated; sign-in required is unchecked in ASC, but actual reviewer path still needs owner confirmation |
| Console URL fields | NEEDS REVIEW | Support and marketing URL visible; Apple App Privacy page Privacy Policy URL is blank; account deletion URL field still needs owner confirmation where supported |
| Ready to submit | NO | Do not submit until build selection, screenshots, App Privacy, and owner confirmations are complete |

## FishCrew Owner Actions

- Complete [PRIVACY_OWNER_QUESTIONNAIRE.md](./PRIVACY_OWNER_QUESTIONNAIRE.md) before submitting Apple App Privacy or Google Data Safety.
- Review [STORE_FORM_DRAFTS.md](./STORE_FORM_DRAFTS.md) and fill owner-confirmed answers only.
- Review [SCREENSHOT_PLAN.md](./SCREENSHOT_PLAN.md) and approve demo-safe screenshot scenes.
- Use [SCREENSHOT_EXECUTION_CHECKLIST.md](./SCREENSHOT_EXECUTION_CHECKLIST.md) to track capture status.
- Confirm app-specific screenshot routes/screens before capture; only the public/support-safe route is ready to capture from local evidence.
- Place approved captures under `screenshots/apple` and `screenshots/google-play`.
- Confirm Apple App Privacy answers.
- Confirm reviewer/demo account requirements.
- Upload/select iPhone screenshots.
- Select approved TestFlight build `1.0 (20260624034852)` for App Review only after screenshots and privacy are ready.

## Privacy + Asset Prep Pass 002

| Prep Area | Status | Notes |
| --- | --- | --- |
| Apple App Privacy questionnaire | NEEDS OWNER CONFIRMATION | Created in `PRIVACY_OWNER_QUESTIONNAIRE.md`; all answers remain owner-confirmed only |
| Google Data Safety questionnaire | NEEDS OWNER CONFIRMATION | Created in `PRIVACY_OWNER_QUESTIONNAIRE.md`; do not submit answers without owner confirmation |
| Screenshot plan | READY | Created in `SCREENSHOT_PLAN.md`; uploads remain blocked until assets are captured and approved |
| Apple screenshot scenes | BLOCKED | Planned 8 scenes: home/local fishing hub, explore/local water activity, weather or Port Window, feed/trip activity, profile, tools/guides, auth/onboarding if needed, public route/support-safe view if needed |
| Google Play missing assets | BLOCKED | Category, contact details, app icon, screenshots, and feature graphic are missing |
| Account deletion workflow | NEEDS OWNER CONFIRMATION | Public URL is available; actual deletion workflow must be confirmed as manual support-based, in-app request-based, or backend self-service |
| Reviewer/demo access | NEEDS OWNER CONFIRMATION | ASC sign-in required is unchecked; owner must confirm whether guest browsing is sufficient or demo login is needed |

## Owner Answers + Screenshot Execution Pass 003

| Prep Area | Status | Notes |
| --- | --- | --- |
| Store form drafts | READY | Created in `STORE_FORM_DRAFTS.md`; no unconfirmed privacy answers were invented |
| Apple App Privacy draft | NEEDS OWNER CONFIRMATION | Draft separates known console state from unconfirmed data practices |
| Google Data Safety draft | NEEDS OWNER CONFIRMATION | Draft leaves data collection/sharing/deletion answers unresolved |
| Reviewer/demo access draft | NEEDS OWNER CONFIRMATION | FishCrew ASC sign-in required is unchecked; actual app behavior still needs owner confirmation |
| Account deletion draft | NEEDS OWNER CONFIRMATION | Public URL exists; actual workflow still unconfirmed |
| Screenshot execution checklist | READY | Created in `SCREENSHOT_EXECUTION_CHECKLIST.md`; all scenes are `NOT CAPTURED` |
| Asset checklist | BLOCKED | App icon, Apple screenshots, Play screenshots, Play feature graphic, Play category, and Play contact details remain blocked |

## Asset Capture + Owner Decision Pass 004

| Prep Area | Status | Notes |
| --- | --- | --- |
| Screenshot output folders | READY | `screenshots/apple` and `screenshots/google-play` created for FishCrew |
| Screenshot route confirmation | BLOCKED | App-specific native scenes need route/screen confirmation; public/support-safe route is confirmed from local public route evidence |
| Screenshot capture readiness | IN PROGRESS | 1 scene `READY TO CAPTURE`; 2 scenes `NEEDS TEST DATA`; 1 scene `NEEDS LOGIN`; 4 scenes `NEEDS OWNER REVIEW`; 0 scenes `NOT AVAILABLE` |
| Screenshot capture status | BLOCKED | No screenshots captured or uploaded; do not capture broken, placeholder, beta-looking, private, or admin-only screens without owner approval |
| Owner privacy decision sheet | NEEDS OWNER CONFIRMATION | Added to `STORE_FORM_DRAFTS.md`; all listed data categories remain `NEEDS OWNER CONFIRMATION` |
| Account deletion decision | NEEDS OWNER CONFIRMATION | Public deletion URL is confirmed available; actual deletion method and compliance readiness remain unconfirmed |
| Reviewer/demo access decision | NEEDS OWNER CONFIRMATION | Guest browsing, reviewer login requirement, and demo account requirement remain unknown for the submitted build |
| Asset blockers | BLOCKED | App icon, Apple screenshots, Play screenshots, Play feature graphic, Play category, and Play contact details remain blocked |

## Route/Test Data + Screenshot Capture Pass 005

| Area | Status | Notes |
| --- | --- | --- |
| Public route capture attempt | NEEDS RETAKE | Captured `https://fishcrew.macksims.com/` into Apple and Play screenshot folders |
| Captured files | NEEDS RETAKE | `NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png` in both Apple and Google Play screenshot folders |
| Screenshot dimensions | NEEDS RETAKE | Captured size is `1227 x 2688`, not accepted Apple width `1242` or `1284` |
| Store polish | NEEDS RETAKE | Visible beta/testing banner and repeated/sticky layout in tall viewport |
| App-specific route confirmation | BLOCKED | Scenes 1-7 still need native route/screen confirmation |
| Minimum safe test data | IN PROGRESS | Documented in `SCREENSHOT_EXECUTION_CHECKLIST.md`; local/demo data is OK only after owner confirms it matches the submitted build |
| Screenshot upload status | BLOCKED | No screenshots uploaded to App Store Connect or Google Play |

## Screenshot Fix + Demo Data Pass 006

| Area | Status | Notes |
| --- | --- | --- |
| FishCrew source path | READY | `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070` (`fishcrew-static-v083` missing; possible version mismatch vs live site) |
| Screenshot-safe mode | READY | Local `?screenshot=1` hides beta banner and loads demo seed when empty |
| Captured scenes | READY | Home, Explore, Feed at `1242 x 2688` in Apple and Google Play folders |
| Live public route | DEFER | `https://fishcrew.macksims.com/` not used; Pass 005 artifact retained as superseded |
| Source backups | READY | `.pass006-backups/20260703-074720` and `.pass006-backups/20260703-075158-demo` |
| Checks | READY | `tests/v070-static-checks.js` passed after screenshot-mode edits |
| Screenshot upload status | BLOCKED | No screenshots uploaded to App Store Connect or Google Play |

## Asset Approval + Build Match Pass 007

| Area | Status | Notes |
| --- | --- | --- |
| File verification | READY | 3 scenes × Apple + Play copies confirmed; all `1242 x 2688` |
| Visual review | APPROVED FOR OWNER REVIEW | Pass 006 captures store-safe with demo data; no beta banner |
| Build-match | OWNER REVIEW REQUIRED | Internal source `0.7.0` vs submitted marketing `1.0`; `fishcrew-static-v083` not found — owner must confirm TestFlight/Play UI parity before upload |
| Upload package | WAITING OWNER APPROVAL | See `docs/store-launch/ASSET_UPLOAD_PACKAGE_CHECKLIST.md` |
| Public route blocker | SEPARATE | Live `fishcrew.macksims.com` beta banner unchanged |
| Pass 007 source changes | NONE | Review/docs only |

## Asset Approval + Native UI Verification Pass 008

| Area | Status | Notes |
| --- | --- | --- |
| Build-match | **LIKELY MATCH** | `docs/EXTERNAL_TESTFLIGHT_CHECKLIST.md` ties TestFlight to `fishcrew-static-v070`; v083 not found; `fishcrew-ios` wrapper not local |
| Native/mobile | N/A (mobile-first static web) | Pass 006 `?screenshot=1` differs from default first-launch UI |
| Screenshot decisions | **OWNER REVIEW REQUIRED** (all 3 scenes) | Upload allowed: **NO** |
| Owner approval | **PENDING** | See `OWNER_ASSET_APPROVAL_DECISIONS.md` |
| Pass 008 source changes | NONE | Verification/docs only |

## Pass 010 Note

FishCrew screenshots unchanged. All 3 scenes remain **READY** visually with **LIKELY MATCH** build status; upload **NO** until owner signs `OWNER_ASSET_APPROVAL_DECISIONS.md`.

## Google Play Confirmation Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Google Play app record exists | READY | Visible app: FishCrew |
| Package name | READY | `com.chrissims.fishcrew` |
| AAB uploaded | READY | Version code `1`, version name `1.0`, Active |
| Internal/closed/open testing track status | READY | Internal testing available to internal testers |
| Data Safety status | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed data answers still required |
| Privacy policy URL | READY | `https://macksims-public-site.netlify.app/privacy/` populated |
| Account deletion URL | NEEDS OWNER CONFIRMATION | Public URL is live; Play App content/account-deletion field not directly confirmed |
| App icon | BLOCKED | Play listing shows `Add assets` |
| Screenshots | BLOCKED | Play listing shows `Add assets` |
| Feature graphic | BLOCKED | Play listing shows `Add assets` |
| Short description | READY | Populated |
| Full description | READY | Populated |
| Contact details | BLOCKED | Store settings showed missing email/phone/website values |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION | Play App content/app-access field not directly confirmed; confirm review access path before submission |

## Google Play Owner Console Action Pass 001 Snapshot

| Field | Value | Notes |
| --- | --- | --- |
| Google Play app record exists | YES | App list shows FishCrew |
| Package name | `com.chrissims.fishcrew` | App list confirms package |
| AAB uploaded | YES | Latest app bundle is active |
| Latest version/build | Version code `1`, version name `1.0` | Uploaded Jun 24, 2026, 7:42 PM |
| Testing track status | Internal testing | `FishCrew Android 1`, available to internal testers, full rollout |
| Data Safety status | UNKNOWN | Play App content/Data Safety route stalled; owner confirmation required |
| Privacy policy URL | `https://macksims-public-site.netlify.app/privacy/` | Populated in Play Console |
| Account deletion URL | UNKNOWN | Public URL is live; Play console field not directly confirmed |
| App icon uploaded | NO | Default listing shows `Add assets` |
| Screenshots uploaded | NO | Phone and tablet screenshot sections show `Add assets` |
| Feature graphic uploaded | NO | Default listing shows `Add assets` |
| Short description populated | YES | Populated |
| Full description populated | YES | Populated |
| Category populated | NO | Store settings show `Select a category` |
| Contact details populated | NO | Store settings show no visible email/phone/website values |
| App access/reviewer instructions populated | UNKNOWN | Play App content/app-access field not directly confirmed |

### Directly Confirmed In Google Play Console

| Field | Status | Confirmation |
| --- | --- | --- |
| Existing Google Play app record | READY | Visible app: FishCrew |
| Package name | READY | `com.chrissims.fishcrew` |
| Package/build expectation | READY | Current uploaded Play AAB is in the FishCrew record for `com.chrissims.fishcrew`; future build expectations still require owner control |
| App status | IN PROGRESS | Draft, Internal testing |
| Android AAB uploaded | READY | App bundle version code `1`, version name `1.0`, uploaded Jun 24, 2026, 7:42 PM, Active |
| Latest release | READY | `FishCrew Android 1`, latest version `1`, Internal testing, Available to internal testers, Full rollout, last updated Jun 24, 2026, 3:43 PM |
| Google Play testing status | READY | Internal testing active/available to internal testers |
| App name | READY | FishCrew |
| Short description | READY | Populated: "Fishing community tools, profiles, and beta water features." |
| Full description | READY | Populated |
| Privacy Policy URL | READY | `https://macksims-public-site.netlify.app/privacy/` populated in Play Console |
| App icon | BLOCKED | Play listing shows `Add assets` |
| Feature graphic | BLOCKED | Play listing shows `Add assets` |
| Phone screenshots | BLOCKED | Play listing shows `Add assets` |
| 7-inch tablet screenshots | BLOCKED | Play listing shows `Add assets` |
| 10-inch tablet screenshots | BLOCKED | Play listing shows `Add assets` |
| Category | BLOCKED | Store settings show `Select a category` |
| Contact fields | BLOCKED | Store settings show Email address, Phone number, and Website with no visible values |
| Data safety | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed answers required |
| Support URL in Play Console | NEEDS OWNER CONFIRMATION | Public URL is live, but Play contact/support field was not populated in visible store settings |
| Terms URL in Play Console | NOT APPLICABLE | No Play terms field was directly visible in checked pages |
| Account deletion URL in Play Console | NEEDS OWNER CONFIRMATION | Public URL is live; Play account deletion field was not directly confirmed |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION | Play App content/app-access field not directly confirmed |

### App Store Connect Confirmation Result

| Field | Status | Confirmation |
| --- | --- | --- |
| App Store Connect access | READY | Logged-in browser session accessible on retry |
| Existing Apple app record | READY | Visible app: FishCrew, App Store Connect app ID `6783567028` |
| Visible app name | READY | FishCrew |
| Bundle ID | READY | `com.chrissims.fishcrew` from TestFlight build metadata |
| iOS build uploaded | READY | Latest visible build `1.0 (20260624034852)`, upload complete/validated, uploaded Jun 23, 2026 at 11:51 PM |
| Latest TestFlight build status | READY | Build `20260624034852` is Approved and expires in 82 days |
| TestFlight groups | IN PROGRESS | Internal `FishCrew Testers` has 1 tester; external group was safely renamed from `ShutterBid Testers` to `FishCrew Testers`, has 0 testers and 1 build |
| App Store version status | IN PROGRESS | iOS App Version `1.0` is Prepare for Submission |
| App Store submission build selected | BLOCKED | App Store version page shows `Add Build`; a build is not selected for App Review submission |
| Apple screenshots/assets | BLOCKED | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes shown: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| Apple promotional text | READY | Populated |
| Apple description | READY | Populated |
| Apple keywords | READY | Populated |
| Apple Support URL | READY | `https://macksims-public-site.netlify.app/support/` |
| Apple Marketing URL | READY | `https://macksims.com/fishcrew` |
| Apple reviewer notes/contact | IN PROGRESS | Contact and notes populated; sign-in required is not checked |
| App Privacy answers | NEEDS OWNER CONFIRMATION | App Privacy page shows `Get Started`; Privacy Policy URL and User Privacy Choices URL show blank/dash values; do not submit answers until owner confirms data collection details |
| App Information/category/SKU | NEEDS OWNER CONFIRMATION | App Information page did not expose fields in the readable snapshot |

### Account Deletion Workflow

| Field | Status | Confirmation |
| --- | --- | --- |
| Public account deletion URL | READY | `https://macksims-public-site.netlify.app/account-deletion/` is present in local public site docs and previously returned HTTP 200 |
| Workflow type | IN PROGRESS | Public page is informational/manual support request: users email `support@macksims.com` from the account email with "Account Deletion Request" |
| In-app deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Backend deletion automation | NEEDS OWNER CONFIRMATION | Not confirmed |

## Next Action

Select an Apple build for the App Store version only after screenshots and privacy are ready; upload screenshots/assets, complete Apple App Privacy owner review, and fix Google Play category/contact/assets/Data Safety before any submission.
