# MackSims Store Launch System

This folder is the reusable MackSims launch package for App Store Connect and Google Play Console preparation.

**Publisher / legal entity (all apps):** start with [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md) and paste answers from [`STORE_CONSOLE_PRIVACY_FILL.md`](./STORE_CONSOLE_PRIVACY_FILL.md).

**Paste-ready index:** [`CONSOLE_PASTE_INDEX.md`](./CONSOLE_PASTE_INDEX.md) · **Demo / App Review logins:** [`DEMO_REVIEW_LOGINS.md`](./DEMO_REVIEW_LOGINS.md)

It does not submit anything automatically. It is a documentation and readiness workflow for producing store copy, privacy answers, data safety answers, reviewer notes, screenshots, tester instructions, and release checklists for each MackSims app.

FishCrew and ShutterBid are treated as existing console records. Their folders are audit workflows for completing current App Store Connect and Google Play Console setup. Do not create duplicate app records, change bundle IDs, change package names, or create second listings for those apps without explicit owner approval.

## How To Use This System

1. Start with `PUBLISHER_LEGAL_ENTITY.md` + `STORE_CONSOLE_PRIVACY_FILL.md` (shared legal entity for every listing).
2. Open `STORE_LAUNCH_MASTER_CHECKLIST.md`.
3. Open the app folder under `apps/`.
4. For FishCrew and ShutterBid, start with the audit files:
   - `APP_STORE_CONNECT_AUDIT.md`
   - `GOOGLE_PLAY_CONSOLE_AUDIT.md`
   - `PRIVACY_DATA_STATUS.md`
   - `SCREENSHOT_STATUS.md`
   - `REVIEW_NOTES.md`
   - `TESTER_STATUS.md`
   - `SUBMISSION_BLOCKERS.md`
   - `NEXT_ACTIONS.md`
   - `STATUS.md`
4. For apps that are not yet store-ready, fill out each app file in this order:
   - `STATUS.md`
   - `APP_STORE_CONNECT.md`
   - `GOOGLE_PLAY_CONSOLE.md`
   - `PRIVACY_DATA.md`
   - `SCREENSHOTS.md`
   - `REVIEW_NOTES.md`
   - `RELEASE_NOTES.md`
5. Use the shared templates in this folder when creating or updating per-app docs.
6. Update `PER_APP_STATUS_TRACKER.md` after every meaningful change.

## What To Fill Out Per App

Each app needs confirmed answers for:

- App identity, category, bundle ID, package name, SKU, and version.
- Store listing copy for Apple and Google.
- Privacy Policy, Terms, Support, and Account Deletion URLs.
- Login providers, demo account needs, and reviewer access.
- Data collection, data use, data sharing, retention, deletion, and encryption answers.
- Permission use for location, camera, photos, contacts, notifications, Bluetooth, background activity, payments, user content, messaging, analytics, ads, and third-party APIs.
- Screenshots and asset inventory.
- Tester instructions and review notes.

## Before Store Submission

Before an app is moved from beta prep to store review, the owner must confirm:

- App Store Connect and Google Play Console app records exist, or the owner has explicitly approved creating them.
- Existing FishCrew and ShutterBid app records are audited rather than duplicated.
- Bundle ID and package name match the submitted builds.
- Native build artifacts are ready, signed, and tested.
- Store copy is final and does not overclaim unfinished features.
- Privacy and Data safety answers are complete and reviewed.
- All URLs are live and correct.
- Demo account or reviewer path works if login is required.
- Screenshots match the submitted build.
- Known risks and limitations are disclosed in reviewer notes when relevant.

## Moving From Beta To Store Review

Use this sequence:

1. Complete `PRIVACY_DATA.md` with owner-confirmed answers.
2. Confirm build identifiers, signing, and version numbers.
3. Complete Apple and Google console templates.
4. Run the smoke-test checklist on the exact build being submitted.
5. Capture screenshots from that build.
6. Finalize reviewer notes and demo access.
7. Confirm compliance declarations.
8. Submit manually through the store consoles.

## First Priority

Use this order for v001.1 work:

1. FishCrew existing console audit.
2. ShutterBid existing console audit.
3. Store copy, privacy/data safety, and reviewer note completion for both.
4. Screenshot checklist for both.
5. Tester instructions for both.
6. Reusable templates for the rest of MackSims apps.

## Information That Must Never Be Guessed

Never guess or invent:

- Privacy/data collection answers.
- Tracking or data sharing answers.
- Encryption, retention, or deletion behavior.
- Regulatory compliance claims.
- Third-party partnership claims.
- Payment, marketplace, broker, dispatch, safety, medical, financial, or emergency claims.
- Whether a permission is used by a native build.
- Whether a feature is live in production.

Use `NEEDS OWNER CONFIRMATION` when a fact is not verified. Use `TBD` for operational fields that have not been assigned yet.
