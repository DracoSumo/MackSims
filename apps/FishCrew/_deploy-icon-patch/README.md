# FishCrew (v0.8)

Live product bet for MackSims: **post trip → share invite → approve → crew chat**.

## Canonical paths

- Live web app (Netlify) and, from 0.10.0, the Codemagic iOS build: `apps/FishCrew/_deploy-icon-patch/`.
  The iOS app is a remote shell (`server.url` = https://fishcrew.macksims.com), so it runs the deployed web build.
- Older bundled copy (Codemagic Android still builds from it): `apps/fishcrew-static-v070/`.

Phone alerts (0.10.0): `supabase/migrations/20261011_push_notifications.sql`, edge function
`supabase/functions/push-dispatch` (deploy with `--no-verify-jwt`), and `scripts/ios-enable-push.sh` at the repo root.

## Core loop

1. Host posts a trip (public area + private meetup).
2. Host shares `https://fishcrew.macksims.com/?trip=<id>`.
3. Friend opens the link, signs in if needed, requests a spot.
4. Host approves → private meetup + crew chat unlock.
5. In-app alerts deep-link back into Crew.

## Stack

- Static SPA (`app.js` / `config.js`) + Supabase Auth / Postgres / Storage
- Optional Capacitor shell (`capacitor.config.json`, `npm run build:dist`)
- PWA service worker + legal pages for store readiness

## Local

```bash
cd apps/fishcrew-static-v070
# static file server of your choice, e.g.
npx --yes serve -l 4173 .
npm test
npm run build:dist
```

Production web: https://fishcrew.macksims.com/

## Config honesty

- `DEMO_MODE: false` — live beta data, not sample packs by default
- Email/password auth primary; Google/Facebook still off
- Trip invite share is live; Fish ID / measure remain assistive stubs
