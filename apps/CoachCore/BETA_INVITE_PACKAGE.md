# CoachCore — Controlled Beta Invite Package

**Build:** v0.5 static mock demo (build verified 2026-07-01)
**Status:** Wave 0 complete — **Wave 1 on hold** (not authorized)
**Existing demo URL:** https://coachcore7.netlify.app (prior deploy — do not redeploy unless instructed)

---

## 1. Controlled rollout plan

| Wave | Who | Size | Goal | Gate to next wave |
|------|-----|------|------|-------------------|
| 0 | Operator smoke pass | 1 | Confirm inventory, demo URL, disclaimers | **Complete** |
| 1 | 1–2 coaches or gym owners you trust | 2–3 | Validate hook, accountability concept, Wave 1 scope | No compliance/copy blockers; concept resonates |
| 2 | Mix of coaches + athletes | 5–8 | Test athlete “today” clarity and connected surfaces | Feedback themes collected |
| 3 | Wider external beta | as desired | Volume feedback | Requires deploy/backend decisions |

**Wave 1 is authorized** — send 2–3 invites. Operator confirmed UX re-review pass.

---

## 2. Distribution options

**Option A — existing Netlify demo (preferred):**

Share https://coachcore7.netlify.app — includes cycle 4 UX patches (deployed 2026-07-01).

**Option B — tester runs locally:**

```powershell
cd coachcore-static-v001
npm install
npm run dev
# http://localhost:3000
```

Zip the `coachcore-static-v001` folder **without** `node_modules`, `.next`, or `.netlify` for Option B.

**Option C — new deploy:** requires explicit authorization — do not use in this cycle.

---

## 3. Copy-paste invite message (Wave 1 — use after operator gate)

> Subject: Help me test CoachCore (10–15 min, static demo)
>
> Hey! I'm building CoachCore — a coaching and team accountability app with the hook
> **“No more guessing who is locked in.”** It covers teams, training, nutrition, film,
> chat, and accountability for coaches, athletes, and gyms (including functional fitness
> / box-gym style programming).
>
> This is an **early static demo beta**: mock data only — no real login, database,
> wearables, or payments. Nutrition and readiness features are **coaching support tools**,
> not medical advice.
>
> What I need (10–15 minutes, best on your phone):
> 1. Open: https://coachcore7.netlify.app
> 2. Explore as a coach: dashboard → team → accountability → one mock action flow.
> 3. Ask yourself: would an athlete know what to do today?
> 4. Tell me: what was confusing, what felt useful, whether accountability feels helpful,
>    and if anything is too much for a first version.
>
> Send thoughts to feedback@macksims.com (template attached). Please don't share publicly yet. Thanks!

Attach: `TESTER_FEEDBACK_TEMPLATE.md`, `EXTERNAL_TESTING_CHECKLIST.md`

---

## 4. What testers should focus on

1. Can a coach understand the app in under 30 seconds?
2. Can an athlete understand what they need to do today?
3. Does the accountability concept feel useful?
4. Are training, food, readiness, and communication clearly connected?
5. Does functional fitness / gym support feel natural without protected trademark language?
6. Is anything confusing, too broad, or too much for Wave 1?
7. **Compliance:** Any nutrition/readiness copy that sounds like medical advice?

---

## 5. Safety and compliance (include in every invite)

- CoachCore does **not** provide medical diagnosis or treatment.
- Meal, readiness, and wearable surfaces are **coaching support** only.
- Use “functional fitness” or “CrossFit-style” — do not imply official CrossFit affiliation.
- Static demo only — action buttons do not persist real data.

---

## 6. Feedback intake

- All feedback → feedback@macksims.com using `TESTER_FEEDBACK_TEMPLATE.md`
- **Compliance/copy issues** (medical framing, trademark affiliation) → treat as **critical**, fix before Wave 2
- Broken navigation or blank screens → fix before next wave
- Concept feedback → log for backend milestone (`docs/NEXT_STEPS.md` v0.6)

---

## 7. Tracking

| Tester | Wave | Invited | Feedback received | Blocking issues | Notes |
|--------|------|---------|-------------------|-----------------|-------|
| | 0 | operator | | | smoke pass |
| | 1 | | | | |
| | 1 | | | | |

---

## 8. Report back after operator smoke pass (Wave 0)

```text
CoachCore Wave 0 (operator):
- inventory reviewed: yes/no
- demo URL smoke pass: pass/fail
- disclaimers clear: yes/no
- Wave 1 invites authorized: yes/no
- blockers: __
```

## 9. Report back after Wave 1

```text
CoachCore Wave 1:
- testers invited: __
- feedback received: __
- accountability concept useful: yes/no/mixed
- athlete today clarity: pass/fail
- compliance/copy flags: yes/no (what)
- too much for Wave 1: yes/no (where)
```
