# MotoCrew (Throttle/ThrottleLink) — Controlled Beta Invite Package

**Build:** mocked-shell beta (lint + build + smoke checks passed 2026-07-01)
**Status:** cleared for tester invites. No deploy performed — distribution options below.
**Branding note:** MotoCrew is the current branding of the Throttle/ThrottleLink concept.

---

## 1. Controlled rollout plan

| Wave | Who | Size | Goal | Gate to next wave |
|------|-----|------|------|-------------------|
| 1 | Riders you know personally | 2–3 | Validate rider-friendliness: readability, tap targets, quick-glance layout | No safety-copy confusion; no blocking bugs |
| 2 | A small riding group / club contacts | 5–10 | Validate group-ride concepts (phases, packs, meet-ups, comms placeholders) | Feedback themes collected |
| 3 | Open external beta | as desired | Volume feedback | Requires hosted URL (deploy decision) |

**Safety gate for every wave:** invite copy must repeat that this is a couch-testing
app — never used while riding — and that no emergency/comms features are real.

## 2. Distribution options (no deploy)

**Option A — tester runs it locally (most reliable):**
Zip the app folder WITHOUT `node_modules`, `dist`, or `_backup-beta-prep`. Tester needs Node 20+:

```powershell
npm install
npm run dev
```

**Option B — share the production build:**
`npm run build`, zip `dist/`, tester serves it with `npx serve dist` (file:// won't work).

**Option C — hosted preview:** requires a deploy — do not use until explicitly authorized.

## 3. Copy-paste invite message

> Subject: Help me test MotoCrew, a group-ride app concept (15 min, nothing is live)
>
> Hey! I'm building MotoCrew — an app concept for coordinating motorcycle group
> rides: ride dashboard, pack roster, ride phases, meet-up points, and (eventually)
> helmet comms. Right now it's a **demo shell**: every ride, rider, route, and chat
> is mock data. **There is no live tracking, no real messaging, and absolutely no
> emergency features — in a real emergency you call 911 like always.**
>
> One rule: **test it on the couch, not the bike.** The app itself will remind you.
>
> What I need (about 15 minutes):
> 1. Open the app (instructions attached) — phone or phone-sized window is best.
> 2. Acknowledge the safety notice, then explore: Home dashboard → Rides (join one,
>    filter the feed) → create a ride draft → Map screen → Chat/Comms (note what's
>    marked "Not live") → Safety screen (add an emergency contact).
> 3. Tell me: could you read it at a glance with gloves on? Are the tap targets big
>    enough? Did anything look "live" that shouldn't? What would your riding group
>    actually need before using this?
>
> Feedback to feedback@macksims.com (template attached, plain reply is fine).
> Please don't share publicly yet. Ride safe!

Attach: `TESTER_FEEDBACK_TEMPLATE.md`, `THROTTLE_TESTING_NOTES.md`, and the zip from section 2.

## 4. What testers should focus on

1. Safety comprehension: after 2 minutes, do they know nothing is live and the app
   never dispatches help? (If not, that's the #1 bug.)
2. Rider ergonomics: contrast, font size, tap-target size, quick-glance readability
3. Ride flows: join/leave, create draft, phase status card, pack roster
4. Placeholder clarity: map, chat, voice/PTT/call all clearly "Not live"
5. Emergency contacts: add/remove, and the "call 911" disclaimer being unmissable
6. The one big question: what would their riding group need before adopting this?

## 5. Feedback intake & triage

- All feedback → feedback@macksims.com using `TESTER_FEEDBACK_TEMPLATE.md`
- Triage order: (1) any "I thought it was live" confusion — fix immediately, it's a
  safety issue in this domain; (2) broken flows; (3) feature requests → log against
  the roadmap phases in `docs/ROADMAP.md`.

## 6. Tracking

| Tester | Wave | Rider? | Invited | Feedback received | Blocking issues | Notes |
|--------|------|--------|---------|-------------------|-----------------|-------|
| | 1 | | | | | |
| | 1 | | | | | |
| | 2 | | | | | |

## 7. Report back after Wave 1

Paste back:

```text
MotoCrew Wave 1:
- testers invited: __ (riders: __)
- feedback received: __
- safety-copy confusion ("thought something was live"): yes/no (what) — CRITICAL if yes
- rider ergonomics complaints (readability/tap targets): yes/no (what)
- broken flows reported: yes/no (what)
```
