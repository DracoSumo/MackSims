# ShutterBid - Store Form Drafts

Date: July 2, 2026

Scope: Owner Answers + Screenshot Execution Pass 003 plus Asset Capture + Owner Decision Pass 004. Documentation draft only. Do not submit Apple App Privacy, Google Data Safety, app review, or Play forms until owner confirms the unresolved answers.

## Source Docs

| Source | Status |
| --- | --- |
| `PRIVACY_OWNER_QUESTIONNAIRE.md` | Created; owner answers still needed |
| `SCREENSHOT_PLAN.md` | Created; screenshots not captured |
| `STATUS.md` | Console state documented |
| `NEXT_ACTIONS.md` | Next actions documented |

## Apple App Privacy Draft Answers

| Store Form Area | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Privacy Policy URL | Public URL exists: `https://macksims-public-site.netlify.app/privacy/`; Apple field is blank | NEEDS OWNER CONFIRMATION | Owner must approve adding this URL to Apple App Privacy |
| User Privacy Choices URL | No value confirmed | NEEDS OWNER CONFIRMATION | Optional Apple field; leave blank unless owner confirms a URL |
| Account creation/login | Login is required for Apple reviewer in ASC; data collection details unconfirmed | NEEDS OWNER CONFIRMATION | Do not infer account/data collection answers from reviewer login alone |
| Name | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes real name, business name, venue name, or display name |
| Email | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes account, support, or auth email collection |
| Username/profile info | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes client/photographer profiles, portfolio fields, business/venue fields |
| Photos/media uploads | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes profile images, portfolio images, job images, or other media |
| Location or approximate area | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes event location, service area, city/area, venue location |
| Messages/chat | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes bid messaging, direct messages, contact requests, comments, chat |
| User-generated content | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes profiles, posts, bids, portfolios, reviews, comments |
| Payment or purchase data | No answer confirmed | NEEDS OWNER CONFIRMATION | Do not claim payment/booking/escrow behavior until owner confirms |
| Diagnostics/crash data | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes crash logs, diagnostics, performance, device/app health |
| Analytics | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes usage events, screen views, engagement metrics |
| Advertising/tracking | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes ads, IDFA/ad ID, cross-app tracking, remarketing |
| Third-party sharing | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes auth, storage, analytics, notifications, moderation, payments |
| Data deletion path | Public account deletion URL exists; actual workflow unconfirmed | NEEDS OWNER CONFIRMATION | Confirm manual support-based, in-app request-based, or backend self-service |
| Linked to user identity | No answer confirmed | NEEDS OWNER CONFIRMATION | Must be answered for each collected data type |

## Google Data Safety Draft Answers

| Store Form Area | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Privacy policy URL | Public URL exists: `https://macksims-public-site.netlify.app/privacy/`; Play field is blank | BLOCKED | Owner should approve adding the URL before Play submission |
| Data collection | No answer confirmed | NEEDS OWNER CONFIRMATION | Do not mark collected/not collected until owner confirms categories |
| Data sharing | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm service providers and third-party sharing |
| Data encryption in transit | No answer confirmed | NEEDS OWNER CONFIRMATION | Owner/backend confirmation required |
| Data deletion request path | Public account deletion URL exists; actual workflow unconfirmed | NEEDS OWNER CONFIRMATION | Confirm manual support-based, in-app request-based, or backend self-service |
| Account creation/login | Reviewer login is required in ASC; Play app-access details unknown | NEEDS OWNER CONFIRMATION | Confirm submitted Android build behavior |
| Name | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Email | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Username/profile info | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Photos/media uploads | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Location or approximate area | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Messages/chat | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| User-generated content | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Payment or purchase data | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Diagnostics/crash data | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Analytics | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Advertising/tracking | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Linked to user identity | No answer confirmed | NEEDS OWNER CONFIRMATION |  |

## Owner Privacy Decision Sheet - Pass 004

Use only `YES`, `NO`, or `NEEDS OWNER CONFIRMATION` when converting this table into Apple App Privacy or Google Play Data Safety forms. No `YES`/`NO` answers are owner-confirmed yet.

| Data Category | Owner Decision | Notes |
| --- | --- | --- |
| Account/login data | NEEDS OWNER CONFIRMATION | Apple reviewer login is required, but submitted-build account/data behavior still needs owner confirmation |
| Name | NEEDS OWNER CONFIRMATION | Confirm real name, display name, business name, venue name, or profile name collection |
| Email | NEEDS OWNER CONFIRMATION | Confirm account, auth, reviewer, client, photographer, or support email collection |
| Username/profile info | NEEDS OWNER CONFIRMATION | Confirm client, photographer, business, venue, portfolio, or profile fields |
| Photos/media | NEEDS OWNER CONFIRMATION | Confirm profile, portfolio, job, event, or other media upload behavior |
| Location or approximate area | NEEDS OWNER CONFIRMATION | Confirm event location, service area, city/area, venue location, or derived area behavior |
| Messages/chat | NEEDS OWNER CONFIRMATION | Confirm bids, contact requests, direct messaging, comments, or chat |
| User-generated content | NEEDS OWNER CONFIRMATION | Confirm profiles, jobs, bids, portfolio items, reviews, comments, or posts |
| Payments/purchases | NEEDS OWNER CONFIRMATION | Do not claim payments, escrow, bookings, contracts, or payouts unless owner confirms submitted-build behavior |
| Diagnostics/crash logs | NEEDS OWNER CONFIRMATION | Confirm crash/performance/device diagnostics behavior |
| Analytics | NEEDS OWNER CONFIRMATION | Confirm event, screen-view, engagement, or product analytics behavior |
| Advertising/tracking | NEEDS OWNER CONFIRMATION | Confirm ads, ad identifiers, cross-app tracking, or remarketing behavior |
| Third-party sharing | NEEDS OWNER CONFIRMATION | Confirm auth, storage, analytics, notifications, moderation, payment, or marketplace vendors |
| Data linked to user identity | NEEDS OWNER CONFIRMATION | Must be decided for each collected data type |
| Data deletion path | NEEDS OWNER CONFIRMATION | Public deletion URL exists; actual deletion method is unconfirmed |

## Reviewer/Demo Access Draft

| Field | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Reviewer login required? | YES in Apple ASC | READY | Sign-in required is checked |
| Guest browsing available? | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm whether any guest flow exists |
| Demo account required? | Likely yes for Apple because sign-in required is checked | NEEDS OWNER CONFIRMATION | Password must stay outside repo |
| Username | Present in ASC, not repeated here | NEEDS OWNER CONFIRMATION | Do not duplicate reviewer credentials into docs |
| Password | `DO_NOT_COMMIT_PASSWORD` | READY | Placeholder only |
| Reviewer notes | Existing Apple notes populated | IN PROGRESS | Existing notes may contain credentials in ASC; do not commit them |

## Reviewer/Demo Access Decision - Pass 004

| Field | Decision | Notes |
| --- | --- | --- |
| Guest browsing available | UNKNOWN | Confirm whether any guest flow exists in the submitted build |
| Login required for reviewer | YES | Apple sign-in required is checked; Play app-access route was not directly confirmed |
| Demo account required | YES | Required for Apple ASC reviewer access; Play app-access route was not directly confirmed |
| Demo email | NEEDS OWNER CONFIRMATION | Add only if owner explicitly approves documenting a non-secret demo email |
| Demo password | `DO_NOT_COMMIT_PASSWORD` | Placeholder only |
| Notes for reviewer | Draft only; do not submit | Final notes must match the selected build, privacy answers, and account deletion workflow |

## Account Deletion Workflow Draft

| Field | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Public account deletion URL | `https://macksims-public-site.netlify.app/account-deletion/` | READY | Previously confirmed reachable |
| Current documented public workflow | Manual email/support request | NEEDS OWNER CONFIRMATION | Do not claim compliance until owner confirms actual deletion handling |
| In-app request flow | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Backend self-service deletion | No answer confirmed | NEEDS OWNER CONFIRMATION |  |
| Backend/manual deletion executor | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm who performs deletion and expected timeline |
| Data deleted vs retained | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm account, profile, media, jobs, bids, portfolios, analytics, logs, backups |

## Account Deletion Owner Decision - Pass 004

| Field | Decision | Notes |
| --- | --- | --- |
| Current public deletion URL | CONFIRMED AVAILABLE | `https://macksims-public-site.netlify.app/account-deletion/` |
| Actual deletion method | NEEDS OWNER CONFIRMATION | Do not claim store compliance until owner confirms the operational workflow |
| Option: manual support-based deletion | NEEDS OWNER CONFIRMATION | Public page describes an email/support request flow |
| Option: in-app request-based deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Option: backend self-service deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Store compliance status | NOT READY | Blocked until actual deletion method and execution path are confirmed |

## Google Play Listing Draft - Pass 004

Draft only. Do not enter this in Google Play until owner approves final wording and confirms that the submitted Android build supports the described flows.

| Field | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Short description | Photo marketplace beta for clients, photographers, and creative jobs. | DRAFT - OWNER REVIEW REQUIRED | Safe placeholder for blank Play field |
| Full description | ShutterBid is a MackSims beta marketplace foundation for photography jobs, client requests, photographer profiles, portfolio review, and early bidding workflow testing. Use this draft only after owner review. Do not imply live payments, escrow, guaranteed bookings, verified professionals, background checks, dispute handling, or production marketplace outcomes unless those features are owner-confirmed in the submitted build. | DRAFT - OWNER REVIEW REQUIRED | Keep beta/preview limitations unless owner confirms production scope |
| Privacy URL candidate | `https://macksims-public-site.netlify.app/privacy/` | DRAFT - OWNER REVIEW REQUIRED | Public URL exists; Play field remains blank until owner approves entry |

## Asset Checklist

| Asset / Field | Status | Notes |
| --- | --- | --- |
| App icon | BLOCKED | Missing in Google Play; Apple icon status not separately confirmed in this pass |
| Apple iPhone screenshots | BLOCKED | 0 of 10 uploaded |
| Google Play screenshots | BLOCKED | Missing phone/tablet screenshots |
| Google Play feature graphic | BLOCKED | Missing |
| Google Play privacy URL | BLOCKED | Field is blank |
| Google Play short description | BLOCKED | Field is blank |
| Google Play full description | BLOCKED | Field is blank |
| Google Play category | BLOCKED | Store settings show `Select a category` |
| Google Play contact details | BLOCKED | Email, phone, and website show no visible values |
