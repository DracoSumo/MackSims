# ShutterBid - Reviewer Notes

Do not include real passwords in this file.

## Demo Placeholders

DEMO_EMAIL=
DEMO_PASSWORD=DO_NOT_COMMIT_PASSWORD

## Reviewer Summary Draft

ShutterBid is a MackSims photographer/client marketplace app for reviewing local photo jobs, bids, photographer profiles, and approval/trust flows that are present in the submitted build.

## Features To Test

- Install and first launch.
- Guest or browse path if available.
- Client flow.
- Photographer flow.
- Job or bid flow if active.
- Admin approval, trust, or moderation flow if active.
- Business or venue profile path if active.
- Support, privacy, and account deletion links.

## Review Access

| Field | Status | Notes |
| --- | --- | --- |
| Login required | NEEDS OWNER CONFIRMATION |  |
| Demo account provided | NEEDS OWNER CONFIRMATION | Use placeholders only |
| Reviewer roles complete | IN PROGRESS | Confirm client/photographer/admin needs |
| Support contact | NEEDS OWNER CONFIRMATION | Public support URL is reachable; direct review contact still needs confirmation |
| Support URL reachable | READY | `https://macksims-public-site.netlify.app/support/` returned HTTP 200 on 2026-07-01 |
| Privacy URL reachable | READY | `https://macksims-public-site.netlify.app/privacy/` returned HTTP 200 on 2026-07-01 |
| Account deletion URL reachable | READY | `https://macksims-public-site.netlify.app/account-deletion/` returned HTTP 200 on 2026-07-01 |

## Reviewer Walkthrough Draft

1. Launch ShutterBid from the submitted build.
2. Test guest/browse flow if available.
3. Sign in only if reviewer access requires it.
4. Test the client path with approved test data.
5. Test the photographer profile/portfolio path if active.
6. Test jobs, bids, approval, business, venue, or admin flows only if active in the build.
7. Verify support, privacy, and account deletion links.
8. Treat payments, escrow, contracts, verified booking, disputes, and live moderation as unavailable unless the submitted build and owner notes confirm they are active.

## Beta/Limited Behavior

- NEEDS OWNER CONFIRMATION: whether jobs, bids, profiles, approvals, reviews, or content are demo, mock, preview, or production.
- NEEDS OWNER CONFIRMATION: whether photo uploads, messaging/contact, payments, marketplace transactions, and admin approval are active.
- NEEDS OWNER CONFIRMATION: moderation/reporting state.

## Safety/Moderation Notes

TBD after owner confirms user content, marketplace, contact, and admin approval behavior.
