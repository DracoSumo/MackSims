# MackSims Public-Ready Status

**Pass date:** 2026-07-23 (follow-up 2026-07-24)  
**Standard:** Public-grade (as if the public sees everything)  
**No git commit** in this pass.

Canonical product roots live under `C:\Users\draco\Downloads\MackSims\` unless noted. Store launch kits: `docs/store-launch/`.

## Status table

| App | Stack | Build | Live URL | Fixes | Blockers needing user |
| --- | --- | --- | --- | --- | --- |
| **public-site** (MackSims marketing) | Static HTML + CSS/JS / Netlify | N/A (static publish); prod redeployed 2026-07-24 | https://www.macksims.com | Product CTAs on custom domains. **Content Suite** card + footer/home CTAs ? `https://adorable-chebakia-0fc082.netlify.app`. **Aegis** CTAs ? `https://aegis.macksims.com`. MomentPick product CTA ? live web beta. | Optional Content Suite custom domain. |
| **CoachCore** | Next.js 16 (static `out`) + Vitest + Capacitor scripts | **PASS** `npm run check` | https://coachcore.macksims.com (also coachcore7.netlify.app) | None required | None for web. Native store kit still owner-gated (`docs/store-launch/apps/coachcore`). |
| **FairShare / CurbCue** | Vite 7 + React 19 + Vitest + Capacitor | **PASS** `npm run check` | https://fairshare.macksims.com (also fairshare-v03-20260624.netlify.app) | None required | Product UI brand is **CurbCue**; package/ids still `fairshare-*`. Store kit owner confirmations (`docs/store-launch/apps/fairshare`). |
| **MotoCrew / ThrottleLink** | Vite 8 + React 19 + ESLint + Vitest + Capacitor | **PASS** `npm run check` | https://motocrew.macksims.com (also motocrewz.netlify.app) | None required | Confirm final public name MotoCrew vs ThrottleLink for store listings (`docs/store-launch/apps/throttlelink`). |
| **Sermon Studio** | Next.js 14 + `@netlify/plugin-nextjs` + Capacitor | **PASS** local `npm run build` / `netlify build` | https://sermonstudio.macksims.com | `netlify.toml` has **no** `publish = ".next"` (plugin owns output). Live verified **200** with app HTML + `/api/config` Supabase payload. No redeploy needed this pass. | Optional: clear Netlify UI Publish directory if still stuck on `.next` (`publishOrigin=ui`) so plain `netlify deploy --prod` stays healthy. See `apps/SermonStudio/_followup_result.md`. |
| **FishCrew** | Capacitor iOS wrapper (`fishcrew-ios`) + Codemagic; marketing on public-site; static `_deploy-icon-patch` assets | Wrapper `build:ios` is echo-only locally; no full native/Xcode/Android tree in this folder | https://fishcrew.macksims.com ; ASC app `6783567028`; bundle `com.chrissims.fishcrew` | Marketing page OK | **Missing full app source** in MackSims tree (remote wrapper repo only). **Play Console / ASC:** select App Review build, upload screenshots, complete App Privacy / Play Data Safety (`docs/store-launch/apps/fishcrew`). |
| **ShutterBid** | Next.js 16 + Netlify Next plugin + Firebase | **PASS** build + lint (after local tsconfig/Capacitor exclude) | https://shutterbid.macksims.com ; https://shutterbid-web.netlify.app | Excluded `capacitor.config.ts` from TS project; Windows symlink to junction preload for Netlify packaging | **Play / ASC console** owner actions (`docs/store-launch/apps/shutterbid`). Do not duplicate store records. |
| **MomentPick** | Next.js 16 + Firebase client; Capacitor camera | **PASS** `npm run build` | https://momentpick.macksims.com (Netlify site `momentpick-web`) | Confirmed origin is **Netlify** (not Firebase Hosting). Added `netlify.toml` + `@netlify/plugin-nextjs`, linked CLI (`f949809e-�`), documented deploy. `firebase.json` remains rules-only. Windows local CLI packaging via junction preload can 502 � **kept known-good prod deploy** `6a6242b15684e935733cb08f`. | Optional: clear UI Publish directory stuck on `.next`. Prefer Linux/CI or Netlify UI for next prod ship. Enable Windows Developer Mode if retrying local Next plugin packaging. |
| **Aegis Intel** | Static PWA + Netlify Functions; Capacitor; v**0.15.54** / UI **v15.5.4** | **PASS** `npm run check` | https://aegis.macksims.com (also sprightly-lily-160925.netlify.app) | Attached custom domain `aegis.macksims.com` (NETLIFY DNS on `macksims.com` zone) � HTTPS **200**. | Store kit early-access only (`docs/store-launch/apps/aegis-intel`). Source: `C:\Users\draco\Downloads\aegis-intel-v9-full`. |
| **Content Suite** (MackSims-branded; under DracoSumo path) | Vite 6 + React 19 + Netlify Functions | **PASS** `npm run build`; prod live | https://adorable-chebakia-0fc082.netlify.app | Linked from public-site (home, products, footer). | Optional custom domain. PDF docs under `docs/` still point at Hugging Face `DracoSumo/*` spaces (non-UI). |

## Live URL smoke (2026-07-24 follow-up)

| Host | HTTP | Notes |
| --- | --- | --- |
| https://www.macksims.com | 200 | Content Suite + Aegis custom domain CTAs live |
| https://www.macksims.com/products/ | 200 | Content Suite card present |
| https://sermonstudio.macksims.com | 200 | Pastor's Sermon Studio + `/api/config` OK |
| https://momentpick.macksims.com | 200 | Restored known-good deploy after failed Windows package attempts |
| https://aegis.macksims.com | 200 | New custom domain |
| https://adorable-chebakia-0fc082.netlify.app | 200 | Content Suite |

## Branding / quality notes

- User-facing UI scanned for **DracoSumo** leakage and **Lorem ipsum** in primary app sources: clean for FairShare, MotoCrew, CoachCore, Sermon Studio, ShutterBid, Aegis, public-site.
- Content Suite UI/README already say **MackSims**; package name leftover fixed prior pass.
- Internal package names / event ids may still say `fairshare`, `ThrottleLink` lineage, GitHub org `DracoSumo` -- acceptable if not shown in UI.

## Store launch asset paths

| App | Kit / assets |
| --- | --- |
| Shared system | `docs/store-launch/` ; `PER_APP_STATUS_TRACKER.md` |
| FishCrew | `docs/store-launch/apps/fishcrew/` |
| ShutterBid | `docs/store-launch/apps/shutterbid/` |
| FairShare / CurbCue | `docs/store-launch/apps/fairshare/` |
| MotoCrew / ThrottleLink | `docs/store-launch/apps/throttlelink/` |
| CoachCore | `docs/store-launch/apps/coachcore/` |
| Sermon Studio | `docs/store-launch/apps/sermon-studio/` |
| Aegis Intel | `docs/store-launch/apps/aegis-intel/` ; `docs/store-launch/app-store-assets/aegisintel` ; `docs/store-launch/play-assets/aegisintel` |

## Inventory map (this machine)

| App | Path |
| --- | --- |
| public-site | `MackSims/public-site` |
| CoachCore | `MackSims/apps/CoachCore/coachcore-static-v001` |
| FairShare / CurbCue | `MackSims/apps/FairShare` |
| MotoCrew | `MackSims/apps/MotoCrew` |
| Sermon Studio | `MackSims/apps/SermonStudio` |
| FishCrew | `MackSims/apps/FishCrew` (wrapper + patch only) |
| ShutterBid | `MackSims/apps/ShutterBid/shutterbid-starter` |
| MomentPick | `MackSims/apps/momentpick-web` |
| Aegis Intel | `C:\Users\draco\Downloads\aegis-intel-v9-full` |
| Content Suite | `C:\Users\draco\Downloads\DracoSumo\content-suite` |

## What this follow-up fixed vs still human

### Fixed / automated
1. **MomentPick hosting identified** � Netlify `momentpick-web` serves `momentpick.macksims.com`. Added `netlify.toml`, linked project, documented deploy; Firebase Hosting not required.
2. **Sermon Studio** � confirmed healthy (200 + app content + config API); `netlify.toml` already correct.
3. **public-site** � Content Suite CTAs + Aegis/`momentpick` CTA updates; redeployed www.
4. **Aegis** � `aegis.macksims.com` custom domain + DNS (existing `macksims.com` Netlify zone).

### Still needs human
1. **FishCrew / ShutterBid** � Play Console / App Store Connect paste-upload from `docs/store-launch` only (screenshots, privacy, build selection). Do not create duplicate store records.
2. **MomentPick** � next prod ship should use Linux/CI or Netlify UI (Windows junction packaging caused 404/502); optional clear UI Publish directory `.next`.
3. Optional Content Suite custom domain.

## Owner priority queue

1. **FishCrew / ShutterBid** -- console paste/upload from `docs/store-launch` (screenshots, privacy, build selection). Do not create duplicate store records.
2. **MomentPick** -- optional: clear Netlify UI Publish directory; ship next build via CI/UI (not Windows junction package).
3. **Sermon Studio** -- optional: clear Netlify UI Publish directory (`.next`) if still set.
4. Optional Content Suite custom domain.
