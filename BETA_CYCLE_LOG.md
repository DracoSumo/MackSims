# MackSims — Beta Cycle Log

Concise running log of the guided operator cycle. Newest entries at the top.

---

## 2026-07-01 — Production deploys (operator authorized)

All MackSims beta apps deployed to production:

| App | URL | Platform |
|---|---|---|
| CoachCore | https://coachcore7.netlify.app | Netlify |
| Sermon Studio | https://sermon-studio-beta.netlify.app | Netlify (new site) |
| ShutterBid | https://shutterbid.macksims.com | Vercel |
| FairShare | https://fairshare-v03-20260624.netlify.app | Netlify |
| MotoCrew | https://motocrewz.netlify.app | Netlify (fixed `netlify.toml` → `dist`) |
| FishCrew | https://fishcrew.macksims.com | Netlify |

**Notes:** Sermon Studio runs localStorage mode on Netlify unless Supabase env is set in Netlify dashboard. ShutterBid Firebase env must remain configured on Vercel. MotoCrew first deploy used wrong publish path — corrected and redeployed.

---

## 2026-07-01 — Cycle 4 follow-up: operator confirmed all three focus apps

**Operator report:** Sermon Studio, CoachCore, and ShutterBid — **all passed**.

| App | Result |
|---|---|
| Sermon Studio | Pass — local/demo Wave 1 cleared |
| ShutterBid | Pass — existing Firebase smoke complete → **Ready** |
| CoachCore | Pass — UX re-review; accountability + connected surfaces improved → **Wave 1 authorized** |

**Status updates:**
- Sermon Studio → testing active
- ShutterBid → Ready; Wave 1 invites next
- CoachCore → Wave 1 authorized; send invites

**Codex actions:** Updated operator board and readiness docs. No source changes.

---

## 2026-07-01 — Cycle 4: Sermon Studio, CoachCore, ShutterBid focus

**Mission:** Tighten three remaining apps for beta readiness while waiting for backend/user-owned work.

### Sermon Studio (`sermon-studio-next-patched`)

- Re-sanitized `.env.example` and `.env.local.example` (placeholders only)
- Updated `KEY_ROTATION.md` — old project decommissioned; security closeout documented
- Patched `app/page.tsx`: local/demo mode banner, start-here guide, demo sermon seed, notes placeholder fix, library Edit scroll
- Created `BETA_INVITE_PACKAGE.md`, `SERMON_STUDIO_BACKEND_STANDBY.md`
- `npm run build`: **PASS**

### CoachCore (`apps/CoachCore/coachcore-static-v001`)

- Fixed AppShell navigation (all sections route correctly; mobile nav updated)
- Added accountability definition, coaching-support disclaimers, cross-link strips
- Dashboard: action cards, athlete profile links, readiness column, version alignment
- Patched accountability, nutrition, training, team pages
- Created `COACHCORE_BACKEND_STANDBY.md`
- `npm run build`: **PASS**

### ShutterBid (`shutterbid-starter`)

- Created `SHUTTERBID_BACKEND_STANDBY_STATUS.md`
- Updated `FIREBASE_SETUP.md` — existing project first
- Updated `BETA_READINESS_REPORT.md` — wire existing Firebase wording
- No source changes — docs only

### Master beta system

- Rewrote `BETA_OPERATOR_ACTION_BOARD.md` — FairShare/MotoCrew testing active; three focus apps; FishCrew parked

**Next user actions:** Sermon Studio Wave 1 invites → ShutterBid Firebase smoke → CoachCore re-review

---

## 2026-07-01 — Cycle 3 follow-up: CoachCore operator smoke pass

**Operator report (demo URL):**

| Check | Result |
|---|---|
| Inventory path confirmed | Yes |
| Demo URL smoke pass | Pass (https://coachcore7.netlify.app) |
| Static-demo disclaimers clear | Yes |
| Coach 30-second clarity | Pass |
| Accountability useful | Unclear |
| Training/food/readiness/comms connected | No |
| Gym/fitness language OK | Yes |
| Wave 1 invites authorized | **No** — on hold |

**Status update:** Wave 0 complete. Wave 1 **not authorized** — accountability unclear, surfaces not connected.

**Codex actions:** Updated operator board and readiness docs; no source changes.

---

## 2026-07-01 — Cycle 3: CoachCore Workstream 6 recovery

**User correction:**

- **CoachCore** was accidentally left out of the beta operations board. It must be added as **Workstream 6** without disrupting active apps (FairShare Wave 1, MotoCrew Wave 1, Sermon Studio, ShutterBid, FishCrew parked).

**CoachCore locked direction:**

- All-sports coaching/team accountability app; hook: “No more guessing who is locked in.”
- Supports coaches, teams, athletes, gyms, functional fitness/box-gym, training, WOD/class programming, chat, nutrition, wearables/readiness, video review, leaderboards, accountability, AI-assisted programming (mock/static in current build).
- Known demo URL: https://coachcore7.netlify.app — do not redeploy unless instructed.
- Trademark: use “functional fitness” or “CrossFit-style”; no implied official affiliation.
- Compliance: no medical claims; nutrition/readiness = coaching support only.

**Done this cycle (repo-side):**

- Located source at `MackSims\apps\CoachCore\coachcore-static-v001` (Next.js 16 static export, v0.5 mock demo)
- Created `apps\CoachCore\COACHCORE_INVENTORY.md`
- Created beta doc pack: `BETA_READINESS_REPORT.md`, `EXTERNAL_TESTING_CHECKLIST.md`, `TESTER_FEEDBACK_TEMPLATE.md`, `BETA_INVITE_PACKAGE.md`
- Updated `BETA_OPERATOR_ACTION_BOARD.md` — Workstream 6 with inventory + smoke-pass gate
- Updated this log
- Verified `npm run build` passes (2026-07-01)

**CoachCore status:** Recovered into beta ops — readiness pending inventory

**Standing gates:**

- Do not send CoachCore Wave 1 invites until operator completes inventory review + demo URL smoke pass.
- Do not redeploy CoachCore unless explicitly instructed.
- FairShare, MotoCrew, ShutterBid, Sermon, FishCrew workstreams unchanged.

**Next user actions:** Continue FairShare/MotoCrew Wave 1 → CoachCore Workstream 6 smoke pass → Sermon/ShutterBid per board.

**Next Codex actions (after user confirms CoachCore smoke pass):** Authorize Wave 1 invite distribution; triage feedback on accountability, athlete clarity, compliance copy.

No source code changed this cycle — docs/inventory only. Build check run for inventory verification only.

---

## 2026-07-01 — Cycle 2: existing Firebase + Sermon migration correction

**User correction:**

- **ShutterBid** already has an existing Firebase project/app. Docs must say
  *verify existing project* — not *create Firebase project* — unless intentionally
  starting over.
- **Sermon Studio** has a new URL/project in progress. Security closeout must
  cover **both** new-project env wiring **and** old leaked Supabase key rotation
  (or full decommission of the old project).

**Done this cycle (repo-side):**

- Updated `FIREBASE_PROVISIONING_CHECKLIST.md` — existing-project language,
  verification section, updated report-back template
- Created `SHUTTERBID_EXISTING_FIREBASE_RUNBOOK.md` — step-by-step smoke path,
  pass/fail table, paste-back template
- Updated `sermon-studio-next-patched\KEY_ROTATION.md` — "New Sermon Studio
  project / URL migration" section + expanded report-back template
- Updated `BETA_OPERATOR_ACTION_BOARD.md` — ShutterBid verify existing Firebase;
  Sermon Studio new migration + old key closeout
- Updated this log

**Standing gates (unchanged):**

- Do not mark ShutterBid Ready until user confirms env wiring, rules, and smoke pass.
- Do not mark Sermon Studio security closed until user confirms old leaked keys
  were rotated or old project was fully decommissioned.

**Next user actions:** Sermon old-key closeout (+ new project env if migrating) →
FairShare/MotoCrew Wave 1 invites → ShutterBid existing Firebase verify + smoke →
FishCrew deploy decision.

No code changed this cycle — docs only; no builds run.

**Verification (2026-07-01, follow-up run):** all Cycle 2 doc changes independently
re-checked and confirmed complete — existing-Firebase language + 10-point verification
table in the checklist, full 11-step runbook with pass/fail table and paste-back
template, KEY_ROTATION migration section with old/new-project separation, and the
updated action board. No further edits were needed.

---

## 2026-07-01 — Cycle 1 begins: guided operator handoff

**State at cycle start:**

| App | Readiness | Blocker |
|---|---|---|
| ShutterBid | Almost Ready (lint/tsc/build pass; graceful no-backend) | User: Firebase provisioning + rules + smoke pass |
| FishCrew | Ready (code); not yet deployed | User: Netlify deploy decision + phone smoke |
| Sermon Studio | Ready (local mode); env examples sanitized | User: rotate Supabase keys (URGENT — service-role key was exposed) |
| FairShare | Ready (simulated data); build passes | User: send Wave 1 invites |
| MotoCrew/Throttle | Ready (mocked shell); lint+build pass | User: send Wave 1 invites (couch-only safety language) |

**Done this cycle (repo-side):**
- Created `BETA_OPERATOR_ACTION_BOARD.md` (this folder) — all user-owned manual actions
- Created this log
- Verified all five app-level docs exist (KEY_ROTATION, FIREBASE_PROVISIONING_CHECKLIST, NETLIFY_DEPLOY_CHECKLIST, 2× BETA_INVITE_PACKAGE)
- Added "report back" sections to app checklists that lacked them

**Next user actions (in order):** rotate Supabase keys → send FairShare + MotoCrew Wave 1 invites → provision ShutterBid Firebase → decide FishCrew deploy.

**Next Codex actions (after user confirms):** verify rotation follow-ups; re-verify + flip ShutterBid to Ready; prep ShutterBid invite package; mark FishCrew deployed; triage Wave 1 feedback.

No code changed this cycle — docs/operator files only; no builds run.
