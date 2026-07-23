# ThrottleLink / MotoCrew - Store Launch Status

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| iOS | NOT STARTED | Bundle ID and TestFlight status not confirmed |
| Android | NOT STARTED | Package name and AAB status not confirmed |
| Web/PWA | NOT STARTED | Current deployment status not confirmed |
| Store copy | NOT STARTED | Seeded template only; final app name required |
| Privacy | NEEDS OWNER CONFIRMATION | Complete `PRIVACY_DATA.md` |
| Screenshots | NOT STARTED | Capture after build is final |
| Tester readiness | NOT STARTED | Demo/reviewer path not confirmed |
| Backend readiness | NEEDS OWNER CONFIRMATION | Confirm maps, location, groups, messages, notifications |

## Highest-Priority Blockers

- Confirm final brand name: ThrottleLink or MotoCrew.
- Confirm location and background location behavior.
- Confirm safety/liability language.
- Confirm messaging, calls, intercom, and notification scope.

## Next Action

Select final app name and confirm native permission scope before completing store copy or screenshots.

---

## 2026-07-05 — Bulk UI Polish + Mismatch Audit append

| Area | Status | Notes |
| --- | --- | --- |
| Mobile UI | **POLISHED** | Footer feedback copy softened; existing bottom nav unchanged |
| Local build | **PASS** | `npm run check` on 2026-07-05 |
| Brand mismatch | **OPEN** | Code = MotoCrew; store docs folder = throttlelink |
| Public route | **LIKELY MATCH** | `https://motocrewz.netlify.app` |
| Store readiness | **NOT STARTED** | Unchanged |

See `docs/BULK_UI_POLISH_REPORT.md`.

