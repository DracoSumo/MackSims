# Uniform Netlify deploy (MackSims)

Updated: 2026-07-05

See table and owner actions below.

## Operator flow

cd apps/<App>
npm run deploy:netlify

public-site: netlify deploy --prod --dir=public --no-build

## App table

| App | Dir | Build | Publish | Site | URL |
|-----|-----|-------|---------|------|-----|
| public-site | public-site | none | public | macksims-public-site | https://macksims.com |
| FairShare | apps/FairShare | npm run build | dist | fairshare-v03-20260624 | https://fairshare-v03-20260624.netlify.app |
| MotoCrew | apps/MotoCrew | npm run build | dist | motocrewz | https://motocrewz.netlify.app |
| CoachCore | apps/CoachCore/coachcore-static-v001 | npm run build | out | coachcore7 | https://coachcore7.netlify.app |
| Sermon Studio | apps/SermonStudio | npm run build | .next | sermon-studio-beta | https://sermon-studio-beta.netlify.app |
| ShutterBid | apps/ShutterBid/shutterbid-starter | npm run build | .next | shutterbid-web | https://shutterbid-web.netlify.app |

## ShutterBid versions
- Web package.json: 0.1.0
- Store native: 1.0 via Codemagic (unchanged)

## Verification
- fairshare, motocrew, sermon, coachcore: HTTP 200
- macksims-public-site.netlify.app/shutterbid/: HTTP 200
- shutterbid-web.netlify.app: 404 until deploy
- macksims.com/shutterbid/: intermittent (dual apex A records)

## Owner actions
1. Add Netlify credits (new deploys blocked).
2. DNS: remove apex A 35.172.94.1; keep 75.2.60.5 (Netlify).
3. npm run deploy:netlify in shutterbid-starter after credits.
4. Optional CNAME shutterbid.macksims.com to shutterbid-web.netlify.app

## Still different
- ShutterBid native: Codemagic only
- Aegis Intel, FishCrew: out of scope

Backups: .backups/uniform-deploy-2026-07-05/
## Deploy run 2026-07-06

### ShutterBid (shutterbid-web)
- Local build: PASS (npm run build, Next.js 16.2.6, 138 routes).
- npm run deploy:netlify (full build plus @netlify/plugin-nextjs): FAIL - Windows EPERM creating symlinks (firebase-admin into .netlify/functions-internal). Enable Windows Developer Mode or deploy from WSL/Linux/CI so the Next.js Netlify plugin can finish.
- netlify deploy --prod --trigger: FAIL - Project not found / CI not configured (no remote build trigger).
- netlify deploy --prod --no-build: CLI reported Deploy is live (deploy 6a4b3d617e21198837c5c174); first attempt HTTP 422 no records matched, retry succeeded. Not a valid Next-on-Netlify bundle (.next only, no server handler); site still HTTP 404.

### URL smoke (HEAD and GET)
| URL | Status |
|-----|--------|
| https://fairshare-v03-20260624.netlify.app | 200 |
| https://motocrewz.netlify.app | 200 |
| https://coachcore7.netlify.app | 200 |
| https://sermon-studio-beta.netlify.app | 200 |
| https://shutterbid-web.netlify.app | 404 (after no-build upload) |
| https://macksims-public-site.netlify.app/shutterbid/ | 200 |
| https://macksims.com/shutterbid/ | 404 (intermittent DNS / dual apex, see Owner actions) |

### Next steps
1. Re-run npm run deploy:netlify from an environment that can create symlinks (Developer Mode on this PC, WSL, or Netlify CI after linking repo).
2. If deploy fails with billing/credits, add Netlify credits (per Owner actions above) before retrying.
3. After a plugin-complete deploy, re-smoke shutterbid-web and optional apex /shutterbid/ path.

### Deploy run 2026-07-06 (WSL retry)
- WSL: **not available** (wsl echo ok reports Windows Subsystem for Linux is not installed).
- Local `netlify deploy --prod --build` (same as `npm run deploy:netlify`): **FAIL** - `@netlify/plugin-nextjs` v5.15.12 `EPERM` on symlink `node_modules\firebase-admin` into `.netlify\functions-internal\___netlify-server-handler\...` (errno -4048). `npm run build` alone still **PASS** (Next.js 16.2.6, 138 routes). Machine cannot create symlinks without Administrator or Windows Developer Mode.
- Fallback `netlify deploy --prod --trigger`: **CLI success** (deploy `6a4b3e7c3287728e5d305c82`, build ~5s, `deploy_source: api`). Site has **no linked git repo** (`build_settings: {}`), so trigger did not produce a full Next-on-Netlify bundle (`framework: unknown`, no functions).
- URL smoke: https://shutterbid-web.netlify.app -> **404** (HEAD/GET). Permalink https://6a4b3e7c3287728e5d305c82--shutterbid-web.netlify.app -> **404**.
- **Outcome: FAIL** (production still 404). Unblock: install WSL or enable Developer Mode / run deploy terminal as Administrator, then `npm run deploy:netlify`; or link https://github.com/DracoSumo/shutterbid-starter.git in Netlify and deploy from CI/Linux build image.

### Deploy run 2026-07-06 (Git connected)
- Context: User linked Git repos to Netlify sites; triggered production builds via `netlify deploy --prod --trigger` from linked local folders (API `createSiteBuild` failed on Windows PowerShell JSON quoting).
- Builds triggered: **yes** (all six MackSims app sites below).

| Site | Triggered | Deploy ID | `netlify watch` | URL smoke |
|------|-----------|-----------|-----------------|-----------|
| shutterbid-web | yes | `6a4b4192eeb8e4799f78c657` | complete (~2.3s) | https://shutterbid-web.netlify.app **200** |
| fairshare-v03-20260624 | yes | `6a4b419f33d18e12dd4cc260` | last build (~1.2s) | https://fairshare-v03-20260624.netlify.app **200** |
| motocrewz | yes | `6a4b419fbae9271e1c674b97` | last build (~1.2s) | https://motocrewz.netlify.app **200** |
| coachcore7 | yes | `6a4b41a02421328c98841e0c` | complete (~11.1s) | https://coachcore7.netlify.app **200** |
| sermon-studio-beta | yes | `6a4b41a08e52ad87d96014be` | complete (~9.9s) | https://sermon-studio-beta.netlify.app **200** |
| macksims-public-site | yes | `6a4b41a14e9c56842590f59d` | last build (~1.2s) | https://macksims-public-site.netlify.app/shutterbid/ **200**; https://macksims-public-site.netlify.app/ **200** |

- Custom domain (no DNS changes this run): https://macksims.com/shutterbid/ **404**; https://macksims.com/ **404** (apex still not serving public-site; see prior Owner actions).
- **ShutterBid outcome: SUCCESS** on primary target https://shutterbid-web.netlify.app (was 404 before Git-connected deploy).

## External testing ready 2026-07-06

**Scope:** FairShare, MotoCrew, CoachCore, Sermon Studio (+ public-site product pages). **Excluded:** ShutterBid, FishCrew, Aegis Intel.

| App | Tester URL | `npm run check` | HTTP smoke | Prod trigger |
|-----|------------|-----------------|------------|--------------|
| FairShare (CurbCue) | https://fairshare-v03-20260624.netlify.app | PASS | 200 | `6a4b4a2b4150b70ef07a92e7` (CLI); trigger CI still errors |
| MotoCrew | https://motocrewz.netlify.app | PASS | 200 | `6a4b4806f4cdc5bbc5119b61` |
| CoachCore | https://coachcore7.netlify.app/app | PASS | 200 | `6a4b48065c851dac02d98103` |
| Sermon Studio | https://sermon-studio-beta.netlify.app | PASS | 200 | `6a4b4806ecb69eb2766fa4e4` |
| MomentPick | — | NOT READY | — | — |
| public-site | https://macksims-public-site.netlify.app/ | n/a | 200 (`/fairshare/`, `/motocrew/`, `/coachcore/`) | not re-triggered this pass |

- Full tester instructions: `docs/EXTERNAL_TESTING_PACKAGE.md`
- Access: guest/demo only (one-time acknowledgement gates; no beta passwords)
- Native TestFlight / Play external testing: **not configured** for these four apps — share Netlify URLs
- **CurbCue rename (2026-07-06):** Pushed `44fcae8` to `DracoSumo/FairShare`; production branding live via CLI deploy `6a4b4a2b4150b70ef07a92e7`. Netlify `--trigger` CI builds still error (exit 2) — owner should fix remote build logs for auto-deploy on push.
