# CoachCore — Supabase OAuth setup

Project ref: `bfqfbkldxbojrrxeidcc`  
Staging site: `https://coachcore7.netlify.app`  
Production site: `https://coachcore.macksims.com`  
Supabase callback: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://coachcore7.netlify.app/auth/callback`
- `https://coachcore7.netlify.app/auth/callback/`
- `https://coachcore.macksims.com/auth/callback`
- `https://coachcore.macksims.com/auth/callback/`
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/callback/`

Set **Site URL** to `https://coachcore.macksims.com` when custom DNS is live; until then use `https://coachcore7.netlify.app`.

## 2. Enable providers

Under **Authentication → Providers**:

### Google

Enabled on staging (`bfqfbkldxbojrrxeidcc`) with GCP project `nutt-362500`.

### GitHub

Enabled on staging. OAuth App **CoachCore Supabase** (client id `Ov23li3ju6zrCikMibbg`) callback:

`https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`

### Redirect URLs (applied)

Site URL (until custom DNS resolves): `https://coachcore7.netlify.app`

Allow list includes staging, `coachcore.macksims.com`, and localhost `/auth/callback` variants.

### Facebook / Meta

Facebook Login is implemented in the app UI but **gated off** until Meta + Supabase
are configured and tested. Do not set `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true` until
the checklist below is complete.

1. Create a dedicated Meta app for CoachCore (do not reuse FishCrew/Shutterbid apps).
2. Add **Facebook Login** product. Keep the app in **Development** mode.
3. Valid OAuth Redirect URI (exact):
   `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`
4. App domain: `coachcore.macksims.com`
5. Privacy Policy URL: `https://macksims-public-site.netlify.app/privacy/`
6. Data deletion URL: `https://macksims-public-site.netlify.app/account-deletion/`
7. Use Cases → Authentication and Account Creation: ensure `email` + `public_profile`.
8. Supabase → Authentication → Providers → Facebook: enable and paste App ID + App Secret.
9. Add yourself as a Meta app tester/admin, then test login.
10. Only then set Netlify `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true` and redeploy.

## 3. Netlify env (build time)

- `NEXT_PUBLIC_SUPABASE_URL` — project API URL from Supabase Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public JWT from the same page

Static export bakes these into the client bundle. After changing env vars, **rebuild and redeploy** (env alone does not fix an old deploy).

## 4. App flow

CoachCore uses Supabase PKCE OAuth:

- Buttons call `supabase.auth.signInWithOAuth()`
- Redirect target is `/auth/callback`
- Callback exchanges the `code` with `exchangeCodeForSession()`
- Local demo data syncs after sign-in, then redirects to `/app`

## 5. Verify

1. Confirm the provider is enabled in Supabase and credentials are saved.
2. Open `/login` on production.
3. Click **Continue with Google** or **Continue with GitHub** (buttons must be enabled).
4. Complete provider login → should land on `/app` with session in browser storage.
5. If it fails, check the callback page error text and Supabase Auth logs.

## 6. Plugin OAuth (Calendar / Strava)

See [INTEGRATIONS_SETUP.md](./INTEGRATIONS_SETUP.md) for Google Calendar scopes and Strava client setup.
Do not put provider client secrets in `NEXT_PUBLIC_*` env vars.

No secrets belong in this repo.
