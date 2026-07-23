# CoachCore - Screenshots

**Updated:** 2026-07-11 · v0.7.1  
**Base URL:** https://coachcore7.netlify.app

## Before capture

1. Open production URL in a clean browser profile
2. **Dismiss** the demo walkthrough banner (session dismiss is OK)
3. Use **mock data only** — no real athlete names or private info
4. Capture at listed viewports; save to `store-assets/v071/`

## Required shots

| # | Screen | URL | Viewport | iOS | Android |
| --- | --- | --- | --- | --- | --- |
| 1 | Landing hero | `/` | 1290×2796 (6.7") | Yes | Phone 1080×2400 |
| 2 | Coach dashboard | `/app` | 1290×2796 | Yes | Phone |
| 3 | Accountability | `/app/accountability` | 1290×2796 | Yes | Phone |
| 4 | Training | `/app/training` | 1290×2796 | Yes | Phone |
| 5 | Team chat | `/app/chat` | 1290×2796 | Yes | Phone |
| 6 | Privacy footer | `/privacy` | 1290×2796 | Optional | Optional |
| 7 | Dashboard tablet | `/app` | 2048×2732 | iPad | 7" tablet 1200×1920 |

## Google Play extras

| Asset | Size | Status |
| --- | --- | --- |
| Feature graphic | 1024×500 | NOT STARTED |
| App icon | 512×512 | Use 1024 source scaled |

## iOS icon

| Asset | Size | Notes |
| --- | --- | --- |
| App Store icon | 1024×1024 | No alpha channel |

## Capture command (optional)

From `coachcore-static-v001`:

```bash
npx playwright install chromium
node scripts/capture-store-screens.mjs
```

Outputs to `store-assets/v071/`.

## Avoid in screenshots

- Medical or performance guarantee claims
- Real minors' names without consent
- Confusing login fields (use dashboard after demo entry)
- Error states or broken layouts

## Asset Status

| Asset | Status | Notes |
| --- | --- | --- |
| App icon 1024 | NOT STARTED | MackSims brand + CoachCore wordmark |
| iOS 6.7" set (5) | NOT STARTED | Run capture script |
| Android phone set (5) | NOT STARTED | Run capture script |
| Feature graphic | NOT STARTED | Play only |
