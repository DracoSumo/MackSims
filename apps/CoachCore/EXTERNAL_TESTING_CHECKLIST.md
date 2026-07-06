# CoachCore — External Testing Checklist

Version v0.5 (static mock demo) · Feedback: feedback@macksims.com

Mark each item **Pass / Fail / Notes**. Best on a phone or phone-sized browser window.
**Do not redeploy** — use the existing demo URL or a local dev build.

**Demo URL:** https://coachcore7.netlify.app
**Local dev:** `cd coachcore-static-v001 && npm install && npm run dev`

---

## First impression (coach lens — under 30 seconds)

- [ ] Landing page hook (“No more guessing who is locked in.”) is immediately clear
- [ ] It is obvious this is a coaching / team accountability product
- [ ] “View Demo” or equivalent entry into the app is easy to find
- [ ] Nothing implies live auth, real data sync, or production backend

## First impression (athlete lens — today’s work)

- [ ] From the dashboard, a tester can tell what an athlete should do today
- [ ] Training, meals, film, and accountability surfaces feel connected (not isolated silos)
- [ ] Mock completion states / action flows are understandable

## Core navigation

- [ ] `/app` dashboard loads with action cards and team context
- [ ] Team, Chat, Playbook, Training, Nutrition, Video, Accountability pages all load
- [ ] Integrations, Profile, Admin, and Status pages load
- [ ] Mobile navigation is tappable; no horizontal scroll at ~375 px width
- [ ] Athlete profile links work from Team / Accountability
- [ ] Video detail pages open from Video list

## Mock action flows

- [ ] Send nudge mock page loads and reads as a demo action (no real send)
- [ ] Assign video / assign workout mock pages load
- [ ] Log meal mock page loads
- [ ] AI workout draft mock page loads (no real AI API)
- [ ] Save coach note mock page loads
- [ ] Success / confirmation copy does not imply real backend writes

## Accountability concept

- [ ] Accountability dashboard shows login, film, workout, and fueling signals
- [ ] The “who is locked in” concept feels useful, not creepy or punitive
- [ ] Status labels are readable at a glance

## Functional fitness / gym support

- [ ] WOD / class-style programming language feels natural
- [ ] Copy uses “functional fitness” or “CrossFit-style” — no implied official CrossFit affiliation
- [ ] Gym / box-gym use case is recognizable without feeling bolted on

## Safety and compliance

- [ ] Nutrition and readiness copy does **not** read as medical diagnosis or treatment
- [ ] Wearable / readiness surfaces read as coaching support, not clinical advice
- [ ] Beta request form on `/beta` states it does not submit yet (if tested)
- [ ] `/app/status` safety list is accurate (no real auth, APIs, payments, data writes)

## Wave 1 scope check

- [ ] Nothing feels too broad or overwhelming for a first beta wave
- [ ] Any confusing area is noted (screen name + what was unclear)

---

**Tester:** ____________  **Device/browser:** ____________  **Date:** ____________
**URL tested:** demo URL / local dev (circle one)

---

## Report back

Paste results to the operator or email feedback@macksims.com using `TESTER_FEEDBACK_TEMPLATE.md`.

```text
CoachCore smoke pass:
- demo URL or local: __
- coach 30-second test: pass/fail
- athlete today test: pass/fail
- accountability useful: yes/no/unclear
- connected surfaces: yes/no
- gym/fitness language OK: yes/no
- too much for Wave 1: yes/no (where)
- blockers: __
```
