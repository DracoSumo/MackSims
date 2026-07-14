# MackSims Bulk UI Polish + Mismatch Audit Report

**Date:** 2026-07-05  
**Pass:** Bulk UI Polish + Extended Mismatch Audit / Reality Check  
**Workspace roots searched:** `C:\Users\draco\Downloads` (MackSims monorepo, sibling app folders, deploy packs)

---

## Executive summary

This pass **polished mobile UI** for FairShare, MotoCrew, and Sermon Studio (patched), **audited all included MackSims apps** for source/store/route/screenshot mismatches, and **documented blockers without hiding risk**.

**Aegis Intel and FishCrew were not edited.** No backend, Firebase, Supabase, DNS, hosting, signing, bundle IDs, package names, app records, or console settings were changed. Nothing was deployed or submitted.

**Strongest TestFlight / Play internal testing candidates today:** ShutterBid (builds already uploaded; screenshots pending owner approval) → MotoCrew (clean guest demo shell) → FairShare (functional compare after beta gate).

**Apps needing owner review before upload/testing:** ShutterBid (privacy, screenshots, public landing URL), MackSims public site (source not located locally), all pre-store apps (FairShare, MotoCrew, CoachCore, Sermon Studio) for privacy questionnaires and brand decisions.

---

## Apps found vs skipped

### Included and audited

| App | Source path | Status this pass |
|-----|-------------|------------------|
| **FairShare** | `MackSims/apps/FairShare` | UI polished + builds PASS |
| **MotoCrew** | `MackSims/apps/MotoCrew` | UI polished (footer revert on re-audit) + builds PASS |
| **CoachCore** | `MackSims/apps/CoachCore/coachcore-static-v001` | Audit + builds PASS; no edits |
| **Sermon Studio** | `sermon-studio-next-patched` (deployed) | UI polished + builds PASS |
| **ShutterBid** | `MackSims/apps/ShutterBid/shutterbid-starter` | Audit only — store builds separate |
| **MackSims public site** | Intended OneDrive `public-site` | **SOURCE NOT LOCATED** in Downloads |

### Explicitly excluded (not touched)

| App / folder | Reason |
|--------------|--------|
| **Aegis Intel** | All `aegis-intel-*` folders under Downloads — hard exclusion |
| **FishCrew** | `FishCrew-Superfolder`, `MackSims/apps/FishCrew`, fishcrew deploy assets — hard exclusion |

### Skipped duplicates / out of scope

| Path | Reason |
|------|--------|
| `MackSims/Fairshare` | Duplicate spelling; canonical is `apps/FairShare` |
| `shutterbid-*` backup folders in Downloads | Duplicates; canonical starter in MackSims monorepo |
| `macksims-baby-apps-deploy-v003` | Stale deploy bundle (ThrottleLink v0.1 era) — reference only |
| `sermon-studio-next` (unpatched) | Superseded by `sermon-studio-next-patched` for production |
| `sports-predictor-mvp` | Not MackSims portfolio app |

**Confirmation:** Aegis Intel and FishCrew received **zero file edits** in this pass.

---

## Final mismatch table

| App | Source Path | Local Version | Store/Test Version | UI Match | Mobile Match | Public Route Match | Screenshot Match | Privacy/Access Match | Status | Notes |
|-----|-------------|---------------|-------------------|----------|--------------|-------------------|------------------|---------------------|--------|-------|
| **ShutterBid** | `MackSims/apps/ShutterBid/shutterbid-starter` (+ OneDrive `shutterbid-ios` ref) | package `0.1.0` | ASC `1.0 (20260624035226)`; Play `1.0` / code `1782330956` | LIKELY MATCH (Capacitor web) | **LIKELY NATIVE MATCH** after Pass 009–010 | **MISMATCH** — `https://macksims.com/shutterbid` → Site not found | **3 READY** (1242×2688) owner approval pending; Pass 006 **SUPERSEDED** | **BLOCKED** — App Privacy / Play Data Safety incomplete | **POSSIBLE MISMATCH** | Local package version ≠ store 1.0; confirm OneDrive repo = submitted build |
| **FairShare** | `MackSims/apps/FairShare` | `0.3.0` / label v0.3 | No store record | MATCH | **IMPROVED** — bottom nav added | **MATCH** — `https://fairshare-v03-20260624.netlify.app/` | NOT STARTED | NEEDS OWNER — `PRIVACY_DATA.md` | **MINOR POLISH ONLY** | Beta gate + demo banners intentional |
| **MotoCrew** | `MackSims/apps/MotoCrew` | `0.0.0` / label v0.1 | No store record | MATCH | MATCH — existing bottom nav | **MATCH** — `https://motocrewz.netlify.app` | NOT STARTED | NEEDS OWNER | **MINOR POLISH ONLY** | Brand: MotoCrew vs ThrottleLink undecided |
| **CoachCore** | `MackSims/apps/CoachCore/coachcore-static-v001` | `0.5.0` | No store record | MATCH | MATCH — mobile bottom nav | **MATCH** — `https://coachcore7.netlify.app` | NOT STARTED | NEEDS OWNER — youth/health data scope | **MINOR POLISH ONLY** | Demo walkthrough banner on `/app/*` |
| **Sermon Studio** | `sermon-studio-next-patched` | `0.1.1` | No store record | MATCH (patched) | **IMPROVED** — overflow/button grid | **MATCH** — `https://sermon-studio-beta.netlify.app` | NOT STARTED | NEEDS OWNER | **MINOR POLISH ONLY** | Legacy `sermon-studio-next` v0.1.0 is stale duplicate |
| **MackSims public site** | OneDrive `public-site` (not in Downloads) | UNKNOWN | N/A | UNKNOWN | UNKNOWN | **MISMATCH** — app landing routes fail | N/A | N/A | **SOURCE NOT LOCATED** | Launch pack docs only in Downloads |
| **ThrottleLink (deploy pack)** | `macksims-baby-apps-deploy-v003/.../ThrottleLink` | v0.1 era | N/A | **MISMATCH** vs MotoCrew | Stale | Unknown | N/A | N/A | **POSSIBLE MISMATCH** | Do not deploy; use `apps/MotoCrew` |

**CLEAN status was not assigned to any app** — store readiness, privacy, public routes, or source/version alignment gaps remain everywhere except pure local demos.

---

## Mismatch audit detail (by category)

### 1. Source vs submitted build

| App | Verdict | Evidence |
|-----|---------|----------|
| ShutterBid | **POSSIBLE BUILD MISMATCH** | Local `shutterbid-starter` is `0.1.0`; ASC/Play show `1.0`. Store docs cite `C:\Users\draco\OneDrive\Documents\GitHub\shutterbid-ios` as capture source — not verified byte-for-byte against Downloads copy. |
| FairShare / MotoCrew / CoachCore / Sermon | **N/A or LIKELY MATCH** | No console records; Netlify deploys align with local package versions per `BUILD_FULL_REPORT.md`. |
| MackSims public site | **UNKNOWN** | Source not present in Downloads workspace. |

### 2. Web UI vs native/mobile UI

| App | Verdict | Notes |
|-----|---------|-------|
| ShutterBid | Pass 008 flagged **WEB-ONLY CAPTURE RISK** at 1242 CSS px; Pass 009–010 retook at **414×896 @3x** with mobile shell | Footer “Admin access” was flagged in Pass 010 JSON for some scenes — see screenshot section |
| FairShare | **Fixed this pass** — added fixed bottom nav; hides horizontal nav on mobile | Prior: top nav scroll only |
| MotoCrew | Already mobile-first with 6-tab bottom nav | |
| CoachCore | Desktop sidebar hidden `lg:`; 5-tab mobile nav | |
| Sermon Studio | **Fixed this pass** — overflow-x clip, 2-col button grids on small screens | Single long page still dense |

### 3. Public route vs local route

| Expected route | Actual | Likely cause | Local source usable for screenshots? |
|--------------|--------|--------------|--------------------------------------|
| `https://macksims.com/shutterbid` | **Site not found** (Pass 005) | DNS/hosting / public-site gap | Yes — use local dev or `shutterbid.macksims.com` per `BETA_CYCLE_LOG.md` |
| `https://fairshare-v03-20260624.netlify.app/` | HTTP 200 (per prior deploy report) | — | Yes |
| `https://motocrewz.netlify.app` | HTTP 200 (per prior deploy report) | — | Yes |
| `https://coachcore7.netlify.app` | HTTP 200 (per prior deploy report) | Yes — dismiss demo banner for cleaner shots |
| `https://sermon-studio-beta.netlify.app` | HTTP 200 (per prior deploy report) | Yes — redeploy needed for CSS fixes from this pass |
| MackSims support/privacy/terms | Documented in launch pack; live status not re-probed | public-site repo | Blocked until source located |

**DNS/hosting not modified this pass.**

### 4. Store docs vs app reality

| App | Key mismatches |
|-----|----------------|
| ShutterBid | Play short/full description blank; privacy URL blank; screenshots not uploaded; Apple build not selected for review; marketing URL points to broken `/shutterbid` landing |
| FishCrew | (Excluded from edits — documented only) FishCrew ASC group was wrongly named “ShutterBid Testers” — corrected in prior pass |
| FairShare / MotoCrew / CoachCore / Sermon | Store docs **NOT STARTED** — seeded templates only; product features exceed store claims (simulated data, demo auth) |
| MotoCrew | Docs folder named **throttlelink** but app branded **MotoCrew** |

### 5. Auth / reviewer access

| App | Mark | Notes |
|-----|------|-------|
| ShutterBid | **LOGIN REQUIRED DESPITE DOCS** for full flows | ASC sign-in required checked; guest browse limited; reviewer creds use `DO_NOT_COMMIT_PASSWORD` only |
| FairShare | **GUEST PATH NOT VERIFIED** live | Beta gate then guest compare works locally |
| MotoCrew | **READY** (guest) | Safety ack → browse rides without login |
| CoachCore | **GUEST PATH** | Demo dashboard without real auth; login/signup are shells |
| Sermon Studio | **READY** (guest) | Local + optional OAuth |

### 6. Privacy / data safety

All pre-store apps: **NEEDS OWNER CONFIRMATION** — complete per-app `PRIVACY_DATA.md` / questionnaires.

ShutterBid: **BLOCKED** — Apple App Privacy “Get Started”; Play Data Safety incomplete; owner questionnaires in `docs/store-launch/apps/shutterbid/PRIVACY_OWNER_QUESTIONNAIRE.md`.

No owner-confirmed answers were weakened or invented.

### 7. Screenshot asset mismatch

| App | Verdict | Details |
|-----|---------|---------|
| ShutterBid | **NEEDS RETAKE / OWNER REVIEW** | Pass 010 STATUS.md claims **3 READY**; `pass010-shutterbid-postjob-capture-results.json` still lists **NEEDS RETAKE** with footer admin + draft banner — **doc vs JSON mismatch**; assets on OneDrive not in Downloads workspace |
| FishCrew | **NEEDS RETAKE** (prior pass) | Beta banner in captures — excluded from edits |
| Others | **NOT STARTED** | No PNG assets in repo |

Old captures marked **SUPERSEDED** per store-launch STATUS (Pass 006 desktop layout) — not deleted.

### 8. Package / deployment mismatch

| Issue | Detail |
|-------|--------|
| ShutterBid folder proliferation | `shutterbid-ios-clean`, `shutterbid-github`, `shutterbid-v0.1-download-and-go`, etc. — risk of editing wrong tree |
| Sermon Studio dual folders | Production = `sermon-studio-next-patched` v0.1.1; `sermon-studio-next` v0.1.0 is stale |
| FairShare duplicate | `MackSims/Fairshare` vs `MackSims/apps/FairShare` |
| ThrottleLink deploy pack | Older FairShare + ThrottleLink bundles in `macksims-baby-apps-deploy-v003` |

### 9. Brand / name mismatch

| Doc / artifact | App reality |
|----------------|-------------|
| `docs/store-launch/apps/throttlelink/` | App code uses **MotoCrew**; config says “Throttle / ThrottleLink concept lineage” |
| ShutterBug | Not found — **ShutterBid** consistent |
| GoFare / FairShare | **FairShare** consistent; no GoFare in canonical source |
| CoachCore placeholders | Marketing hook present; no wrong product name found |

---

## UI polish completed (this pass)

### Fixed vs documented only

| App | Fixed | Documented only |
|-----|-------|-----------------|
| FairShare | Mobile bottom nav; hide top nav tabs on phone; tap target on account button | Beta gate wall-of-text; admin routes in Settings |
| MotoCrew | ~~Footer copy polish~~ **Reverted on re-audit** (see append) | Brand name decision; demo notice remains |
| Sermon Studio (patched) | Mobile overflow; action button grid | Beta banner text; single-page density |
| CoachCore | — | Demo banner; mock auth |
| ShutterBid | — | All store/public route/screenshot mismatches |
| Public site | — | Source not located; broken `/shutterbid` |

### Files changed

| App | Files |
|-----|-------|
| FairShare | `src/components/AppShell.tsx`, `src/styles.css` |
| MotoCrew | `src/App.tsx` |
| Sermon Studio | `app/globals.css`, `app/page.tsx` |

### Backup paths

`C:\Users\draco\Downloads\MackSims\.backups\bulk-ui-polish-20260705-170500\`

Pre-edit full mirrors were not completed (auto-review blocked cross-app shell backup). Revert via git or restore from sibling `_backup-*` folders inside each app.

---

## Checks / builds run

| App | Command | Result | Notes |
|-----|---------|--------|-------|
| FairShare | `npm run check` | **PASS** | vitest + vite build; chunk size warnings pre-existing |
| MotoCrew | `npm run check` | **PASS** | eslint + 2 tests + vite build |
| CoachCore | `npm run check` | **PASS** | 2 tests + next static export |
| Sermon Studio (patched) | `npm run check` | **PASS** | 1 ICS test + next build |
| ShutterBid | Not run | — | Audit-only; extensive existing check scripts |

---

## Screenshot candidates (3+ per app)

### FairShare
1. `/compare` — fare comparison grid with demo chip  
2. `/crowd-meter` — venue crowd cards  
3. `/` — home hero after beta gate dismissed  

### MotoCrew
1. Home — upcoming rides + safety ack cleared  
2. Rides — filter chips + ride cards  
3. Map — honest placeholder panel  

### CoachCore
1. `/` — landing hook  
2. `/app` — dashboard with check-in panel  
3. `/app/training` — training module shell  

### Sermon Studio
1. `/` — sermon editor header + demo sermon  
2. Scripture browse cards  
3. Library list with sync badges  

### ShutterBid (from store-launch docs — not recaptured this pass)
1. Marketplace home `/`  
2. Job detail `/jobs/venue-content-package`  
3. Post-job clean `/post-job` — **owner must confirm Pass 010 vs JSON conflict**  

---

## Apps safe for screenshot / store prep

| Tier | Apps | Condition |
|------|------|-----------|
| **Nearest ready** | ShutterBid | Owner approves 3 PNGs + privacy forms; fix marketing URL landing separately |
| **Good local demo captures** | MotoCrew, FairShare (post-deploy), CoachCore | Hide/dismiss demo banners if marketing shots needed |
| **Needs redeploy first** | Sermon Studio | CSS fixes local only until Netlify redeploy |
| **Not ready** | MackSims public site | Locate source + fix app routes |
| **Excluded** | Aegis Intel, FishCrew | Per hard exclusion |

---

## Strongest TestFlight / Play internal testing candidates

1. **ShutterBid** — Builds already on ASC (Approved TestFlight) and Play (internal testing). Blockers are metadata/screenshots/privacy, not binary availability.  
2. **MotoCrew** — Honest demo, guest-friendly, mobile-native shell; no store record yet (safe to iterate).  
3. **FairShare** — Functional compare loop; beta gate is the main tester friction.

---

## Secret scan result

**PASS** on all edited files — no API keys, passwords, service accounts, or signing material introduced.

Acceptable placeholder only: `DO_NOT_COMMIT_PASSWORD` in store-launch docs (not in edited source).

---

## Explicit confirmations

- **Aegis Intel:** NOT touched  
- **FishCrew:** NOT touched  
- **No** console records, identifiers, backend configs, Firebase, Supabase schema, DNS, hosting settings, signing config, bundle IDs, package names, or app records changed  
- **No** apps submitted for review  
- **No** deployments executed in this pass  
- **No** secrets committed  

---

## Related docs

- `docs/BULK_UI_POLISH_CHECKLIST.md` — operator checklist  
- `docs/store-launch/apps/shutterbid/STATUS.md` — ShutterBid store state (Passes 001–010)  
- `scripts/BUILD_FULL_REPORT.md` — 2026-07-05 deploy matrix  
- `DUMB_HUMAN_APP_AUDIT.md` — UX audit same date  

---

## Dated append — FairShare / MotoCrew / Sermon (2026-07-05)

**Bulk UI polish pass:** FairShare mobile bottom nav; MotoCrew footer copy; Sermon patched mobile layout CSS. Builds PASS. Deploy not run — owner should redeploy FairShare + Sermon Studio when ready.

**Mismatch flags added:** ShutterBid version 0.1.0 vs store 1.0; public-site source missing; Pass 010 JSON vs STATUS conflict for ShutterBid post-job capture.

---

## Mismatch-First Re-Audit (2026-07-05)

**Principle:** Find → Label → Fix only if safe. Do not polish over drift.

**Scope:** Re-reviewed every UI change from the bulk polish pass. **Aegis Intel and FishCrew not touched.** One revert applied (MotoCrew footer). No deploys, backend, or store-doc edits.

### Prior polish changes reviewed

| App | Change | Verdict | Rationale |
|-----|--------|---------|-----------|
| **FairShare** | Mobile bottom nav (4 tabs) | **KEPT (safe)** | Fixes real mobile shell gap; mirrors CoachCore/MotoCrew pattern. Beta gate + `DemoDataBanner` unchanged. |
| **FairShare** | Hide horizontal `main-nav` at ≤719px | **KEPT (safe)** | Standard responsive swap (bottom nav on phone, top nav on desktop ≥720px). Does **not** hide desktop-in-phone mismatch — it **addresses** missing thumb navigation. Desktop layout unchanged at wide widths. |
| **FairShare** | Account button min-height 44px on phone | **KEPT (safe)** | Tap-target accessibility only. |
| **FairShare** | Primary nav limited to 4 consumer routes | **DOCUMENTED ONLY** | Predates bulk polish (backend-sprint 2026-07-03). Admin/driver/government still reachable via Settings → “Internal / operator demos”. Not reverted — intentional beta scope, already documented. |
| **MotoCrew** | Footer “Beta tester?” → “Questions or feedback?” | **REVERTED (masked mismatch)** | Softened explicit external-beta label while `DEMO_NOTICE` still reads “Beta demo shell…”. Made footer screenshot-ready but hid reviewer/beta identity. Restored original copy in `apps/MotoCrew/src/App.tsx`. |
| **Sermon Studio** | `.ss-page` overflow-x clip + safe-area padding | **KEPT (safe)** | Prevents horizontal scroll on narrow viewports; no label or feature hiding. |
| **Sermon Studio** | `.ss-action-row` / `.ss-template-row` 2-col grids ≤639px | **KEPT (safe)** | Layout-only; external-beta banner and “not live AI” copy unchanged. |
| **CoachCore** | (no edits this pass) | **DOCUMENTED ONLY** | Demo walkthrough banner + mock auth remain visible — owner screenshot decision. |
| **ShutterBid** | (audit only) | **DOCUMENTED ONLY** | Store/public-route/screenshot mismatches unchanged from table below. |

### Polish that masked mismatch (reverted)

| App | File | What was reverted | Why |
|-----|------|-------------------|-----|
| MotoCrew | `apps/MotoCrew/src/App.tsx` | Footer “Questions or feedback?” → restored **“Beta tester? Email feedback to …”** | **MISMATCH CONFIRMED:** copy change hid external-beta tester framing for screenshot/marketing polish. `config.ts` `DEMO_NOTICE` alone is insufficient — footer was the only explicit “Beta tester” affordance in the main app shell footer. |

**Backup (pre-revert snapshot of reverted file):** `MackSims/.backups/bulk-ui-reaudit-20260705-171800/MotoCrew/src/App.tsx`  
**Check after revert:** `npm run check` in `apps/MotoCrew` — **PASS** (eslint + 2 tests + vite build).

### Safe polish retained

- FairShare: bottom nav + responsive nav swap + account tap target (`AppShell.tsx`, `styles.css`)
- Sermon Studio (patched): mobile overflow + action/template button grids (`app/globals.css`, `app/page.tsx`)

### New / updated mismatch labels

| ID | App | Category | Status | Evidence |
|----|-----|----------|--------|----------|
| M-FS-01 | FairShare | Web UI vs mobile UI | **NOT MASKING — KEPT** | Bottom nav adds missing phone shell; beta/demo surfaces retained. Pre-polish: horizontal scroll nav only (`_backup-20260703-scrub-pass`). |
| M-MC-01 | MotoCrew | Store docs vs app reality / beta labeling | **MISMATCH CONFIRMED — REVERTED** | Footer copy change removed “Beta tester?” while `DEMO_NOTICE` = “Beta demo shell…”. Docs folder `docs/store-launch/apps/throttlelink/` still TBD on login/demo; UI must stay honest. |
| M-SS-01 | Sermon Studio | Web UI vs mobile UI | **NOT MASKING — KEPT** | CSS layout only; beta banner at `page.tsx` L390–398 unchanged. Single-page density still **DOCUMENTED ONLY** (not fixed). |

### Updated mismatch table rows (status changes)

| App | Column | Prior | After re-audit |
|-----|--------|-------|----------------|
| **FairShare** | Mobile Match | IMPROVED | **IMPROVED (safe)** — bottom nav is legitimate mobile shell fix, not screenshot masking |
| **MotoCrew** | UI Match / Notes | MINOR POLISH ONLY | **MINOR POLISH ONLY** — footer revert restores beta honesty; brand MotoCrew vs ThrottleLink still **MISMATCH CONFIRMED** (owner) |
| **Sermon Studio** | Mobile Match | IMPROVED | **IMPROVED (safe)** — overflow/grid CSS only |

All other table rows unchanged. **CLEAN** still not assigned to any app.

### Owner-review only (unchanged)

- ShutterBid: privacy, screenshots, `macksims.com/shutterbid` landing, local 0.1.0 vs store 1.0
- MackSims public site: source not located
- MotoCrew / ThrottleLink brand decision
- FairShare: beta gate + demo banners for marketing screenshots
- All pre-store apps: `PRIVACY_DATA.md` / data safety questionnaires
 
---

---

## Deployment (2026-07-05)

**Operator:** Netlify CLI (`netlify-cli/26.1.0`), authenticated as chris sims (fishcrew team). **No** DNS, site settings, Firebase, Supabase, signing, or store records modified.

### Summary

| App | Result | Production URL | Deploy ID |
|-----|--------|----------------|-----------|
| **FairShare** | **SUCCESS** | https://fairshare-v03-20260624.netlify.app | `6a4acd1f3287722938305cf2` |
| **MotoCrew** | **SUCCESS** | https://motocrewz.netlify.app | `6a4acd2ff8f1c3efb6346f0d` |
| **CoachCore** | **SUCCESS** | https://coachcore7.netlify.app | `6a4acd2f24213227c3841e74` |
| **Sermon Studio** | **SUCCESS** | https://sermon-studio-beta.netlify.app | `6a4acd56da9a8af7ba097b18` |
| **ShutterBid** | **SKIPPED** | — | No linked Netlify site in CLI account; no root netlify.toml — store fixes out of scope |

Post-deploy HTTP smoke (GET): all four URLs **200**.

### Per-app commands

**FairShare** (`MackSims/apps/FairShare`, site `f81df982-2348-4d3c-b842-fb806b1b4b00`)

1. `npm run build` — PASS (vite to dist/)
2. `netlify deploy --prod --dir=dist --site=f81df982-2348-4d3c-b842-fb806b1b4b00` — PASS

**MotoCrew** (`MackSims/apps/MotoCrew`, site `94099ea3-9d62-4c02-9ab3-5162c59282a7`)

1. `npm run build` — PASS
2. `netlify deploy --prod --dir=dist --site=94099ea3-9d62-4c02-9ab3-5162c59282a7` — PASS (live includes reverted beta footer copy)

**CoachCore** (`MackSims/apps/CoachCore/coachcore-static-v001`, site `b8885541-5a95-4e01-8ba8-3ccb27e1e60f`)

1. `npm run build` — PASS (next build static export to out/)
2. `netlify deploy --prod --dir=out --site=b8885541-5a95-4e01-8ba8-3ccb27e1e60f` — PASS

**Sermon Studio** (`C:\Users\draco\Downloads\sermon-studio-next-patched`, site `f695214f-1e22-429a-86ac-5adac2822414`)

1. `npm run build` — PASS (Next.js 14.2.15; .env.local at build only, not committed)
2. `netlify deploy --prod --site=f695214f-1e22-429a-86ac-5adac2822414` — PASS (@netlify/plugin-nextjs)

### Not deployed / blockers

| Item | Reason |
|------|--------|
| **Aegis Intel** | Hard exclusion |
| **FishCrew** | Hard exclusion |
| **ShutterBid** | No Netlify site in account list; native/store track — do not fix store mismatches |
| **MackSims public-site** | Out of scoped app list |

### Logs (local)

- `MackSims/docs/_deploy_*_build.log` and `_deploy_*_prod.log`
- `MackSims/docs/_netlify_sites_tmp.txt`

### Auth

Netlify CLI auth **OK** — no owner action required for these four sites.
