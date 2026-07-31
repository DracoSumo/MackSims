# MackSims monorepo

Folder-style monorepo of four independent beta web/mobile apps under `apps/`. There is no root `package.json` and no workspace tooling — each app is installed and run on its own with **npm** (per-app `package-lock.json`). All apps run fully in the browser using `localStorage` by default; Supabase/Netlify/Formspree are optional and unset locally.

| App | Path | Framework | Dev URL |
| --- | --- | --- | --- |
| Pastor's Sermon Studio | `apps/SermonStudio` | Next.js 14 | http://localhost:3000 |
| CurbCue (FairShare) | `apps/FairShare` | Vite 7 + React 19 | http://127.0.0.1:3000 |
| MotoCrew | `apps/MotoCrew` | Vite 8 + React 19 | http://localhost:5173 |
| CoachCore | `apps/CoachCore/coachcore-static-v001` | Next.js 16 (static export) | http://localhost:3000 (app at `/app`) |

Standard per-app commands live in each app's `package.json` and README: `npm run dev`, `npm run build`, `npm test` (Vitest), `npm run check`, and `npm run lint` (MotoCrew/CoachCore/SermonStudio).

## Cursor Cloud specific instructions

- Node 22 is active and works for all four apps (they require Node 20+). The update script runs `npm install` in each of the four app directories; there is no root install.
- No secrets/env vars are needed for local dev or tests — all apps default to `localStorage` and degrade gracefully when Supabase/Netlify/Formspree env vars are absent.
- Port conflicts: SermonStudio, CurbCue, and CoachCore all default to **port 3000**. To run more than one at once, override the port: Next apps with `npm run dev -- -p <port>`, Vite apps with `npm run dev -- --port <port>`. MotoCrew defaults to 5173.
- CurbCue's `dev` script hardcodes `--host 127.0.0.1 --port 3000`; use `127.0.0.1` (not `localhost`) and override `--port` if 3000 is taken.
- CoachCore serves marketing pages at `/` and the actual product app under `/app` (`/app` returns a 308 redirect to the trailing-slash form — follow redirects).
- `apps/CoachCore/coachcore-static-v001` `npm run lint` currently reports pre-existing errors (`react-hooks/set-state-in-effect`) in the repo's own components; this is a code issue, not an environment problem, and `npm run build`/`npm test` still succeed. Do not "fix" it as part of environment setup.
- `npm run seed` (SermonStudio) and `deploy:netlify`/`cap:*` scripts require external Supabase/Netlify/Capacitor credentials and native SDKs; skip them for standard local dev.
