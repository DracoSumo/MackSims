# OAuth readiness

Audit date: 2026-07-29 (headed Playwright Meta automation pass)

This document contains no credentials. All login-enabled products use their existing
Supabase Auth projects; no Netlify Identity or second auth system should be added.

## Current architecture and status

| App | Production URL | Login status | Supabase project | Login methods in UI |
| --- | --- | --- | --- | --- |
| CoachCore | `https://coachcore.macksims.com` | Enabled | `bfqfbkldxbojrrxeidcc` | Google, GitHub, Facebook |
| CurbCue / FairShare | `https://fairshare.macksims.com` | Enabled in Settings | `dsbwqxhqktzsdleeobbi` | Google, GitHub, Facebook |
| MotoCrew / ThrottleLink | `https://motocrew.macksims.com` | Enabled in Profile | `npmiwnxnqgonnmwvblyi` | Google, GitHub, Facebook |
| Sermon Studio | `https://sermonstudio.macksims.com` | Enabled; local mode remains available | `zipxwqkmenapnckwyzrh` | Google, GitHub, Facebook, email/password |
| FishCrew | `https://fishcrew.macksims.com` | Enabled | `kkyuychvitrmtehvzqfd` | Email/password; Google/Facebook deliberately gated off |

The four TypeScript apps preserve a same-app return route through OAuth and reject
absolute, protocol-relative, backslash, and callback-loop return targets. They accept
both legacy JWT anon keys and current `sb_publishable_` keys. Facebook is wired into
`signInWithOAuth({ provider: "facebook" })` with the same callback/return handling as
Google/GitHub. Repository evidence records dedicated Meta apps and enabled Supabase
Facebook providers for all four, so Facebook is now enabled by default. The existing
`*_ENABLE_FACEBOOK_AUTH=false` value remains available only as an emergency kill
switch. FishCrew already persists sessions, handles password reset,
gates unavailable social buttons, and uses a fixed canonical redirect. Its Instagram
profile connection is unchanged.

## Exact provider callbacks and app redirects

Google, GitHub, and Facebook are brokered by Supabase. Their provider-console callback
is the Supabase URL below, not the app `/auth/callback` URL. Google authorized
JavaScript origins are **not applicable** to these brokered login calls.

### CoachCore

- Provider callback (Google, GitHub, and Facebook):
  `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`
- Supabase Site URL: `https://coachcore.macksims.com`
- Supabase exact Redirect URLs:
  - `https://coachcore.macksims.com/auth/callback/`
  - `https://coachcore7.netlify.app/auth/callback/`
  - `http://localhost:3000/auth/callback/`
- Required Netlify build variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Facebook UI is on by default. Set `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=false` only as
  an emergency kill switch.
- Meta app domain / policies for Facebook Login:
  - App domain: `coachcore.macksims.com`
  - Privacy: `https://macksims-public-site.netlify.app/privacy/`
  - Data deletion: `https://macksims-public-site.netlify.app/account-deletion/`

### CurbCue / FairShare

- Provider callback (Google, GitHub, and Facebook):
  `https://dsbwqxhqktzsdleeobbi.supabase.co/auth/v1/callback`
- Supabase Site URL: `https://fairshare.macksims.com`
- Supabase exact Redirect URLs:
  - `https://fairshare.macksims.com/auth/callback`
  - `https://fairshare-v03-20260624.netlify.app/auth/callback`
  - `http://localhost:3000/auth/callback`
- Required Netlify build variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Facebook UI is on by default; `VITE_ENABLE_FACEBOOK_AUTH=false` is an emergency kill switch.
- Meta app domain: `fairshare.macksims.com` (same stable privacy/deletion URLs)

### MotoCrew / ThrottleLink

- Provider callback (Google, GitHub, and Facebook):
  `https://npmiwnxnqgonnmwvblyi.supabase.co/auth/v1/callback`
- Supabase Site URL: `https://motocrew.macksims.com`
- Supabase exact Redirect URLs:
  - `https://motocrew.macksims.com/auth/callback`
  - `https://motocrewz.netlify.app/auth/callback`
  - `http://localhost:5173/auth/callback`
- Required Netlify build variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Facebook UI is on by default; `VITE_ENABLE_FACEBOOK_AUTH=false` is an emergency kill switch.
- Meta app domain: `motocrew.macksims.com` (same stable privacy/deletion URLs)

### Sermon Studio

- Provider callback (Google, GitHub, and Facebook):
  `https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback`
- Supabase Site URL: `https://sermonstudio.macksims.com`
- Supabase exact Redirect URLs:
  - `https://sermonstudio.macksims.com/auth/callback`
  - `https://sermon-studio-beta.netlify.app/auth/callback`
  - `http://localhost:3000/auth/callback`
- Required Netlify variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Facebook UI is on by default; `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=false` is an emergency kill switch.
- Meta app domain: `sermonstudio.macksims.com` (same stable privacy/deletion URLs)
- Email/password remains the fallback.

### FishCrew

- Supabase Site URL: `https://fishcrew.macksims.com`
- Current app redirect: `https://fishcrew.macksims.com/`
- Required static runtime configuration names:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- Google and Facebook login remain intentionally disabled by
  `ENABLE_GOOGLE_AUTH` and `ENABLE_FACEBOOK_AUTH`. Do not flip either flag until the
  matching Supabase provider is enabled and tested.
- Facebook/Google provider callback (when approved):
  `https://kkyuychvitrmtehvzqfd.supabase.co/auth/v1/callback`
- Instagram Meta app ID currently used by FishCrew config (non-secret):
  `956207094120610`. Console display name observed 2026-07-29: **Shutterbid**.
  This app powers Instagram profile connection (not login) and must not be
  repurposed, deleted, rotated, or disrupted.
- Separate Meta app observed 2026-07-29: display name **Fishcrew**, App ID
  `1709471443573822` (Development). Not remapped or configured for Facebook Login
  in this pass; inspect before any FishCrew Facebook Login enablement.
- Stable policy URLs:
  - `https://macksims-public-site.netlify.app/privacy/`
  - `https://macksims-public-site.netlify.app/account-deletion/`

## Meta / Facebook architecture

Prefer **one dedicated Meta Facebook Login app per product / Supabase project**.
Do not share one Meta app across products with different Supabase callbacks.

| Product | Exact Meta Valid OAuth Redirect URI | Dedicated Meta app status (2026-07-29) |
| --- | --- | --- |
| CoachCore | `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback` | **Configured in Development** — dedicated app `1732171628101176` |
| CurbCue | `https://dsbwqxhqktzsdleeobbi.supabase.co/auth/v1/callback` | **Configured in Development** — dedicated app `2243402953092342` |
| MotoCrew | `https://npmiwnxnqgonnmwvblyi.supabase.co/auth/v1/callback` | **Configured in Development** — dedicated app `1040026771740958` |
| Sermon Studio | `https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback` | **Configured in Development** — dedicated app `1616615176822509` |
| FishCrew (login) | `https://kkyuychvitrmtehvzqfd.supabase.co/auth/v1/callback` | Candidate app `1709471443573822` exists but was not fully inspected/configured before browser control dropped; Instagram remains on `956207094120610` |

Keep every new Meta app in **Development** mode until each login flow is tested with
Meta app roles (admin/developer/tester). Do not submit App Review or switch Live
unless requirements are satisfied and unambiguous.

## Provider-console procedure

For each Google client, reuse the client already mapped to the same Supabase project.
Add only that project's exact Supabase callback URI under **Authorized redirect URIs**.
Do not add app callback URLs or wildcard redirects.

For each GitHub OAuth App, set **Authorization callback URL** to that app's exact
Supabase callback above. A GitHub OAuth App supports one callback, so do not share one
OAuth App across products with different Supabase projects.

For each Meta Facebook Login app:

1. Create App (or use a clearly product-mapped existing app — stop if ambiguous).
2. Add Facebook Login → Settings → Valid OAuth Redirect URIs = that product's exact
   Supabase callback only.
3. Settings → Basic: App Domains (exact host, no wildcards), Privacy Policy URL,
   Terms if required, and Data Deletion instructions/URL using the MackSims policy
   pages above.
4. Use Cases → Authentication and Account Creation: `public_profile` + `email`.
5. Copy App ID + App Secret into that product's Supabase Authentication → Providers
   → Facebook and enable the provider.
6. Test in Development mode with an app-role user. The repository UI is enabled by
   default; use the flag only to disable the button during an incident.
7. Never print or store App Secrets in the repo, docs, screenshots, or chat.

## Supabase dashboard checklist

For each project:

1. Authentication → URL Configuration: set the custom production Site URL and add only
   the exact production, legacy Netlify, and localhost callbacks listed above.
2. Authentication → Providers: verify the UI providers (Google/GitHub/Facebook when
   ready) are enabled and have credentials for that same project callback.
3. Keep redirect allowlists app-specific. Do not copy another product's domain.
4. Rebuild/redeploy after changing frontend environment variables.

### URL configuration status

User-confirmed on 2026-07-29 (not independently browser-verified): the documented
Site URL and exact Redirect URL allowlist entries are already configured for CoachCore,
CurbCue, MotoCrew, and Sermon Studio. No further URL-allowlist change is requested.

## Excluded products

- ShutterBid: Firebase-primary application; no login UI was found in the checked source.
  Note: Meta console app **Shutterbid** (`956207094120610`) is currently wired into
  FishCrew Instagram connect — leave it alone for that purpose.
- MomentPick: Firebase client application; no login UI was found in the checked source.
- Public marketing site: no account feature.
- Aegis Intel: source is outside this monorepo app tree and no login intent is established here.
- Content Suite: outside this monorepo app tree; no login intent is established here.

Authentication was not added to excluded products.

## Verification and remaining blockers

### Code completed (this Meta pass)

- CoachCore, CurbCue/FairShare, MotoCrew, Sermon Studio: Facebook is included in
  `OAuthProvider`, the shared provider list, and `signInWithOAuth`; the verified
  provider is enabled by default in each UI.
- Same-app callback/return sanitization unchanged and covered by tests.
- FishCrew: `ENABLE_FACEBOOK_AUTH` remains `false`; Instagram config untouched;
  comments updated with console display-name findings.
- Per-app `docs/OAUTH_SETUP.md` updated with Facebook checklists.

### Console changes completed

- A dedicated headed Microsoft Edge Playwright profile was used after interactive
  user login/MFA. No personal browser profile, cookie extraction, credential store,
  screenshot, or secret logging was used.
- Four dedicated Meta apps were created and independently re-opened to verify:
  - **CoachCore** `1732171628101176`
  - **CurbCue** `2243402953092342`
  - **MotoCrew** `1040026771740958`
  - **Sermon Studio** `1616615176822509`
- Each app remains **In development** and has its exact product domain, privacy URL,
  data-deletion URL, exact Supabase callback, client/web OAuth, HTTPS-only redirect,
  and strict redirect matching saved. The Facebook Login authentication use case was
  selected; no extra permissions, App Review, or Live-mode change was requested.
- **Shutterbid** `956207094120610` and **Fishcrew** `1709471443573822` were not edited.
- Supabase Facebook is **Enabled** for CoachCore, CurbCue, MotoCrew, and Sermon
  Studio. Independent re-open verification confirmed each Meta App ID, enabled
  state, and exact product callback. Every App Secret was transferred directly
  in-memory and was not logged, stored, or screenshotted.
- No Meta app was switched to Live; no App Review submitted.

### Remaining console blockers (exact)

1. Test each login flow as a Meta app role user while still in Development mode.
2. After successful role-user tests, complete any Meta requirements and deliberately
   switch each dedicated app Live before advertising Facebook login to the public.
3. **FishCrew Facebook Login**: keep gated. Before enabling, inspect Meta app
   `1709471443573822` (do not touch `956207094120610` Instagram settings). If that
   Fishcrew app is clearly for login, configure its Facebook Login redirect to
   `https://kkyuychvitrmtehvzqfd.supabase.co/auth/v1/callback`, enable Supabase
   Facebook, test, then flip `ENABLE_FACEBOOK_AUTH`. If ambiguous, create a new
   dedicated FishCrew Login app instead of guessing.
4. Google/GitHub console state for CurbCue, MotoCrew, and Sermon Studio was not
   re-verified in the Meta pass. The repository has working buttons and callbacks,
   while `KEYS_STATUS.md` confirms each deployed public key matches its Supabase
   project; any provider-console failure still requires console inspection.

### Deployment prerequisites

- No production deploy was made: working trees already contain unrelated dirty work.
- Redeploy is required for this default-on Facebook UI change and after any Supabase
  public env change.
