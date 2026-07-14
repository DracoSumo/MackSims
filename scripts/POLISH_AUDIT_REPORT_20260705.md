# MackSims Beta Fleet — Polish & Intense Audit Report

**Date:** 2026-07-05  
**Scope:** CoachCore, FairShare, MotoCrew, Sermon Studio  
**Excludes:** ShutterBid, FishCrew, Aegis Intel, MackSims public site

---

## Executive summary

Phase 1 build polish, Phase 2 UI pass (390px-safe patterns, empty states, sync feedback), Phase 3 audit matrix, and Phase 4 deploy completed. All four apps pass `npm run check` locally and were redeployed via `scripts/deploy-all-with-keys.ps1` (Sermon Studio remote Netlify build).

| App | `npm run check` | Deploy |
|-----|-----------------|--------|
| CoachCore | **PASS** | **LIVE** |
| FairShare | **PASS** | **LIVE** |
| MotoCrew | **PASS** | **LIVE** |
| Sermon Studio | **PASS** | **LIVE** (remote build) |

**Production URLs**

| App | URL |
|-----|-----|
| CoachCore | https://coachcore7.netlify.app |
| FairShare | https://fairshare-v03-20260624.netlify.app |
| MotoCrew | https://motocrewz.netlify.app |
| Sermon Studio | https://sermon-studio-beta.netlify.app |

---

## CoachCore

**Path:** `apps/CoachCore/coachcore-static-v001`

### Build / polish changes

| Area | Change |
|------|--------|
| Dashboard sync feedback | New `DashboardSyncStrip` on `/app` — compact sync label + link to `/app/status` |
| Same-tab panel refresh | `localDataEvents.ts` + listeners on check-in/action panels and accountability panel |
| Athlete check-in UX | Success card, submitting state, sync note, sign-in nudge, focus rings, mobile-safe headers |
| Beta success states | Submitting state, channel-specific copy, `cloudSync` surfaced, success card, 390px hero/header fixes |
| Vitest guard | `notifyLocalDataChanged` skips when `dispatchEvent` unavailable (test env) |

### UI polish list

- Dashboard sync strip (no dig into status page required)
- Panel badge layout stacks on narrow screens (`flex-col` → `sm:flex-row`)
- Check-in form matches mock-action success pattern
- Beta form disabled during submit; mailto button wraps at 390px
- Focus rings on interactive controls

### Audit matrix

| Check | Result |
|-------|--------|
| Main nav routes load | **PASS** — 41 static routes built |
| Settings/status/profile flows | **PASS** — `/app/status`, `/app/profile`, `/login` |
| `/auth/callback` not 404 | **PASS** — route + netlify redirect to trailing slash |
| Connection/sync panels accurate | **PASS** — dashboard strip + status panel |
| Console errors on load | **NEEDS REVIEW** — operator smoke recommended (no automated browser run) |
| Secrets not in repo | **PASS** — no JWT in source; keys from deploy JSON / Netlify env |
| `netlify.toml` security headers | **PASS** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| `npm run check` + test | **PASS** |

### Fixes applied (critical)

- Same-tab dashboard stale after check-in (**FIXED** — local data events)

---

## FairShare

**Path:** `apps/FairShare`

### Build / polish changes

| Area | Change |
|------|--------|
| Compare empty states | Saved comparisons use dashed `empty-block` with next-action copy |
| CrowdMeter loading/error | Static signal sections gated behind `loadState === "ready"`; poll history empty hint |
| Settings account clarity | Eyebrow → "Account & preferences"; profile/sync copy; sync dashboard refreshes on `fairshare:auth-changed` |
| OAuth panel styles | `.oauth-panel` / `.oauth-actions` CSS (44px touch targets, mobile stack) |
| Supabase label | `supabaseStatusLabel()` reflects live OAuth/sync (not "wiring is next") |

### UI polish list

- CrowdMeter no longer shows "Unknown" demand table during load/error
- Settings explains local profile vs cloud sync
- OAuth buttons styled consistently at 390px

### Audit matrix

| Check | Result |
|-------|--------|
| Main nav routes load | **PASS** — SPA routes via `index.html` fallback |
| Settings/status/profile flows | **PASS** — `/settings`, OAuth, sync dashboard |
| `/auth/callback` not 404 | **PASS** — client route in `App.tsx` |
| Connection/sync panels accurate | **PASS** — settings sync row + OAuth merge note |
| Console errors on load | **NEEDS REVIEW** — operator smoke recommended |
| Secrets not in repo | **PASS** |
| `netlify.toml` security headers | **PASS** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| `npm run check` + test | **PASS** (5 tariff tests) |

### Fixes applied (critical)

- None required this pass

---

## MotoCrew

**Path:** `apps/MotoCrew`

### Build / polish changes

| Area | Change |
|------|--------|
| Ride join feedback | `saveMessage` rendered on Rides screen; skipped + leave messages |
| Profile sync copy | Eyebrow drops "(local)"; `supabaseStatusLabel()` updated |
| Map/readiness polish | Readiness panel links to Chat checklist; simulated map called out |
| Join state | Joined badge copy on ride detail |

### UI polish list

- Join/leave feedback visible where action happens
- Readiness CTA when checklist incomplete
- Honest map placeholder copy retained

### Audit matrix

| Check | Result |
|-------|--------|
| Main nav routes load | **PASS** — home/rides/map/chat/profile/create/safety |
| Settings/status/profile flows | **PASS** — Profile screen + OAuth |
| `/auth/callback` not 404 | **PASS** — `AuthCallbackHandler` in shell |
| Connection/sync panels accurate | **PASS** — profile save notes + sync meta |
| Console errors on load | **NEEDS REVIEW** — operator smoke recommended |
| Secrets not in repo | **PASS** |
| `netlify.toml` security headers | **NEEDS REVIEW** — X-Frame-Options + nosniff present; **Referrer-Policy missing** |
| `npm run check` + test | **PASS** (eslint + 2 filter tests) |

### Fixes applied (critical)

- Join feedback invisible on Rides screen (**FIXED**)

---

## Sermon Studio

**Path:** `sermon-studio-next-patched`

### Build / polish changes

| Area | Change |
|------|--------|
| Library/editor polish | Dark-theme status banner; library row hover; muted tokens |
| Sync badge consistency | `SyncBadge` component on library rows **and** series cards |
| Save draft feedback | `Saving…` button state; last sync/error line under AuthCard |
| Series sync | `cloudSynced` on series; merge marks remote series synced |

### UI polish list

- Status toasts use dark theme (no light gray/emerald-50 clash)
- Save Draft disables during async push
- Series planner shows Synced / Local only badges

### Audit matrix

| Check | Result |
|-------|--------|
| Main nav routes load | **PASS** — tabs + `/auth/callback` |
| Settings/status/profile flows | **PASS** — AuthCard + sync meta |
| `/auth/callback` not 404 | **PASS** — static route in build output |
| Connection/sync panels accurate | **PASS** — beta banner + badges + sync meta |
| Console errors on load | **NEEDS REVIEW** — operator smoke recommended |
| Secrets not in repo | **PASS** in tracked source; `.env.local` is local-only (gitignored) |
| `netlify.toml` security headers | **NEEDS REVIEW** — Next plugin deploy; no explicit `[[headers]]` block (Netlify defaults apply) |
| `npm run check` + test | **PASS** (1 ICS test + Next build) |

### Fixes applied (critical)

- None required this pass

---

## Cross-app audit summary

| Area | CoachCore | FairShare | MotoCrew | Sermon |
|------|-----------|-----------|----------|--------|
| Nav routes | PASS | PASS | PASS | PASS |
| Profile/settings | PASS | PASS | PASS | PASS |
| `/auth/callback` | PASS | PASS | PASS | PASS |
| Sync panels | PASS | PASS | PASS | PASS |
| Console smoke | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW |
| Secrets in repo | PASS | PASS | PASS | PASS |
| Security headers | PASS | PASS | NEEDS REVIEW | NEEDS REVIEW |
| `npm run check` | PASS | PASS | PASS | PASS |

**BLOCKED:** None  
**NOT APPLICABLE:** HUMAN_TEST_SCRUB_REPORT (file not present)

---

## Deploy log

Executed: `scripts/deploy-all-with-keys.ps1`

| Site | Method | Status |
|------|--------|--------|
| coachcore7 | Local build → `--no-build` upload `out/` | LIVE |
| fairshare-v03-20260624 | Local build → `--no-build` upload `dist/` | LIVE |
| motocrewz | Local build → `--no-build` upload `dist/` | LIVE |
| sermon-studio-beta | Remote Netlify build (`@netlify/plugin-nextjs`) | LIVE |

---

## Recommended operator smoke (post-deploy)

1. **CoachCore:** Submit check-in → dashboard panels update without reload; beta form shows channel + cloud queue note.
2. **FairShare:** Compare save → Settings sync counts refresh after OAuth sign-in.
3. **MotoCrew:** Join ride → message on Rides screen; readiness → Chat link.
4. **Sermon:** Save Draft signed in → library **Synced** badge; unsigned → **Local only** + sign-in prompt.

Confirm each Supabase project has OAuth redirect URLs for `/auth/callback` (CoachCore uses trailing slash).

---

## Files touched (summary)

**CoachCore:** `localDataEvents.ts`, `DashboardSyncStrip.tsx`, `checkInStore.ts`, `actionLogStore.ts`, panels, dashboard, check-in page, beta page  

**FairShare:** `App.tsx`, `config.ts`, `OAuthSignIn.tsx`, `styles.css`  

**MotoCrew:** `App.tsx`, `config/backend.ts`  

**Sermon Studio:** `app/page.tsx`, `lib/supabaseSync.ts` (series merge badges)

---

## Follow-up pass (2026-07-05)

Addresses **NEEDS REVIEW** items from the security-headers and console-smoke rows above.

### Changes

| App | Fix | Result |
|-----|-----|--------|
| **MotoCrew** | Added `Referrer-Policy = "strict-origin-when-cross-origin"` to `apps/MotoCrew/netlify.toml` (matches CoachCore/FairShare) | **FIXED** — verified live |
| **Sermon Studio** | Added explicit `[[headers]]` block to `netlify.toml` **and** `headers()` in `next.config.mjs` (Next.js plugin ignores `netlify.toml` headers on SSR routes; `next.config.mjs` is required for full coverage) | **FIXED** — verified live |

### Security header verification (post-deploy)

All four production URLs now return:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

| URL | Headers |
|-----|---------|
| https://coachcore7.netlify.app | **PASS** |
| https://fairshare-v03-20260624.netlify.app | **PASS** |
| https://motocrewz.netlify.app | **PASS** |
| https://sermon-studio-beta.netlify.app | **PASS** |

### `npm run check`

| App | Result |
|-----|--------|
| CoachCore | **PASS** |
| FairShare | **PASS** |
| MotoCrew | **PASS** |
| Sermon Studio | **PASS** (after `next.config.mjs` header change) |

### Deploy

1. Full fleet: `scripts/deploy-all-with-keys.ps1` — all four sites **LIVE**
2. Targeted Sermon Studio redeploy after `next.config.mjs` header fix — **LIVE**

### Production console smoke (addendum)

Automated load smoke with injected `console.error` / `console.warn` / `uncaught` hooks (3 s settle per site):

| App | Console errors/warnings on load | Page load |
|-----|----------------------------------|-----------|
| CoachCore | **None** | **PASS** |
| FairShare | **None** | **PASS** |
| MotoCrew | **None** | **PASS** |
| Sermon Studio | **None** | **PASS** |

**Updated audit rows**

| Area | CoachCore | FairShare | MotoCrew | Sermon |
|------|-----------|-----------|----------|--------|
| Console smoke | **PASS** | **PASS** | **PASS** | **PASS** |
| Security headers | PASS | PASS | **PASS** (was NEEDS REVIEW) | **PASS** (was NEEDS REVIEW) |

### Files touched (follow-up)

- `apps/MotoCrew/netlify.toml`
- `sermon-studio-next-patched/netlify.toml`
- `sermon-studio-next-patched/next.config.mjs`
