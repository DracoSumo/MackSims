# CoachCore — Beta Readiness Report

**Date:** 2026-07-01
**Version:** v0.5 (coachcore-static-v001 — static mock demo)
**Status:** UX hardened — **Wave 1 authorized** (operator re-review pass)  
**Verdict:** **Ready for simulated beta**

---

## Product identity (locked direction)

CoachCore is an all-sports coaching and team accountability app from MackSims.

**Core hook:** “No more guessing who is locked in.”

Supports coaches, teams, athletes, gyms, functional fitness / box-gym use cases, training plans, WOD/class-style programming, team/group chats, meal/nutrition tracking, wearable/readiness tracking, video movement review, leaderboards, accountability, and AI-assisted programming — all as **mock/static demo surfaces** in this build.

**Public demo URL (prior deploy):** https://coachcore7.netlify.app
**Do not redeploy** unless explicitly instructed.

---

## What existed before beta ops recovery

A substantial Next.js static-export app was already in place:

- Public landing + beta request shell + login/signup shells
- Full coach app: dashboard, team, chat, playbook, training, nutrition, video, accountability, integrations, profile, admin
- Mock action flows (nudge, assign video/workout, log meal, AI workout draft, save note)
- Clickable athlete profiles and video detail pages
- Internal `/app/status` build-lock page
- Product docs: README, COACHCORE_VERSIONS, NEXT_STEPS
- Netlify config and prior mobile demo deployment

CoachCore was **not** on the MackSims beta operator board until this cycle.

---

## What beta ops recovery added

| Area | Change |
| --- | --- |
| Inventory | `COACHCORE_INVENTORY.md` — path, stack, blockers, readiness |
| Beta docs | This report + external checklist + feedback template + invite package |
| Master beta system | Workstream 6 on operator board and cycle log |

No source code changed in this recovery pass.

---

## Verification

| Check | Result |
| --- | --- |
| Source located | Yes — `apps/CoachCore/coachcore-static-v001` |
| `npm run build` | **Pass** (2026-07-01) — static export, all routes prerendered |
| `npm run lint` | Warnings only — from `.netlify/` / `.next/` artifacts, not `src/` |
| Real auth / DB / payments | None — by design |
| Demo URL referenced | `https://coachcore7.netlify.app` |
| `.env` touched | No |

---

## Safety and compliance posture

- **No medical claims.** Nutrition, readiness, and wearable surfaces are coaching-support tools — not diagnosis, treatment, or medical advice.
- **Trademark language:** Use “functional fitness” or “CrossFit-style” in copy; do not imply official CrossFit affiliation unless licensed.
- **Static demo framing:** No real auth, Hudl, wearables, payments, or data writes. Action buttons simulate flows only.
- **No deploy** in this cycle unless explicitly authorized.

---

## Tester focus areas (Wave 1)

1. Can a coach understand the app in under 30 seconds?
2. Can an athlete understand what they need to do today?
3. Does the accountability concept feel useful?
4. Are training, food, readiness, and communication clearly connected?
5. Does functional fitness / gym support feel natural without protected trademark language?
6. Is anything confusing, too broad, or too much for Wave 1?

---

## Cycle 4 UX hardening (2026-07-01)

| Patch | Detail |
|---|---|
| Navigation | AppShell routes to all section pages; mobile nav includes Train/Fuel/Proof |
| Accountability | Definition, status legend, readiness column, profile links, nudge flow |
| Connected surfaces | Cross-link strips on dashboard, training, nutrition, accountability, team |
| Disclaimers | Static demo + coaching-support on landing, dashboard, nutrition, accountability |
| Dashboard | Action cards rendered; version aligned to v0.5 |

**Wave 1:** Still on hold until operator re-reviews patched local build.

---

## Operator smoke pass (2026-07-01)

| Check | Result |
|---|---|
| Demo URL | Pass — https://coachcore7.netlify.app |
| Disclaimers | Clear |
| Coach 30-second clarity | Pass |
| Accountability concept | Unclear — **primary Wave 1 question** |
| Connected surfaces | Not yet — **primary Wave 1 question** |
| Gym/fitness language | OK |
| Compliance flags | None reported |
| Wave 1 | **Authorized** — operator re-review pass (2026-07-01) |

---

## Remaining blockers for beta

Wave 1 invites **not authorized**. Open UX themes from smoke pass:

- Accountability concept unclear
- Training / food / readiness / comms not felt as connected

Revisit Wave 1 when operator re-authorizes or minimal UX polish addresses these themes (no major features, no redeploy unless instructed).

---

## Post-beta path (before any “real” launch)

1. Supabase auth + database (see `docs/NEXT_STEPS.md` v0.6 roadmap)
2. Real notifications and assignment persistence
3. Wearable and Hudl integrations with licensed/API access only
4. Legal review of nutrition/readiness copy (coaching support vs medical claims)
5. Terms, privacy, and role-based permissions

---

## Report back

After inventory review and demo URL smoke pass:

```text
CoachCore readiness:
- build confirmed: yes/no
- demo URL smoke pass: pass/fail
- static-demo disclaimers clear: yes/no
- Wave 1 invite prep authorized: yes/no
- blockers: __
```
