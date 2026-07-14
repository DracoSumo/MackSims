# MackSims — Beta Operator Action Board

All **user-owned manual actions** across the ecosystem, in priority order.
Repo-side prep for each item is already done; these steps need YOUR logins
(Supabase, Firebase, Netlify) or a real phone. Check items off as you go and
report back using the mini-template at the bottom of each app's checklist doc.

**Last updated:** 2026-07-03 (ShutterBid hardened rules deployed · FishCrew profiles policy applied · live verification pending)

---

## Ecosystem status (quick reference)

| App | Status | Live URL |
|---|---|---|
| FairShare | **Testing active** — deployed | https://fairshare-v03-20260624.netlify.app |
| MotoCrew/Throttle | **Testing active** — deployed | https://motocrewz.netlify.app |
| Sermon Studio | **Deployed** — Wave 1 ready | https://sermon-studio-beta.netlify.app |
| CoachCore | **Deployed** — Wave 1 authorized | https://coachcore7.netlify.app |
| ShutterBid | **Hardened rules deployed** — live verification pending | https://shutterbid.macksims.com |
| FishCrew | **Privacy policy applied** — smoke verification pending | https://fishcrew.macksims.com |

---

## 1. Sermon Studio — Wave 1 testing active

| | |
|---|---|
| **Status** | **Operator confirmed pass** — local/demo Wave 1 cleared |
| **Manual action** | Track Wave 1 feedback; triage per `BETA_INVITE_PACKAGE.md` |
| **Where** | `sermon-studio-next-patched\` · `EXTERNAL_TESTING_CHECKLIST.md` |
| **Done** | [x] Operator smoke · [x] Wave 1 cleared |
| **Report back** | Feedback received · outline/copy themes · Wave 2 gate |
| **Next Codex action** | Triage feedback; backend only when requested |

## 2. ShutterBid — hardened rules DEPLOYED, run live post-deploy verification

| | |
|---|---|
| **Status** | **Rules deployed — live verification pending.** `firebase deploy --only firestore:rules,storage` completed successfully on 2026-07-03 (Firestore + Storage rules). The deployed rules are emulator-tested **24/24** and match `firestore.rules.production-draft`. ShutterBid is **no longer "rules not deployed"** — the remaining gate is verifying live behavior before Wave 1 invites. |
| **Manual action** | Run the live verification checklist below against the production app, then send Wave 1 invites. |
| **Where** | `shutterbid-starter\` · `FIREBASE_PROVISIONING_CHECKLIST.md` (section 4b runbook) · `docs/TESTER_INVITE_MESSAGE.md` |
| **Done** | [x] Existing Firebase verified · [x] Smoke pass · [x] **Hardened rules deployed** · [ ] Live post-deploy verification · [ ] Wave 1 invites |
| **Report back** | Each checklist line pass/fail · any live rule error text · then testers invited |
| **Next Codex action** | After verification results: mark security closed (or triage failures), then triage Wave 1 feedback |

**ShutterBid live verification checklist** (use a normal test account, a photographer test account, and your real admin account):

Expected `PERMISSION_DENIED` (must FAIL):
- [ ] Normal user self-promotes own `users/{uid}` doc to `role: "admin"`
- [ ] Normal user sets `disabled`, unsafe `status`, approval, or moderation fields on own doc
- [ ] Normal user updates another user's job
- [ ] Photographer updates another photographer's bid

Expected success (must WORK):
- [ ] Normal profile edit (name/phone/photo)
- [ ] Client posts a job
- [ ] Photographer submits a bid on an open job
- [ ] Client accepts one bid / declines another
- [ ] Admin role change + suspension from a real admin account

## 3. CoachCore — send Wave 1 invites (Workstream 6)

| | |
|---|---|
| **Status** | **Wave 1 authorized** — operator confirmed UX re-review pass (accountability + connected surfaces) |
| **Manual action** | Send 2–3 invites per `BETA_INVITE_PACKAGE.md`. Use local dev build or https://coachcore7.netlify.app. **Do not redeploy** unless instructed. |
| **Where** | `apps\CoachCore\` · `TESTER_FEEDBACK_TEMPLATE.md` |
| **Done** | [x] Wave 0 · [x] UX hardening · [x] Re-review pass · [ ] Wave 1 invites sent |
| **Report back** | Testers invited · accountability feedback · connected-surfaces feedback |
| **Next Codex action** | Triage Wave 1 feedback |

## 4. FairShare — Wave 1 testing active

| | |
|---|---|
| **Status** | **Testing active** — invites sent |
| **Manual action** | Track feedback, triage using invite package tracking table |
| **Where** | `MackSims\apps\FairShare\BETA_INVITE_PACKAGE.md` |
| **Done** | [x] Wave 1 sent |
| **Report back** | Feedback received · confusion items · Wave 2 gate |

## 5. MotoCrew/Throttle — Wave 1 testing active

| | |
|---|---|
| **Status** | **Testing active** — invites sent |
| **Manual action** | Track feedback; treat safety-copy confusion as critical |
| **Where** | `MackSims\apps\MotoCrew\BETA_INVITE_PACKAGE.md` |
| **Done** | [x] Wave 1 sent |
| **Report back** | Feedback received · safety clarity · Wave 2 gate |

## 6. FishCrew — privacy policy APPLIED, run privacy + first-run smoke verification

| | |
|---|---|
| **Status** | **Username login deploy live** — verified 2026-07-03: live `app.js` has `login_identifier_for_username`, generic login error, and no email-only blocker. Supabase RPCs + privacy checks pass. Ready for in-app smoke verification. |
| **Manual action** | Deploy updated auth fix (`fishcrew-netlify-deploy.zip`), then run in-app smoke checklist. **While debugging auth, use ONE disposable test account only** — do not create random test users in Supabase. Suggested: `fishcrew.smoketest@yourdomain.com` / username `fishcrew_smoketest`. |
| **Where** | `FishCrew-Superfolder\current\fishcrew-static-v070\` |
| **Done** | [x] Policy SQL · [x] Post Trip CTA · [x] Username SQL/RPCs · [x] Username login deploy verified live · [ ] In-app smoke pass |
| **Report back** | Each checklist line pass/fail · any profiles/email payload observed |

**FishCrew live verification checklist:**

Logged out / private window:
- [ ] App loads
- [ ] Browse-first works (Home, Explore, feed, business views render)
- [ ] Profiles request returns an empty array `[]` (DevTools → Network → `profiles?select=...`) — empty is the expected success signal, not an error
- [ ] No profile emails appear anywhere in network payloads
- [ ] Host names fall back safely (e.g. "FishCrew host")
- [ ] Guest sees "Sign in to post a trip" CTA on empty trip states

Signed in:
- [ ] Profile display fields load (name, avatar, bio)
- [ ] Post Trip CTA appears on Home/Explore/Crew empty states
- [ ] CTA opens the existing "Post a fishing plan" modal
- [ ] Posting a trip succeeds
- [ ] Posting to the feed succeeds
- [ ] Profiles network request selects explicit columns and does **not** include `email`
- [ ] No broad profile email payload appears in any response

---

## Suggested order

ShutterBid live verification + FishCrew smoke verification (parallel) → CoachCore + ShutterBid Wave 1 invites → triage all active Wave 1 feedback (FairShare, MotoCrew, Sermon Studio, CoachCore, ShutterBid).

## Standing rules

- Never paste real keys/secrets into chat, docs, or commits — report *names and yes/no results* only.
- Deploys happen only on your explicit instruction.
- Nothing gets marked Ready until its manual steps above are confirmed done.
