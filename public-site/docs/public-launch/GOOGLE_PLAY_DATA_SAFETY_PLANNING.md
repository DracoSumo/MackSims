# Google Play Data Safety Planning

This is a planning document, not final legal guidance. Final answers must match the actual production build.

## Data categories to evaluate
- Account information: email, username, first/last name, app role.
- User content: photos, posts, profile images, listings, jobs, bids, support messages.
- App activity: screens used, feature actions, beta feedback, diagnostics.
- Device/app info: OS, browser/app version, crash logs, performance diagnostics.
- Location: only mark collected if the production build collects or transmits it.
- Photos/camera: only mark collected if uploads or camera capture are live.
- Payments: only mark collected if payment integrations are live.
- Contacts: only mark collected if contacts integration is live.

## FishCrew notes
- Current claim should stay conservative.
- Do not claim live marine weather, GPS tracking, push, guide verification, or safety features unless wired and tested.

## ShutterBid notes
- Marketplace profile/job data may be user-provided content.
- Payment and identity verification should be marked only when actually live.

## Required before submission
- Confirm production build features.
- Confirm third-party SDKs.
- Confirm retention/deletion behavior.
- Confirm encryption in transit.
- Confirm whether data is optional or required.
- Confirm whether data is shared with service providers.
