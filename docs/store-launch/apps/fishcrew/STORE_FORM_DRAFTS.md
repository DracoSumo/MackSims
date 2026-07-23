# FishCrew - Store Form Drafts

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
| Account creation/login | No answer confirmed | NEEDS OWNER CONFIRMATION | Determine whether submitted build allows account creation/login |
| Name | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes real name or display name |
| Email | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes account, support, or auth email collection |
| Username/profile info | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes username, profile photo, bio, preferences, profile fields |
| Photos/media uploads | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes profile images, trip images, catch images, or other media |
| Location or approximate area | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes precise location, approximate location, favorite waters, or derived area |
| Messages/chat | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes messages, comments, chat, or contact flows |
| User-generated content | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes posts, catches, reports, comments, profile content |
| Payment or purchase data | No answer confirmed | NEEDS OWNER CONFIRMATION | Do not answer no/yes until owner confirms commerce scope |
| Diagnostics/crash data | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes crash logs, diagnostics, performance, device/app health |
| Analytics | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes usage events, screen views, engagement metrics |
| Advertising/tracking | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes ads, IDFA/ad ID, cross-app tracking, remarketing |
| Third-party sharing | No answer confirmed | NEEDS OWNER CONFIRMATION | Includes auth, storage, maps/weather, analytics, notifications, moderation |
| Data deletion path | Public account deletion URL exists; actual workflow unconfirmed | NEEDS OWNER CONFIRMATION | Confirm manual support-based, in-app request-based, or backend self-service |
| Linked to user identity | No answer confirmed | NEEDS OWNER CONFIRMATION | Must be answered for each collected data type |

## Google Data Safety Draft Answers

| Store Form Area | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Privacy policy URL | `https://macksims-public-site.netlify.app/privacy/` is populated in Play Console | READY | Still confirm policy content matches submitted app behavior |
| Data collection | No answer confirmed | NEEDS OWNER CONFIRMATION | Do not mark collected/not collected until owner confirms categories |
| Data sharing | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm service providers and third-party sharing |
| Data encryption in transit | No answer confirmed | NEEDS OWNER CONFIRMATION | Owner/backend confirmation required |
| Data deletion request path | Public account deletion URL exists; actual workflow unconfirmed | NEEDS OWNER CONFIRMATION | Confirm manual support-based, in-app request-based, or backend self-service |
| Account creation/login | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm submitted build behavior |
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
| Account/login data | NEEDS OWNER CONFIRMATION | Confirm whether submitted build supports account creation, login, or account state |
| Name | NEEDS OWNER CONFIRMATION | Confirm real name, display name, or profile name collection |
| Email | NEEDS OWNER CONFIRMATION | Confirm account, auth, reviewer, or support email collection |
| Username/profile info | NEEDS OWNER CONFIRMATION | Confirm username, profile, bio, preferences, or home-water fields |
| Photos/media | NEEDS OWNER CONFIRMATION | Confirm profile, trip, catch, feed, or other media upload behavior |
| Location or approximate area | NEEDS OWNER CONFIRMATION | Confirm precise/approximate location, favorite waters, or derived area behavior |
| Messages/chat | NEEDS OWNER CONFIRMATION | Confirm chat, comments, contact, or messaging features |
| User-generated content | NEEDS OWNER CONFIRMATION | Confirm posts, reports, catches, comments, or profile content |
| Payments/purchases | NEEDS OWNER CONFIRMATION | Confirm whether any commerce, purchases, or subscriptions exist in submitted build |
| Diagnostics/crash logs | NEEDS OWNER CONFIRMATION | Confirm crash/performance/device diagnostics behavior |
| Analytics | NEEDS OWNER CONFIRMATION | Confirm event, screen-view, engagement, or product analytics behavior |
| Advertising/tracking | NEEDS OWNER CONFIRMATION | Confirm ads, ad identifiers, cross-app tracking, or remarketing behavior |
| Third-party sharing | NEEDS OWNER CONFIRMATION | Confirm auth, storage, maps/weather, analytics, notifications, or moderation vendors |
| Data linked to user identity | NEEDS OWNER CONFIRMATION | Must be decided for each collected data type |
| Data deletion path | NEEDS OWNER CONFIRMATION | Public deletion URL exists; actual deletion method is unconfirmed |

## Reviewer/Demo Access Draft

| Field | Draft Value | Status | Notes |
| --- | --- | --- | --- |
| Reviewer login required? | ASC sign-in required is unchecked | NEEDS OWNER CONFIRMATION | Confirm whether the submitted build can be reviewed as guest |
| Guest browsing available? | No answer confirmed | NEEDS OWNER CONFIRMATION | Owner/build behavior confirmation required |
| Demo account required? | No answer confirmed | NEEDS OWNER CONFIRMATION | If required, password must stay outside repo |
| Username | No value documented | NEEDS OWNER CONFIRMATION | Do not add credentials unless owner instructs and password remains outside repo |
| Password | `DO_NOT_COMMIT_PASSWORD` | READY | Placeholder only |
| Reviewer notes | Existing Apple notes populated | IN PROGRESS | Confirm notes match final submitted build and privacy answers |

## Reviewer/Demo Access Decision - Pass 004

| Field | Decision | Notes |
| --- | --- | --- |
| Guest browsing available | UNKNOWN | ASC sign-in required is unchecked, but actual submitted build behavior is not owner-confirmed |
| Login required for reviewer | UNKNOWN | Do not assume guest review is sufficient until owner confirms app behavior |
| Demo account required | UNKNOWN | If required, do not record a real password in docs |
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
| Data deleted vs retained | No answer confirmed | NEEDS OWNER CONFIRMATION | Confirm account, profile, media, UGC, analytics, logs, backups |

## Account Deletion Owner Decision - Pass 004

| Field | Decision | Notes |
| --- | --- | --- |
| Current public deletion URL | CONFIRMED AVAILABLE | `https://macksims-public-site.netlify.app/account-deletion/` |
| Actual deletion method | NEEDS OWNER CONFIRMATION | Do not claim store compliance until owner confirms the operational workflow |
| Option: manual support-based deletion | NEEDS OWNER CONFIRMATION | Public page describes an email/support request flow |
| Option: in-app request-based deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Option: backend self-service deletion | NEEDS OWNER CONFIRMATION | Not confirmed |
| Store compliance status | NOT READY | Blocked until actual deletion method and execution path are confirmed |

## Asset Checklist

| Asset / Field | Status | Notes |
| --- | --- | --- |
| App icon | BLOCKED | Missing in Google Play; Apple icon status not separately confirmed in this pass |
| Apple iPhone screenshots | BLOCKED | 0 of 10 uploaded |
| Google Play screenshots | BLOCKED | Missing phone/tablet screenshots |
| Google Play feature graphic | BLOCKED | Missing |
| Google Play category | BLOCKED | Store settings show `Select a category` |
| Google Play contact details | BLOCKED | Email, phone, and website show no visible values |
