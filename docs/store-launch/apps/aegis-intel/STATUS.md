# Aegis Intel - Store Launch Status

**Updated:** 2026-07-23  
**Packaging decision:** **GO** — Capacitor iOS + Android shells loading https://sprightly-lily-160925.netlify.app/

| Area | Status | Notes |
| --- | --- | --- |
| Console status | **OWNER ACTION** | Create ASC + Play records with `com.macksims.aegisintel` |
| iOS | **IN PROGRESS** | Codemagic `ios-testflight` on `main`; bundle `com.macksims.aegisintel` |
| Android | **IN PROGRESS** | Codemagic `android-release`; package `com.macksims.aegisintel`; keystore `aegis-intel-key` |
| Web/PWA | **LIVE** | v15.5.4 + Supabase client-ready |
| Bundle/package confirmed | **CONFIRMED** | `com.macksims.aegisintel` (Capacitor + android `applicationId`) |
| Store copy | **READY TO PASTE** | [`../../OWNER_UPLOAD_KIT.md`](../../OWNER_UPLOAD_KIT.md) + ASC/Play docs |
| Privacy/data safety | **READY TO PASTE** | PRIVACY_DATA.md + CSV; `macksims.com/privacy` still 404 — use Netlify |
| Screenshots/assets | **READY TO PASTE** (iOS) · Play feature **NEEDED** | 3×6.5, 3×6.9, 3×iPad 12.9; icon512 OK; `feature-1024x500.png` missing |
| Age / content rights | **OWNER CONFIRM** age · Content Rights documented | Target 17+ / 18+; rights statement in ASC doc |
| Reviewer notes | **READY TO PASTE** | Guest path; optional demo login |
| Tester track | **READY TO CREATE** | Codemagic beta group `Aegis-testers`; Play internal testing after AAB |
| Backend readiness | **READY** | Netlify functions + Supabase foundation migration applied |

## Highest-Priority Blockers (owner)

1. Create App Store Connect app + Play Console app with **`com.macksims.aegisintel`** (do not use `com.chrissims.*`).
2. Confirm Codemagic ASC integration can publish to the new Aegis ASC app; keystore `aegis-intel-key` present.
3. Upload screenshots + privacy questionnaire; trigger Codemagic builds.
4. Optional: point `macksims.com/privacy` at the live privacy page (currently 404).

## Next Action

Follow [Aegis `docs/STORE_SUBMISSION.md`](../../../../aegis-intel-v9-full/docs/STORE_SUBMISSION.md) Phase A (browser consoles), then run Codemagic iOS + Android workflows.
