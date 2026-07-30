# Screenshot 404 fix (2026-07-23)

## Audit

OCR scanned **193** PNGs under `app-store-assets/` and `play-assets/`.

| Result | Count | Notes |
| --- | ---: | --- |
| Netlify “Page not found” | **2** (before fix) | `aegisintel/iphone-6.7/02-watchlist.png`, `…/03-settings.png` |
| Primary ASC sizes (6.5 / 6.9 / iPad 12.9) | 0 bad | Already good app UI |
| Play phone pack | 0 bad | Already good app UI |

Live probe also confirmed Aegis **deep links** return Netlify 404:

| Old URL (broken) | Working alternate |
| --- | --- |
| `https://sprightly-lily-160925.netlify.app/watchlist` | `/` then click `button.app-nav-btn` **Watchlist** |
| `https://sprightly-lily-160925.netlify.app/settings` | `https://sprightly-lily-160925.netlify.app/#settings` (or nav **Settings**) |

Other live bases (CoachCore, CurbCue, MotoCrew, Sermon Studio, ShutterBid marketplace/job/post, FishCrew) returned in-app UI for capture routes. ShutterBid `/browse` still 404s (not used in primary packs).

## Fixed files (recaptured)

All Aegis Intel `01-home` / `02-watchlist` / `03-settings` refreshed with SPA-safe navigation:

- `app-store-assets/aegisintel/iphone-6.5/{01-home,02-watchlist,03-settings}.png` — **1242×2688**
- `app-store-assets/aegisintel/iphone-6.9/{01-home,02-watchlist,03-settings}.png` — **1320×2868**
- `app-store-assets/aegisintel/iphone-6.7/{01-home,02-watchlist,03-settings}.png` — **1290×2796** (legacy; only pack that OCR-confirmed 404)
- `app-store-assets/aegisintel/ipad-12.9/{01-home,02-watchlist,03-settings}.png` — **2048×2732**
- `play-assets/aegisintel/phone/{01-home,02-watchlist,03-settings}.png` — **1080×2400**

Post-recapture OCR: **0** remaining “Page not found” / “Site not found” hits on those files.

## Script changes

- `scripts/capture-all-store-screens.mjs` — Aegis shots stay on `/` (or `/#settings`) and switch via `.app-nav-btn`; never hit `/watchlist` or `/settings` paths.
- `scripts/_recapture-aegis-404.mjs` — one-off recapture for the sizes above.

## Still broken (owner / deploy UI)

These need Netlify SPA redirects (or hash/query routing) so refreshable URLs work:

1. **Aegis Intel** — `GET /watchlist` and `GET /settings` → Netlify 404 (app is client-routed only).
2. **ShutterBid** — `GET /browse` → Next.js 404 (unused by store packs; marketplace `/` and `/jobs/venue-content-package` work).

No ASC upload was performed by this pass.
