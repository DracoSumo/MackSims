# Sermon Studio — Controlled Beta Invite Package

**Build:** v0.1.1 local/demo beta (2026-07-01)  
**Live URL:** https://sermon-studio-beta.netlify.app (deployed 2026-07-01)  
**Mode:** localStorage only (ship **without** `.env.local`)

---

## 1. Rollout plan

| Wave | Who | Size | Goal |
|------|-----|------|------|
| 1 | 1–2 pastors or ministry staff you trust | 2–3 | Outline builder + copy flow + mobile layout |
| 2 | Wider trusted circle | 5–8 | Series/library workflow feedback |
| 3 | Hosted preview | as desired | Requires deploy + backend decision |

---

## 2. Distribution

**Hosted (preferred):** https://sermon-studio-beta.netlify.app

**Local fallback:**

```powershell
cd sermon-studio-next-patched
npm install
npm run dev
# http://localhost:3000
```

Zip the folder **without** `node_modules`, `.next`, or `.env.local`.

---

## 3. Copy-paste invite

> Subject: Help me test Sermon Studio (10–15 min, local demo)
>
> Hey! I'm building Sermon Studio — a sermon planning app for drafting outlines, attaching Scripture, planning worship, and copying sermon notes.
>
> This is a **local demo beta**: your work stays in your browser only. Idea suggestions are **local templates, not live AI**. No account required.
>
> What I need (10–15 minutes):
> 1. Run the attached app (Node 20+): `npm install && npm run dev`
> 2. Edit the demo sermon → add a key point → attach a passage from Scripture tab
> 3. Click **Copy Sermon Notes** → **Save Draft** → check Library tab
> 4. Tell me what was confusing, what felt useful, and whether you'd use this weekly
>
> Send thoughts to feedback@macksims.com (template attached). Please don't share publicly yet. Thanks!

Attach: `TESTER_FEEDBACK_TEMPLATE.md`, `EXTERNAL_TESTING_CHECKLIST.md`

---

## 4. Tester focus

1. Is local/demo mode obvious?
2. Can they draft an outline in under 5 minutes?
3. Copy Sermon Notes output useful?
4. Mobile layout at phone width
5. Anything that looks like live AI when it isn't?

---

## 5. Tracking

| Tester | Wave | Invited | Feedback | Notes |
|--------|------|---------|----------|-------|
| | 1 | | | |

---

## 6. Report back

```text
Sermon Studio Wave 1:
- testers invited: __
- feedback received: __
- outline/copy flow: pass/fail
- mobile layout: pass/fail
- blockers: __
```
