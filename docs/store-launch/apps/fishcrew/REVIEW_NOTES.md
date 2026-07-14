# FishCrew - Reviewer Notes

Do not include real passwords in this file.

## Demo Placeholders

DEMO_EMAIL=
DEMO_PASSWORD=DO_NOT_COMMIT_PASSWORD

## Reviewer Summary Draft

FishCrew is a MackSims fishing community app for anglers, captains, charters, and crews. Reviewers should test the current build's community, profile, local water awareness, and fishing utility flows that are actually present in the submitted app.

## Features To Test

- Install and first launch.
- Browse path before sign-in if available.
- Sign-in and sign-out if login is required.
- Profile creation or completion.
- Feed/community surfaces if active.
- Weather, water, map, tools, or local trip coordination surfaces if active.
- Support, privacy, and account deletion links.

## Review Access

| Field | Status | Notes |
| --- | --- | --- |
| Login required | NEEDS OWNER CONFIRMATION |  |
| Demo account provided | NEEDS OWNER CONFIRMATION | Use placeholders only |
| Reviewer walkthrough complete | IN PROGRESS | Draft path below; update after build is confirmed |
| Support contact | NEEDS OWNER CONFIRMATION | Public support URL is reachable; direct review contact still needs confirmation |
| Support URL reachable | READY | `https://macksims-public-site.netlify.app/support/` returned HTTP 200 on 2026-07-01 |
| Privacy URL reachable | READY | `https://macksims-public-site.netlify.app/privacy/` returned HTTP 200 on 2026-07-01 |
| Account deletion URL reachable | READY | `https://macksims-public-site.netlify.app/account-deletion/` returned HTTP 200 on 2026-07-01 |

## Reviewer Walkthrough Draft

1. Launch FishCrew from the submitted build.
2. Browse first if guest/browse mode is enabled.
3. Sign in only if reviewer access requires it.
4. Complete or inspect profile state if available.
5. Review Home, Explore, Crew, Feed, Tools, Tools Guide, and Profile surfaces if included in the current build.
6. Verify support, privacy, and account deletion links.
7. Treat location, photos/camera, notifications, messaging, weather/maps, and social/feed behavior as limited unless the submitted build and owner notes confirm they are active.

## Beta/Limited Behavior

- NEEDS OWNER CONFIRMATION: whether content is demo, mock, preview, or production.
- NEEDS OWNER CONFIRMATION: whether location, photos/camera, messaging, notifications, maps, or weather integrations are active.
- NEEDS OWNER CONFIRMATION: moderation/reporting state.

## Safety/Moderation Notes

TBD after owner confirms UGC, feed, messaging, and moderation behavior.
