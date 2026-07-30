# CoachCore - Screenshots

**Updated:** 2026-07-23 · store-launch pack  
**Base URL:** https://coachcore7.netlify.app

## Packs (local)

| Slot | Path | Count | Size |
| --- | --- | ---: | --- |
| iPhone 6.5" | `../../app-store-assets/coachcore/iphone-6.5/` | 5 | 1242×2688 |
| iPhone 6.9" | `../../app-store-assets/coachcore/iphone-6.9/` | 5 | 1320×2868 |
| iPad 12.9" | `../../app-store-assets/coachcore/ipad-12.9/` | 5 | 2048×2732 |

**ASC note:** 12.9" iPad screenshots are **required** before Add for Review. See [`../../ASC_SUBMISSION_BLOCKERS_ALL_APPS.md`](../../ASC_SUBMISSION_BLOCKERS_ALL_APPS.md).

## Before capture

1. Open production URL in a clean browser profile
2. **Dismiss** the demo walkthrough banner (session dismiss is OK)
3. Use **mock data only** — no real athlete names or private info

## Required shots

| # | Screen | URL |
| --- | --- | --- |
| 1 | Landing hero | `/` |
| 2 | Coach dashboard | `/app` |
| 3 | Accountability | `/app/accountability` |
| 4 | Training | `/app/training` |
| 5 | Team chat | `/app/chat` |

## Capture command

```bash
cd docs/store-launch
node scripts/capture-all-store-screens.mjs --apps=coachcore --forms=ipad-12.9
```

## Avoid in screenshots

- Medical or performance guarantee claims
- Real minors' names without consent
- Confusing login fields (use dashboard after demo entry)
- Error states or broken layouts

## Asset Status

| Asset | Status | Notes |
| --- | --- | --- |
| App icon 1024 | READY | `../../app-store-assets/coachcore/icon-1024.png` |
| iOS 6.5" / 6.9" | READY locally | Upload in ASC still needed |
| iOS 12.9" iPad | READY locally | **Required** for submission |
| Feature graphic | Play only | |
