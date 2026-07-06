# CurbCue — Controlled Beta Invite Package

**Build:** v0.3.0 simulated-data beta (build + smoke checks passed 2026-07-01)
**Status:** cleared for tester invites. No deploy has been performed — distribution
options below.

---

## 1. Controlled rollout plan

| Wave | Who | Size | Goal | Gate to next wave |
|------|-----|------|------|-------------------|
| 1 | Trusted friends/family on real phones | 2–3 | Catch anything confusing or broken in the core compare flow | No blocking bugs; disclaimers understood |
| 2 | Wider trusted circle incl. 1–2 nightlife-going testers | 5–8 | Validate nightlife/crowd/pickup concepts resonate | Feedback themes collected |
| 3 | Open external beta | as desired | Volume feedback | Requires a hosted URL (deploy decision) |

Keep waves 1–2 on the local/shared-build options below; wave 3 needs a deploy (not yet authorized).

## 2. Distribution options (no deploy)

**Option A — tester runs it locally (most reliable):**
Zip the app folder WITHOUT `node_modules`, `dist`, or `_backups`. Tester needs Node 20+:

```powershell
npm install
npm run dev     # http://127.0.0.1:3000
```

**Option B — share the production build:**
Run `npm run build`, zip the `dist/` folder, and have the tester serve it locally
(`npx serve dist`). Opening `index.html` directly from the file system will NOT work
(module scripts require a server).

**Option C — hosted preview:** requires a deploy — do not use until explicitly authorized.

## 3. Copy-paste invite message

> Subject: Help me test CurbCue (10–15 min, everything is simulated)
>
> Hey! I'm building CurbCue — know where to ride before you book. It's a mobile-first app
> for comparing ride prices on a night out (rideshare vs taxi vs walking vs a designated driver),
> with venue crowd/demand context. It's an early external beta: **every price, venue, and
> crowd number is simulated demo data** — nothing is live yet.
>
> What I need from you (10–15 minutes):
> 1. Open the app (instructions attached) — best on your phone or a phone-sized window.
> 2. Read the beta screen, then try: search a trip → compare prices → sort the list →
>    save a place → check "Tonight nearby" and the Crowd Meter.
> 3. Type `error test` in the Pickup field once — you should see a friendly error, not a crash.
> 4. Tell me: what was confusing, what felt useful, what's missing, and whether anything
>    looked "real" when it shouldn't. Would you actually use this on a night out?
>
> Send thoughts to feedback@macksims.com (template attached, but a plain reply works).
> Please don't share the app or screenshots publicly yet. Thanks!

Attach: `TESTER_FEEDBACK_TEMPLATE.md`, `FAIRSHARE_TESTING_NOTES.md`, and the zip from section 2.

## 4. What testers should focus on

1. Beta gate + demo-data banner: is it obvious nothing is real?
2. Compare flow end-to-end (including sort options and the error state)
3. Saved places / recent searches surviving reload
4. Nightlife panel + Crowd Meter: does the concept make sense?
5. Mobile layout: anything cramped, overflowing, or hard to tap
6. The one big question: would they use this on a real night out?

## 5. Feedback intake & triage

- All feedback → feedback@macksims.com using `TESTER_FEEDBACK_TEMPLATE.md`
- Triage weekly: (1) "looked real but isn't" confusion — fix immediately;
  (2) broken flows — fix before next wave; (3) concept feedback — log for the
  live-adapter milestone (`src/adapters/index.ts` is the swap point).

## 6. Tracking

| Tester | Wave | Invited | Feedback received | Blocking issues | Notes |
|--------|------|---------|-------------------|-----------------|-------|
| | 1 | | | | |
| | 1 | | | | |
| | 2 | | | | |

## 7. Report back after Wave 1

Paste back:

```text
CurbCue Wave 1:
- testers invited: __
- feedback received: __
- "looked real but isn't" confusion: yes/no (what)
- broken flows reported: yes/no (what)
- would-use-it verdicts: __
```
