# MotoCrew — Native Platform Decision (Next Sprint)

## Current state
- **Web PWA shell** (Vite + React) with mock rides, local drafts, and safety gate.
- **No live GPS, maps API, or intercom** connected.

## Options under consideration

| Path | Pros | Cons |
|------|------|------|
| **Capacitor PWA wrap** | Reuse current web UI; faster beta | iOS background GPS unreliable; intercom limited |
| **React Native** | Better native GPS, push, comms hooks | Full rewrite of navigation + maps layer |

## Hard limitations (do not over-promise in beta)
- **iOS background GPS** is not dependable from a browser or thin Capacitor shell.
- **Intercom / mesh comms** need native audio + platform permissions.
- **Live pack tracking** requires backend + map provider keys + battery-aware native APIs.

## Recommended sequence
1. Ship controlled web beta with honest mock/live labels.
2. Choose Capacitor vs RN after 2–3 ride-host feedback cycles.
3. Add map adapter (Mapbox/Google) only after provider keys and ToS review.
4. Wire backend for rides, chat, and presence before claiming live tracking.

## Safety copy (required in all builds)
Riders must not interact with the app while moving. Emergency contacts stay on-device until a vetted backend exists.
