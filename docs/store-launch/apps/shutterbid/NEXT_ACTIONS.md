# ShutterBid - Next Actions

## July 2, 2026 Confirmation Summary

- Google Play existing record confirmed: ShutterBid, package `com.chrissims.shutterbid`.
- Google Play Android AAB confirmed: version code `1782330956`, version name `1.0`, uploaded Jun 24, 2026, Active.
- Google Play testing confirmed: Internal testing, Available to internal testers, Full rollout.
- Google Play listing text blockers: short description and full description are blank.
- Google Play listing asset blockers: app icon, feature graphic, phone screenshots, and tablet screenshots.
- Google Play Privacy Policy URL blocker: field is blank.
- Google Play Data safety status: NEEDS OWNER CONFIRMATION; Play App content/Data Safety route stalled during Owner Console Action Pass 001.
- App Store Connect retry confirmed existing Apple app record: ShutterBid, App Store Connect app ID `6783551944`.
- Apple bundle ID confirmed from build metadata: `com.chrissims.shutterbid`.
- Apple TestFlight upload confirmed: latest build `1.0 (20260624035226)`, uploaded Jun 23, 2026 at 11:55 PM, Approved.
- Apple TestFlight groups confirmed: internal `ShutterBid Testers` has 1 tester; external `ShutterBid Testers` shows no tester count.
- Apple App Store version metadata confirmed populated: promotional text, description, keywords, support URL, version, copyright, contact info, and review notes.
- Apple App Store submission blocker: version page shows `Add Build`, so no build is selected for App Review submission.
- Apple screenshot blocker: iPhone 6.5-inch area shows 0 of 10 screenshots; accepted sizes shown are `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284`.
- Apple Marketing URL corrected and saved as `https://macksims.com/shutterbid`.
- Apple reviewer access: sign-in required is checked and reviewer credential fields are populated; docs must use `DO_NOT_COMMIT_PASSWORD` only.
- Apple App Privacy status: NEEDS OWNER CONFIRMATION; page shows `Get Started`, with blank/dash Privacy Policy URL and User Privacy Choices URL.
- Account deletion workflow: public URL present; current workflow is manual email/support request, not confirmed in-app/backend deletion.
- Pass 004 screenshot output folders created: `screenshots/apple` and `screenshots/google-play`.
- Pass 004 screenshot readiness: 1 public/support-safe scene is `READY TO CAPTURE`; app-specific scenes still need route/screen, login, test-data, or owner review before capture; admin/moderation is `NOT AVAILABLE` unless explicitly approved.
- Pass 004 owner decision sheets added to `STORE_FORM_DRAFTS.md`; no privacy answers were guessed.
- Pass 004 Google Play listing draft added for owner review only; it was not entered into Play.
- Pass 005 capture result: public/support-safe route was captured locally but marked `REJECT`; live route showed `Site not found`.
- Pass 005 blocker: ShutterBid public route must be fixed/replaced before store screenshots can use it; no screenshots were uploaded.

## App Store Connect

1. Do not create a duplicate Apple app record.
2. Do not change bundle ID `com.chrissims.shutterbid`.
3. Review `STORE_FORM_DRAFTS.md` and fill owner-confirmed privacy answers only.
4. Complete `PRIVACY_OWNER_QUESTIONNAIRE.md`; App Privacy is not started in ASC and must not be submitted without owner-confirmed data details.
5. Review `SCREENSHOT_EXECUTION_CHECKLIST.md`; app-specific scenes need route/screen confirmation before capture, and the public/support-safe capture is rejected because the live route showed `Site not found`.
6. Review `SCREENSHOT_PLAN.md`; visible iPhone 6.5-inch slot currently shows 0 of 10 screenshots.
7. Select an uploaded build for App Review only after screenshots and privacy are ready; the App Store version currently shows `Add Build`.
8. Apple Marketing URL is corrected to `https://macksims.com/shutterbid`.
9. Confirm App Information fields, including SKU/category/age rating if needed; readable App Information fields were not confirmed.
10. Confirm reviewer/demo access outside repo. Sign-in is required and credentials are present in App Store Connect; use `DO_NOT_COMMIT_PASSWORD` in docs and do not commit or reveal passwords.
11. Confirm Apple privacy/account deletion URL fields where supported.
12. Use `screenshots/apple` and `screenshots/google-play` for owner-approved captures only.

## Privacy Owner Questionnaire

All questionnaire answers are `NEEDS OWNER CONFIRMATION` in `PRIVACY_OWNER_QUESTIONNAIRE.md`, including account/login, name, email, profile info, photos/media, location, messages/chat, UGC, payments, diagnostics, analytics, advertising/tracking, third-party sharing, deletion path, and whether data is linked to identity.

## Apple Submission-Prep Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Confirmed identity | READY | ShutterBid, ASC app ID `6783551944`, bundle ID `com.chrissims.shutterbid` |
| Confirmed TestFlight build | READY | `1.0 (20260624035226)`, Approved |
| Build selected for App Review | NOT DONE | App Store version page shows `Add Build` |
| Screenshots uploaded | NOT DONE | iPhone 6.5-inch screenshot area shows 0 of 10 screenshots; accepted sizes: `1242 x 2688`, `2688 x 1242`, `1284 x 2778`, or `2778 x 1284` |
| App Privacy completed | NEEDS OWNER CONFIRMATION | ASC App Privacy page shows `Get Started`; owner must confirm Apple App Privacy answers and Apple privacy URL |
| Reviewer notes/demo access | NEEDS OWNER CONFIRMATION | Sign-in is required and credentials are in console; docs must use `DO_NOT_COMMIT_PASSWORD` only |
| Console URL fields | NEEDS REVIEW | Marketing URL corrected; confirm privacy/account deletion URL fields where supported |
| Ready to submit | NO | Build selection, screenshots, privacy, URL review, and owner confirmations remain |

## Google Play Console

1. Do not change package name `com.chrissims.shutterbid`.
2. Keep existing AAB/release intact unless explicitly instructed later.
3. Complete Google Data Safety owner questionnaire before editing Play forms.
4. Fill short description and full description; both are blank.
5. Add Privacy Policy URL; current field is blank.
6. Review the Pass 004 Google Play listing draft in `STORE_FORM_DRAFTS.md`; do not enter it until owner approves the copy and privacy URL candidate.
7. Fill category and store contact fields; store settings shows `Select a category` and no visible email/phone/website values.
8. Upload app icon, feature graphic, phone screenshots, and tablet screenshots from the exact current build after owner approves screenshot plan.
9. Confirm or complete Google Play Data Safety; Play App content route stalled in this pass, and privacy answers must not be submitted until owner confirms them.
10. Confirm Play support/account deletion fields if present; public URLs are live but not confirmed in console fields.
11. Confirm whether the manual email account-deletion workflow is acceptable for Play policy.

## Screenshot Plan

Use `SCREENSHOT_PLAN.md` for 8 planned scenes: home/marketplace value, client post-job flow, photographer profile or portfolio, bidding/job details, client dashboard, photographer bookings/workload, admin/moderation if appropriate, and public route/support-safe view if needed.

## Screenshot Execution Checklist

ShutterBid public/support-safe scene has a local capture marked `REJECT`. All app-specific scenes remain uncaptured. Capture only after owner approves demo data, login/guest state, privacy answers, and route/screen confirmation.

Pass 004 readiness:

| Readiness | Count | Scenes |
| --- | --- | --- |
| READY TO CAPTURE | 0 | None |
| NEEDS TEST DATA | 1 | Photographer profile or portfolio |
| NEEDS LOGIN | 4 | Client post-job flow; Bidding / job details; Client dashboard; Photographer bookings/workload |
| NEEDS OWNER REVIEW | 1 | Home / marketplace value |
| NOT AVAILABLE | 2 | Admin/moderation if appropriate; Public route / support-safe view if needed |

Rejected captured files:

| Store Folder | File | Size | Reason |
| --- | --- | --- | --- |
| Apple | `screenshots/apple/REJECT-shutterbid-public-route-site-not-found-1242x2688.png` | `1242 x 2688` | Live route showed `Site not found`; wrong page |
| Google Play | `screenshots/google-play/REJECT-shutterbid-public-route-site-not-found-1242x2688.png` | `1242 x 2688` | Same rejected capture copied for Play review; do not upload |

## Google Play Confirmation Checklist

| Item | Status |
| --- | --- |
| Google Play app record exists | READY |
| Package name | READY |
| AAB uploaded | READY |
| Internal/closed/open testing track status | READY |
| Data Safety status | NEEDS OWNER CONFIRMATION |
| Privacy policy URL | BLOCKED |
| Account deletion URL | NEEDS OWNER CONFIRMATION |
| App icon | BLOCKED |
| Screenshots | BLOCKED |
| Feature graphic | BLOCKED |
| Short description | BLOCKED |
| Full description | BLOCKED |
| Contact details | BLOCKED |
| App access/reviewer instructions | NEEDS OWNER CONFIRMATION |

## Owner Decisions Needed

- Confirm client/photographer roles, uploads/portfolio, jobs/bids, contact/messaging, business/venue profiles, admin approval/moderation, payments, and account deletion behavior.
- Complete the Pass 004 owner privacy decision sheet in `STORE_FORM_DRAFTS.md` using only `YES`, `NO`, or `NEEDS OWNER CONFIRMATION`.
- Confirm app-specific route/screen availability for screenshot scenes 1-7.
- Confirm required demo/test data and login state for scenes marked `NEEDS TEST DATA` or `NEEDS LOGIN`.
- Confirm whether the admin/moderation scene should remain excluded.
- Fix or replace the ShutterBid public/support-safe route before using it for store screenshots.
- Approve or revise the draft Google Play short description, full description, and privacy URL candidate before entering them in Play.
- Confirm whether beta/testing language should remain in public store copy.
- Confirm support contact and demo account strategy.
- Confirm whether deletion is manual support-based, in-app request-based, or backend self-service.

## Immediate Checklist

- [x] Access App Store Connect.
- [x] Confirm bundle ID: `com.chrissims.shutterbid`.
- [x] Confirm package name: `com.chrissims.shutterbid`.
- [x] Confirm iOS build uploaded: `1.0 (20260624035226)`.
- [x] Confirm Android AAB uploaded: version code `1782330956`, version name `1.0`.
- [x] Confirm TestFlight build status: Approved.
- [ ] Select App Store version build for review.
- [x] Confirm Google Play internal testing active.
- [ ] Complete privacy/data safety owner review.
- [ ] Fill `STORE_FORM_DRAFTS.md` owner-answer fields.
- [ ] Fill the Pass 004 owner decision sheet.
- [ ] Approve or revise the ShutterBid Play listing draft.
- [ ] Confirm screenshot route/screen availability.
- [ ] Confirm screenshot demo/test data and login state.
- [x] Capture 3 Pass 006 local screenshots (marketplace, job detail, post-job) — Pass 007 review complete.
- [ ] Owner confirms local captures represent submitted native build UI (not desktop web-only layout).
- [ ] Owner approves final 3-scene ShutterBid mobile set in `OWNER_ASSET_APPROVAL_DECISIONS.md` (home, job detail, post-job clean).
- [ ] Owner signs `OWNER_ASSET_APPROVAL_DECISIONS.md` and `ASSET_UPLOAD_PACKAGE_CHECKLIST.md` before upload.
- [ ] Fix `https://macksims.com/shutterbid` public route separately if store marketing URL is required.
- [ ] Upload/confirm screenshots/assets in both consoles.
- [ ] Confirm reviewer/demo account path without committing passwords.
- [ ] Confirm marketplace/payment/moderation scope before final copy or screenshots.
- [ ] Confirm account deletion workflow before claiming compliance.
