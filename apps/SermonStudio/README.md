# Pastor's Sermon Studio (beta)

Draft sermons, plan series, curate worship setlists, browse a small local scripture library, gather ideas, and keep a saved sermon library — all in the browser.

**This is an external beta.** By default the app runs with **no backend**: everything is stored in your browser's localStorage. Idea suggestions are simple local templates built into the app — **not live AI**.

## Requirements

- Node.js 18+ (tested with Node 22)
- npm

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build for production

```bash
npm run build
npm run start
```

Other scripts:

- `npm run lint` — Next.js lint (note: ESLint is not configured in this repo yet; the command prompts for interactive setup)
- `npm run seed` — seeds a Supabase database from `data/seed/` (only needed if you configure Supabase)

## Storage modes

| Mode | When | Where data lives |
| --- | --- | --- |
| Local (default) | No Supabase env vars set | Browser localStorage (`sermon-studio-lib`, `sermon-studio-series`, `sermon-studio-draft`) |
| Supabase (optional) | Env vars configured | Your Supabase project (`supabase/schema.sql`) |

Clearing browser site data clears the local library. Data does not sync between browsers/devices in local mode.

## Optional Supabase configuration

Supabase is entirely optional. To enable it, create a `.env.local` with these variables (values come from your own Supabase project — never commit this file):

- `NEXT_PUBLIC_SUPABASE_URL` — project URL (client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key (client)
- `SUPABASE_URL` — project URL (server-side scripts, e.g. seeding)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-only; never expose with a `NEXT_PUBLIC_` prefix)
- `NEXT_PUBLIC_SITE_URL` — public site URL (used for share/feed links if deployed)

Then apply `supabase/schema.sql` to your project and optionally run `npm run seed`.

## Project layout

- `app/` — Next.js App Router pages (`page.tsx` is the studio dashboard) and the `/api/ics` calendar export route (requires Supabase)
- `components/ui/` — small UI primitives (button, card, input, textarea, badge, switch)
- `lib/` — Supabase client helper and shared types (`Sermon`, `SermonOutline`, `Series`, `Song`, `Verse`)
- `data/seed/` — local fallback songs and verses
- `supabase/schema.sql` — database schema for the optional backend

## Beta docs

- `SERMON_STUDIO_TESTING_NOTES.md` — what was tested and how
- `BETA_READINESS_REPORT.md` — current readiness assessment
- `EXTERNAL_TESTING_CHECKLIST.md` — step-by-step checklist for testers
- `TESTER_FEEDBACK_TEMPLATE.md` — feedback form (send to feedback@macksims.com)
