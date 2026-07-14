# Picky Human Audit — MackSims Portfolio (Full Report)

**Date:** 2026-07-05  
**Pass:** Picky Human Audit (Phases 0–10)  
**Excluded:** Aegis Intel, FishCrew app (hard exclude)

Each app below uses the **16-section audit template**.

---

# FairShare

## 1. Executive summary
Mobility fare-comparison beta. Builds and tests pass. Production deploy loads cleanly with mobile bottom nav. Demo operator admin is publicly reachable without login (mock metrics only). **SAFE for beta Netlify redeploy.**

## 2. App identity
- **Name:** FairShare Mobility Platform
- **Version:** 0.3.0 (`package.json`)
- **Framework:** Vite 7 + React 19 + TypeScript + Vitest + Supabase client

## 3. Commands
| Script | Command |
|--------|---------|
| Dev | `npm run dev` (port 3000) |
| Test | `npm run test` |
| Build | `npm run build` |
| Check | `npm run check` (= test + build) |

## 4. Deploy
- **Target:** Netlify (`netlify.toml`, publish `dist`)
- **Live:** https://fairshare-v03-20260624.netlify.app

## 5. Source & docs
- **Source:** `MackSims/apps/FairShare`
- **Docs:** `README.md`, `BETA_READINESS_REPORT.md`, `docs/OAUTH_SETUP.md`, `supabase/schema.sql`
- **ZIP artifacts:** None in repo root; prior deploy packs in `_backups`

## 6. Env & git
- **`.env.example`:** Yes — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (placeholder)
- **`.env.local`:** Not committed (correct)
- **Git:** Part of MackSims monorepo; not independently verified this pass

## 7. Backup
`MackSims/backups/FairShare-backup-before-picky-human-2026-07-05-1822.zip` (0.19 MB, no secrets)

## 8. Persona gauntlet (A–H)
| Persona | Finding |
|---------|---------|
| **A. Snotty Brat** | Beta banner wordy but clear; wants skip button — none |
| **B. Lazy Bum** | Home pre-fills airport→hotel; one-click "Compare rides" works |
| **C. Accomplished Doctor** | Fare breakdown labels sane; no medical/finance advice |
| **D. Mother-in-law** | Support email visible; demo disclaimers repeated |
| **E. Dumbest Human** | Can reach `/admin` by URL — confusing but labeled demo |
| **F. Admin/Owner** | Operator dashboard shows mock metrics; no real PII |
| **G. App Store Reviewer** | Demo data labeled; admin public may raise questions |
| **H. Mobile (390/430/768)** | Bottom nav present; horizontal nav hidden on small screens |

## 9. Core flows
| Flow | Result |
|------|--------|
| First load | PASS — beta gate + home |
| Compare rides | PASS — form pre-filled |
| CrowdMeter | PASS — nav reachable |
| Persist (saved places) | localStorage — empty state OK |
| Refresh | PASS — Netlify SPA redirect assumed |
| Settings/Account | PASS — OAuth optional |
| Admin | PASS functionally — **no auth gate** |

## 10. Visual/copy killers
- Chunk size warning (>500 kB) — LOW
- "Loading demo nightlife data…" may persist briefly — LOW

## 11. Functional killers
- None blocking

## 12. Security killers
- Admin routes public (mock only) — **MEDIUM**
- No raw API keys in source grep — PASS
- Supabase anon key via env only — PASS

## 13. Severity table
| ID | Severity | Issue |
|----|----------|-------|
| FS-01 | MEDIUM | `/admin` public without gate |
| FS-02 | LOW | Large JS bundle |
| FS-03 | LOW | Dynamic import chunk warnings |

## 14. Patches this pass
None (admin gating deferred — needs product decision)

## 15. Tests
```
npm run check → PASS (5/5 tests, build OK)
Warnings: chunk size, dynamic import duplication
```

## 16. Recommendation
**SAFE** — beta Netlify redeploy OK. Not store-ready (privacy questionnaire pending).

---

# MotoCrew

## 1. Executive summary
Motorcycle group-ride demo shell. Lint, tests, build all pass. Production site clean with safety disclaimers. **SAFE for beta redeploy.**

## 2. App identity
- **Version:** 0.0.0 (UI label v0.1)
- **Framework:** Vite 8 + React 19 + ESLint + Vitest + Supabase

## 3. Commands
`npm run dev` | `npm run lint` | `npm run test` | `npm run build` | `npm run check`

## 4. Deploy
Netlify → https://motocrewz.netlify.app

## 5. Source & docs
`MackSims/apps/MotoCrew` — `docs/`, `README.md`, Supabase schema

## 6. Env & git
`.env.example` present; secrets not committed

## 7. Backup
`MotoCrew-backup-before-picky-human-2026-07-05-1822.zip` (0.10 MB)

## 8. Personas
| Persona | Finding |
|---------|---------|
| Snotty Brat | "Do not use while riding" — good |
| Lazy Bum | Home shows featured rides immediately |
| Doctor | Safety copy appropriate |
| Mother-in-law | feedback@macksims.com linked |
| Dumbest Human | "View details" x5 — all work |
| Admin | No admin surface exposed |
| App Store | Beta demo shell clearly stated |
| Mobile | 6-tab bottom nav — excellent |

## 9. Core flows — all PASS
Home, rides, map/chat/safety/profile nav, demo data banners

## 10–12. Killers
- Brand confusion MotoCrew vs ThrottleLink — LOW (documented)
- No live GPS/comms — intentional beta disclaimer

## 13. Severity
All LOW — polish only

## 14. Patches
None

## 15. Tests
`npm run check` → **PASS** (eslint, 2 tests, build)

## 16. Recommendation
**SAFE** — beta redeploy

---

# CoachCore

## 1. Executive summary
Coach accountability demo (Next.js static export). Tests and build pass. Rich mock dashboard. `/app/admin` publicly reachable with fake org stats. **SAFE for beta redeploy** with admin caveat.

## 2. App identity
- **Version:** 0.5.0
- **Framework:** Next.js 16.2.9 + Tailwind 4 + Supabase

## 3. Commands
`npm run dev` | `npm run test` | `npm run build` | `npm run check`

## 4. Deploy
https://coachcore7.netlify.app

## 5. Source
`MackSims/apps/CoachCore/coachcore-static-v001`

## 6. Env
`.env.example` — Supabase keys placeholder

## 7. Backup
1.21 MB ZIP confirmed

## 8. Personas
Demo walkthrough banner satisfies most personas; admin page may confuse App Store reviewer

## 9. Core flows
Home `/app`, team, training, nutrition, chat — all load with mock athletes

## 10–12. Killers
- Mock athlete names visible (Marcus Reed, etc.) — intentional demo
- `/app/admin` no auth — **MEDIUM**
- Youth/health data scope needs privacy owner review — **HIGH** (pre-store, not deploy blocker for beta)

## 13. Severity
| ID | Sev | Issue |
|----|-----|-------|
| CC-01 | MEDIUM | Public admin demo |
| CC-02 | HIGH | Privacy questionnaire for youth/health (pre-store) |

## 14. Patches
None

## 15. Tests
`npm run check` → **PASS** (2 tests, 41 routes built)

## 16. Recommendation
**SAFE** — beta Netlify. **NOT SAFE** for App Store until privacy completed.

---

# Sermon Studio

## 1. Executive summary
**Broken local rebuild.** Deployed beta works in browser. Patched source v0.1.1 missing; local v0.1.0 fails build. **NOT SAFE to ship from current local tree.**

## 2. App identity
- **Deployed:** v0.1.1 (per prior docs)
- **Local:** v0.1.0 (`sermon-studio-next`)
- **Framework:** Next.js 14 + Supabase + Tailwind

## 3. Commands
Local: `dev`, `build`, `seed` only — **no `check` script**
Deployed patched had `npm run check` per prior report

## 4. Deploy
https://sermon-studio-beta.netlify.app — **loads PASS**

## 5. Source
- **Expected:** `sermon-studio-next-patched` — **NOT FOUND**
- **Found:** `C:\Users\draco\Downloads\sermon-studio-next`
- `MackSims/apps/SermonStudio` — empty

## 6. Env
`.env.local` may exist locally (not inspected for secrets)

## 7. Backup
0.04 MB (unpatched source only)

## 8. Personas
Deployed UI: sermon editor, tabs, save/copy/print — all functional for lazy/accomplished users

## 9. Core flows (deployed)
PASS — outline templates, scripture tab, save draft

## 10–12. Killers
- **BLOCKER:** Cannot rebuild from local source
- Single long page dense on mobile — MEDIUM (partially fixed in patched deploy per prior pass)

## 13. Severity
| SS-01 | BLOCKER | Patched source missing |
| SS-02 | BLOCKER | Local `npm run build` fails TypeScript |
| SS-03 | MEDIUM | Mobile density |

## 14. Patches
None — need source recovery

## 15. Tests
```
npm run build → FAIL
./components/ui/tabs.tsx:9 — cloneElement typing error
```

## 16. Recommendation
**NOT SAFE** — do not package from local. Redeploy only from recovered patched source.

---

# ShutterBid

## 1. Executive summary
Large Next.js + Firebase marketplace. Build passes (138 routes). Store builds at v1.0; local at v0.1.0. Public macksims.com landing **404**. Privacy incomplete. **NOT SAFE for public promotion or new store submit without owner review.**

## 2. App identity
- **Version:** 0.1.0 local / 1.0 store
- **Framework:** Next.js 16.2.6 + Firebase 12 + Tailwind 4 + Playwright

## 3. Commands
Extensive: `npm run build`, `npm run check:full`, `npm run test:smoke`, 80+ check scripts

## 4. Deploy
- Native: ASC + Play (uploaded per prior docs)
- Web: No Netlify prod URL verified
- Public: https://macksims.com/shutterbid → **SITE NOT FOUND**

## 5. Source
`MackSims/apps/ShutterBid/shutterbid-starter`

## 6. Env
`.env.example`, `.env.local`, `.env.production.local` exist locally — **excluded from backup**

## 7. Backup
1.75 MB confirmed

## 8. Personas
Marketplace complexity — lazy user may get lost; demo routes abundant; admin routes exist in app (not smoke-tested live)

## 9. Core flows
Build generates all routes; live smoke not run (no public web deploy URL)

## 10–12. Killers
- Public route 404 — **BLOCKER**
- Store privacy incomplete — **BLOCKER** (store)
- Version mismatch — **HIGH**
- `.env.local` on disk — ensure never packaged

## 13. Severity
Multiple BLOCKER/HIGH — see portfolio summary

## 14. Patches
None this pass

## 15. Tests
`npm run build` → **PASS** (138 pages)

## 16. Recommendation
**NOT SAFE** for web deploy or store marketing until public URL + privacy fixed.

---

# MomentPick

## 1. Executive summary
Photo triage/portfolio Next.js app. Build passes; **lint fails**. No production deploy found. Firebase unset. **NOT SAFE.**

## 2. App identity
- **Version:** 0.1.0
- **Framework:** Next.js 16.2.10 + Firebase + Capacitor camera

## 3. Commands
`dev`, `build`, `lint` — no `check` or `test`

## 4. Deploy
None verified

## 5. Source
`MackSims/apps/momentpick-web`

## 6. Env
`.env.example` — Firebase + OpenAI placeholders

## 7. Backup
0.22 MB

## 8–9. Personas/flows
Not smoke-tested locally (no dev server run this pass)

## 10–12. Killers
- Lint errors in AuthProvider, CameraRollImporter — **HIGH**
- Next.js workspace root warning (lockfile at user home) — **MEDIUM**
- No deploy — **BLOCKER** for public

## 13. Severity
| MP-01 | BLOCKER | No production deploy |
| MP-02 | HIGH | ESLint errors |
| MP-03 | MEDIUM | turbopack root mis-detection |

## 14. Patches
None (lint fix is easy but AuthProvider pattern needs care)

## 15. Tests
```
npm run build → PASS (11 routes)
npm run lint → FAIL (2 errors, 3 warnings)
```

## 16. Recommendation
**NOT SAFE**

---

# MackSims Public Site

## 1. Executive summary
Static HTML marketing site. Source **found** at `MackSims/public-site` (contrary to prior "not located" report). UTF-8 mojibake **fixed locally**. Production macksims.com/shutterbid **still broken**. **NOT SAFE until redeployed + DNS verified.**

## 2. App identity
Static HTML + CSS + JS, Netlify publish `public/`

## 3. Commands
None (no package.json). Scripts: `scripts/update-nav.ps1`, `update-footer.ps1`

## 4. Deploy
Netlify → macksims.com (partial)

## 5. Source & docs
`public-site/public/`, `docs/PUBLIC_LAUNCH_CHECKLIST.md`, store launch drafts

## 6. Env
None required

## 7. Backup
0.16 MB

## 8. Personas
Mother-in-law/support pages readable after encoding fix; broken product routes fail everyone

## 9. Core flows
| Route | Result |
|-------|--------|
| / (assumed) | Not probed this pass |
| /shutterbid/ | **FAIL — SITE NOT FOUND** |
| Local HTML | PASS after encoding fix |

## 10–12. Killers
- DNS/hosting mismatch — **BLOCKER**
- Mojibake em-dashes — **FIXED** locally (was MEDIUM)

## 14. Patches applied
UTF-8 em-dash repair on: fairshare, motocrew, coachcore, shutterbid, support, beta, fishcrew index pages

## 15. Tests
Static — no npm scripts

## 16. Recommendation
**NOT SAFE** — redeploy after owner confirms Netlify site linkage to macksims.com

---

# Phase 9 — Packaging

No deploy ZIPs created this pass. Apps marked NOT SAFE were intentionally not packaged per audit rules.

Apps that could be packaged on owner request (after optional redeploy):
- FairShare, MotoCrew, CoachCore — builds verified PASS

---

# Phase 10 — Owner sign-off checklist

- [ ] Recover sermon-studio-next-patched source
- [ ] Fix macksims.com → public-site Netlify attachment
- [ ] Redeploy public site (encoding fix)
- [ ] ShutterBid privacy + public landing
- [ ] MomentPick lint + staging deploy
- [ ] Decide on demo admin auth gates (FairShare, CoachCore)

---

*Generated by Picky Human Audit — 2026-07-05*
