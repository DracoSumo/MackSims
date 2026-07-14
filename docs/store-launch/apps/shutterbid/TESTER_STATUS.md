# ShutterBid - Tester Status

Use statuses: `READY`, `IN PROGRESS`, `NEEDS OWNER CONFIRMATION`, `BLOCKED`, `NOT APPLICABLE`.

## Tester Track Audit

| Item | Status | Notes |
| --- | --- | --- |
| TestFlight group exists | NEEDS OWNER CONFIRMATION | Audit existing App Store Connect setup |
| TestFlight build available | NEEDS OWNER CONFIRMATION | Prior docs say external testing candidate; confirm current build/version in console |
| Google Play internal test exists | NEEDS OWNER CONFIRMATION | Audit existing Play Console setup |
| Google Play closed test exists | NEEDS OWNER CONFIRMATION | If required |
| Tester list ready | NEEDS OWNER CONFIRMATION |  |
| Feedback process ready | NEEDS OWNER CONFIRMATION |  |
| Known issues documented | IN PROGRESS | Update blockers as found |

## Current Audit Result

- Local status: external testing candidate.
- Public ShutterBid route: `https://macksims.com/shutterbid` returned HTTP 200 on 2026-07-01.
- Older local note: next native/store build was pending.
- iOS TestFlight status: NEEDS OWNER CONFIRMATION.
- Google Play internal/closed test status: NEEDS OWNER CONFIRMATION.
- Uploaded native build status: NEEDS OWNER CONFIRMATION.

## Tester Instructions Draft

1. Install ShutterBid from the assigned TestFlight or Google Play testing link.
2. Open the app and confirm the first launch flow works.
3. Test guest/browse flow if available.
4. Test the client flow using only approved test data.
5. Test the photographer flow, including profile and portfolio behavior if active.
6. Test job, bid, approval, business, venue, or admin flows that are present.
7. Check support, privacy, and account deletion links.
8. Report issues through the approved feedback path.

## Feedback Path

TBD.
