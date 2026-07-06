# CurbCue Rename Report

**Date:** 2026-07-05  
**Scope:** FairShare app at `MackSims/apps/FairShare`  
**Mission:** User-facing + documentation rename FairShare → **CurbCue**  
**Deploy:** **Not performed** (per owner instruction)

---

## Owner-facing summary

CurbCue is now the product name everywhere users and testers see it: shell, beta gate, hero, compare empty state, feedback emails, README, beta docs, and PWA manifest. Brand copy matches the approved strings (tagline, hero, feature labels, empty state, CTA **Check ride options**).

Routes `/curbcue`, `/fairshare`, and `/farewave` all render the home view. `/curbcue` is the preferred public slug; legacy paths remain for bookmarks.

**Nothing was deployed.** Hosting URLs, Supabase project ref, npm package name, localStorage keys, OAuth callback URLs, and icon filename stay on legacy `fairshare-*` identifiers until owner approves identifier migration.

Backups of touched files: `_backup-20260705-curbcue-rename/` (23 files). Older pre-change snapshots also exist in `_backup-20260703-*` and `_backups/`.

---

## Mismatch audit

| Area | Expected | Actual | Status | Notes |
| --- | --- | --- | --- | --- |
| User-facing app name | CurbCue | CurbCue (`APP_NAME`, shell, gate, hero, titles) | **CLEAN** | Demo provider renamed to "Demo Rideshare" |
| Public route | `/curbcue` preferred | `/curbcue` → home via client router | **CLEAN** | No Netlify redirect added |
| Legacy route | `/fairshare` preserved | `/fairshare` → home (alias) | **CLEAN** | Same component as `/` |
| FareWave references | none except history | No source references; `/farewave` alias only | **CLEAN** | Alias added proactively |
| GoFare references | none except history | None found in repo | **CLEAN** | — |
| Package/bundle identifiers | unchanged unless approved | `fairshare-mobility-platform` in `package.json` | **CLEAN** | Identifier rename requires owner approval |
| Store/test docs | CurbCue | Updated README, checklists, invite copy, feedback template | **CLEAN** | `FAIRSHARE_TESTING_NOTES.md` filename kept for links |
| Screenshots/docs | CurbCue | Docs updated; no screenshot assets in repo | **CLEAN** | Re-capture screenshots after UI deploy |

---

## Brand copy applied

| Element | Copy |
| --- | --- |
| App name | **CurbCue** |
| Tagline | Know where to ride before you book. |
| Short | Compare rides, spot surge pressure, and choose smarter pickup options before prices jump. |
| Longer (beta gate) | CurbCue turns ride prices, crowd pressure, surge risk, and pickup options into one clear signal before you book. |
| Hero CTA | Check ride options |
| Feature labels | Ride Compare, Crowd Cue, Surge Watch, Pickup Smarts, Timing Signal, Route Options |
| Empty state | No ride signals yet. / Add a pickup area to compare ride prices, crowd pressure, and surge risk. |
| Feedback subject | CurbCue Beta Feedback |

---

## Files changed (23 + this report)

| Path | Change |
| --- | --- |
| `src/config.ts` | `APP_NAME`, tagline, descriptions, feedback subject |
| `src/App.tsx` | Routes, hero, features, rename copy, empty state, pick card label |
| `src/components/AppShell.tsx` | Brand mark CC, name, tagline |
| `src/components/BetaGate.tsx` | CurbCue copy + feedback subject |
| `src/components/DemoDataBanner.tsx` | Feedback subject |
| `src/components/FeedbackPrompt.tsx` | Feedback subject |
| `src/components/TripSearchForm.tsx` | Optional `submitLabel` prop |
| `src/styles.css` | Hero subhead + feature label chips |
| `src/data/mockData.ts` | User-visible demo strings (not internal IDs) |
| `src/lib/storage.ts` | Default demo user display name |
| `src/adapters/mockAdapter.ts` | Adapter display name |
| `src/adapters/types.ts` | Comment |
| `index.html` | Title + meta description |
| `public/manifest.webmanifest` | PWA name/description |
| `public/fairshare-icon.svg` | `aria-label` only (filename unchanged) |
| `README.md` | Full CurbCue rewrite |
| `.env.example` | Header comment |
| `TESTER_FEEDBACK_TEMPLATE.md` | CurbCue |
| `FAIRSHARE_TESTING_NOTES.md` | CurbCue content (legacy filename) |
| `BETA_INVITE_PACKAGE.md` | CurbCue |
| `BETA_READINESS_REPORT.md` | CurbCue header + package note |
| `EXTERNAL_TESTING_CHECKLIST.md` | CurbCue + route checks |
| `docs/OAUTH_SETUP.md` | CurbCue header; hosting IDs preserved |

**Not changed:** `netlify.toml`, `.env`, Supabase schema body, `package.json` name, git remotes, DNS.

---

## Preserved identifiers (intentional)

> **Identifier rename requires owner approval.**

| Reference | Location | Why preserved |
| --- | --- | --- |
| `fairshare-mobility-platform` | `package.json`, `package-lock.json` | npm package identifier |
| `fairshare-v03-20260624.netlify.app` | `config.ts`, OAuth docs | Netlify site name / DNS |
| `dsbwqxhqktzsdleeobbi` | `.env.example`, `supabase/schema.sql` | Supabase project ref |
| `fairshare.savedPlaces.v1` (etc.) | `src/lib/storage.ts`, `supabaseSync.ts` | localStorage migration would drop tester data |
| `fairshare:auth-changed` | `OAuthSignIn.tsx`, `App.tsx` | Internal event name |
| `fairshare-rideshare` | `mockData.ts`, `compositeAdapter.ts` | Internal provider ID |
| `/fairshare-icon.svg` | `index.html`, manifest | Static asset path (OAuth/CDN safe) |
| `FairShare user` | `supabase/schema.sql` default | DB default — backend |
| `-- FairShare v0.4 schema` | `supabase/schema.sql` header | SQL stub comment only |
| Repo folder `FairShare/` | filesystem | Path rename out of scope |

---

## Route handling

Client router (`src/App.tsx`):

- `HOME_ROUTE_ALIASES`: `/`, `/curbcue`, `/fairshare`, `/farewave`
- Aliases resolve to home page component; nav highlights Home when on any alias
- **No** `netlify.toml` redirect changes (SPA fallback unchanged)

**Optional future (owner approval):** Netlify redirect `/` → `/curbcue` or custom domain for CurbCue.

---

## Validation

| Check | Result |
| --- | --- |
| `npm run test` | **PASS** — 5 tests (`bermudaTariffModel.test.ts`) |
| `npm run build` | **PASS** — tsc + vite build |
| `npm run lint` | **N/A** — no lint script configured |
| Deploy | **NOT RUN** |
| `.env` / secrets edited | **NO** |
| Aegis Intel touched | **NO** — workspace grep shows no CurbCue edits under `aegis-intel-v9-full` |
| FishCrew / other MackSims apps touched | **NO** — changes confined to `MackSims/apps/FairShare` |

### Remaining grep hits (expected)

- Legacy aliases `/fairshare`, `/farewave` in router + docs
- Internal keys and IDs listed in **Preserved identifiers**
- Historical backups under `_backup-*` and `_backups/` (unchanged)
- `dist/` rebuild will reflect CurbCue in output after next local build (not deployed)

---

## Follow-ups (owner decision)

1. **Rename npm package** `fairshare-mobility-platform` → e.g. `curbcue` (breaks CI paths if any)
2. **Rename icon asset** `fairshare-icon.svg` → `curbcue-icon.svg` (+ manifest/html refs)
3. **Netlify site rename / custom domain** for public URL branding
4. **localStorage key migration** if fresh beta cohort is acceptable
5. **Supabase `display_name` default** in applied schema
6. **Rename doc file** `FAIRSHARE_TESTING_NOTES.md` → `CURBCUE_TESTING_NOTES.md` when invite links updated
7. **Screenshot / marketing assets** with CurbCue branding

---

## Backup

| Folder | Files | Notes |
| --- | --- | --- |
| `_backup-20260705-curbcue-rename/` | 23 | Post-rename snapshots of all edited paths (rollback point for this pass) |
| `_backup-20260703-*`, `_backups/` | prior | Pre-rename historical snapshots still available |
