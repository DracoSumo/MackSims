# Store Launch Master Checklist

Use this checklist for every current and future MackSims app before App Store Connect or Google Play Console submission.

## Guardrails

- Do not submit anything automatically.
- Do not create duplicate app records.
- Do not change bundle IDs or package names without explicit owner approval.
- Do not expose secrets, API keys, certificates, credentials, private account data, or the company EIN on public listings.
- Use [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md) + [`STORE_CONSOLE_PRIVACY_FILL.md`](./STORE_CONSOLE_PRIVACY_FILL.md) for shared publisher, URL, sell/share/ads, and deletion SLA answers.
- Do not invent **app-specific** data-type answers beyond that shared pack — mark unknowns as `NEEDS OWNER CONFIRMATION`.
- Do not change app source code unless a store-readiness doc explicitly requires it.
- Mark unassigned operational items as `TBD`.
- Treat FishCrew and ShutterBid as existing App Store Connect / Google Play Console records.

## Phase 0 - Publisher entity (once for all apps)

- [x] Legal name: MackSims LLC
- [x] Address: 1211 Sweet Gum Drive, Brandon, FL 33511, United States
- [x] Privacy / support / account-deletion URLs on macksims.com
- [x] Copyright: (c) 2026 MackSims LLC
- [x] No sell / share / ads / tracking baseline
- [ ] Paste shared values into each App Store Connect + Play Console listing (manual)
- [ ] Redeploy `public-site` so updated `/privacy` and `/account-deletion` are live

## Phase 1 - App Identity

Collect and confirm:

- [ ] Existing console record status. For FishCrew and ShutterBid, this should be `EXISTING CONSOLE RECORDS`.
- [ ] App name.
- [ ] Subtitle or short description.
- [ ] Bundle ID.
- [ ] Package name.
- [ ] SKU.
- [ ] Primary category.
- [ ] Secondary category if applicable.
- [ ] Age rating target.
- [ ] Support URL.
- [ ] Marketing URL.
- [ ] Privacy Policy URL.
- [ ] Terms URL.
- [ ] Account deletion URL if accounts exist.
- [ ] Contact email.
- [ ] Demo account requirements.
- [ ] Login/auth providers.
- [ ] Whether the app has payments.
- [ ] Whether the app has user-generated content.
- [ ] Whether the app has messaging/chat.
- [ ] Whether the app has location.
- [ ] Whether the app uses camera/photos.
- [ ] Whether the app sends notifications.
- [ ] Whether the app collects analytics.
- [ ] Whether the app connects to third-party APIs.

## Phase 2 - Store Copy

Prepare:

- [ ] App name.
- [ ] Subtitle.
- [ ] Short description.
- [ ] Full description.
- [ ] Keywords.
- [ ] Promotional text.
- [ ] What's new.
- [ ] Beta tester summary.
- [ ] Support response copy.
- [ ] Review team notes.

Use plain, professional MackSims tone. Store copy must describe the submitted build, not an aspirational roadmap.

## Phase 3 - Privacy And Data Safety

Complete the privacy intake matrix for:

- [ ] Data collected.
- [ ] Data linked to user.
- [ ] Data used for tracking.
- [ ] Data shared with third parties.
- [ ] Purpose of collection.
- [ ] Whether data is optional or required.
- [ ] Whether data is encrypted in transit.
- [ ] Whether user can request deletion.
- [ ] Whether account deletion is supported.
- [ ] Whether the app uses ads or analytics.
- [ ] Whether the app uses location.
- [ ] Whether the app uses photos/camera.
- [ ] Whether the app uses contacts.
- [ ] Whether the app uses notifications.

Do not guess. Use `NEEDS OWNER CONFIRMATION` until the app owner, implementation owner, or policy owner confirms.

## Phase 4 - Build Artifacts

### iOS

- [ ] Apple Developer account ready.
- [ ] App Store Connect record audited if existing, or created only after owner approval.
- [ ] Bundle ID confirmed.
- [ ] Signing, certificates, and provisioning profiles confirmed.
- [ ] TestFlight build ready.
- [ ] App privacy completed.
- [ ] Review notes completed.
- [ ] Screenshots uploaded.
- [ ] App review info complete.
- [ ] Demo credentials added if needed.
- [ ] Export compliance answered.
- [ ] Manual submit for review.

### Android

- [ ] Google Play developer account ready.
- [ ] Google Play Console record audited if existing, or created only after owner approval.
- [ ] Package name confirmed.
- [ ] AAB build ready.
- [ ] Internal test track ready.
- [ ] Closed or open test plan ready if needed.
- [ ] Store listing complete.
- [ ] Data safety complete.
- [ ] App content declarations complete.
- [ ] Privacy policy linked.
- [ ] Screenshots uploaded.
- [ ] Release notes complete.
- [ ] Manual submit for review or testing.

## Phase 5 - Tester Readiness

Create:

- [ ] TestFlight tester instructions.
- [ ] Google Play internal or closed testing instructions.
- [ ] Known issues.
- [ ] Feedback form or support process.
- [ ] Smoke-test checklist.
- [ ] Demo account instructions if needed.
- [ ] Support contact.

## Phase 6 - Submission

Confirm:

- [ ] Pre-submit checklist complete.
- [ ] Review notes complete.
- [ ] Login/demo details verified.
- [ ] Feature walkthrough for reviewers complete.
- [ ] Contact person assigned.
- [ ] Risk flags reviewed.
- [ ] Final submit checklist complete.
- [ ] App submitted manually by authorized owner.
