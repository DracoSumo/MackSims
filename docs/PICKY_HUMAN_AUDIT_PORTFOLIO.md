# Picky Human Audit — MackSims Portfolio Master Summary

**Audit date:** 2026-07-05  
**Auditor role:** QA lead / product / release / backup operator / human tester  
**Scope:** All MackSims apps except **Aegis Intel** and **FishCrew** (hard excluded — zero edits, zero backups, zero tests)

---

## Portfolio inventory (Phase 0)

| App | Version | Framework | Source path | Deploy target | Live URL |
|-----|---------|-----------|-------------|---------------|----------|
| **FairShare** | 0.3.0 | Vite + React 19 | `MackSims/apps/FairShare` | Netlify | https://fairshare-v03-20260624.netlify.app |
| **MotoCrew** | 0.0.0 (label v0.1) | Vite + React 19 | `MackSims/apps/MotoCrew` | Netlify | https://motocrewz.netlify.app |
| **CoachCore** | 0.5.0 | Next.js 16 | `MackSims/apps/CoachCore/coachcore-static-v001` | Netlify | https://coachcore7.netlify.app |
| **Sermon Studio** | 0.1.1 deployed / 0.1.0 local | Next.js 14 | `Downloads/sermon-studio-next` (patched source **missing**) | Netlify | https://sermon-studio-beta.netlify.app |
| **ShutterBid** | 0.1.0 local / 1.0 store | Next.js 16 + Firebase | `MackSims/apps/ShutterBid/shutterbid-starter` | ASC/Play (no Netlify prod) | macksims.com/shutterbid **404** |
| **MomentPick** | 0.1.0 | Next.js 16 + Firebase | `MackSims/apps/momentpick-web` | Not deployed (no live URL found) | — |
| **MackSims public site** | static HTML | Netlify static | `MackSims/public-site` | Netlify (macksims.com) | https://macksims.com — **partially broken routes** |

**Also found (out of audit scope):** `MackSims/Fairshare` (duplicate spelling), empty `apps/SermonStudio`, root MackSims monorepo shell.

---

## Backup status (Phase 1)

All backups: `MackSims/backups/[app]-backup-before-picky-human-2026-07-05-1822.zip`

| App | Backup | Size | Secrets in ZIP |
|-----|--------|------|----------------|
| FairShare | ✅ | 0.19 MB | None (.env excluded) |
| MotoCrew | ✅ | 0.10 MB | None |
| CoachCore | ✅ | 1.21 MB | None |
| SermonStudio | ✅ | 0.04 MB | None (local unpatched copy) |
| ShutterBid | ✅ | 1.75 MB | None (.env.local excluded) |
| MomentPick | ✅ | 0.22 MB | None |
| MackSimsPublicSite | ✅ | 0.16 MB | None |

---

## Deploy recommendation matrix

| App | Verdict | Why |
|-----|---------|-----|
| **FairShare** | **SAFE** (beta Netlify redeploy) | `npm run check` PASS; production smoke PASS; demo admin reachable but mock-only |
| **MotoCrew** | **SAFE** (beta Netlify redeploy) | `npm run check` PASS; production smoke PASS |
| **CoachCore** | **SAFE** (beta Netlify redeploy) | `npm run check` PASS; production smoke PASS; demo admin public but mock |
| **Sermon Studio** | **NOT SAFE** (source mismatch) | Deployed beta works; **local source cannot rebuild**; patched v0.1.1 missing from Downloads |
| **ShutterBid** | **NOT SAFE** (store/public gaps) | Build PASS; macksims.com route dead; store privacy incomplete; local ≠ store version |
| **MomentPick** | **NOT SAFE** (lint + no deploy) | Build PASS; **lint FAIL**; no production URL; Firebase unset |
| **MackSims public site** | **NOT SAFE** (DNS/hosting) | Encoding fixed locally; **macksims.com/shutterbid returns SITE NOT FOUND**; needs Netlify redeploy after DNS fix |

---

## Cross-portfolio blockers (brutally honest)

1. **macksims.com product routes broken** — `/shutterbid/` returns Netlify "SITE NOT FOUND". Public marketing site source exists locally but is not serving correctly on production domain.
2. **Sermon Studio source drift** — Production runs `sermon-studio-next-patched` v0.1.1; only `sermon-studio-next` v0.1.0 exists locally and **fails TypeScript build** (`tabs.tsx` cloneElement typing).
3. **ShutterBid store vs local** — Package `0.1.0` vs ASC/Play `1.0`; privacy/data-safety questionnaires incomplete per prior store docs.
4. **Demo admin surfaces public** — FairShare `/admin` and CoachCore `/app/admin` reachable without auth (mock data only — not a secret leak, but violates "admin not public" policy for App Store reviewer persona).
5. **MomentPick lint errors** — ESLint fails on `AuthProvider.tsx` and `CameraRollImporter.tsx`; not deploy-ready.

---

## Patches applied this pass

| App | Change | Severity addressed |
|-----|--------|-------------------|
| MackSims public site | Fixed UTF-8 mojibake (`â€"` → `—`) on fairshare, motocrew, coachcore, shutterbid, support, beta, fishcrew landing pages | MEDIUM (copy/UX) |

No other code patches — remaining issues need owner decisions (auth gates, DNS, sermon patched source recovery).

---

## Automated test summary (Phase 7)

| App | Command | Result |
|-----|---------|--------|
| FairShare | `npm run check` | **PASS** (5 tests, build OK) |
| MotoCrew | `npm run check` | **PASS** (lint, 2 tests, build OK) |
| CoachCore | `npm run check` | **PASS** (2 tests, Next build 41 routes) |
| Sermon Studio | `npm run build` | **FAIL** — TypeScript error in `components/ui/tabs.tsx` |
| ShutterBid | `npm run build` | **PASS** (138 routes) |
| MomentPick | `npm run build` | **PASS**; `npm run lint` | **FAIL** (2 errors, 3 warnings) |
| Public site | N/A (static) | Manual HTML review only |

---

## Manual smoke summary (Phase 8)

| URL | 390px-equivalent | Loads | Console | Notes |
|-----|------------------|-------|---------|-------|
| fairshare-v03-20260624.netlify.app | ✅ | ✅ | Not fully probed | Bottom nav, beta banner, compare flow visible |
| motocrewz.netlify.app | ✅ | ✅ | Not fully probed | 6-tab nav, demo disclaimers present |
| coachcore7.netlify.app/app | ✅ | ✅ | Not fully probed | Demo banner, mock athletes, mobile nav |
| sermon-studio-beta.netlify.app | ✅ | ✅ | Not fully probed | Full sermon editor UI functional |
| macksims.com/shutterbid | — | ❌ | — | **SITE NOT FOUND** |
| MomentPick | — | ❌ | — | No deploy URL — local only |

---

## Excluded apps (confirmed untouched)

- **Aegis Intel** — workspace at `aegis-intel-v9-full`; zero file access in this pass
- **FishCrew** — `apps/FishCrew`; zero edits (public-site fishcrew page encoding fixed as part of public site only)

---

## Next actions for owner

1. **Recover `sermon-studio-next-patched`** or tag deployed Netlify commit as canonical source.
2. **Fix macksims.com DNS/Netlify** — attach public-site deploy or fix `_redirects`/site ID so product landings resolve.
3. **Redeploy public site** after encoding fix (ZIP not built this pass — site NOT SAFE until redeployed).
4. **ShutterBid** — complete App Privacy / Play Data Safety before any store promotion; confirm OneDrive iOS repo matches store build.
5. **MomentPick** — fix lint, configure Firebase, deploy to staging before any public link.
6. **Optional:** Add demo-only auth gate on FairShare/CoachCore admin routes if App Store reviewer scrutiny is a concern.

---

## Related documents

- Full per-app 16-section reports: [PICKY_HUMAN_AUDIT.md](./PICKY_HUMAN_AUDIT.md)
- Prior polish pass: [BULK_UI_POLISH_REPORT.md](./BULK_UI_POLISH_REPORT.md)
