# CoachCore — Store Launch Checklist

**Version:** v0.7.1  
**Bundle ID:** `com.macksims.coachcore`

## Pre-flight (owner)

- [x] Target audience — all sports
- [x] Data use — app only, no sales, no ads
- [x] Deletion — privacy@macksims.com / `/account-deletion`
- [x] Bundle ID — `com.macksims.coachcore`
- [x] Supabase schema + RLS tightened (v0.7.1)
- [x] Netlify env + production deploy

## Assets

- [ ] Dismiss demo walkthrough banner before screenshots
- [ ] Run `node scripts/capture-store-screens.mjs`
- [ ] App icon 1024×1024 (no alpha on iOS)
- [ ] Google Play feature graphic 1024×500

## Legal / privacy

- [x] PRIVACY_DATA.md complete
- [x] `/privacy`, `/support`, `/terms`, `/account-deletion` live
- [x] Store data safety answers drafted (Play + App Store)

## Native builds

- [ ] `npm run build:native` passes
- [ ] Codemagic iOS signed IPA → TestFlight
- [ ] Codemagic Android AAB → Play internal
- [x] Hybrid loads https://coachcore7.netlify.app/app (documented)

## Store records

- [ ] App Store Connect record created
- [ ] Google Play Console record created
- [ ] TestFlight internal — 2+ testers
- [ ] Play internal testing track

## Reviewer notes

See `docs/store-launch/apps/coachcore/REVIEW_NOTES.md` — demo path, no password required.
