# ThrottleLink - Reviewer Notes

**Product:** ThrottleLink (web UI brand: **MotoCrew**)  
**Web:** https://motocrewz.netlify.app  
**Package:** `com.chrissims.throttlelink`  
**Source of truth for credentials:** [`../../DEMO_REVIEW_LOGINS.md`](../../DEMO_REVIEW_LOGINS.md)

## Access (login not required)

**Primary path — no credentials:**

1. Open the app (or https://motocrewz.netlify.app).
2. Accept / acknowledge the **safety notice**.
3. Continue as **guest** — rides and map unlock.

**Optional signed-in review account:**

```
Sign-in not required. Open app → accept safety notice → use guest rides/map.
Optional account: see DEMO_REVIEW_LOGINS.md (local only)
Support: feedback@macksims.com
Privacy: https://macksims-public-site.netlify.app/privacy/
Deletion: https://macksims-public-site.netlify.app/account-deletion/
```

| Field | Answer |
| --- | --- |
| Login required | **No** |
| Demo / guest | Yes — after safety notice |
| Optional account | see DEMO_REVIEW_LOGINS.md (local only) |
| Support contact | feedback@macksims.com |

## Reviewer Summary

ThrottleLink is a MackSims motorcycle group ride app (also branded MotoCrew on the web). Reviewers should evaluate ride planning, map/route surfaces, crew meetup coordination, the safety notice gate, and legal pages. Native beta builds load the live web experience in a shell.

## Features To Test

1. Cold open → **safety notice** → guest unlock
2. **Home** — pack / ride overview
3. **Rides** — plan or browse rides / meetups
4. **Map** — route / location surfaces (approx location if permission granted)
5. **Safety** — disclaimers present and accurate
6. Optional **Settings** sign-in with review account
7. Privacy / support / account deletion links

## Disclaimers Reviewers Should See

- Not an emergency service
- No guaranteed rider safety
- Does not replace traffic laws or official navigation tools
- **No live background tracking** claimed for this beta — approximate location used in foreground only when enabled

## Data & Privacy (confirmed baseline)

- Optional accounts: name, email, user ID when signed in
- Approximate location for ride/map context (foreground)
- UGC: routes, events, ride plans
- Messages / interactions (may be limited in beta)
- Crash logs, diagnostics, device ID for reliability
- Not sold; no ads; deletion on request

Details: [PRIVACY_DATA.md](./PRIVACY_DATA.md)

## Known Limitations (this beta)

- Capacitor / native shell → live Netlify web app
- Messaging and some coordination features may be limited
- No background location / continuous live tracking in beta
- Do not treat as emergency or certified safety equipment

## Smoke-Test Checklist

- [ ] App opens on a clean install
- [ ] Safety notice appears before guest rides/map
- [ ] Guest path works without sign-in
- [ ] Optional review login works when tested
- [ ] Location permission behavior matches “approx / foreground” only
- [ ] Safety / liability copy present; no emergency or guaranteed-safety claims
- [ ] Support / privacy / account deletion URLs work
- [ ] No unverified intercom, turn-by-turn, or background tracking claims
