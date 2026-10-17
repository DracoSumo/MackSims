# FishCrew - Reviewer Notes

**ASC app ID:** `6783567028` · Bundle/package: `com.chrissims.fishcrew`  
Source of truth: [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md).

## Demo Access

ASC **Sign-in required** is currently unchecked — prefer guest browse first.

```
Sign-in not required for basic review (ASC flag unchecked).
Optional account if gated: see DEMO_REVIEW_LOGINS.md (local only)
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Field | Value |
| --- | --- |
| Login required | **No** (prefer guest) |
| Optional demo email | `review.fishcrew@macksims.com` |
| Optional demo password | `[see DEMO_REVIEW_LOGINS.md]` |
| Support | feedback@macksims.com |

**Provision:** Create the optional account in FishCrew auth before relying on it. If a future build gates content behind login, check “Sign-in required” in ASC and paste the credentials above.

## Reviewer Summary

FishCrew is a MackSims fishing community app for anglers, captains, charters, and crews. Test community, profile, local water awareness, and fishing utility flows present in the submitted build.

## Features To Test

1. Cold launch / guest browse
2. Optional sign-in with review account
3. Home, Explore, Crew, Feed, Tools, Profile (as present)
4. Support / privacy / account-deletion links
5. Do **not** assume live payments, guaranteed weather, or moderation admin unless confirmed in build

## Console paste checklist (remaining)

| Item | Status |
| --- | --- |
| Apple Privacy Policy URL | Paste `https://macksims-public-site.netlify.app/privacy/` |
| Play Data Safety | Import `../../play-data-safety/data_safety_fishcrew.csv` |
| Play category | Select (Sports / Outdoors recommended) |
| Play contact email | `feedback@macksims.com` |
| Screenshots | Upload only after owner asset approval |
| App Review build | Select TestFlight build on version page |

## Known Limitations

- Privacy questionnaire still needs owner sign-off before final App Privacy submit
- Some READY screenshots exist locally; upload gated on owner approval board
- Public marketing may be incomplete — use Netlify/support URLs for review
