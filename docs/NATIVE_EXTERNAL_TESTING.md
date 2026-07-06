# Native External Testing — CurbCue, MotoCrew, CoachCore, Sermon Studio

**Prepared:** 2026-07-06  
**Strategy:** Hybrid Capacitor shells load **production Netlify URLs** in the native WebView (`server.url` in each `capacitor.config.ts`). Fastest path to TestFlight / Play closed testing without rebundling web assets on every web deploy.

**Excluded:** ShutterBid, FishCrew, Aegis Intel

---

## Hybrid vs bundled tradeoffs

| Approach | Pros | Cons |
|----------|------|------|
| **Hybrid (current)** | Web fixes deploy instantly via Netlify; one native shell; matches current web beta | Requires network; store review may ask about offline behavior; `capacitor-web/` is splash fallback only |
| **Bundled static** | Works offline; closer to production native | Must rebuild IPA/AAB after every web change; larger artifacts |

Switch hybrid → bundled: remove `server.url` from `capacitor.config.ts`, set `webDir` to `dist` or `out`, run `npm run build` before `npx cap sync`.

---

## Codemagic environment variables (names only — no values)

Set in Codemagic **Environment variables** or **Code signing** UI before first signed build.

### Shared (all apps)

| Variable | Purpose |
|----------|---------|
| `APP_STORE_CONNECT_KEY_NAME` | App Store Connect API integration name |
| `APPLE_TEAM_ID` | Apple Developer team (see `.env.signing.example`) |

### Per app — CurbCue (FairShare repo)

| Variable | Purpose |
|----------|---------|
| `CURBCUE_BUNDLE_ID` | iOS bundle ID — **TBD owner** (`docs/store-launch/apps/fairshare/`) |
| `CURBCUE_PACKAGE_NAME` | Android package — **TBD owner** |
| `CURBCUE_APP_STORE_APPLE_ID` | ASC numeric app ID after owner creates record |
| `CURBCUE_ANDROID_KEYSTORE_REFERENCE` | Codemagic Android keystore reference name |
| `CAPACITOR_SERVER_URL` | Optional override; default `https://fairshare-v03-20260624.netlify.app` |

### Per app — MotoCrew

| Variable | Purpose |
|----------|---------|
| `MOTOCREW_BUNDLE_ID` | **TBD owner** (`docs/store-launch/apps/throttlelink/`) |
| `MOTOCREW_PACKAGE_NAME` | **TBD owner** |
| `MOTOCREW_APP_STORE_APPLE_ID` | **TBD** after ASC app created |
| `MOTOCREW_ANDROID_KEYSTORE_REFERENCE` | Codemagic keystore ref |
| `CAPACITOR_SERVER_URL` | Default `https://motocrewz.netlify.app` |

### Per app — CoachCore

| Variable | Purpose |
|----------|---------|
| `COACHCORE_BUNDLE_ID` | **TBD owner** (`docs/store-launch/apps/coachcore/`) |
| `COACHCORE_PACKAGE_NAME` | **TBD owner** |
| `COACHCORE_APP_STORE_APPLE_ID` | **TBD** |
| `COACHCORE_ANDROID_KEYSTORE_REFERENCE` | Codemagic keystore ref |
| `CAPACITOR_SERVER_URL` | Default `https://coachcore7.netlify.app/app` |

### Per app — Sermon Studio

| Variable | Purpose |
|----------|---------|
| `SERMON_STUDIO_BUNDLE_ID` | **TBD owner** (`docs/store-launch/apps/sermon-studio/`) |
| `SERMON_STUDIO_PACKAGE_NAME` | **TBD owner** |
| `SERMON_STUDIO_APP_STORE_APPLE_ID` | **TBD** |
| `SERMON_STUDIO_ANDROID_KEYSTORE_REFERENCE` | Codemagic keystore ref |
| `CAPACITOR_SERVER_URL` | Default `https://sermon-studio-beta.netlify.app` |

### Codemagic workflows (artifacts only — no auto-publish)

| Workflow | Platform |
|----------|----------|
| `curbcue-ios-signed` | iOS IPA |
| `curbcue-android-signed` | Android AAB |
| `motocrew-ios-signed` | iOS IPA |
| `motocrew-android-signed` | Android AAB |
| `coachcore-ios-signed` | iOS IPA |
| `coachcore-android-signed` | Android AAB |
| `sermon-studio-ios-signed` | iOS IPA |
| `sermon-studio-android-signed` | Android AAB |

---

## Per-app reference

### CurbCue (FairShare)

| Field | Value |
|-------|-------|
| Source | `apps/FairShare` |
| Hybrid URL | https://fairshare-v03-20260624.netlify.app |
| Display name | CurbCue |
| Bundle ID / package | **TBD** — owner must confirm per `docs/store-launch/apps/fairshare/APP_STORE_CONNECT.md` |
| Capacitor config | `apps/FairShare/capacitor.config.ts` |

**Local / CI build commands**

```powershell
cd apps\FairShare
npm install
npm run check
npm run cap:sync          # generates ios/ android/ locally
npm run cap:android       # opens Android Studio (after sync)
npm run cap:ios           # macOS + Xcode only
```

**Android debug (after `npx cap add android` + sync)**

```powershell
cd apps\FairShare\android
.\gradlew assembleDebug
```

**iOS archive (macOS + Xcode)**

1. `npm run build:native` in `apps/FairShare`
2. Open `ios/App/App.xcworkspace` in Xcode
3. Select **Any iOS Device** → **Product → Archive**
4. **Distribute App** → **App Store Connect** → upload (do not submit for App Review)

**TestFlight external testing**

1. Owner creates App Store Connect app with confirmed bundle ID
2. Upload IPA (Codemagic artifact or Xcode Organizer)
3. ASC → **TestFlight** → wait for processing
4. **External Testing** → create group (e.g. `CurbCue Beta`) → add build
5. Submit **Beta App Review** (required for external testers)
6. Add tester emails or public link; testers install **TestFlight** app

**Play closed testing**

1. Owner creates Play Console app with confirmed package name
2. Upload AAB to **Testing → Closed testing** track
3. Create tester list (emails) or use opt-in link
4. Complete store listing minimum + content rating + data safety (owner)
5. Share opt-in URL with testers

**Blockers:** Bundle ID/package TBD; no ASC/Play records yet; Android keystore not provisioned for CurbCue; iOS profiles require owner signing setup.

---

### MotoCrew

| Field | Value |
|-------|-------|
| Source | `apps/MotoCrew` |
| Hybrid URL | https://motocrewz.netlify.app |
| Display name | MotoCrew |
| Bundle ID / package | **TBD** — `docs/store-launch/apps/throttlelink/` |
| Capacitor config | `apps/MotoCrew/capacitor.config.ts` |

**Build commands:** Same pattern as CurbCue, path `apps\MotoCrew`.

**TestFlight / Play:** Same owner steps as above; final store name may be **MotoCrew** vs **ThrottleLink** — owner confirmation required.

**Blockers:** Final app name + bundle ID TBD; no store records; signing credentials not provisioned.

---

### CoachCore

| Field | Value |
|-------|-------|
| Source | `apps/CoachCore/coachcore-static-v001` |
| Hybrid URL | https://coachcore7.netlify.app/app |
| Display name | CoachCore |
| Bundle ID / package | **TBD** — `docs/store-launch/apps/coachcore/` |
| Capacitor config | `apps/CoachCore/coachcore-static-v001/capacitor.config.ts` |

**Build commands**

```powershell
cd apps\CoachCore\coachcore-static-v001
npm install
npm run check
npm run cap:sync
```

**Blockers:** Bundle ID TBD; privacy/support URLs TBD in store docs; no ASC/Play records.

---

### Sermon Studio

| Field | Value |
|-------|-------|
| Source | `apps/SermonStudio` |
| Hybrid URL | https://sermon-studio-beta.netlify.app |
| Display name | Sermon Studio |
| Bundle ID / package | **TBD** — `docs/store-launch/apps/sermon-studio/` |
| Capacitor config | `apps/SermonStudio/capacitor.config.ts` |

**Build commands:** Same pattern, path `apps\SermonStudio`.

**Blockers:** Bundle ID TBD; store metadata incomplete; no ASC/Play records.

---

## Owner checklist (before first external native test)

Do **not** submit for App Store / Play **production** release.

1. **Confirm bundle IDs and package names** for all four apps (`docs/store-launch/STORE_LAUNCH_MASTER_CHECKLIST.md`).
2. **Create App Store Connect app records** (manual — CLI cannot create new apps without existing IDs).
3. **Create Google Play Console app records** (manual).
4. **Provision signing:** Apple distribution cert + profiles; Android upload keystores per app in Codemagic.
5. **Set Codemagic env vars** (table above) and run signed workflows manually.
6. **Upload artifacts** to TestFlight / Play closed testing.
7. **Enable external testers** (TestFlight Beta App Review; Play closed track tester list).
8. Update `docs/store-launch/apps/<app>/STATUS.md` and `docs/EXTERNAL_TESTING_PACKAGE.md`.

---

## Windows development notes

- `npx cap add ios` requires **macOS + Xcode** — fails on Windows; CI builds iOS on Codemagic mac_mini.
- `npx cap add android` works on Windows if **Android Studio / SDK** and **JDK 21** are installed.
- `ios/` and `android/` are gitignored; generated by `cap sync` locally or on CI.

---

*See also: `codemagic.yaml`, `scripts/codemagic-hybrid-capacitor.sh`, `docs/EXTERNAL_TESTING_PACKAGE.md`.*

## Android debug build verification 2026-07-06

Local Windows verification after JDK upgrade (Capacitor 7 / Gradle require JDK 11+, previously blocked on Java 8).

### JDK

| Item | Result |
|------|--------|
| Install | **PASS** — `winget install --id EclipseAdoptium.Temurin.17.JDK -e --accept-source-agreements --accept-package-agreements` |
| `JAVA_HOME` | `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot` |
| `java -version` | OpenJDK **17.0.19** (Temurin-17.0.19+10) |

Session setup (PowerShell):

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Android SDK

| Check | Result |
|-------|--------|
| `C:\Users\draco\AppData\Local\Android\Sdk` | **Not present** |
| `ANDROID_HOME` / `ANDROID_SDK_ROOT` | **Unset** (no SDK found on machine) |

Install [Android Studio](https://developer.android.com/studio) or the command-line SDK, then set `ANDROID_HOME` to the SDK path and add `platform-tools` to `PATH`, or create `android/local.properties` with `sdk.dir=<path>` (forward slashes on Windows are OK).

### Per-app `npx cap sync android` + `gradlew assembleDebug --no-daemon`

| App | Path | `cap sync` | `assembleDebug` | APK / blocker |
|-----|------|------------|-----------------|---------------|
| **CurbCue (FairShare)** | `apps/FairShare` | PASS | **FAIL** | SDK location not found. Set `ANDROID_HOME` or `apps/FairShare/android/local.properties` (`sdk.dir`). Expected APK: `apps/FairShare/android/app/build/outputs/apk/debug/app-debug.apk` |
| **MotoCrew** | `apps/MotoCrew` | PASS | **FAIL** | Same SDK error — `apps/MotoCrew/android/local.properties` |
| **CoachCore** | `apps/CoachCore/coachcore-static-v001` | PASS | **FAIL** | Same SDK error — `apps/CoachCore/coachcore-static-v001/android/local.properties` |
| **Sermon Studio** | `apps/SermonStudio` | PASS | **FAIL** | Same SDK error — `apps/SermonStudio/android/local.properties` |

Gradle error (all four apps):

```text
Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'.
> SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file.
```

**Next step on this machine:** Install Android SDK, set `ANDROID_HOME`, re-run `.\gradlew.bat assembleDebug --no-daemon` in each app’s `android/` folder (or use Codemagic `*-android-signed` workflows for signed AABs).


## Codemagic build trigger 2026-07-06

### Bundle IDs (dev defaults � owner must match App Store Connect / Play Console when records are created)

| App | iOS bundle ID | Android package |
|-----|---------------|-----------------|
| CurbCue (FairShare) | `com.macksims.curbcue` | `com.macksims.curbcue` |
| MotoCrew | `com.macksims.motocrew` | `com.macksims.motocrew` |
| CoachCore | `com.macksims.coachcore` | `com.macksims.coachcore` |
| Sermon Studio | `com.macksims.sermonstudio` | `com.macksims.sermonstudio` |

Sources: `apps/*/capacitor.config.ts` defaults and `codemagic.yaml` workflow `vars` (FishCrew/ShutterBid remain `com.chrissims.*`).

**No ASC or Play app records were created via API.** `CURBCUE_APP_STORE_APPLE_ID`, `MOTOCREW_APP_STORE_APPLE_ID`, `COACHCORE_APP_STORE_APPLE_ID`, and `SERMON_STUDIO_APP_STORE_APPLE_ID` are still required before iOS workflows can increment build numbers.

### Local signing material (names only)

| App | Android keystore reference (Codemagic UI) | Local `.env.signing.example` |
|-----|----------------------------------------|------------------------------|
| CurbCue | `curbcue-upload-key` | `CURBCUE_ANDROID_KEYSTORE_REFERENCE` |
| MotoCrew | `motocrew-upload-key` | `MOTOCREW_ANDROID_KEYSTORE_REFERENCE` |
| CoachCore | `coachcore-upload-key` | `COACHCORE_ANDROID_KEYSTORE_REFERENCE` |
| Sermon Studio | `sermon-studio-upload-key` | `SERMON_STUDIO_ANDROID_KEYSTORE_REFERENCE` |

On this machine: only FishCrew/ShutterBid `.jks` backups under `_archive/android-signing-BACKUP/`; no hybrid-app upload keystores in `_secure/android-signing/`.

### Build trigger results

| App | `curbcue-*` / `motocrew-*` / `coachcore-*` / `sermon-studio-*` | Android signed | iOS signed |
|-----|------------------------------------------------------------------|----------------|------------|
| CurbCue | workflows exist in `codemagic.yaml` | **BLOCKED** | **BLOCKED** |
| MotoCrew | | **BLOCKED** | **BLOCKED** |
| CoachCore | | **BLOCKED** | **BLOCKED** |
| Sermon Studio | | **BLOCKED** | **BLOCKED** |

**BLOCKED reason (all eight workflows):** No `cm-cli` on PATH; `CODEMAGIC_API_TOKEN` / `CM_API_TOKEN` / `CODEMAGIC_TOKEN` not set in this environment; MackSims monorepo has **no git remote** (cannot push `codemagic.yaml` to trigger Codemagic webhooks). Codemagic application ID is not documented in-repo � builds must be started from the Codemagic UI or API after the MackSims repository is connected.

No build IDs or Codemagic URLs were returned.

### Owner checklist (Codemagic dashboard)

1. Connect the **MackSims** Git repository (must contain `codemagic.yaml`, `scripts/codemagic-hybrid-capacitor.sh`, and `apps/{FairShare,MotoCrew,CoachCore/coachcore-static-v001,SermonStudio}`).
2. Set **global** variable: `APP_STORE_CONNECT_KEY_NAME` (same integration used for FishCrew/ShutterBid).
3. Per hybrid app, set **environment variables** (names only): `CURBCUE_BUNDLE_ID`, `CURBCUE_PACKAGE_NAME`, `CURBCUE_APP_STORE_APPLE_ID`, `CURBCUE_ANDROID_KEYSTORE_REFERENCE`; `MOTOCREW_*`; `COACHCORE_*`; `SERMON_STUDIO_*` � values should match the table above unless console records use different IDs.
4. Upload Android keystores in **Code signing** with reference names: `curbcue-upload-key`, `motocrew-upload-key`, `coachcore-upload-key`, `sermon-studio-upload-key` (generate `.jks` locally; do not commit).
5. Ensure Apple **distribution** signing covers each bundle ID (profiles after ASC app records exist).
6. Run workflows manually in order: `*-android-signed` first, then `*-ios-signed` after `*_APP_STORE_APPLE_ID` is set.

### Git commits (this pass)

| Repo | Remote | Action |
|------|--------|--------|
| FairShare | `github.com/DracoSumo/FairShare` | commit + push `capacitor.config.ts` if push succeeds |
| MotoCrew | `github.com/DracoSumo/MotoCrew` | commit + push `capacitor.config.ts` |
| Sermon Studio | `github.com/DracoSumo/Pastor-s-Sermon-Studio` | commit + push `capacitor.config.ts` |
| CoachCore (`coachcore-static-v001`) | none | local commit only |
| MackSims monorepo | none | local commit `codemagic.yaml`, `.env.signing.example`, this doc |

