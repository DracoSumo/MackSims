# Sermon Studio — Testing Notes (Beta Prep)

Date: 2026-07-01
Environment: Windows 11, Node v22.19.0, npm 10.9.3, Next.js 14.2.15

## Baseline state (before changes)

- `npx tsc --noEmit` — passed (exit 0).
- `npm run build` — passed (exit 0). Routes: `/` (static), `/_not-found`, `/api/ics` (dynamic).
- `npm run lint` — **not configured**: `next lint` prompts interactively to set up ESLint. Left unconfigured on purpose (no heavy config added for beta).
- The shipped `app/page.tsx` was a Supabase-first variant (auth card, church switcher, ICS feed buttons) that **required** Supabase env vars in the browser client (`components/supabaseClient.ts` throws when missing), so basic flows were not testable without a backend.

## Changes made for beta

- Restored/rebuilt the studio dashboard (`app/page.tsx`) around the localStorage-first concept: Current Sermon editor + working Scripture / Ideas / Worship / Series / Library tabs. Original file preserved as `app/page.tsx.bak-beta-prep`.
- Tabs now actually switch sections (previously decorative).
- Added structured outline (key points, illustrations, application) to the sermon model (`lib/types.ts`, optional `outline` field; old saved data is normalized with defaults on load).
- Added "Copy Sermon Notes" button: assembles title/date/theme/series/passages/outline/notes/setlist into plain text via `navigator.clipboard` with a `document.execCommand('copy')` fallback.
- Beta banner at the top: external beta, local storage disclosure, "not live AI" disclosure.
- Idea Gatherer relabeled "Local Suggestions — not live AI" with an explanatory note.
- Replaced `window.alert` / `window.prompt` with inline dismissible status messages and an inline "New Series" input.
- Added loading state, empty states (library, series, passages, scripture search, setlist), and a load-error message.
- Mobile: reduced padding at small widths, `flex-wrap` on button rows and library rows, `max-w-full` on fixed-width selects, `truncate`/`min-w-0` on song titles.
- `supabase/schema.sql`: added `outline jsonb` column with default plus an idempotent `alter table ... add column if not exists` migration line.
- Fixed the corrupt `package.json` in the OLD copy (`C:\Users\draco\Downloads\sermon-studio-next`) — removed a stray `},`; JSON now parses. No other changes there.

## Manual test pass (local mode, no backend)

- Draft a sermon: title/theme/date fields update; draft persists across reload (localStorage draft key).
- Outline: add/remove key points and illustrations; application textarea saves with the sermon.
- Scripture tab: search by reference ("John") and theme ("trust"); translation switcher; "Add to Sermon" attaches a passage badge; unknown search shows a friendly empty state.
- Ideas tab: local suggestions update with theme and attached passages; clearly labeled as templates.
- Worship tab: filter by theme/tempo, add/remove songs, "Match Current Sermon Theme".
- Series tab: create series inline; attach current sermon via switch + dropdown.
- Library tab: save, edit (loads back into editor including outline), delete; survives page reload.
- Copy Sermon Notes: produces clean plain text; success/failure reported inline.

## Known gaps / not tested

- Supabase mode (auth, sync, ICS export) — requires a configured project; out of scope for the no-backend beta.
- `/api/ics` returns a JSON error without Supabase env vars (expected; the UI no longer links to it).
- ESLint not configured (see above).
- `components/AuthCard.tsx`, `components/ChurchSwitcher.tsx`, `components/supabaseClient.ts` are currently unused by the page but kept for a future Supabase-mode revival.
