# MotoCrew (Throttle / ThrottleLink)

MotoCrew is the current branding of the Throttle / ThrottleLink concept: a motorcycle group-ride
coordination app. This build is a **mocked beta shell** — every ride, route, chat, and status you
see is demo data. There is no backend, no live tracking, no live comms, and no emergency dispatch.

> **Safety first: do not use this app while riding.** Set everything up before kickstands-up.
> MotoCrew does not contact emergency services — in a real emergency, call 911.

## What's in this build (v0.1 beta shell)

- Rider dashboard: tonight's ride hero card, quick actions, mocked ride-phase status card
  (Staging / Rolling / Regroup / Fuel Stop / Complete).
- Ride feed and detail: upcoming / featured / completed groups, filters by status and pace,
  pack roster, safety notes, join/leave (stored locally).
- Route/map placeholder: works with **no map API keys** — a styled panel states that maps
  require provider configuration, with a mocked route outline beneath it.
- Pack chat mock and comms/intercom placeholders, all clearly marked **Not live**.
- Safety screen: rider safety rules, emergency contacts list (localStorage only, max 6),
  and a beta feedback link.
- Create-ride flow saving drafts to localStorage.
- First-load safety notice that must be acknowledged (persisted locally).
- Tester feedback prompts (mailto: feedback@macksims.com).

## Install / develop / build

Requires Node 20+ and npm.

```powershell
cd C:\Users\draco\Downloads\MackSims\apps\MotoCrew
npm install       # only needed once / if node_modules is missing
npm run dev       # Vite dev server
npm run lint      # ESLint (flat config)
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build locally
```

Stack: Vite 8, React 19, TypeScript ~6, ESLint flat config. No router, no state library —
plain React state plus a small `useLocalStorageState` hook.

## Local data

User-entered data is stored in `localStorage` under these keys and never leaves the device:

| Key | Contents |
| --- | --- |
| `motocrew.joinedRideIds` | Rides the tester "joined" |
| `motocrew.draftRides` | Draft rides from the create flow |
| `motocrew.emergencyContacts` | Emergency contacts (Safety screen) |
| `motocrew.safetyAcknowledged` | First-load safety notice acknowledgement |

Clear site data in the browser to reset the app.

## Future backend / API / key requirements

Nothing below exists in this build. Each item is a placeholder surface today:

- **Map provider + API key** — Mapbox, Google Maps Platform, or an OpenStreetMap stack for real
  route rendering, meet-spot pins, and ETAs. Keep it behind a map adapter (see `docs/ROADMAP.md`).
- **Backend + auth** — ride storage, pack membership, profiles, and draft sync to replace
  localStorage.
- **Realtime messaging** — chat, announcements, and checklists (WebSocket or hosted realtime).
- **Voice/comms** — WebRTC or similar for voice rooms, push-to-talk, and host broadcast; native
  wrapper work for helmet/headset Bluetooth routing.
- **GPS / background location** — permissioned live pack position; requires a native wrapper
  (Capacitor / React Native) and app-store policy review for background use.
- **Push notifications** — ride alerts, regroup prompts, safety broadcasts.
- **Road awareness data** — speed zone / camera / hazard feeds, gated by regional legal review.

## Docs

- `docs/ROADMAP.md` — phased product roadmap.
- `THROTTLE_TESTING_NOTES.md` — what testers can and cannot exercise.
- `BETA_READINESS_REPORT.md` — current readiness assessment.
- `EXTERNAL_TESTING_CHECKLIST.md` — pass/fail checklist for external testers.
- `TESTER_FEEDBACK_TEMPLATE.md` — copy-paste feedback template (email feedback@macksims.com).

Backups of files significantly modified during beta prep live in `_backup-beta-prep/`.
