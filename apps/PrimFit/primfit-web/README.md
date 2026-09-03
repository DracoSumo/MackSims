# PrimFit (web v0.2.2)

Athlete-first fitness app: sport + goal aware workout and meal templates across **23 sports**, weekly grocery list, equipment/pantry inventory, location mode, demo videos on every task, and request-only intros to trainers/nutritionists.

**Separate brand from CoachCore.** Local-first (`localStorage`); no auth, payments, or cloud sync in v0.2. Not medical advice.

## Dev

```bash
cd primfit-web
npm install
npm run dev
```

Open http://localhost:3000

## Build (web)

```bash
npm run build
```

Static export → `out/` (Netlify-ready **when a dedicated PrimFit site exists**). There is **no PrimFit Netlify site** in the MackSims map yet — do not deploy onto other products.

## Android / BlueStacks (Capacitor 7)

App id: `com.macksims.primfit`  
`webDir`: `out` (run `npm run build` first)

```bash
npm install
npm run build
npx cap add android
npx cap sync android
```

Set `ANDROID_HOME` to your SDK (example: `C:\Users\draco\AppData\Local\Android\Sdk`). Capacitor 7 needs **Java 21** (`JAVA_HOME` can be Android Studio's JBR: `C:\Program Files\Android\Android Studio\jbr`). Then:

```bash
cd android
.\gradlew.bat assembleDebug
```

Debug APK:

`android\app\build\outputs\apk\debug\app-debug.apk`

BlueStacks (typical):

```bash
adb connect 127.0.0.1:5555
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

If Gradle/SDK is missing, you can still test the web export: `npx serve out` or open the Capacitor project after `npx cap sync`.

## v0.2.2

- Capacitor Android shell for BlueStacks
- YouTube demos use youtube-nocookie + playsinline (WebView-friendly); meal/week videos play inline
- Onboarding: restore full profile, require gear/pantry, location mode syncs gear, clearer geo errors
- Safe-area padding for Android status/nav bars

## v0.2 features

- **Sports (grouped + searchable):** strongman, bodybuilding, powerlifting, general strength, CrossFit/functional, running, cycling, swimming, triathlon, HYROX, boxing/MMA, wrestling, football, basketball, soccer, baseball/softball, tennis, badminton, volleyball, golf, yoga/mobility, general athleticism, pilates
- **Science engine:** ACSM FITT-VP, NSCA periodization/2-for-2, ISSN protein timing, Daniels/Seiler 80/20, HYROX hybrid, field S&C — paraphrased original templates
- **Coach influences:** Gambetta, Boyle, Pfaff, Daniels, Sims, Jeukendrup, PN-style habits, Olympic S&C composite — with honest non-affiliation disclaimer (`/app/methods/`)
- **Videos:** every workout block and meal has `videoUrl` (+ optional title) with category fallbacks
- **Inventory:** `primfit.equipment` + `primfit.foodInventory` in localStorage; plan substitutes exercises/meals
- **Location mode:** Home / Commercial gym / Outdoor / Travel (+ optional lat/lng label). No fake Places scraping
- Today / Week / Grocery / Pros / Profile / Methods
- Purple / black / silver colorway
- Not medical advice; sample pros are illustrative

## Deploy (when ready)

Netlify site TBD — `primfit.macksims.com` candidate. Use preflight + exact `--site` UUID per `docs/DEPLOY_POLICY.md`. Do **not** deploy to empire-marketing-print, sermon-studio-beta, or other existing sites.
