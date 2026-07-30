# FishCrew - Next Actions

## July 2, 2026 Confirmation Summary

- Google Play existing record confirmed: FishCrew, package `com.chrissims.fishcrew`.
- Google Play Android AAB confirmed: version code `1`, version name `1.0`, uploaded Jun 24, 2026, Active.
- Google Play testing confirmed: Internal testing, Available to internal testers, Full rollout.
- Google Play listing text confirmed populated: app name, short description, full description.
- Google Play listing blockers: app icon, feature graphic, phone screenshots, tablet screenshots, category, and contact fields.
- Google Play Privacy Policy URL confirmed populated: `https://macksims-public-site.netlify.app/privacy/`.
- Google Play Data safety status: NEEDS OWNER CONFIRMATION; Play App content/Data Safety route stalled during Owner Console Action Pass 001.
- App Store Connect retry confirmed existing Apple app record: FishCrew, App Store Connect app ID `6783567028`.
- Apple bundle ID confirmed from build metadata: `com.chrissims.fishcrew`.
- Apple TestFlight upload confirmed: latest build `1.0 (20260624034852)`, uploaded Jun 23, 2026 at 11:51 PM, Approved.
- Apple TestFlight groups confirmed: internal `FishCrew Testers` has 1 tester; external group was safely renamed from `ShutterBid Testers` to `FishCrew Testers` and has 0 testers / 1 build.
- Apple App Store version metadata confirmed populated: promotional text, description, keywords, support URL, marketing URL, version, copyright, contact info, and review notes.
- Apple App Store submission blocker: version page shows `Add Build`, so no build is selected for App Review submission.
- Apple screenshot blocker: iPhone 6.5-inch area shows 0 of 10 screenshots; accepted sizes shown are `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284`.
- Apple App Privacy status: NEEDS OWNER CONFIRMATION; page shows `Get Started`, with blank/dash Privacy Policy URL and User Privacy Choices URL.
- Account deletion workflow: public URL present; current workflow is manual email/support request, not confirmed in-app/backend deletion.
- Pass 004 screenshot output folders created: `screenshots/apple` and `screenshots/google-play`.
- Pass 004 screenshot readiness: 1 public/support-safe scene is `READY TO CAPTURE`; all app-specific scenes still need route/screen, login, test-data, or owner review before capture.
- Pass 004 owner decision sheets added to `STORE_FORM_DRAFTS.md`; no privacy answers were guessed.
- Pass 005 capture result: public/support-safe route was captured locally but marked `NEEDS RETAKE`; no screenshots were uploaded.
- Pass 005 blocker: FishCrew capture shows visible beta/testing banner, repeated/sticky tall-viewport layout, and `1227 x 2688` size instead of accepted Apple width.

## App Store Connect

1. Do not create a duplicate Apple app record.
2. Do not change bundle ID `com.chrissims.fishcrew`.
3. Review `STORE_FORM_DRAFTS.md` and fill owner-confirmed privacy answers only.
4. Complete `PRIVACY_OWNER_QUESTIONNAIRE.md`; App Privacy is not started in ASC and must not be submitted without owner-confirmed data details.
5. Review `SCREENSHOT_EXECUTION_CHECKLIST.md`; app-specific scenes need route/screen confirmation before capture, and the public/support-safe capture currently needs retake.
6. Review `SCREENSHOT_PLAN.md`; visible iPhone 6.5-inch slot currently shows 0 of 10 screenshots.
7. Select an uploaded build for App Review only after screenshots and privacy are ready; the App Store version currently shows `Add Build`.
8. Confirm App Information fields, including SKU/category/age rating if needed; readable App Information fields were not confirmed.
9. Review TestFlight group setup: latest approved build is assigned to internal `FishCrew Testers` and external `FishCrew Testers`; external group currently has 0 testers.
10. Confirm reviewer/demo access expectations; App Store version has sign-in required unchecked.
11. Confirm Apple privacy/account deletion URL fields where supported.
12. Use `screenshots/apple` and `screenshots/google-play` for owner-approved captures only.

## Privacy Owner Questionnaire

All questionnaire answers are `NEEDS OWNER CONFIRMATION` in `PRIVACY_OWNER_QUESTIONNAIRE.md`, including account/login, name, email, profile info, photos/media, location, messages/chat, UGC, payments, diagnostics, analytics, advertising/tracking, third-party sharing, deletion path, and whether data is linked to identity.

## Apple Submission-Prep Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Confirmed identity | READY | FishCrew, ASC app ID `6783567028`, bundle ID `com.chrissims.fishcrew` |
| Confirmed TestFlight build | READY | `1.0 (20260624034852)`, Approved |
| Build selected for App Review | NOT DONE | App Store version page shows `Add Build` |
| Screenshots uploaded | NOT DONE | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| App Privacy completed | NEEDS OWNER CONFIRMATION | ASC App Privacy page shows `Get Started`; owner must confirm Apple App Privacy answers and Apple privacy URL |
| Reviewer notes/demo access | NEEDS OWNER CONFIRMATION | Confirm whether demo/reviewer access is required |
| Console URL fields | NEEDS REVIEW | Confirm privacy/account deletion URL fields where supported |
| Ready to submit | NO | Build selection, screenshots, privacy, and owner confirmations remain |

## Google Play Console

1. Do not change package name `com.chrissims.fishcrew`.
2. Keep existing AAB/release intact unless explicitly instructed later.
3. Complete Google Data Safety owner questionnaire before editing Play forms.
4. Fill missing category; currently blocked at `Select a category`.
5. Fill missing store contact fields; Email address, Phone number, and Website showed no visible values.
6. Upload app icon, feature graphic, phone screenshots, and tablet screenshots from the exact current build after owner approves screenshot plan.
7. Confirm or complete Google Play Data Safety; Play App content route stalled in this pass, and privacy answers must not be submitted until owner confirms them.
8. Confirm Play support/account deletion fields if present; public URLs are live but not confirmed in console fields.
9. Confirm whether the manual email account-deletion workflow is acceptable for Play policy.

## Screenshot Plan

Use `SCREENSHOT_PLAN.md` for 8 planned scenes: home/local fishing hub, explore/local water activity, weather or Port Window, feed/trip activity, profile, tools/guides, auth/onboarding if needed, and public route/support-safe view if needed.

## Screenshot Execution Checklist

FishCrew public/support-safe scene has a local capture marked `NEEDS RETAKE`. All app-specific scenes remain uncaptured. Capture only after owner approves demo data, login/guest state, privacy answers, and route/screen confirmation.

Pass 004 readiness:

| Readiness | Count | Scenes |
| --- | --- | --- |
| READY TO CAPTURE | 0 | None |
| NEEDS TEST DATA | 2 | Explore / local water activity; Feed / trip activity |
| NEEDS LOGIN | 1 | Profile |
| NEEDS OWNER REVIEW | 4 | Home / local fishing hub; Weather or Port Window; Tools / guides; Auth or onboarding if needed |
| DEFER | 1 | Public route / support-safe view if needed |
| NOT AVAILABLE | 0 | None |

Captured files needing retake:

| Store Folder | File | Size | Reason |
| --- | --- | --- | --- |
| Apple | `screenshots/apple/NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png` | `1227 x 2688` | Visible beta/testing banner, repeated/sticky tall-viewport layout, wrong Apple width |
| Google Play | `screenshots/google-play/NEEDS_RETAKE-fishcrew-public-route-beta-banner-1242x2688.png` | `1227 x 2688` | Same capture copied for Play review; do not upload |

## Google Play Confirmation Checklist

| Item | Status |
| --- | --- |
| Google Play app record exists | READY |
| Package name | READY |
| AAB uploaded | READY |
| Internal/closed/open testing track status | READY |
| Data Safety status | NEEDS OWNER CONFIRMATION |
| Privacy policy URL | READY |
| Account deletion URL | NEEDS OWNER CONFIRMATION |
| App icon | BLOCKED |
| Screenshots | BLOCKED |
| Feature graphic | BLOCKED |
| Short description | READY |
| Full description | READY |
| Contact details | BLOCKED |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION |

## Owner Decisions Needed

- Confirm location, photos/camera/uploads, UGC, messaging, weather/maps, notifications, moderation, and account deletion behavior.
- Complete the Pass 004 owner privacy decision sheet in `STORE_FORM_DRAFTS.md` using only `YES`, `NO`, or `NEEDS OWNER CONFIRMATION`.
- Confirm app-specific route/screen availability for screenshot scenes 1-7.
- Confirm required demo/test data for scenes marked `NEEDS TEST DATA`.
- Confirm whether the Profile scene requires a demo login and whether reviewer access can be guest-only.
- Confirm whether to remove/hide beta/testing banner for store screenshots or replace the public/support-safe scene.
- Retake public/support-safe capture at an Apple accepted size after route/layout is store-polished.
- Confirm whether beta/testing language should remain in public store copy.
- Confirm support contact and demo account strategy; FishCrew ASC sign-in required is currently unchecked, but actual app login behavior still needs owner confirmation.
- Confirm whether deletion is manual support-based, in-app request-based, or backend self-service.

## Immediate Checklist

- [x] Access App Store Connect.
- [x] Confirm bundle ID: `com.chrissims.fishcrew`.
- [x] Confirm package name: `com.chrissims.fishcrew`.
- [x] Confirm iOS build uploaded: `1.0 (20260624034852)`.
- [x] Confirm Android AAB uploaded: version code `1`, version name `1.0`.
- [x] Confirm TestFlight build status: Approved.
- [ ] Select App Store version build for review.
- [x] Confirm Google Play internal testing active.
- [ ] Complete privacy/data safety owner review.
- [ ] Fill `STORE_FORM_DRAFTS.md` owner-answer fields.
- [ ] Fill the Pass 004 owner decision sheet.
- [ ] Confirm screenshot route/screen availability.
- [ ] Confirm screenshot demo/test data and login state.
- [x] Capture 3 Pass 006 local screenshots (home, explore, feed) — Pass 007 visual review complete.
- [ ] Owner confirms `fishcrew-static-v070` matches submitted TestFlight/Play build before upload.
- [ ] Owner signs final approval board in `OWNER_ASSET_APPROVAL_DECISIONS.md` after confirming **LIKELY MATCH** for v0.7.0 vs build `20260624034852`.
- [ ] Owner signs `ASSET_UPLOAD_PACKAGE_CHECKLIST.md` before any Apple/Play screenshot upload.
- [ ] Retake FishCrew public/support-safe screenshot before upload.
- [ ] Upload/confirm screenshots/assets in both consoles.
- [ ] Confirm reviewer/demo account path without committing passwords.
- [ ] Confirm account deletion workflow before claiming compliance.
