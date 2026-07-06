# Sermon Studio — Supabase Key Rotation

**Date flagged:** 2026-07-01
**Last updated:** 2026-07-01 (cycle 4 — old project closeout + example re-sanitization)

## Current security status

| Item | Status |
|---|---|
| Old initial Supabase project | **Decommissioned/destroyed** per operator direction — leaked keys no longer valid at source |
| Example env files (`.env.example`, `.env.local.example`) | **Re-sanitized** with placeholder values only (cycle 4) |
| Real values in docs | None — variable names only |
| New Supabase project | Optional / future — wire only in `.env.local` when ready |

**Security closeout for the old project:** Treat as **complete** if the old project was fully deleted. If any copy of the old project still exists in the Supabase dashboard, rotate or delete it before calling security closed.

**Original status note:** Example env files were sanitized locally on 2026-07-01; server-side rotation was required while the old project existed.

## What happened

The checked-in example files (`.env.example`, `.env.local.example`) contained what
appeared to be a real Supabase project URL, anon key, and — critically — a
**service role key**. The service role key bypasses Row Level Security and must
never appear in any committed or distributed file.

On 2026-07-01 both example files were replaced with names-only placeholders.
Sanitizing the files does **not** un-expose the old values: anyone who received a
copy of this folder (zip, git history, backup) may have them.

## Required actions (do these in the Supabase dashboard)

1. Sign in at https://supabase.com/dashboard and open the Sermon Studio project.
2. **Rotate the service role key** — Project Settings → API keys → rotate/regenerate
   the `service_role` secret. This immediately invalidates the leaked key.
3. **Rotate the anon/publishable key** the same way (lower risk than service role,
   but rotate it since both leaked together).
4. If the project uses a database password that was ever shared alongside these
   keys, reset it: Project Settings → Database → Reset database password.
5. Review logs for suspicious access: Dashboard → Logs (API / Auth / Database)
   around and after the exposure window.
6. Put the NEW values only in `.env.local` (gitignored — see `.gitignore` line
   `.env*`). Never put real values back into `*.example` files.

## Where the new values go

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | safe to be public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | designed to be public, still rotate |
| `SUPABASE_URL` | server only | |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **secret — never NEXT_PUBLIC_** |
| `NEXT_PUBLIC_SITE_URL` | links/redirects | not a secret |

## Also check

- The older copy at `C:\Users\draco\Downloads\sermon-studio-next` has its own
  `.env.local` (untouched). If it holds the same project's keys, rotation above
  covers it; update that file with new values if you still use that copy.
- Any deployed environments (Vercel/Netlify) that used the old keys need the new
  values set in their environment settings.

## Note on backups

The sanitized example files were deliberately **not** backed up before editing —
keeping local copies of leaked secrets would defeat the purpose of sanitizing.
The old values remain recoverable by the project owner in the Supabase dashboard
until rotation, which is another reason to rotate now.

## New Sermon Studio project / URL migration

Sermon Studio may move to a **new Supabase project and URL**. That migration does
**not** remove the need to close out the **old** project if its keys were ever
leaked.

### What this means

- You may install a **new** Supabase project URL and keys in local/deployed
  environment variables for the current Sermon Studio app.
- The **old** leaked project keys still need **rotation** unless the old project
  was fully **deleted or decommissioned**.
- Treat old-project closeout and new-project wiring as **two separate tasks** —
  both must be confirmed before security is considered closed.

### Where new values go (never in docs)

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | new project URL — env only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | env only; designed to be public but never in docs |
| `SUPABASE_URL` | server only | env only |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **secret — never `NEXT_PUBLIC_`, never client-side** |
| `NEXT_PUBLIC_SITE_URL` | links/redirects | update if the app URL changed |

**Rules:**

- New Supabase URL and keys go **only** into `.env.local` and deployed
  environment settings — never into markdown, commits, chat, or example files.
- The **service-role key must never be used client-side** or exposed in any
  `NEXT_PUBLIC_` variable.
- If the old Supabase project still exists, rotate or decommission it even after
  the new project is live.

### Old project closeout (required if old project still exists)

1. Open the **old** Supabase project in the dashboard (if it still exists).
2. Rotate `service_role` and anon keys **or** delete/decommission the entire
   project if it is no longer needed.
3. Reset DB password if it was ever shared alongside the leaked keys.
4. Skim access logs for suspicious activity around the exposure window.
5. Update any deployed environments that still pointed at the old project.

### New project wiring (if migrating)

1. Create or open the **new** Sermon Studio Supabase project.
2. Copy the new URL and keys manually into `.env.local` (and deployed env when
   ready).
3. Run migrations / schema setup per project docs if required.
4. Confirm the app opens locally against the new backend.
5. Update deployed env vars when you choose to deploy — report status separately.

## Report back after completing this

Paste back (no key values, ever):

```text
Sermon Studio key rotation / migration:
- old project rotated: yes/no/not applicable
- old project decommissioned: yes/no/not applicable
- new project URL installed in env: yes/no/not migrating
- service_role key rotated (old project): yes/no/not applicable
- anon key rotated (old project): yes/no/not applicable
- DB password reset: yes/no/not needed
- suspicious log activity found: yes/no
- local app opens: yes/no
- deployed env updated: yes/no/not deployed
```
