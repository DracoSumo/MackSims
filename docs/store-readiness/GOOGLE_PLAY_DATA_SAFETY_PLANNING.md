# Google Play Data Safety Planning

This is a planning worksheet, not a final legal submission.

## Shared App Family Notes

- Apps: ShutterBid, FishCrew, FairShare, MotoCrew, and future MackSims beta apps.
- Support: support@macksims.com
- Privacy Policy: https://macksims.com/privacy
- Account Deletion: https://macksims.com/account-deletion
- Beta content may be mock, demo, or preview content.

## Data Types To Review Per App

| Data Type | Possible Use | Apps To Check | Notes |
| --- | --- | --- | --- |
| Account info | Sign-in, tester identity, profile ownership | ShutterBid, FishCrew, future wrappers | Confirm provider behavior and deletion path |
| Profile data | Display name, role, home area/water, public profile | ShutterBid, FishCrew, MotoCrew | Confirm stale local state does not leak |
| User content | Uploaded photos, feed posts, portfolio/media | ShutterBid, FishCrew | Confirm moderation and deletion behavior before broad launch |
| Diagnostics | Crash, device, OS, build, support logs | All beta apps | Document provider and retention |
| Location | Route, water, pickup, navigation, ride planning | FairShare, FishCrew, MotoCrew | Do not claim active GPS/background location until validated |
| Financial info | Payments or marketplace flows | ShutterBid, FairShare | Not production-ready unless explicitly wired and reviewed |

## Security And Deletion Questions

- Is data encrypted in transit?
- Is data encrypted at rest by the provider?
- Can users request deletion from inside the app or via support URL?
- Are backups retained, and for how long?
- Are any data types shared with third parties for ads or sale?
- Is data collection optional, required, or only used after sign-in?

## Current Gaps

- Final provider inventory per app.
- Final retention answers.
- Native permission prompts for future GPS, media, camera, push, and Bluetooth modules.
- Store-specific data safety screenshots and review notes.
