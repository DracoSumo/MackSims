# MackSims Beta Fleet — Build Full Report

**Date:** 2026-07-05  
**Scope:** CoachCore, FairShare, MotoCrew, Sermon Studio (excludes ShutterBid, FishCrew, Aegis Intel, MackSims public site)

## Summary

All four apps built (`npm run check` PASS), deployed to production Netlify URLs with per-app Supabase env baked via `deploy-all-with-keys.ps1`. Sermon Studio used **remote Netlify build** (Next.js plugin) so `NEXT_PUBLIC_SUPABASE_*` is baked at build time.

---

## CoachCore

**Path:** `apps/CoachCore/coachcore-static-v001`  
**Supabase ref:** `bfqfbkldxbojrrxeidcc`  
**URL:** https://coachcore7.netlify.app

### Built / extended

| Area | Status |
|------|--------|
| Coach dashboard check-in badges + sync labels | Dashboard `RecentCheckInsPanel` shows count + sync state |
| Coach action log on dashboard | New `RecentActionLogPanel` — local log + sync label |
| Athlete check-in → `athlete_check_ins` | Existing `checkInStore` + `pushCheckIn` |
| Action log → `coach_action_log` | Existing `actionLogStore` + `pushActionLog` |
| Beta intake localStorage + cloud when authed | `betaIntake` + `pushBetaRequest` (auth-gated insert) |
| Profile OAuth, merge, sign-out | `ProfileAuthPanel` + `mergeOnSignIn` |
| Status page sync panel | `SupabaseStatusPanel` + `LocalDataPanel` |
| Playbook/training demo labels | Playbook page demo banner added |
| Privacy/terms/support | Unchanged, intact |

### Build

- `npm run check`: **PASS** (2 tests, Next static export 41 routes)

### Deploy

- **LIVE** — prebuilt `out/` with env at local build time

---

## FairShare

**Path:** `apps/FairShare`  
**Supabase ref:** `dsbwqxhqktzsdleeobbi`  
**URL:** https://fairshare-v03-20260624.netlify.app

### Built / extended

| Area | Status |
|------|--------|
| 7-row Bermuda compare (tariff + companions) | `compositeAdapter` — taxi, shuttle, rideshare, private, local transport, designated driver, walking |
| Saved comparisons local + cloud | `storage` + `pushSavedComparison` + merge on sign-in |
| Settings profile → `user_profiles` | `pushUserProfile` on save/merge |
| CrowdMeter polls → `crowd_polls` | Local + anon/authed insert with feedback message |
| Home saved comparison indicator | New `SavedComparisonsHomeBadge` — count, last saved, sync hint |
| Consumer nav, beta gate, env from config | Existing `AppShell` / `BetaGate` / no hardcoded URLs |

### Build

- `npm run check`: **PASS** (5 tariff tests, Vite build)

### Deploy

- **LIVE** — prebuilt `dist/` with `VITE_SUPABASE_*` baked

---

## MotoCrew

**Path:** `apps/MotoCrew`  
**Supabase ref:** `npmiwnxnqgonnmwvblyi`  
**URL:** https://motocrewz.netlify.app

### Built / extended

| Area | Status |
|------|--------|
| Profile → `rider_profiles` | `profileStore` + `pushRiderProfile` |
| Ride drafts → `ride_drafts` | Create flow + `pushRideDraft` + merge |
| Joined rides → `joined_rides` | Join toggle + `pushJoinedRide` + merge |
| Map placeholder | `mapAdapter` honest placeholder |
| 5 ride chats, difficulty filter, checklist | Existing shell |
| Profile sync badges | Draft/joined counts on Profile; draft cloud hint on home |
| Export JSON / offline path | `localDataExport` |

### Build

- `npm run check`: **PASS** (eslint, 2 tests, Vite build)

### Deploy

- **LIVE** — prebuilt `dist/` with `VITE_SUPABASE_*` baked

---

## Sermon Studio

**Path:** `sermon-studio-next-patched`  
**Supabase ref:** `zipxwqkmenapnckwyzrh`  
**URL:** https://sermon-studio-beta.netlify.app

### Built / extended

| Area | Status |
|------|--------|
| Full editor (outline, KJV/WEB, templates, duplicate, print) | Main `app/page.tsx` |
| Library Synced / Local only badges | Per-sermon `Badge` in Library tab |
| Series + sermons cloud sync | `pushSeries`, `pushSermon`, `mergeOnSignIn` |
| AuthCard OAuth + email | `AuthCard` + local demo banner when unconfigured |
| ICS client route | `/api/ics` + client `localIcs` download |
| Production Netlify remote build | `netlify.toml` + `@netlify/plugin-nextjs`; deploy script uses `netlify deploy --prod` (no `--no-build`) |
| Songs/verses seed read-only | Pull from Supabase when rows exist; fallback local |

### Build

- `npm run check`: **PASS** (1 ICS test, Next build)

### Deploy

- **LIVE** — remote Netlify build (Supabase env from deploy script + site env)

---

## Operator steps (for your audit)

1. **OAuth:** Confirm Google/GitHub redirect URLs include each app’s `/auth/callback` in the matching Supabase project.
2. **Sign-in smoke:** One flow per app — save something local, sign in, confirm merge/sync copy and no console errors.
3. **CoachCore beta form:** Cloud write to `beta_requests` only when signed in; local save always works.
4. **FairShare:** Save a comparison locally, sign in, use “Save to cloud” on Compare.
5. **Sermon:** Confirm production banner shows “Supabase connected” (not “local demo mode only”) after deploy.

---

## Build matrix

| App | `npm run check` | Deploy |
|-----|-----------------|--------|
| CoachCore | PASS | LIVE |
| FairShare | PASS | LIVE |
| MotoCrew | PASS | LIVE |
| Sermon Studio | PASS | LIVE (remote build) |
