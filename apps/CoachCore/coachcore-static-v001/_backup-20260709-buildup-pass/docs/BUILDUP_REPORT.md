# CoachCore Build-Up Report

**Date:** 2026-07-09  
**Version:** v0.7.0 (`coachcore-static-v001`)  
**Backup:** `_backup-20260709-buildup-pass`

## Phase 0 — Workspace

| Item | Status |
|------|--------|
| Baseline `npm run check` | Run after edits |
| Backup snapshot | Created |
| Version doc drift fixed | `COACHCORE_VERSIONS.md` → v0.7 current |

## Phase 1 — Wave 1 UX (v0.5.1)

| Item | Status |
|------|--------|
| Coach onboarding card | `CoachOnboardingCard` on dashboard |
| Athlete Today strip | `AthleteTodayStrip` on dashboard |
| Today's loop | `TodaysLoop` on dashboard, training, nutrition, chat, video, accountability |
| Accountability progress bars | `AthleteProgressBar` on accountability + athlete profiles |
| Demo vs auth clarity | Login/signup demote email fields; `DemoModeBadge` in `AppShell` |

## Phase 2 — Static simulation (v0.5.2)

| Item | Status |
|------|--------|
| `assignmentStore` | localStorage completions |
| Mark complete buttons | Training, nutrition, video detail, athlete profile |
| Live timeline | `LiveTimelinePanel` on dashboard + `/app/timeline` |
| Tests | `assignmentStore.test.ts`, `athleteProgress.test.ts` |

## Phase 3 — Backend scaffold (v0.6)

| Item | Status |
|------|--------|
| Schema expansion | `supabase/schema.sql` |
| Data adapters | `src/services/data/` |
| Auth gate | `AuthGate` in `src/app/app/layout.tsx` |
| Beta intake | Anon insert policy + `pushBetaRequest` without auth |

## Phase 4 — Product features (v0.7)

| Item | Status |
|------|--------|
| Demo messaging | `ChatWorkspace` with `messageStore` |
| Local notifications | `notificationStore` + `NotificationBell` |
| Video upload scaffold | `VideoUploadPanel` |
| AI workout review | `AiWorkoutReview` component |

## Phase 5 — Store prep

| Item | Status |
|------|--------|
| Store checklist | `docs/STORE_LAUNCH_CHECKLIST.md` |
| Privacy data defaults | Updated for static demo scope |
| Owner confirmations | Still required before app records |

## Deploy

**Not redeployed** to coachcore7.netlify.app per beta safety rules.

## Owner decisions still required

- Youth/minor data handling
- Health/nutrition data scope for store forms
- Bundle ID confirmation (`com.macksims.coachcore`)
- Netlify Supabase env vars when enabling production backend
