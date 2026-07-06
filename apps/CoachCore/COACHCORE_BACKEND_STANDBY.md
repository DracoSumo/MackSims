# CoachCore — Backend Standby

**Date:** 2026-07-01  
**Source:** `MackSims\apps\CoachCore\coachcore-static-v001`  
**Demo URL:** https://coachcore7.netlify.app (prior deploy — do not redeploy unless instructed)

---

## What works in static demo (no backend)

| Surface | Status |
|---|---|
| Landing + hook | Yes |
| Coach dashboard + accountability view | Yes — mock data |
| Team, training, nutrition, video, chat, playbook | Yes — mock/static |
| Mock action flows (nudge, assign, log meal, AI draft) | Yes — no persistence |
| Mobile navigation | Yes — section routes wired |
| Compliance disclaimers | Yes — static demo + coaching support |

---

## What remains backend-dependent (standby)

| Feature | Future stack (see `docs/NEXT_STEPS.md` v0.6) |
|---|---|
| Real auth (coach/athlete/parent/admin) | Supabase Auth |
| Assignment persistence | Supabase DB + RLS |
| Notifications / nudges | Backend + push |
| Wearables (Garmin, WHOOP, Apple Health, etc.) | Licensed integrations |
| Hudl / video sync | API or licensed integration |
| AI workout generation | Hosted AI with coach review |
| Payments | Legal + terms first |

**Do not add backend integrations in this beta cycle** unless explicitly instructed.

---

## Wave 1 status

Wave 0 smoke pass complete. UX hardening applied (cycle 4). **Operator confirmed re-review pass (2026-07-01) — Wave 1 authorized.** Send invites per `BETA_INVITE_PACKAGE.md`.

---

## Report back

```text
CoachCore backend standby:
- local build verified: yes/no
- UX hardening reviewed: yes/no
- Wave 1 re-authorize: yes/no
```
