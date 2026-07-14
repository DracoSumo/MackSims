# CoachCore - Store Launch Status

**Updated:** 2026-07-11 · v0.7.1

| Area | Status | Notes |
| --- | --- | --- |
| Console status | **READY TO CREATE** | Owner approved scope; do not submit until TestFlight smoke pass |
| iOS | NOT STARTED | Bundle `com.macksims.coachcore`; Capacitor hybrid |
| Android | NOT STARTED | Package `com.macksims.coachcore` |
| Web/PWA | **LIVE** | https://coachcore7.netlify.app |
| Bundle/package | **CONFIRMED** | `com.macksims.coachcore` |
| Store copy | **DRAFT READY** | APP_STORE_CONNECT.md + GOOGLE_PLAY_CONSOLE.md |
| Privacy/data safety | **CONFIRMED** | PRIVACY_DATA.md + live /privacy |
| RLS / backend | **TIGHTENED** | Migrations v071 applied |
| Screenshots/assets | NOT STARTED | See SCREENSHOTS.md + capture script |
| Reviewer notes | **READY** | REVIEW_NOTES.md |
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
