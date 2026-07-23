# App Store Connect assets — Tier-3 apps

**Date:** 2026-07-11  
**Apps:** Curbcue, ThrottleLink (MotoCrew), CoachCore, Sermon Studio

## App Store Connect IDs

| App | ASC app ID | Bundle ID (wrapper) |
|-----|------------|---------------------|
| Curbcue | `6787820297` | `com.chrissims.fairshare` |
| ThrottleLink | `6787821088` | `com.chrissims.throttlelink` |
| CoachCore | `6787821608` | `com.chrissims.coachcore` |
| Sermon Studio | `6787823019` | `com.chrissims.sermonstudio` |

Set Codemagic env vars: `CURBCUE_APP_STORE_APPLE_ID=6787820297`, `MOTOCREW_APP_STORE_APPLE_ID=6787821088`, `COACHCORE_APP_STORE_APPLE_ID=6787821608`, `SERMON_STUDIO_APP_STORE_APPLE_ID=6787823019`.

## Asset folders

Generated under `docs/store-launch/app-store-assets/<app>/`:

| File / folder | Size | ASC slot |
|---------------|------|----------|
| `icon-1024.png` | 1024×1024 | App Information → App Icon |
| `iphone-6.7/*.png` | 1290×2796 | Version → Screenshots → **6.7" Display** |
| `ipad-12.9/*.png` | 2048×2732 | Version → Screenshots → **12.9" iPad Pro** (optional) |

**Re-capture:** `node scripts/capture-app-store-screens.mjs all`  
**Open folders + ASC:** `.\scripts\open-app-store-assets.ps1`

## Upload URLs (screenshots + metadata)

| App | Prepare for Submission |
|-----|------------------------|
| Curbcue | https://appstoreconnect.apple.com/apps/6787820297/distribution/ios/version/inflight |
| ThrottleLink | https://appstoreconnect.apple.com/apps/6787821088/distribution/ios/version/inflight |
| CoachCore | https://appstoreconnect.apple.com/apps/6787821608/distribution/ios/version/inflight |
| Sermon Studio | https://appstoreconnect.apple.com/apps/6787823019/distribution/ios/version/inflight |

App icon: same app → **Distribution → App Information** (or General → App Information).

## Shared policy URLs (use on ASC)

- Privacy: `https://macksims-public-site.netlify.app/privacy/`
- Support: `https://macksims-public-site.netlify.app/support/`
- Account deletion: `https://macksims-public-site.netlify.app/account-deletion/`
- Contact: `feedback@macksims.com`

## Store copy

Full text per app: `TIER3_PLAY_STORE_LISTINGS.md` and per-app `docs/store-launch/apps/*/APP_STORE_CONNECT.md`.

## Upload checklist (per app)

1. **App icon** — `icon-1024.png` (no transparency)
2. **6.7" iPhone screenshots** — all files in `iphone-6.7/` (3–10 shots)
3. **12.9" iPad** (optional) — all files in `ipad-12.9/`
4. **Description, subtitle, keywords** — paste from listing docs
5. **Support / marketing / privacy URLs** — shared URLs above
6. **Save** — version does not need App Store submission for TestFlight-only beta

## TestFlight note

Screenshots on the App Store version also support Beta App Review for external TestFlight groups. Test Information was filled in a prior session; see transcript for `FT Curbcue Testers` public link.
