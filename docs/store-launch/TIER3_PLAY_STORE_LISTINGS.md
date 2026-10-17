# Tier-3 Play Store listings (CurbCue, ThrottleLink, CoachCore, Sermon Studio)

**Date:** 2026-07-11  
**Use for:** Google Play Console default store listing, store settings, privacy policy URL, contact email.

**Policy URLs:** Redeployed `public-site` to Netlify on 2026-07-11 so `https://macksims-public-site.netlify.app/privacy/`, `/support`, and `/account-deletion` resolve (required for Play review). Publisher entity filled 2026-07-14 — see `PUBLISHER_LEGAL_ENTITY.md` and `PLAY_CONSOLE_DECLARATIONS.md`.

Shared URLs (all apps):
- Privacy policy: `https://macksims-public-site.netlify.app/privacy/`
- Support: `https://macksims-public-site.netlify.app/support/`
- Account deletion: `https://macksims-public-site.netlify.app/account-deletion/`
- Contact email: `feedback@macksims.com`
- Developer / copyright: **MackSims LLC** · `© 2026 MackSims LLC`
- Address: 1211 Sweet Gum Drive, Brandon, FL 33511, United States
- Beta hub: `https://macksims.com/beta`

---

## CurbCue (Play record: FairShare)

| Field | Value |
| --- | --- |
| Play app ID | `4973784784637253598` |
| Package | `com.chrissims.fairshare` |
| App name | Curbcue |
| Category | Maps & Navigation |
| Short description | Compare local ride options and pickup pressure before you go. |
| Full description | See below |

### Full description

Curbcue is a MackSims mobility comparison app for reviewing local ride options, pickup pressure, and nearby transport context before you head out.

Compare rideshare, taxi, and local transport options with fare context and crowd-meter signals. This external beta build loads the live CurbCue web experience in a native shell. Optional sign-in is available under Settings.

Some features may be limited, demo, or preview behavior during beta testing. Curbcue does not represent official partnerships with ride providers and does not guarantee prices, pickup times, or availability.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

---

## ThrottleLink / MotoCrew

| Field | Value |
| --- | --- |
| Play app ID | `4973807688393588463` |
| Package | `com.chrissims.throttlelink` |
| App name | ThrottleLink |
| Category | Maps & Navigation |
| Short description | Plan motorcycle rides, crew meetups, and local ride coordination. |

### Full description

ThrottleLink (MotoCrew) is a MackSims motorcycle group ride app for planning rides, coordinating with your crew, and reviewing route and event surfaces.

This external beta build loads the live MotoCrew web experience in a native shell. Guest mode is available — acknowledge the safety notice before ride features unlock.

Some coordination, messaging, or location features may be limited during beta. This app is not an emergency service and does not replace safe riding judgment, traffic laws, or official navigation tools.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

---

## CoachCore

| Field | Value |
| --- | --- |
| Play app ID | `4973388644367502581` |
| Package | `com.chrissims.coachcore` |
| App name | CoachCore |
| Category | Health & Fitness |
| Short description | Coach-led accountability, training workflows, and athlete coordination. |

### Full description

CoachCore is a MackSims sports coaching platform for coach-led accountability, athlete profiles, training workflows, and team coordination.

This external beta build loads the live CoachCore web experience in a native shell. Sign up or log in to explore coach and athlete workflows during testing.

Some training, nutrition, video, or messaging features may be limited or demo data during beta. CoachCore does not provide medical advice, guaranteed performance outcomes, or certified training programs.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

---

## Sermon Studio

| Field | Value |
| --- | --- |
| Play app ID | `4972609657779602718` |
| Package | `com.chrissims.sermonstudio` |
| App name | Sermon Studio |
| Category | Productivity |
| Short description | Organize sermon prep, notes, and church productivity workflows. |

### Full description

Sermon Studio is a MackSims church productivity app for organizing sermon prep, notes, writing support, and calendar workflows.

This external beta build loads the live Sermon Studio web experience in a native shell. Create an account or sign in to explore sermon workspace features during testing.

Some export, collaboration, cloud storage, or AI-assisted writing features may be limited during beta. Content and copyright responsibility remain with the user and their organization.

Feedback: feedback@macksims.com  
Beta hub: https://macksims.com/beta

---

## Store screenshots & graphics (captured 2026-07-11)

Assets live under `docs/store-launch/play-assets/<app>/`:

| App folder | Phone shots | Icon | Feature graphic |
| --- | --- | --- | --- |
| `curbcue/` | 4 (home, compare, crowd-meter, settings) | `icon-512.png` | `feature-1024x500.png` |
| `motocrew/` | 4 (home, rides, map, safety) | `icon-512.png` | `feature-1024x500.png` |
| `coachcore/` | 5 (landing, dashboard, accountability, training, chat) | `icon-512.png` | `feature-1024x500.png` |
| `sermonstudio/` | 4 (dashboard, scripture, ideas, series) | `icon-512.png` | `feature-1024x500.png` |

All phone screenshots are **1080×2400** (9:16) from live Netlify betas.

**Re-capture:** `node scripts/capture-play-store-screens.mjs all`  
**Open folders + Play listings:** `.\scripts\open-play-assets.ps1`

### Upload checklist (each app → Default store listing)

1. **App icon** → `icon-512.png`
2. **Feature graphic** → `feature-1024x500.png`
3. **Phone screenshots** → multi-select all `phone/*.png`
4. **Save** (bottom of page)

Listing URLs:
- [Curbcue](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973784784637253598/main-store-listing)
- [ThrottleLink](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973807688393588463/main-store-listing)
- [CoachCore](https://play.google.com/console/u/0/developers/6245841440522544747/app/4973388644367502581/main-store-listing)
- [Sermon Studio](https://play.google.com/console/u/0/developers/6245841440522544747/app/4972609657779602718/main-store-listing)

---

## App content (all apps — beta / closed testing)

| Declaration | Suggested answer |
| --- | --- |
| Privacy policy URL | `https://macksims-public-site.netlify.app/privacy/` |
| App access | All functionality available without special access (web shell loads public beta URL) |
| Ads | No |
| Target audience | 18+ (or 13+ if owner confirms youth audience) |
| Content rating | Complete IARC questionnaire — expect low maturity for productivity/sports apps |
