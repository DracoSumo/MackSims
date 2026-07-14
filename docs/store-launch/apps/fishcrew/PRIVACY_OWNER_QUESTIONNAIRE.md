# FishCrew - Privacy Owner Questionnaire

Date: July 2, 2026

Purpose: collect owner-confirmed answers for Apple App Privacy and Google Play Data Safety. Do not submit privacy forms until the owner confirms each answer.

## Confirmed Console State

| Item | Status | Notes |
| --- | --- | --- |
| Apple App Privacy form | BLOCKED | App Store Connect shows `Get Started`; answers are not submitted |
| Apple Privacy Policy URL | BLOCKED | Apple App Privacy page shows blank/dash value |
| Apple User Privacy Choices URL | NEEDS OWNER CONFIRMATION | Optional field shows blank/dash value |
| Google Data Safety | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled in Owner Console Action Pass 001 |
| Google Privacy Policy URL | READY | `https://macksims-public-site.netlify.app/privacy/` populated in Play Console |
| Account deletion workflow | NEEDS OWNER CONFIRMATION | Public URL exists; actual deletion path still unconfirmed |

## Apple App Privacy Owner Answers

| Data / Practice | Owner Question | Status | Owner Answer |
| --- | --- | --- | --- |
| Account creation/login | Does FishCrew allow account creation or login in the submitted build? | NEEDS OWNER CONFIRMATION |  |
| Name | Does FishCrew collect a user's real name or display name? | NEEDS OWNER CONFIRMATION |  |
| Email | Does FishCrew collect email address? | NEEDS OWNER CONFIRMATION |  |
| Username/profile info | Does FishCrew collect username, profile photo, bio, fishing preferences, or other profile fields? | NEEDS OWNER CONFIRMATION |  |
| Photos/media uploads | Can users upload photos, profile images, trip images, catches, or other media? | NEEDS OWNER CONFIRMATION |  |
| Location or approximate area | Does FishCrew collect precise location, approximate location, favorite waters, nearby areas, or location-derived data? | NEEDS OWNER CONFIRMATION |  |
| Messages/chat | Does FishCrew include direct messages, comments, chat, or contact flows between users? | NEEDS OWNER CONFIRMATION |  |
| User-generated content | Can users create posts, trip activity, catches, comments, profiles, reports, or other UGC? | NEEDS OWNER CONFIRMATION |  |
| Payment or purchase data | Does FishCrew collect payment, purchase, subscription, payout, or commerce data? | NEEDS OWNER CONFIRMATION |  |
| Diagnostics/crash data | Does FishCrew collect crash logs, performance data, diagnostics, or device/app health data? | NEEDS OWNER CONFIRMATION |  |
| Analytics | Does FishCrew collect analytics events, usage data, screen views, or engagement metrics? | NEEDS OWNER CONFIRMATION |  |
| Advertising/tracking | Does FishCrew use ads, tracking, ad identifiers, cross-app tracking, or third-party tracking SDKs? | NEEDS OWNER CONFIRMATION |  |
| Third-party sharing | Is any user data shared with analytics, maps/weather, auth, storage, notification, moderation, or other third-party providers? | NEEDS OWNER CONFIRMATION |  |
| Data deletion path | How can a FishCrew user request or complete account/data deletion? | NEEDS OWNER CONFIRMATION |  |
| Linked to user identity | For each collected data type, is the data linked to the user's identity/account/profile? | NEEDS OWNER CONFIRMATION |  |

## Google Data Safety Owner Answers

| Data / Practice | Owner Question | Status | Owner Answer |
| --- | --- | --- | --- |
| Account creation/login | Does FishCrew collect or require login/account data? | NEEDS OWNER CONFIRMATION |  |
| Name | Is name/display name collected? | NEEDS OWNER CONFIRMATION |  |
| Email | Is email address collected? | NEEDS OWNER CONFIRMATION |  |
| Username/profile info | Are profile fields, username, avatar, preferences, or other personal fields collected? | NEEDS OWNER CONFIRMATION |  |
| Photos/media uploads | Are uploaded photos/media collected, stored, processed, or shared? | NEEDS OWNER CONFIRMATION |  |
| Location or approximate area | Is precise or approximate location collected, inferred, stored, or shared? | NEEDS OWNER CONFIRMATION |  |
| Messages/chat | Are messages, comments, contact requests, or chat content collected? | NEEDS OWNER CONFIRMATION |  |
| User-generated content | Is user-created content collected, stored, moderated, or made public? | NEEDS OWNER CONFIRMATION |  |
| Payment or purchase data | Is payment, purchase, subscription, payout, or commerce data collected? | NEEDS OWNER CONFIRMATION |  |
| Diagnostics/crash data | Are crash logs, diagnostics, app performance, or device diagnostics collected? | NEEDS OWNER CONFIRMATION |  |
| Analytics | Are usage analytics, event tracking, or behavioral metrics collected? | NEEDS OWNER CONFIRMATION |  |
| Advertising/tracking | Are ads, advertising IDs, tracking, remarketing, or cross-app tracking used? | NEEDS OWNER CONFIRMATION |  |
| Third-party sharing | Is data shared with any service provider or third party? | NEEDS OWNER CONFIRMATION |  |
| Data deletion path | Can users request data deletion, and is deletion manual support-based, in-app request-based, or backend self-service? | NEEDS OWNER CONFIRMATION |  |
| Linked to user identity | Is collected data linked to account, profile, email, device, or user identity? | NEEDS OWNER CONFIRMATION |  |

## Reviewer/Demo Access Safety

| Question | Status | Notes |
| --- | --- | --- |
| Does reviewer need login? | NEEDS OWNER CONFIRMATION | FishCrew ASC sign-in required is unchecked, but actual build behavior must be confirmed |
| Is guest browsing available? | NEEDS OWNER CONFIRMATION | Confirm whether reviewer can inspect core flows without login |
| Is a demo account required? | NEEDS OWNER CONFIRMATION | If yes, store password only outside repo |
| Password placeholder | READY | Use `DO_NOT_COMMIT_PASSWORD` only |

