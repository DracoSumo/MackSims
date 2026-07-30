# ShutterBid - Privacy Owner Questionnaire

Date: July 2, 2026

Purpose: collect owner-confirmed answers for Apple App Privacy and Google Play Data Safety. Do not submit privacy forms until the owner confirms each answer.

## Confirmed Console State

| Item | Status | Notes |
| --- | --- | --- |
| Apple App Privacy form | BLOCKED | App Store Connect shows `Get Started`; answers are not submitted |
| Apple Privacy Policy URL | BLOCKED | Apple App Privacy page shows blank/dash value |
| Apple User Privacy Choices URL | NEEDS OWNER CONFIRMATION | Optional field shows blank/dash value |
| Google Data Safety | NEEDS OWNER CONFIRMATION | Play App content/Data Safety route stalled in Owner Console Action Pass 001 |
| Google Privacy Policy URL | BLOCKED | Privacy policy URL field is blank in Play Console |
| Account deletion workflow | NEEDS OWNER CONFIRMATION | Public URL exists; actual deletion path still unconfirmed |

## Apple App Privacy Owner Answers

| Data / Practice | Owner Question | Status | Owner Answer |
| --- | --- | --- | --- |
| Account creation/login | Does ShutterBid allow account creation or login in the submitted build? | NEEDS OWNER CONFIRMATION |  |
| Name | Does ShutterBid collect real name, business name, venue name, or display name? | NEEDS OWNER CONFIRMATION |  |
| Email | Does ShutterBid collect email address? | NEEDS OWNER CONFIRMATION |  |
| Username/profile info | Does ShutterBid collect usernames, client/photographer profiles, portfolio fields, business info, or venue info? | NEEDS OWNER CONFIRMATION |  |
| Photos/media uploads | Can photographers or users upload profile images, portfolio images, job images, or other media? | NEEDS OWNER CONFIRMATION |  |
| Location or approximate area | Does ShutterBid collect precise location, city/area, event location, service area, or venue location? | NEEDS OWNER CONFIRMATION |  |
| Messages/chat | Does ShutterBid include direct messages, bid messaging, client contact, comments, or chat? | NEEDS OWNER CONFIRMATION |  |
| User-generated content | Can users create profiles, job posts, bids, portfolios, reviews, comments, or other UGC? | NEEDS OWNER CONFIRMATION |  |
| Payment or purchase data | Does ShutterBid collect payment, purchase, subscription, payout, escrow, booking, or commerce data? | NEEDS OWNER CONFIRMATION |  |
| Diagnostics/crash data | Does ShutterBid collect crash logs, performance data, diagnostics, or device/app health data? | NEEDS OWNER CONFIRMATION |  |
| Analytics | Does ShutterBid collect analytics events, usage data, screen views, or engagement metrics? | NEEDS OWNER CONFIRMATION |  |
| Advertising/tracking | Does ShutterBid use ads, tracking, ad identifiers, cross-app tracking, or third-party tracking SDKs? | NEEDS OWNER CONFIRMATION |  |
| Third-party sharing | Is any user data shared with analytics, auth, storage, notification, moderation, payment, or other third-party providers? | NEEDS OWNER CONFIRMATION |  |
| Data deletion path | How can a ShutterBid user request or complete account/data deletion? | NEEDS OWNER CONFIRMATION |  |
| Linked to user identity | For each collected data type, is the data linked to the user's identity/account/profile? | NEEDS OWNER CONFIRMATION |  |

## Google Data Safety Owner Answers

| Data / Practice | Owner Question | Status | Owner Answer |
| --- | --- | --- | --- |
| Account creation/login | Does ShutterBid collect or require login/account data? | NEEDS OWNER CONFIRMATION |  |
| Name | Is name, business name, venue name, or display name collected? | NEEDS OWNER CONFIRMATION |  |
| Email | Is email address collected? | NEEDS OWNER CONFIRMATION |  |
| Username/profile info | Are profile fields, portfolio fields, role data, or business/venue fields collected? | NEEDS OWNER CONFIRMATION |  |
| Photos/media uploads | Are uploaded photos/media collected, stored, processed, or shared? | NEEDS OWNER CONFIRMATION |  |
| Location or approximate area | Is precise or approximate location, event location, service area, or venue location collected? | NEEDS OWNER CONFIRMATION |  |
| Messages/chat | Are messages, bid notes, contact requests, comments, or chat content collected? | NEEDS OWNER CONFIRMATION |  |
| User-generated content | Is user-created content collected, stored, moderated, or made public? | NEEDS OWNER CONFIRMATION |  |
| Payment or purchase data | Is payment, purchase, subscription, payout, escrow, booking, or commerce data collected? | NEEDS OWNER CONFIRMATION |  |
| Diagnostics/crash data | Are crash logs, diagnostics, app performance, or device diagnostics collected? | NEEDS OWNER CONFIRMATION |  |
| Analytics | Are usage analytics, event tracking, or behavioral metrics collected? | NEEDS OWNER CONFIRMATION |  |
| Advertising/tracking | Are ads, advertising IDs, tracking, remarketing, or cross-app tracking used? | NEEDS OWNER CONFIRMATION |  |
| Third-party sharing | Is data shared with any service provider or third party? | NEEDS OWNER CONFIRMATION |  |
| Data deletion path | Can users request data deletion, and is deletion manual support-based, in-app request-based, or backend self-service? | NEEDS OWNER CONFIRMATION |  |
| Linked to user identity | Is collected data linked to account, profile, email, device, or user identity? | NEEDS OWNER CONFIRMATION |  |

## Reviewer/Demo Access Safety

| Question | Status | Notes |
| --- | --- | --- |
| Does reviewer need login? | READY | ASC sign-in required is checked |
| Is guest browsing available? | NEEDS OWNER CONFIRMATION | Confirm whether reviewer can inspect any public or guest flows without login |
| Is a demo account required? | NEEDS OWNER CONFIRMATION | Sign-in fields are populated in ASC, but password must stay outside repo |
| Password placeholder | READY | Use `DO_NOT_COMMIT_PASSWORD` only |

