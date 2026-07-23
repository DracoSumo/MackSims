# MackSims Portfolio Audit — 2026-07-23

**Scope:** Aegis Intel + MackSims monorepo apps (FairShare, MotoCrew/ThrottleLink, CoachCore, Sermon Studio, FishCrew, ShutterBid, public-site, MomentPick).  
**Deploy:** Not performed in this pass.

## Executive summary

| App | Repo / path | Version | `npm run check` | Git push status | Notes |
|-----|-------------|---------|-----------------|-----------------|-------|
| **Aegis Intel** | `DracoSumo/Aegis-Intel` · `Downloads/aegis-intel-v9-full` | **0.15.54 / v15.5.4** | **PASS** (+ timestamps, intelligence) | Committing v15.4.3→v15.5.4 tree | Button audit 88/88 previously PASS; Netlify anon key still **NEED_KEYS** per KEYS_STATUS |
| **FairShare** | MackSims monorepo `apps/FairShare` | 0.3.0 | **PASS** (build) | Via MackSims branch | Clean vs HEAD in monorepo |
| **MotoCrew / ThrottleLink** | MackSims `apps/MotoCrew` | 0.0.0 | **PASS** (build) | Via MackSims | Version still `0.0.0` — bump before store |
| **CoachCore** | MackSims `apps/CoachCore/coachcore-static-v001` | 0.7.1 | **PASS** on HEAD | Local WIP imported missing components (TodaysLoop, AthleteProgressBar, …) — **restored to HEAD for push**; WIP not committed | Live web: coachcore7.netlify.app |
| **Sermon Studio** | MackSims `apps/SermonStudio` | 0.1.1 | **PASS** (build) | Via MackSims | Local `.env.local` present (gitignored) |
| **FishCrew** | `DracoSumo/fishcrew-ios` · `apps/FishCrew/fishcrew-ios` | (iOS package) | N/A this pass | **Clean** vs `origin/main` | Ignored by MackSims `.gitignore`; store privacy **BLOCKED** (blank Apple privacy URL) |
| **ShutterBid** | `DracoSumo/shutterbid-starter` | (web) | Not re-run full suite | **Dirty + ahead 1** — pushing | Ignored by MackSims `.gitignore`; Play listing/privacy **BLOCKED** |
| **MomentPick** | `apps/momentpick-web` | — | Not audited deeply | **Not in git** (gitignore) | No dedicated remote found |
| **Public site** | `MackSims/public-site` | — | Static | **Local git only (no remote)** | Dirty multipage/privacy/product pages; needs GitHub remote or monorepo absorb |

## Secrets / hygiene

- MackSims ignores `.env*`, `secrets/`, FishCrew, ShutterBid, momentpick-web.
- SermonStudio + ShutterBid `.env.local` / `.env.vercel` are present locally — **not** to be committed.
- `backups/` under MackSims root was untracked — added to `.gitignore` this pass.

## Store-launch blockers (from `docs/store-launch`)

- **FishCrew / ShutterBid:** privacy policy URLs / App Privacy questionnaires incomplete.
- **FairShare / MotoCrew / Sermon:** store copy and privacy docs still owner-confirm.
- **CoachCore:** furthest along (live web, draft store copy, privacy confirmed in docs); iOS/Android not started; screenshots not started.
- **Aegis:** packaging optional; PWA primary; Codemagic TestFlight scaffolded on Aegis repo.

## Keys (from KEYS_STATUS.md)

- CoachCore, FairShare, MotoCrew, Sermon Studio Netlify↔Supabase alignment: **OK**.
- Aegis (`sprightly-lily-160925`): URL pointed at `yferqiqlpfvbvevtfbsn`; **anon key still NEED_KEYS**.

## Recommended next actions

1. Paste Aegis Supabase anon key in Netlify; smoke Guest + signed-in sync.
2. Restore or implement missing CoachCore components before merging CoachCore WIP.
3. Create/push remote for `public-site` (or absorb into MackSims without nested `.git`).
4. Decide MomentPick remote vs keep gitignored.
5. Complete FishCrew/ShutterBid privacy URLs in App Store Connect / Play Console.
