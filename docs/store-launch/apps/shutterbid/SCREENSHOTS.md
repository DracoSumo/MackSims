# ShutterBid - Screenshots

**Updated:** 2026-07-23  
See also [`SCREENSHOT_STATUS.md`](./SCREENSHOT_STATUS.md), [`ASC_SUBMISSION_BLOCKERS_ALL_APPS.md`](../../ASC_SUBMISSION_BLOCKERS_ALL_APPS.md).

## Packs (local)

| Slot | Path | Count | Size |
| --- | --- | ---: | --- |
| iPhone 6.5" | `../../app-store-assets/shutterbid/iphone-6.5/` | 3 | 1242×2688 |
| iPhone 6.9" | `../../app-store-assets/shutterbid/iphone-6.9/` | 3 | 1320×2868 |
| iPad 12.9" | `../../app-store-assets/shutterbid/ipad-12.9/` | 3 | 2048×2732 |

**ASC note:** Version 1.0 Prepare for Submission blocked on missing **12.9" iPad** screenshots (among other fields). Local iPad pack is captured; **upload still required**. Do not upload without owner approval of scene set.

## Scenes

1. Marketplace (`01-marketplace`)
2. Job detail (`02-job-detail`)
3. Post job (`03-post-job`)

Base: `https://shutterbid-web.netlify.app` (fallback `https://shutterbid.netlify.app`).

## Capture

```bash
cd docs/store-launch
node scripts/capture-all-store-screens.mjs --apps=shutterbid --forms=ipad-12.9
```
