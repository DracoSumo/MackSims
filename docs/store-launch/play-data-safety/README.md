# Google Play Data Safety CSVs (MackSims)

**Template:** `d:\Downloads\RetroArch\data_safety_export.csv` (Play export format).
**Generated:** import-ready files in this folder.

## Shared answers (all apps)

| Field | Value |
| --- | --- |
| Collects personal data | Yes |
| Encrypted in transit | Yes |
| Account deletion / data deletion | **Yes** (user can request) |
| Deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` |
| Sharing posture | **Collected only** (service providers process on our behalf; not sold; no ads) |
| Advertising purpose | Never |
| SMS / MMS | Never |
| Precise location | Never (approx only where listed) |
| Health info | Never |
| Payments | Never (until commerce is live) |

## How to import in Play Console

1. Open the app → **App content** → **Data safety**.
2. Prefer completing the wizard using the matching CSV / matrix below (Play import UI varies; if no CSV import, answer the wizard from this file).
3. Privacy policy URL (separate App content field): `https://macksims-public-site.netlify.app/privacy/`.

## Per-app files

| App | CSV | Declared types (high level) |
| --- | --- | --- |
| Curbcue (FairShare) | `data_safety_curbcue.csv` | name, email, user_id, approx_location, interactions, crash, diagnostics, device_id |
| ThrottleLink (MotoCrew) | `data_safety_throttlelink.csv` | name, email, user_id, approx_location, ugc, other_messages, interactions, crash, diagnostics, device_id |
| CoachCore | `data_safety_coachcore.csv` | name, email, user_id, photos, videos, other_messages, fitness, ugc, interactions, crash, diagnostics, device_id |
| Sermon Studio | `data_safety_sermonstudio.csv` | name, email, user_id, files, ugc, interactions, crash, diagnostics, device_id |
| FishCrew | `data_safety_fishcrew.csv` | name, email, user_id, approx_location, photos, ugc, other_messages, interactions, crash, diagnostics, device_id |
| ShutterBid | `data_safety_shutterbid.csv` | name, email, user_id, photos, videos, ugc, other_messages, interactions, crash, diagnostics, device_id |
| Aegis Intel | `data_safety_aegis.csv` | email, user_id, ugc, interactions, crash, diagnostics, device_id |

## Corrections vs RetroArch template

- Switched deletion from **auto-delete within 90 days** → **Yes, user can request deletion** + Netlify URL.
- Removed **SMS/MMS** (not collected by MackSims apps).
- Stopped marking email/user IDs as **Shared** for analytics/ads — use **Collected** only.
- Narrowed purposes (no Advertising / unnecessary Personalization on diagnostics).
- CoachCore: **Fitness** yes, **Health** no.
- Location apps: **Approximate** only, optional.

## Notes

- **Curbcue (FairShare):** Mobility compare; optional sign-in; approx location for ride/crowd context (foreground).
- **ThrottleLink (MotoCrew):** Ride/crew coordination; optional accounts; approx location; routes/events as UGC; limited messaging.
- **CoachCore:** Coaching accountability. Fitness info YES (coaching). Health info NO (not medical).
- **Sermon Studio:** Sermon drafts/files as docs/UGC. Do NOT mark Political or religious beliefs unless collecting belief demographics.
- **FishCrew:** Fishing community; profiles/photos/UGC; approx location for local water context.
- **ShutterBid:** Marketplace; portfolio photos/videos; job/bid UGC. No payments declared until live commerce.
- **Aegis Intel:** Market research / watchlists. Optional Supabase sign-in. Guest data stays on-device. No location, media, fitness, payments, or ads.

