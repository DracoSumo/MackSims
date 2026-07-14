# Store external testing — owner runbook

**Date:** 2026-07-07  
**Apps:** CurbCue, MotoCrew, CoachCore, Sermon Studio (strongest four)  
**Goal:** Web beta live now; **TestFlight external** + **Google Play closed testing** for native hybrid shells.

Public tester hub: **https://macksims-public-site.netlify.app/beta/** (also `macksims.com/beta/` when DNS is stable).

---

## Web (live — share today)

| App | Web beta URL |
|-----|----------------|
| CurbCue | https://fairshare-v03-20260624.netlify.app |
| MotoCrew | https://motocrewz.netlify.app |
| CoachCore | https://coachcore7.netlify.app/app |
| Sermon Studio | https://sermon-studio-beta.netlify.app |

---

## iOS — TestFlight external testing

**Current state:** Codemagic iOS wrapper builds finished for `fairshare-ios`, `throttlelink-ios`, `coachcore-ios`, `sermonstudio-ios`. Post-processing failed until ASC app IDs and signing env vars are set.

### Per app (owner)

1. **App Store Connect** — create app record (if not exists) with bundle ID matching `capacitor.config.ts` / `codemagic.yaml` dev default `com.macksims.*` (confirm final IDs before production).
2. **Codemagic** — set `*_APP_STORE_APPLE_ID` env var; upload signing cert / use `APP_STORE_CONNECT_KEY_NAME`.
3. **Run** `*-ios-signed` workflow (or legacy `*-ios` wrapper) on branch `main`.
4. **ASC → TestFlight** — wait for build processing.
5. **External Testing** — create group → add testers OR enable public link → submit **Beta App Review** (required for external testers).
6. **Copy TestFlight public link** into `public-site/public/beta/index.html` under the app’s iOS row (replace “invite rolling out” text).

### Tester install

1. Install **TestFlight** from the App Store.
2. Open invite link or accept email invite.
3. Install the MackSims beta build.

---

## Android — Google Play closed testing

**Current state:** Android signed workflows in `MackSims/codemagic.yaml` require MackSims monorepo connected in Codemagic + Android keystores uploaded.

### Per app (owner)

1. **Play Console** — create app (CurbCue/FairShare record may already exist in console).
2. **Package name** — match `com.macksims.*` (confirm before first upload).
3. **Codemagic** — upload keystore refs (`curbcue-upload-key`, etc.); set `*_ANDROID_*` env vars.
4. **Run** `*-android-signed` workflow → download **AAB**.
5. **Play Console → Testing → Closed testing** — create release → upload AAB → add tester emails or **copy opt-in URL**.
6. **Paste opt-in URL** into `public-site/public/beta/index.html` under the app’s Android row.

Opt-in URL format (from Play Console): `https://play.google.com/apps/testing/<package.name>` or internal testing link from **Release → Testing → Closed testing → How testers join**.

---

## After native links are live

1. Update `public-site/public/beta/index.html` with real TestFlight + Play URLs.
2. Redeploy public site: `cd public-site && netlify deploy --prod --dir=public --no-build`
3. Update `docs/EXTERNAL_TESTING_PACKAGE.md` dated section.
4. Email testers with link to **https://macksims-public-site.netlify.app/beta/**

---

## Do not

- Submit for **production** App Store / Play release in this pass.
- Rotate signing keys or commit `.env` / keystores.
- Fake download counts or store ratings.

See also: `docs/NATIVE_EXTERNAL_TESTING.md`, `docs/UNIFORM_DEPLOY.md`.
