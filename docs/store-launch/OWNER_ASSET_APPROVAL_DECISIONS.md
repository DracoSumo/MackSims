# Owner Asset Approval Decisions

Date: July 4, 2026 (Pass 010 update)

Scope: Final asset approval board for FishCrew + ShutterBid store screenshots. **No uploads performed.**

Reference: [ASSET_UPLOAD_PACKAGE_CHECKLIST.md](./ASSET_UPLOAD_PACKAGE_CHECKLIST.md)

---

## Upload Approval Summary

| Question | Answer |
| --- | --- |
| Any screenshot **OWNER APPROVED FOR UPLOAD**? | **NO** |
| Any upload target **Upload allowed: YES**? | **NO** |
| FishCrew build-match | **LIKELY MATCH** (not confirmed; owner sign-off still required) |
| ShutterBid native/mobile verification | **LIKELY NATIVE MATCH** (Pass 009–010 mobile-shell captures) |
| ShutterBid post-job scene | **CLEANED** (Pass 010 Option B scroll-to-form; draft banner not in viewport) |

---

## Final Asset Approval Board (Pass 010)

Upload allowed remains **NO** for every row until owner provides explicit written approval.

### FishCrew

| Scene | File path | Size | Build/native match | Visual status | Owner approval | Upload allowed | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home / local fishing hub | `apps/fishcrew/screenshots/apple/READY-fishcrew-home-local-fishing-hub-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY MATCH** | **READY** — store-safe; Pass 006 `?screenshot=1` | **PENDING** | **NO** | Demo seed; no beta in capture; differs from default first launch |
| Explore / local water | `apps/fishcrew/screenshots/apple/READY-fishcrew-explore-local-water-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY MATCH** | **READY** — demo trips/partners | **PENDING** | **NO** | Pass 006 local static v070 |
| Feed / trip activity | `apps/fishcrew/screenshots/apple/READY-fishcrew-feed-trip-activity-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY MATCH** | **READY** — minor overlay typo risk (`ST. PETS PIER`) | **PENDING** | **NO** | Optional retake for typo only |

### ShutterBid (current upload set — mobile shell)

| Scene | File path | Size | Build/native match | Visual status | Owner approval | Upload allowed | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Marketplace home | `apps/shutterbid/screenshots/apple/READY-shutterbid-marketplace-home-mobile-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY NATIVE MATCH** | **READY** — mobile shell; demo job board | **PENDING** | **NO** | Pass 009; preserved in Pass 010 |
| Job detail / venue content | `apps/shutterbid/screenshots/apple/READY-shutterbid-job-detail-venue-content-mobile-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY NATIVE MATCH** | **READY** — mobile shell; clean job detail | **PENDING** | **NO** | Pass 009; preserved in Pass 010 |
| Client post-job (clean) | `apps/shutterbid/screenshots/apple/READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` (+ Play copy) | `1242×2688` | **LIKELY NATIVE MATCH** | **READY** — scroll-to-form; no draft banner in viewport; category **Other** + title aligned | **PENDING** | **NO** | Pass 010 Option B; supersedes Pass 009 post-job |

### ShutterBid alternate (not in primary 3-scene set)

| Scene | File path | Size | Visual status | Notes |
| --- | --- | --- | --- | --- |
| Jobs browse (backup) | `apps/shutterbid/screenshots/apple/READY-shutterbid-jobs-browse-mobile-1242x2688.png` (+ Play copy) | `1242×2688` | **READY** | Pass 010 Option C captured as fallback; use only if owner prefers jobs list over post-job form |

---

## Superseded Screenshots (Do Not Upload)

| App | File | Superseded by |
| --- | --- | --- |
| ShutterBid | `READY-shutterbid-marketplace-home-1242x2688.png` | Pass 009 `-mobile-` |
| ShutterBid | `READY-shutterbid-job-detail-venue-content-1242x2688.png` | Pass 009 `-mobile-` |
| ShutterBid | `READY-shutterbid-client-post-job-1242x2688.png` | Pass 009/010 mobile |
| ShutterBid | `READY-shutterbid-client-post-job-mobile-1242x2688.png` | Pass 010 `-mobile-clean-` (draft banner in viewport) |

---

## Owner Sign-Off Checklist (Required Before Upload)

- [ ] FishCrew: Confirm **LIKELY MATCH** for build `1.0 (20260624034852)` / Play `1.0`
- [ ] FishCrew: Approve all 3 scenes for Apple and Google Play
- [ ] ShutterBid: Approve all 3 mobile-shell scenes (home, job detail, post-job clean)
- [ ] Both: Complete Apple App Privacy / Google Data Safety / listing prerequisites
- [ ] Both: Resolve console blockers (build selection, category/contact/assets, reviewer access)
- [ ] Both: Provide explicit **upload go-ahead** in writing

---

## Pass 010 — Post-Job Retake Summary

| Attempt | Result |
| --- | --- |
| Option A — auth/demo login | **Skipped** — no safe credentials in repo/docs (`DO_NOT_COMMIT_PASSWORD` only) |
| Option B — scroll-to-form on `/post-job` | **SUCCESS** — `READY-shutterbid-client-post-job-mobile-clean-1242x2688.png` |
| Option C — `/jobs` replacement | Captured as backup (`READY-shutterbid-jobs-browse-mobile-1242x2688.png`); not used in primary set |

Capture settings: **414×896 CSS @ deviceScaleFactor 3** → **1242×2688** PNG. Script: `docs/store-launch/scripts/pass010-shutterbid-postjob-capture.mjs`

---

## Public-Site Blockers (Separate)

| Route | Status |
| --- | --- |
| `https://fishcrew.macksims.com/` | Beta banner on live site (unchanged) |
| `https://macksims.com/shutterbid` | Pass 005 `Site not found`; not fixed |

---

## Historical Evidence (Passes 008–009)

### FishCrew — LIKELY MATCH

Local `fishcrew-static-v070` docs tie TestFlight to v070; internal **0.7.0** vs marketing **1.0**; v083 not found; not **MATCH CONFIRMED**.

### ShutterBid — LIKELY NATIVE MATCH

Pass 006 desktop-width captures superseded. Pass 009–010 mobile-shell captures at ~414 CSS px show bottom nav, hide desktop top nav, output valid **1242×2688** PNGs.

---

## Secret / Private-Data Scan (Pass 010)

| Category | Result |
| --- | --- |
| Real passwords | **None** — only `DO_NOT_COMMIT_PASSWORD` placeholders |
| API keys / Firebase / Supabase credentials | **None** |
| Apple `.p8` / keystore material | **None** |
| Private user/admin data in captures or filenames | **None** |
| Reviewer credentials in docs | **None** (placeholders only) |

---

## Pass 010 Confirmations

- No screenshots uploaded to App Store Connect or Google Play.
- No console records, identifiers, bundle IDs, package names, signing config, Firebase, Supabase, DNS, Netlify settings, backend projects, or app records changed.
- No source code changed in Pass 010.

## Pass 009 Confirmations (Historical)

- No source code changed in Pass 009.
- No uploads performed.

## Pass 008 Confirmations (Historical)

- No source code changed in Pass 008.
- No uploads performed.
