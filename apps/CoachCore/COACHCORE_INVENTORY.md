# CoachCore — Source Inventory

**Discovered:** 2026-07-01 (MackSims beta cycle 3 — Workstream 6 recovery)
**Inventory author:** Codex (docs-only pass; no source moves or rewrites)

---

## Actual folder path found

| Path | Role |
|------|------|
| `C:\Users\draco\Downloads\MackSims\apps\CoachCore` | MackSims app folder (parent) |
| `C:\Users\draco\Downloads\MackSims\apps\CoachCore\coachcore-static-v001` | **Active source tree** — all code, build config, and existing product docs |

No alternate copies were found under `coachcore`, `coach-core`, or OneDrive during this pass.
The parent `CoachCore` folder contains only `coachcore-static-v001` plus this inventory note.

---

## Stack / framework detected

| Layer | Detail |
|-------|--------|
| Framework | **Next.js 16.2.9** (App Router) |
| UI | **React 19.2.4**, **Tailwind CSS v4** |
| Language | TypeScript |
| Output mode | Static export (`output: "export"` in `next.config.ts`) |
| Hosting config | `netlify.toml` — build `npm run build`, publish `out` |
| Netlify plugin | `@netlify/plugin-nextjs` (devDependency) |
| Data | Mock data only (`src/data/mock.ts`) — no backend, no auth, no DB |
| Config | `src/config/coachcore.ts` — product hook, demo URL, version label |

**Version label in code:** `v0.5` (static demo with mock state simulation)
**Product hook:** “No more guessing who is locked in.”

---

## Build scripts detected

From `coachcore-static-v001/package.json`:

| Script | Command |
|--------|---------|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |

**Build verification (2026-07-01):** `npm run build` — **pass** (static export to `out/`, all routes prerendered).
**Lint note:** `npm run lint` emits warnings from committed `.netlify/` and `.next/` artifact folders — not from `src/`. Consider excluding those paths in eslint config (cleanup item, not a beta blocker).

---

## Existing docs found

| Doc | Location |
|-----|----------|
| README.md | `coachcore-static-v001/README.md` — includes mobile demo URL and demo-status bullets |
| COACHCORE_VERSIONS.md | `coachcore-static-v001/docs/COACHCORE_VERSIONS.md` — v0.1–v0.5 version locks |
| NEXT_STEPS.md | `coachcore-static-v001/docs/NEXT_STEPS.md` — v0.4 handoff checklist, future backend roadmap |
| AGENTS.md / CLAUDE.md | Agent rules (Next.js 16 breaking-change notice) |
| In-app status page | `/app/status` — build lock, safety list, demo URL |

**Missing before this cycle (now added at `apps/CoachCore/`):**

- `BETA_READINESS_REPORT.md`
- `EXTERNAL_TESTING_CHECKLIST.md`
- `TESTER_FEEDBACK_TEMPLATE.md`
- `BETA_INVITE_PACKAGE.md`

---

## Existing deployment references found

| Reference | Location |
|-----------|----------|
| **Public demo URL** | `https://coachcore7.netlify.app` |
| README | Mobile demo section |
| `docs/COACHCORE_VERSIONS.md` | v0.4 deployment note |
| `docs/NEXT_STEPS.md` | Current demo URL section |
| `src/config/coachcore.ts` | `demoUrl` constant |
| `/app/status` | Linked from in-app status page |
| `netlify.toml` | Build/publish config present |
| `.netlify/` folder | Local Netlify CLI state (gitignored pattern in `.gitignore`) |

**Deploy policy for this cycle:** Do not redeploy unless explicitly instructed.

---

## App surface (routes)

Landing (`/`), beta request shell (`/beta`), login/signup shells, and full coach app under `/app`:

- Dashboard, team, chat, playbook, training, nutrition, video, accountability, integrations, profile, admin
- Mock action flows (send nudge, assign video/workout, log meal, AI workout draft, save note)
- Clickable athlete profiles and video detail pages
- Timeline and internal status page

All routes use mock data; action buttons do not persist writes.

---

## Obvious blockers

| Blocker | Severity | Notes |
|---------|----------|-------|
| No MackSims beta ops docs until this cycle | Resolved | Beta doc pack added at `apps/CoachCore/` |
| v0.4 handoff docs incomplete per NEXT_STEPS.md | Low | README exists but product brief / full handoff still listed as in-progress in internal docs |
| Lint noise from build artifacts | Low | `.netlify/` and `.next/` folders trigger eslint warnings |
| No real auth / backend / integrations | Expected | By design for static demo beta |
| Trademark language in UI | Watch | Beta form uses “Functional fitness / CrossFit-style gym” — acceptable per locked direction; avoid implying official CrossFit affiliation in marketing copy |
| Medical / health claims | Watch | Nutrition and readiness features must stay framed as coaching support, not diagnosis or treatment (see beta docs) |

---

## Beta readiness assessment

**Beta readiness assessment (updated cycle 4):**

**Verdict: Ready for simulated beta** after operator re-reviews local UX patches.

**Cycle 4 patches:** navigation fix, accountability definition, connected surface cross-links, disclaimers, dashboard action cards.

**Wave 1:** Authorized — operator confirmed UX re-review pass.

---

## Report back

After reviewing this inventory and running a smoke pass on the demo URL, paste back:

```text
CoachCore inventory review:
- inventory path confirmed: yes/no
- demo URL loads on phone: yes/no
- static-demo disclaimers clear: yes/no
- ready for Wave 1 invite prep: yes/no / needs cleanup first
- blockers noted: __
```
