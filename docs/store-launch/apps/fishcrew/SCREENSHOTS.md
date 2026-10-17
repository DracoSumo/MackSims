# FishCrew - Screenshots

**Updated:** 2026-07-23  
See [`../../ASC_SUBMISSION_BLOCKERS_ALL_APPS.md`](../../ASC_SUBMISSION_BLOCKERS_ALL_APPS.md).

## Packs (local)

| Slot | Path | Count | Size |
| --- | --- | ---: | --- |
| iPhone 6.5" | `../../app-store-assets/fishcrew/iphone-6.5/` | 3 | 1242×2688 |
| iPhone 6.9" | `../../app-store-assets/fishcrew/iphone-6.9/` | 3 | 1320×2868 |
| iPad 12.9" | `../../app-store-assets/fishcrew/ipad-12.9/` | 3 | 2048×2732 |

**ASC note:** 12.9" iPad screenshots are **required** before Add for Review.

## Scenes

1. Home
2. Explore
3. Feed

Base: `https://fishcrew.macksims.com` (fallback `https://fishcrew.netlify.app`).

## Capture

```bash
cd docs/store-launch
node scripts/capture-all-store-screens.mjs --apps=fishcrew --forms=ipad-12.9
```
