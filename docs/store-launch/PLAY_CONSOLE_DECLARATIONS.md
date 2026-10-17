# Play Console declarations — Tier-3 apps

**Date:** 2026-07-14  
**Apps:** Curbcue, ThrottleLink, CoachCore, Sermon Studio  
**Publisher:** See [`PUBLISHER_LEGAL_ENTITY.md`](./PUBLISHER_LEGAL_ENTITY.md) · fill guide [`STORE_CONSOLE_PRIVACY_FILL.md`](./STORE_CONSOLE_PRIVACY_FILL.md)

Shared URLs (live after public-site deploy):
- Privacy: `https://macksims-public-site.netlify.app/privacy/`
- Support: `https://macksims-public-site.netlify.app/support/`
- Account deletion: `https://macksims-public-site.netlify.app/account-deletion/`
- Contact: `feedback@macksims.com`
- Developer: **MackSims LLC**, 1211 Sweet Gum Drive, Brandon, FL 33511, United States
- Copyright: `© 2026 MackSims LLC`

## Per-app IDs

| App | Play ID | Category |
|-----|---------|----------|
| Curbcue | `4973784784637253598` | Maps & Navigation |
| ThrottleLink | `4973807688393588463` | Maps & Navigation |
| CoachCore | `4973388644367502581` | Health & Fitness |
| Sermon Studio | `4972609657779602718` | Productivity |

## Quick declarations (same all apps unless noted)

| Declaration | Answer |
|-------------|--------|
| **Ads** | No, my app does not contain ads |
| **Advertising ID** | No (app does not use Advertising ID) |
| **Government apps** | No |
| **Financial features** | No |
| **Health apps** | No for Curbcue/ThrottleLink/Sermon Studio. **CoachCore:** Yes — fitness/coaching only; not medical device; no diagnosis/treatment |

## Sign in details (App access)

Source of truth: [`DEMO_REVIEW_LOGINS.md`](./DEMO_REVIEW_LOGINS.md) (provision accounts in each auth project before submit).

| App | Answer | Reviewer instructions |
|-----|--------|----------------------|
| **Curbcue** | All functionality available without sign-in | Guest browse compare/crowd-meter. Optional: see DEMO_REVIEW_LOGINS.md (local only) |
| **ThrottleLink** | All functionality available without sign-in | Accept safety notice → guest. Optional: see DEMO_REVIEW_LOGINS.md (local only) |
| **CoachCore** | Demo available without sign-in; OAuth optional | Prefer **Enter Demo Dashboard**. Optional: see DEMO_REVIEW_LOGINS.md (local only) |
| **Sermon Studio** | Some features restricted | see DEMO_REVIEW_LOGINS.md (local only) |
| **FishCrew** | Guest preferred (ASC sign-in unchecked) | Optional: see DEMO_REVIEW_LOGINS.md (local only) |
| **ShutterBid** | Sign-in required | Client `review.shutterbid.client@macksims.com` / `SbClient2026!Mack` · Photo `review.shutterbid.photo@macksims.com` / `SbPhoto2026!Mack` |
| **Aegis Intel** | Guest available | Optional: see DEMO_REVIEW_LOGINS.md (local only) |

## Target audience

- **Target age:** 18 and over (primary adult professionals / general audience)
- **Appeal to children:** No
- **Contains ads:** No

## Content rating (IARC) — conservative beta answers

| Question area | Answer |
|---------------|--------|
| Violence | None |
| Sexuality | None |
| Language | Infrequent/mild or none |
| Controlled substances | None |
| Gambling | None |
| User interaction | Users can communicate (CoachCore/ThrottleLink messaging may be limited in beta) |
| Shares location | Possible for maps/navigation apps (Curbcue, ThrottleLink) — foreground only in beta |
| Unrestricted web access | Yes (WebView loads live beta site) |

## Data safety — conservative beta baseline

Import-ready per-app CSVs (from RetroArch export template, corrected for MackSims):

**Folder:** [`play-data-safety/`](./play-data-safety/) · see [`play-data-safety/README.md`](./play-data-safety/README.md)

| App | CSV |
|-----|-----|
| Curbcue | `play-data-safety/data_safety_curbcue.csv` |
| ThrottleLink | `play-data-safety/data_safety_throttlelink.csv` |
| CoachCore | `play-data-safety/data_safety_coachcore.csv` |
| Sermon Studio | `play-data-safety/data_safety_sermonstudio.csv` |
| FishCrew | `play-data-safety/data_safety_fishcrew.csv` |
| ShutterBid | `play-data-safety/data_safety_shutterbid.csv` |

| Field | Value |
|-------|-------|
| Collects data | Yes |
| Data encrypted in transit | Yes |
| Users can request deletion | **Yes** (`https://macksims-public-site.netlify.app/account-deletion/`) |
| Committed to Play Families policy | N/A (not child-directed) |
| Data sold | No |
| Data shared for ads | No |
| Sharing posture | Collected only (processors on our behalf) |

**Data types NOT declared for any app:** SMS/MMS, ads/tracking IDs for marketing, precise location, health (clinical), payments.

## Store settings contact (all apps)

- Email: `feedback@macksims.com`
- Website: `https://macksims-public-site.netlify.app/support/`
- Phone: (leave blank)

## Remaining manual steps

1. Upload AAB to Internal/Closed testing per app
2. Complete Data safety wizard per app (use table above)
3. Complete IARC content rating questionnaire per app
4. Publishing overview → **Send app for review** after privacy URL validates
5. CoachCore health declaration if prompted (fitness/coaching, not medical)

## Direct Play Console paths (known working)

```
/app/{ID}/main-store-listing
/app/{ID}/store-settings
/app/{ID}/app-content/privacy-policy
/app/{ID}/app-content/ads-declaration
/app/{ID}/app-content/overview
/app/{ID}/publishing
/app/{ID}/tracks/internal-testing
```
