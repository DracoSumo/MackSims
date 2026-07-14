# CoachCore — Store Launch Checklist

**Version:** v0.7.0  
**Bundle ID (proposed):** `com.macksims.coachcore`

## Pre-flight (owner)

- [ ] Confirm target audience — adults only vs youth sports (minors affect privacy forms)
- [ ] Confirm health/nutrition data scope — coaching support only, not medical
- [ ] Confirm `com.macksims.coachcore` bundle ID
- [ ] Apply `supabase/schema.sql` and set Netlify env vars when moving beyond demo

## Assets

- [ ] Dismiss demo walkthrough banner before screenshots
- [ ] Capture iPhone 6.7" and 5.5" screenshots (dashboard, accountability, training, chat)
- [ ] Capture Android phone + 7" tablet screenshots
- [ ] App icon 1024×1024 (no alpha on iOS)

## Legal / privacy

- [ ] Complete `docs/store-launch/apps/coachcore/PRIVACY_DATA.md` with owner answers
- [ ] Privacy policy URL live (in-app `/privacy` exists)
- [ ] Support URL live (in-app `/support` exists)
- [ ] Account deletion flow documented

## Native builds

- [ ] `npm run build:native` passes
- [ ] Codemagic `coachcore-ios-signed` produces TestFlight IPA
- [ ] Codemagic `coachcore-android-signed` produces Play internal AAB
- [ ] Decide: hybrid Netlify WebView vs bundled `out/` for offline

## Store records

- [ ] Apple App Store Connect app record (do not submit until owner approves)
- [ ] Google Play Console app record
- [ ] TestFlight internal track — 2+ testers
- [ ] Play internal testing track

## Reviewer notes (draft)

CoachCore is a coaching accountability demo. v0.7 uses mock athletes and local-only data unless Supabase is configured. No payments, no Hudl API, no wearable imports in this build. Nutrition/readiness surfaces are coaching support — not medical advice.
