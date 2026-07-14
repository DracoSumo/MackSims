# MackSims Bulk UI Polish + Mismatch Audit Checklist

**Pass date:** 2026-07-05 (Extended — Mismatch Audit + Reality Check)  
**Operator:** Cursor bulk UI polish subagent  
**Scope:** ShutterBid, FairShare, MotoCrew/Throttle, Sermon Studio, CoachCore, MackSims public site, other MackSims apps **except Aegis Intel and FishCrew**

---

## Global exclusions (verified)

- [x] Aegis Intel — **NOT touched** (all `aegis-intel-*` folders skipped)
- [x] FishCrew — **NOT touched** (`FishCrew-Superfolder`, `MackSims/apps/FishCrew`, fishcrew deploy docs read-only)
- [x] No backend / Firebase / Supabase schema or env changes
- [x] No DNS, Netlify/Vercel settings, signing, bundle IDs, package names, app identifiers, console records
- [x] No key rotation, no `.env` commits, no app submissions, no deploys, no new app records

---

## Inventory

| App | Canonical source path | Stack | In scope |
|-----|----------------------|-------|----------|
| FairShare | `C:\Users\draco\Downloads\MackSims\apps\FairShare` | Vite 7 + React 19 | Yes |
| MotoCrew (ThrottleLink lineage) | `C:\Users\draco\Downloads\MackSims\apps\MotoCrew` | Vite 8 + React 19 | Yes |
| CoachCore | `C:\Users\draco\Downloads\MackSims\apps\CoachCore\coachcore-static-v001` | Next.js 16 static export | Yes |
| Sermon Studio (deployed) | `C:\Users\draco\Downloads\sermon-studio-next-patched` | Next.js 14 + Supabase | Yes |
| Sermon Studio (legacy) | `C:\Users\draco\Downloads\sermon-studio-next` | Next.js 14 (older) | Audit only |
| ShutterBid | `C:\Users\draco\Downloads\MackSims\apps\ShutterBid\shutterbid-starter` | Next.js 16 + Firebase | Audit only (store builds separate) |
| ShutterBid (submitted source ref) | `C:\Users\draco\OneDrive\Documents\GitHub\shutterbid-ios` | Capacitor/web wrapper | Verify only — not in Downloads |
| MackSims public site | Intended: `C:\Users\draco\OneDrive\Documents\MackSims\public-site` | Next/static | **SOURCE NOT LOCATED** in Downloads workspace |
| FairShare duplicate | `MackSims/Fairshare` | Duplicate folder | Skipped — use `apps/FairShare` |
| ThrottleLink deploy pack | `macksims-baby-apps-deploy-v003` | Stale deploy bundle | Audit reference only |
| Aegis Intel | `aegis-intel-v9-full` + siblings | — | **EXCLUDED** |
| FishCrew | `FishCrew-Superfolder`, etc. | — | **EXCLUDED** |

---

## Per-app UI polish checklist

### FairShare
- [x] Mobile bottom nav added (414px-friendly, 4 tabs)
- [x] Horizontal top nav hidden on mobile (`max-width: 719px`)
- [x] Demo/beta banners retained (intentional for external beta)
- [x] `npm run check` — **PASS**
- [ ] Owner: confirm beta gate copy acceptable for screenshots
- [ ] Owner: Supabase anon key in Netlify env (not verified this pass)

### MotoCrew
- [x] ~~Footer “Beta tester?” softened → “Questions or feedback?”~~ **REVERTED 2026-07-05 re-audit** — masked beta identity; restored “Beta tester?”
- [x] Existing bottom nav + safety gate unchanged
- [x] `npm run check` — **PASS** (eslint + 2 tests + build; re-run after revert)
- [ ] Owner: final brand name ThrottleLink vs MotoCrew

### Sermon Studio (patched)
- [x] Mobile overflow clip + safe-area padding (`.ss-page`)
- [x] Action/template button grids on small screens
- [x] `npm run check` — **PASS** (1 test + Next build)
- [ ] Deploy refresh needed for production URL to pick up CSS (not deployed this pass)

### CoachCore
- [ ] No source edits this pass (already has mobile bottom nav)
- [x] `npm run check` — **PASS**
- [ ] Owner: demo walkthrough banner vs screenshot readiness

### ShutterBid
- [ ] No source edits (existing store/TestFlight build; audit-only)
- [ ] Owner: screenshot upload approval pending (Pass 010 docs)

### MackSims public site
- [ ] Source not present in Downloads — audit blocked
- [ ] Live routes (`macksims.com/shutterbid`, etc.) — **mismatch documented**

---

## Mismatch audit checklist (all included apps)

| # | Audit area | FairShare | MotoCrew | CoachCore | Sermon Studio | ShutterBid | Public site |
|---|------------|-----------|----------|-----------|---------------|------------|-------------|
| 1 | Source vs submitted build | N/A (no store) | N/A | N/A | v0.1.1 local vs 0.1.0 legacy folder | **POSSIBLE BUILD MISMATCH** 0.1.0 local vs 1.0 store | UNKNOWN |
| 2 | Web UI vs mobile UI | Improved this pass | LIKELY MATCH | LIKELY MATCH | Improved this pass | Pass 009–010 mobile-shell captures | N/A |
| 3 | Public route vs local | Netlify OK; macksims.com N/A | motocrewz.netlify.app OK | coachcore7.netlify.app OK | sermon-studio-beta.netlify.app OK | **macksims.com/shutterbid REJECT** | **BLOCKED** |
| 4 | Store docs vs reality | NOT STARTED store | NOT STARTED | NOT STARTED | NOT STARTED | Extensive docs; gaps remain | Launch pack docs only |
| 5 | Auth/reviewer access | GUEST PATH (beta gate) | GUEST PATH | GUEST PATH (demo) | GUEST PATH | **LOGIN REQUIRED** per ASC | UNKNOWN |
| 6 | Privacy/data safety | NEEDS OWNER | NEEDS OWNER | NEEDS OWNER | NEEDS OWNER | **BLOCKED** — questionnaires open | N/A |
| 7 | Screenshot assets | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | 3× READY per STATUS; OneDrive paths | N/A |
| 8 | Package/deployment | v0.3.0 matches Netlify slug | v0.0.0 package | v0.5.0 | patched vs `sermon-studio-next` duplicate | Multiple shutterbid folders | Deploy pack vs live |
| 9 | Brand/name | FairShare OK | **MotoCrew vs ThrottleLink** | CoachCore OK | Sermon Studio OK | ShutterBid OK | MackSims OK |
| 10 | Final status | MINOR POLISH ONLY | MINOR POLISH ONLY | MINOR POLISH ONLY | MINOR POLISH ONLY | **POSSIBLE MISMATCH** | **SOURCE NOT LOCATED** |

---

## Build commands run (2026-07-05)

| App | Command | Result |
|-----|---------|--------|
| FairShare | `npm run check` | **PASS** (vitest + vite build) |
| MotoCrew | `npm run check` | **PASS** (eslint + vitest + vite build) |
| CoachCore | `npm run check` | **PASS** (vitest + next build, 41 routes) |
| Sermon Studio (patched) | `npm run check` | **PASS** (vitest + next build) |
| ShutterBid | Not run (audit-only; excluded from edits) | — |

---

## Secret scan (changed files only)

Scanned edited files for JWTs, passwords, service accounts, `.p8`, keystores:

- `MackSims/apps/FairShare/src/components/AppShell.tsx` — **CLEAN**
- `MackSims/apps/FairShare/src/styles.css` — **CLEAN**
- `MackSims/apps/MotoCrew/src/App.tsx` — **CLEAN**
- `sermon-studio-next-patched/app/globals.css` — **CLEAN**
- `sermon-studio-next-patched/app/page.tsx` — **CLEAN**

Only acceptable placeholder in docs: `DO_NOT_COMMIT_PASSWORD`.

---

## Backups

| Backup root | Notes |
|-------------|-------|
| `MackSims/.backups/bulk-ui-polish-20260705-170500/` | Snapshot marker created; full pre-edit mirrors deferred — use git history for revert |
| `MackSims/.backups/bulk-ui-reaudit-20260705-171800/` | MotoCrew `App.tsx` post-revert snapshot |

---

## Owner review queue (before store/screenshots)

1. **ShutterBid** — Confirm 3 mobile-shell PNGs match submitted TestFlight/AAB build; approve upload; fix `macksims.com/shutterbid` separately (DNS/hosting — out of scope)
2. **ShutterBid** — Complete App Privacy + Play Data Safety (owner questionnaires)
3. **MotoCrew** — Pick final store name (MotoCrew vs ThrottleLink)
4. **FairShare** — Beta gate + demo banners: keep for beta or hide for marketing screenshots
5. **MackSims public site** — Locate/provision `public-site` repo; fix app landing routes
6. **All pre-store apps** — Complete `PRIVACY_DATA.md` per app before store claims

---

## Screenshot candidate routes (local, post-polish)

| App | Route / screen | Mobile shell | Notes |
|-----|----------------|--------------|-------|
| FairShare | `/compare` | Bottom nav ✅ | Demo banner visible |
| FairShare | `/crowd-meter` | Bottom nav ✅ | Good density |
| FairShare | `/` home | Bottom nav ✅ | Beta gate on first visit |
| MotoCrew | `/` home after safety ack | Bottom nav ✅ | Demo notice in footer |
| MotoCrew | Rides list | Bottom nav ✅ | |
| MotoCrew | Map placeholder | Bottom nav ✅ | Honest placeholder |
| CoachCore | `/app` dashboard | Bottom nav ✅ | Demo walkthrough banner |
| CoachCore | `/app/training` | Bottom nav ✅ | |
| CoachCore | `/` landing | Desktop + mobile | Marketing hook |
| Sermon Studio | `/` editor (Scripture tab) | Responsive ✅ | Beta banner |
| Sermon Studio | Library section | Responsive ✅ | |
| ShutterBid | `/`, `/jobs/…`, `/post-job` | Mobile shell per Pass 009–010 | **Do not use Pass 006 desktop captures** |

---

## Next pass

- [ ] Deploy Sermon Studio patched build if owner wants CSS fixes live
- [ ] Re-run FairShare/MotoCrew mobile capture at 414×896 @3x after deploy
- [ ] Locate MackSims public-site source and audit landing routes
- [ ] ShutterBid: owner approval on screenshot package (`ASSET_UPLOAD_PACKAGE_CHECKLIST.md`)
