# Sermon Studio — Backend Standby

**Date:** 2026-07-01  
**App path:** `C:\Users\draco\Downloads\sermon-studio-next-patched`  
**Beta mode:** Local / localStorage demo (no backend required)

---

## What works without backend

| Feature | Local mode |
|---|---|
| Sermon draft editor (title, theme, date, outline) | Yes — localStorage |
| Key points, illustrations, application | Yes |
| Scripture tab (seed verses) | Yes |
| Ideas tab (local templates, not live AI) | Yes |
| Worship setlist | Yes |
| Series management | Yes — localStorage |
| Save Draft / library | Yes — this browser only |
| Copy Sermon Notes | Yes — clipboard |
| Mobile layout | Yes — responsive tabs |

Run without Supabase: **do not ship `.env.local`** in tester zips. `npm install && npm run dev` → http://localhost:3000

---

## What remains backend-dependent (standby)

| Feature | Requires |
|---|---|
| Cross-device sync | Supabase + env vars in `.env.local` only |
| Multi-user auth | Supabase Auth (not wired in current beta UI) |
| ICS calendar export (`/api/ics`) | Supabase server env |
| Seed script (`npm run seed`) | Supabase service role in env |
| Deployed sync | Netlify/Vercel env + new Supabase project when ready |

**Do not create a new Supabase project in this beta cycle** unless explicitly instructed.

---

## Old project security

- Old initial Supabase project: **decommissioned/destroyed** per operator direction.
- Example env files: placeholder values only (re-sanitized 2026-07-01).
- New project wiring: optional future step — env only, never docs.

---

## Operator next steps (when ready for backend)

1. Create or open a **new** Supabase project (if desired).
2. Put URL/keys in `.env.local` only — never in markdown or example files.
3. Run schema from `supabase/schema.sql` if needed.
4. Confirm app boots in Supabase mode locally.
5. Deploy env vars only when deploy is explicitly authorized.

---

## Report back

```text
Sermon Studio backend standby:
- local demo tested: yes/no
- demo sermon + copy flow: pass/fail
- backend wiring started: yes/no/not yet
- new project env installed: yes/no/not applicable
```
