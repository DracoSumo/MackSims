# Import play-assets from Google Drive → Play Console

Your Drive folder: **play-assets** (with `curbcue`, `motocrew`, `coachcore`, `sermonstudio` subfolders).

Play Console cannot bulk-import a folder automatically from here — use **Add from Drive** once per app to load files into that app's asset library, then assets get assigned to listing slots.

## Per app (repeat for motocrew, coachcore, sermonstudio)

1. Open the app's **Default store listing** in Play Console.
2. Under **App icon**, click **Add assets**.
3. In the side panel, click **Add from Drive**.
4. In the Google picker: **My Drive → play-assets → `<app-folder>`**
5. Multi-select **all PNGs** you need:
   - `icon-512.png`
   - `feature-1024x500.png`
   - Everything in `phone/`
   - Everything in `tablet-7/`
   - Everything in `tablet-10/`
6. Confirm import (picker may crop icon/feature automatically).
7. Reply **"`<app>` drive imported"** — assets will be assigned to slots and listing saved.

## App → Play record

| Drive folder | Play app | Listing URL |
|--------------|----------|-------------|
| `motocrew` | ThrottleLink | [listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973807688393588463/main-store-listing) |
| `coachcore` | CoachCore | [listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973388644367502581/main-store-listing) |
| `sermonstudio` | Sermon Studio | [listing](https://play.google.com/console/u/0/developers/6245841440522544747/app/4972609657779602718/main-store-listing) |

## Status

- **curbcue** — listing saved with all graphics.
- **motocrew** — partial: icon, feature, `01-home` only; import remaining shots from Drive `motocrew/phone`, `tablet-7`, `tablet-10`.
- **coachcore** — listing text filled; import all PNGs from Drive `coachcore/`.
- **sermonstudio** — pending import from Drive `sermonstudio/`.

Local copies (same files): `MackSims/docs/store-launch/play-assets/`
