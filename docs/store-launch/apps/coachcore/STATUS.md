# CoachCore - Store Launch Status

**Updated:** 2026-07-23 · v0.7.1  
**Owner paste kit:** [`../../OWNER_UPLOAD_KIT.md`](../../OWNER_UPLOAD_KIT.md)

| Area | Status | Notes |
| --- | --- | --- |
| Console status | **READY TO PASTE** | Listing copy + assets in OWNER_UPLOAD_KIT; do not submit until smoke pass |
| iOS | IN PROGRESS | Bundle `com.macksims.coachcore`; Capacitor hybrid |
| Android | IN PROGRESS | Play CSV may still show `com.chrissims.coachcore` — **OWNER CONFIRM** ID split |
| Web/PWA | **LIVE** | https://coachcore7.netlify.app |
| Bundle/package | **CONFIRMED** | Capacitor `com.macksims.coachcore` |
| Store copy | **READY TO PASTE** | OWNER_UPLOAD_KIT + APP_STORE_CONNECT / GOOGLE_PLAY_CONSOLE |
| Privacy/data safety | **READY TO PASTE** matrix · **OWNER CONFIRM** App Privacy wizard | PRIVACY_DATA.md + CSV |
| RLS / backend | **TIGHTENED** | Migrations v071 applied |
| Screenshots/assets | **READY TO PASTE** | 5×6.5, 5×6.9, 5×iPad 12.9 (2048×2732); Play phone+feature ready |
| Age / content rights | **OWNER CONFIRM** | Suggested 12+ / shared questionnaire in kit |
| Reviewer notes | **READY TO PASTE** | REVIEW_NOTES.md + DEMO_REVIEW_LOGINS |
| Tester track | NOT STARTED | After first native build |

## Completed this pass

- Team-scoped Supabase RLS (orgs, teams, members, content tables)
- User-owned sync logs; staff-only coach notes
- Beta anon insert with validation; no cross-user reads
- Store identity, copy, privacy forms, reviewer notes
- Bundle ID `com.macksims.coachcore` in Capacitor config

## Next actions

1. Run `node scripts/capture-store-screens.mjs` for store assets
2. `npm run build:native` + Codemagic signed build
3. Create App Store Connect + Play Console records (do not public-submit yet)
4. TestFlight / Play internal with 2+ testers

## Blockers

None for record creation. Public launch blocked on: native build upload, screenshot set, TestFlight smoke pass.
