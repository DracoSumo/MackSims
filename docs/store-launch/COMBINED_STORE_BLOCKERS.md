# Combined Store Blockers - FishCrew And ShutterBid

Audit dates: 2026-07-01 public URL audit; 2026-07-02 console/documentation confirmation pass; 2026-07-02 Owner Console Action Pass 001; 2026-07-02 Privacy + Asset Prep Pass 002; 2026-07-02 Owner Answers + Screenshot Execution Pass 003; 2026-07-02 Asset Capture + Owner Decision Pass 004; 2026-07-02 Route/Test Data + Screenshot Capture Pass 005; 2026-07-03 Screenshot Fix + Demo Data Pass 006; 2026-07-03 Asset Approval + Build Match Pass 007; 2026-07-03 Owner Approval + Native UI Verification Pass 008; 2026-07-03 ShutterBid Mobile-Shell Screenshot Retake Pass 009; 2026-07-04 ShutterBid Post-Job Retake + Final Asset Approval Board Pass 010.

Do not create duplicate app records. Do not change bundle IDs or package names without owner approval.

## July 2, 2026 Confirmation Note

Owner Console Action Pass 001 was limited to safe console cleanup and documentation. FishCrew external TestFlight group was renamed from `ShutterBid Testers` to `FishCrew Testers`; ShutterBid Apple Marketing URL was corrected from `https://macksims.com/fishcrew` to `https://macksims.com/shutterbid`. Privacy + Asset Prep Pass 002 created owner privacy questionnaires, screenshot plans, missing Play asset checklists, account deletion clarification, and reviewer/demo access clarification. Owner Answers + Screenshot Execution Pass 003 created store-form drafts and screenshot execution checklists. Asset Capture + Owner Decision Pass 004 created screenshot output folders, added owner decision tables, reviewed screenshot route/capture readiness, and drafted ShutterBid Google Play listing copy for owner review only. Route/Test Data + Screenshot Capture Pass 005 captured only safe public/support route candidates locally: FishCrew was marked `NEEDS RETAKE`; ShutterBid was marked `REJECT`. Screenshot Fix + Demo Data Pass 006 captured 3 READY local app scenes per app at `1242 x 2688` using local sources (`fishcrew-static-v070` and `shutterbid-ios`); no screenshots were uploaded. Asset Approval + Build Match Pass 007 verified all 12 files, completed visual review, flagged FishCrew **possible build mismatch** (v0.7.0 vs submitted `1.0`), and set all upload packages to **WAITING OWNER APPROVAL**. Owner Approval + Native UI Verification Pass 008 upgraded FishCrew to **LIKELY MATCH** (still not upload-approved), classified ShutterBid as **WEB-ONLY CAPTURE RISK** with **RETAKE RECOMMENDED** for all 3 scenes, created `OWNER_ASSET_APPROVAL_DECISIONS.md`, and confirmed **zero** screenshots are **OWNER APPROVED FOR UPLOAD**. ShutterBid Mobile-Shell Screenshot Retake Pass 009 re-captured all 3 ShutterBid scenes at **414×896 CSS @3x** → **1242×2688** with **mobile shell achieved**; results **2 READY / 1 NEEDS RETAKE** (post-job guest draft banner); Pass 006 ShutterBid desktop-width files **SUPERSEDED** on disk. ShutterBid Post-Job Retake + Final Asset Approval Board Pass 010 cleaned post-job via scroll-to-form (**Option B**), producing **`READY-shutterbid-client-post-job-mobile-clean-1242x2688.png`**; final upload set is **3 READY** mobile-shell scenes per app (FishCrew unchanged); **`OWNER_ASSET_APPROVAL_DECISIONS.md`** updated as final approval board; upload remains **WAITING OWNER APPROVAL**. No app records, identifiers, bundle IDs, package names, signing config, Firebase projects, Supabase projects, DNS, Netlify settings, public routes, or backend projects were changed in Pass 006–010. FishCrew received small reversible screenshot-mode source edits in Pass 006 only; Pass 007–010 had no source changes.

App Store Connect was accessible from the logged-in browser. Apple app records, visible names, bundle IDs, uploaded TestFlight builds, App Privacy not-started state, App Store version build-selection blockers, reviewer sign-in state, and iPhone screenshot requirements were directly confirmed.

## Shared Ready Items

| Item | Status | Notes |
| --- | --- | --- |
| Existing console records | READY | Per v001.1 request for FishCrew and ShutterBid |
| FishCrew Google Play record | READY | Visible Play app: FishCrew, package `com.chrissims.fishcrew` |
| ShutterBid Google Play record | READY | Visible Play app: ShutterBid, package `com.chrissims.shutterbid` |
| FishCrew App Store Connect record | READY | Visible Apple app: FishCrew, App Store Connect app ID `6783567028` |
| ShutterBid App Store Connect record | READY | Visible Apple app: ShutterBid, App Store Connect app ID `6783551944` |
| FishCrew Apple bundle ID | READY | `com.chrissims.fishcrew` from TestFlight build metadata |
| ShutterBid Apple bundle ID | READY | `com.chrissims.shutterbid` from TestFlight build metadata |
| FishCrew TestFlight build upload | READY | `1.0 (20260624034852)`, uploaded Jun 23, 2026 at 11:51 PM, Approved |
| ShutterBid TestFlight build upload | READY | `1.0 (20260624035226)`, uploaded Jun 23, 2026 at 11:55 PM, Approved |
| FishCrew Android AAB | READY | Version code `1`, version name `1.0`, uploaded Jun 24, 2026, 7:42 PM, Active |
| ShutterBid Android AAB | READY | Version code `1782330956`, version name `1.0`, uploaded Jun 24, 2026, 7:58 PM, Active |
| FishCrew Apple App Store version metadata | IN PROGRESS | Promotional text, description, keywords, support URL, marketing URL, version, copyright, contact info, and review notes populated |
| ShutterBid Apple App Store version metadata | IN PROGRESS | Promotional text, description, keywords, support URL, marketing URL, version, copyright, contact info, and review notes populated; Marketing URL corrected to `https://macksims.com/shutterbid` |
| FishCrew Google Play internal testing | READY | `FishCrew Android 1`, Available to internal testers, Full rollout |
| ShutterBid Google Play internal testing | READY | `ShutterBid Android 1`, Available to internal testers, Full rollout |
| FishCrew Google Play app name/short/full description | READY | Name, short description, and full description are populated |
| Support URL reachable | READY | `https://macksims-public-site.netlify.app/support/` returned HTTP 200 |
| Privacy Policy URL reachable | READY | `https://macksims-public-site.netlify.app/privacy/` returned HTTP 200 |
| Terms URL reachable | READY | `https://macksims-public-site.netlify.app/terms/` returned HTTP 200 |
| Account deletion URL reachable | READY | `https://macksims-public-site.netlify.app/account-deletion/` returned HTTP 200 |
| FishCrew public route reachable | READY | `https://fishcrew.macksims.com` returned HTTP 200 |
| ShutterBid public route reachable | BLOCKED | Earlier audit recorded HTTP 200, but Pass 005 live capture of `https://macksims.com/shutterbid` showed `Site not found` |
| Account deletion public workflow | IN PROGRESS | Public page is manual/informational: user emails `support@macksims.com`; in-app/backend deletion not confirmed |
| Store copy drafts | IN PROGRESS | Editable drafts exist; FishCrew Play descriptions populated, ShutterBid Play descriptions blank |
| Reviewer note drafts | IN PROGRESS | Draft walkthroughs exist; demo access still required |
| Screenshot checklists | READY | Shot lists exist; console uploads still need confirmation |
| Privacy owner questionnaires | READY | Created for FishCrew and ShutterBid; all unanswered items remain `NEEDS OWNER CONFIRMATION` |
| Screenshot plans | READY | Created for FishCrew and ShutterBid; screenshots remain blocked until captured/uploaded |
| Store form drafts | READY | Created for FishCrew and ShutterBid; unconfirmed answers remain `NEEDS OWNER CONFIRMATION` |
| Screenshot execution checklists | READY | Created for FishCrew and ShutterBid; Pass 005 local captures exist for public/support-safe route candidates, but no captures are upload-ready |
| Screenshot output folders | READY | Per-app `screenshots/apple` and `screenshots/google-play` folders created |
| Owner decision tables | READY | Added to both `STORE_FORM_DRAFTS.md` files; all privacy categories remain `NEEDS OWNER CONFIRMATION` |
| ShutterBid Play listing draft | IN PROGRESS | Draft short description, full description, and privacy URL candidate added for owner review only |
| Screenshot capture review | READY | `SCREENSHOT_CAPTURE_REVIEW.md` created with local capture paths, sizes, statuses, and quality notes |

## Shared Blockers

| Blocker | FishCrew | ShutterBid | Next action |
| --- | --- | --- | --- |
| App Store Connect access | READY | READY | Logged-in browser retry succeeded |
| Apple bundle ID | READY | READY | FishCrew: `com.chrissims.fishcrew`; ShutterBid: `com.chrissims.shutterbid`; do not change |
| Package name | READY | READY | FishCrew: `com.chrissims.fishcrew`; ShutterBid: `com.chrissims.shutterbid`; do not change |
| iOS build upload | READY | READY | TestFlight builds uploaded and Approved for both apps |
| App Store submission build selected | BLOCKED | BLOCKED | Both App Store version pages show `Add Build`; no build selected for App Review submission |
| Android AAB upload | READY | READY | AABs are uploaded and Active in Play Console |
| TestFlight tester status | IN PROGRESS | IN PROGRESS | Internal groups confirmed; FishCrew external group label corrected to `FishCrew Testers` and has 0 testers / 1 build; ShutterBid external group shows no tester count |
| Google Play testing status | READY | READY | Internal testing available to internal testers for both apps |
| App Privacy answers | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Both Apple App Privacy pages show `Get Started`; Apple Privacy Policy URL/User Privacy Choices URL show blank/dash values |
| Google Data safety answers | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed data answers required |
| Screenshots/assets uploaded | IN PROGRESS | IN PROGRESS | FishCrew: **3 READY**; ShutterBid: **3 READY** mobile-shell (Pass 010 post-job clean); upload **WAITING OWNER APPROVAL**; not uploaded; app icon/feature graphic/tablet assets still missing |
| Reviewer/demo access | IN PROGRESS | IN PROGRESS | FishCrew Apple sign-in required is unchecked; ShutterBid Apple sign-in required is checked and credentials are present in console, password not recorded |
| Console URL fields | IN PROGRESS | BLOCKED | FishCrew Apple/Play support and Play privacy populated, but Apple App Privacy URL is blank; ShutterBid Apple Marketing URL corrected, but Play privacy URL and Apple App Privacy URL are blank |
| Account deletion behavior | IN PROGRESS | IN PROGRESS | Public workflow is manual email/support request; in-app/backend deletion still needs owner confirmation |

## Privacy + Asset Prep Pass 002

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Apple App Privacy questionnaire | READY | READY | Owner-answer checklist created; all form answers remain `NEEDS OWNER CONFIRMATION` |
| Google Data Safety questionnaire | READY | READY | Owner-answer checklist created; all Data Safety answers remain `NEEDS OWNER CONFIRMATION` |
| Privacy questions still unresolved | BLOCKED | BLOCKED | Account/login, name, email, profile info, photos/media, location, messages/chat, UGC, payments, diagnostics, analytics, ads/tracking, third-party sharing, deletion path, and identity linkage |
| Screenshot plan | READY | READY | Separate `SCREENSHOT_PLAN.md` created for each app |
| Apple screenshot uploads | BLOCKED | BLOCKED | 0 of 10 iPhone screenshots in both Apple version pages |
| Google Play assets | BLOCKED | BLOCKED | Play screenshots, app icon, and feature graphic missing for both apps |
| Account deletion workflow | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Public URL is live; confirm manual support-based, in-app request-based, or backend self-service deletion |
| Reviewer/demo access | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | FishCrew sign-in required unchecked; ShutterBid sign-in required checked; never write real passwords into docs |

## Screenshot Scene Plans

| App | Planned Scenes |
| --- | --- |
| FishCrew | Home/local fishing hub; Explore/local water activity; Weather or Port Window; Feed/trip activity; Profile; Tools/guides; Auth/onboarding if needed; Public route/support-safe view if needed |
| ShutterBid | Home/marketplace value; Client post-job flow; Photographer profile or portfolio; Bidding/job details; Client dashboard; Photographer bookings/workload; Admin/moderation if appropriate; Public route/support-safe view if needed |

## Owner Answers + Screenshot Execution Pass 003

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Store-form draft doc | READY | READY | `STORE_FORM_DRAFTS.md` created for each app |
| Apple App Privacy draft answers | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Drafts created without inventing data collection answers |
| Google Data Safety draft answers | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Drafts created without inventing collection/sharing/deletion answers |
| Reviewer/demo access draft | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | FishCrew sign-in unchecked; ShutterBid sign-in checked; real passwords not documented |
| Account deletion workflow draft | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Public URL exists; actual workflow unconfirmed |
| Screenshot execution checklist | READY | READY | `SCREENSHOT_EXECUTION_CHECKLIST.md` created for each app |
| Screenshot capture status | NOT CAPTURED | NOT CAPTURED | No Apple or Google Play screenshots captured/uploaded in this pass |
| Asset blockers | BLOCKED | BLOCKED | See per-app asset checklist rows |

## Asset Capture + Owner Decision Pass 004

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Screenshot output folders | READY | READY | Created `screenshots/apple` and `screenshots/google-play` for each app |
| Owner privacy decision sheet | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Added category table with `YES`, `NO`, or `NEEDS OWNER CONFIRMATION`; no `YES`/`NO` answers are owner-confirmed |
| Account deletion decision | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Public URL confirmed available; actual deletion method and compliance readiness remain unconfirmed |
| Reviewer/demo access decision | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | FishCrew guest/login/demo needs unknown; ShutterBid Apple ASC login required, Play access still unknown; no passwords recorded |
| Route/screen confirmation | BLOCKED | BLOCKED | Pass 004 reviewed public/support-safe candidates; Pass 005 supersedes this with FishCrew `NEEDS RETAKE` and ShutterBid `REJECT`; app-specific native scenes still need route/screen confirmation |
| Screenshot capture readiness | IN PROGRESS | IN PROGRESS | FishCrew: 1 READY TO CAPTURE, 2 NEEDS TEST DATA, 1 NEEDS LOGIN, 4 NEEDS OWNER REVIEW, 0 NOT AVAILABLE. ShutterBid: 1 READY TO CAPTURE, 1 NEEDS TEST DATA, 4 NEEDS LOGIN, 1 NEEDS OWNER REVIEW, 1 NOT AVAILABLE |
| Screenshot capture status | NOT CAPTURED | NOT CAPTURED | No screenshots captured or uploaded in Pass 004 |
| ShutterBid Play listing draft | NOT APPLICABLE | DRAFT - OWNER REVIEW REQUIRED | Draft short description, full description, and privacy URL candidate added to ShutterBid `STORE_FORM_DRAFTS.md`; not entered into Play |
| Asset blockers | BLOCKED | BLOCKED | App icons, Apple screenshots, Play screenshots, feature graphics, category/contact fields remain blocked; ShutterBid also needs Play privacy URL and descriptions approved/entered |

## Route/Test Data + Screenshot Capture Pass 005

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Capture attempted | YES | YES | Only public/support-safe route candidates were captured locally |
| App-specific route confirmation | BLOCKED | BLOCKED | Native app scenes still need route/screen confirmation before capture |
| Public/support-safe route result | NEEDS RETAKE | REJECT | FishCrew route loaded but has beta/banner/layout/dimension issues; ShutterBid route showed `Site not found` |
| Captured Apple file | NEEDS RETAKE | REJECT | FishCrew: `apps/fishcrew/screenshots/apple/NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png`; ShutterBid: `apps/shutterbid/screenshots/apple/REJECT-shutterbid-public-route-site-not-found-1242x2688.png` |
| Captured Google Play file | NEEDS RETAKE | REJECT | FishCrew: `apps/fishcrew/screenshots/google-play/NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png`; ShutterBid: `apps/shutterbid/screenshots/google-play/REJECT-shutterbid-public-route-site-not-found-1242x2688.png` |
| Screenshot dimensions | NEEDS RETAKE | READY SIZE / REJECT CONTENT | FishCrew captured at `1227 x 2688`; ShutterBid captured at `1242 x 2688` but content is wrong |
| READY captured screenshots | 0 | 0 | No captured files are ready for upload |
| NEEDS RETAKE captured screenshots | 2 | 0 | FishCrew Apple and Play copies need retake |
| REJECT captured screenshots | 0 | 2 | ShutterBid Apple and Play copies rejected |
| Minimum safe test data | IN PROGRESS | IN PROGRESS | Documented in each app screenshot checklist; local/demo data is OK only after owner confirmation |
| Screenshot upload status | NOT UPLOADED | NOT UPLOADED | No screenshots were uploaded to App Store Connect or Google Play |

## Apple Submission-Prep Checklist

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Confirmed identity | READY | READY | FishCrew: ASC `6783567028`, bundle `com.chrissims.fishcrew`; ShutterBid: ASC `6783551944`, bundle `com.chrissims.shutterbid` |
| Confirmed TestFlight build | READY | READY | FishCrew `1.0 (20260624034852)` Approved; ShutterBid `1.0 (20260624035226)` Approved |
| Build selected for App Review | NOT DONE | NOT DONE | Both App Store version pages show `Add Build` |
| Screenshots uploaded | NOT DONE | NOT DONE | Both iPhone 6.5-inch areas show 0 of 10 screenshots; accepted sizes shown: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| App Privacy completed | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Both App Privacy pages show `Get Started`; do not submit privacy forms without owner-confirmed answers |
| Reviewer notes/demo access | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | FishCrew sign-in required is unchecked; ShutterBid sign-in required is checked and credentials are in console; docs must use `DO_NOT_COMMIT_PASSWORD` only |
| Console URL fields | NEEDS REVIEW | NEEDS REVIEW | ShutterBid Marketing URL corrected; Apple App Privacy URL/account deletion fields still need owner confirmation where supported |
| Ready to submit | NO | NO | Build selection, screenshots, privacy, and owner confirmations remain |

## Owner Actions

### FishCrew

- Confirm Apple App Privacy answers.
- Confirm reviewer/demo account requirements.
- Upload/select iPhone screenshots.
- Select approved TestFlight build `1.0 (20260624034852)` for App Review only after screenshots/privacy are ready.

### ShutterBid

- Confirm Apple App Privacy answers.
- Confirm reviewer/demo account requirements.
- Upload/select iPhone screenshots.
- Select approved TestFlight build `1.0 (20260624035226)` for App Review only after screenshots/privacy are ready.

## Google Play Confirmation Checklist

| Item | FishCrew | ShutterBid | Notes |
| --- | --- | --- | --- |
| Google Play app record exists | READY | READY | Existing records visible in Play Console |
| Package name | READY | READY | FishCrew `com.chrissims.fishcrew`; ShutterBid `com.chrissims.shutterbid` |
| AAB uploaded | READY | READY | FishCrew version code `1`; ShutterBid version code `1782330956` |
| Internal/closed/open testing track status | READY | READY | Internal testing available to internal testers |
| Data Safety status | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled during this pass; owner-confirmed data answers required |
| Privacy policy URL | READY | BLOCKED | FishCrew populated; ShutterBid blank |
| Account deletion URL | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Public URL live; Play App content/account-deletion field not directly confirmed |
| App icon | BLOCKED | BLOCKED | Play listing shows `Add assets` |
| Screenshots | BLOCKED | BLOCKED | Play listing shows `Add assets` |
| Feature graphic | BLOCKED | BLOCKED | Play listing shows `Add assets` |
| Short description | READY | BLOCKED | ShutterBid blank |
| Full description | READY | BLOCKED | ShutterBid blank |
| Contact details | BLOCKED | BLOCKED | Store settings show no visible email/phone/website values for both apps |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION | NEEDS OWNER CONFIRMATION | Play App content/app-access field not directly confirmed; confirm before submission |

## Google Play Owner Console Action Pass 001 Snapshot

| Field | FishCrew | ShutterBid |
| --- | --- | --- |
| Google Play app record exists | YES | YES |
| Package name | `com.chrissims.fishcrew` | `com.chrissims.shutterbid` |
| AAB uploaded | YES | YES |
| Latest version/build | Version code `1`, version name `1.0` | Version code `1782330956`, version name `1.0` |
| Testing track status | Internal testing, available to internal testers, full rollout | Internal testing, available to internal testers, full rollout |
| Data Safety status | UNKNOWN; owner confirmation required | UNKNOWN; owner confirmation required |
| Privacy policy URL | `https://macksims-public-site.netlify.app/privacy/` | NO; field blank |
| Account deletion URL | UNKNOWN; Play field not directly confirmed | UNKNOWN; Play field not directly confirmed |
| App icon uploaded | NO | NO |
| Screenshots uploaded | NO | NO |
| Feature graphic uploaded | NO | NO |
| Short description populated | YES | NO |
| Full description populated | YES | NO |
| Category populated | NO | NO |
| Contact details populated | NO | NO |
| App access/reviewer instructions populated | UNKNOWN | UNKNOWN |

## FishCrew-Specific Blockers

| Blocker | Status | Notes |
| --- | --- | --- |
| Location behavior | NEEDS OWNER CONFIRMATION | Confirm foreground/background, precise/approximate, storage, and sharing |
| Photos/camera/uploads | NEEDS OWNER CONFIRMATION | Confirm permission and storage behavior |
| UGC/social/feed moderation | NEEDS OWNER CONFIRMATION | Confirm reporting, blocking, and admin tools |
| Messaging | NEEDS OWNER CONFIRMATION | Confirm whether active in submitted build |
| Weather/maps providers | NEEDS OWNER CONFIRMATION | Confirm providers and data sent to them |
| Notifications | NEEDS OWNER CONFIRMATION | Confirm whether active and which provider is used |
| Google Play category | BLOCKED | Store settings show `Select a category` |
| Google Play contact fields | BLOCKED | Store settings show Email address, Phone number, and Website with no visible values |
| Google Play listing assets | BLOCKED | App icon, feature graphic, phone screenshots, and tablet screenshots are missing |
| Apple submission build selection | BLOCKED | App Store version page shows `Add Build` |
| Apple screenshots | BLOCKED | iPhone 6.5-inch area shows 0 of 10 screenshots |
| FishCrew public screenshot retake | BLOCKED | Pass 005 local capture shows beta/testing banner, repeated/sticky tall-viewport layout, and `1227 x 2688` size |
| FishCrew TestFlight external group label | READY | Renamed from `ShutterBid Testers` to `FishCrew Testers` during Owner Console Action Pass 001 |

## ShutterBid-Specific Blockers

| Blocker | Status | Notes |
| --- | --- | --- |
| Client/photographer role data | NEEDS OWNER CONFIRMATION | Confirm fields, visibility, and access rules |
| Photo uploads/portfolio | NEEDS OWNER CONFIRMATION | Confirm camera/photo library, upload, storage, and deletion |
| Jobs/bids marketplace scope | NEEDS OWNER CONFIRMATION | Confirm live/demo/preview status |
| Contact/messaging behavior | NEEDS OWNER CONFIRMATION | Confirm direct messaging vs contact/request flow |
| Business/venue profiles | NEEDS OWNER CONFIRMATION | Confirm fields, approval, and visibility |
| Admin approval/moderation | NEEDS OWNER CONFIRMATION | Confirm trust flow, reporting, blocking, and admin tooling |
| Payments/commerce | NEEDS OWNER CONFIRMATION | Do not claim payments, escrow, contracts, payouts, or verified bookings unless active and reviewed |
| Google Play short description | BLOCKED | Blank in default store listing |
| Google Play full description | BLOCKED | Blank in default store listing |
| Google Play Privacy Policy URL | BLOCKED | Blank in Play Console privacy policy field |
| Google Play listing assets | BLOCKED | App icon, feature graphic, phone screenshots, and tablet screenshots are missing |
| Google Play category/contact fields | BLOCKED | Store settings show `Select a category` and no visible email/phone/website values |
| Apple submission build selection | BLOCKED | App Store version page shows `Add Build` |
| Apple screenshots | BLOCKED | iPhone 6.5-inch area shows 0 of 10 screenshots |
| Public route screenshot | BLOCKED | Pass 005 live route capture showed `Site not found`; captured file is rejected |
| Apple Marketing URL | READY | Corrected and saved as `https://macksims.com/shutterbid` during Owner Console Action Pass 001 |
| Apple reviewer credentials | OWNER ACTION REQUIRED | Sign-in required is checked and credentials are populated in App Store Connect; docs must use `DO_NOT_COMMIT_PASSWORD` only |

## Recommended Order

1. Select uploaded TestFlight builds on each App Store version page before App Review; both currently show `Add Build`.
2. Complete Pass 004/005 owner decision sheets for privacy, account deletion, reviewer/demo access, screenshot routes, login state, and test data.
3. Fix or replace rejected/retake screenshot routes before any upload: FishCrew needs a polished retake target; ShutterBid public route currently shows `Site not found`.
4. Upload required Apple and Google Play screenshots/assets only after routes/screens and demo data are owner-approved.
5. Complete Google Play listing blockers: FishCrew category/contact/assets; ShutterBid short/full description, privacy URL, category/contact, and assets.
6. Complete Apple App Privacy and Google Data safety owner review for FishCrew and ShutterBid.
7. Confirm reviewer/demo account requirements without committing or repeating passwords.
8. Confirm Apple App Privacy URLs/answers and Play account-deletion/app-access fields.
9. Confirm whether manual email account deletion is acceptable, or document in-app/backend deletion if it exists.
