# CoachCore — Supabase OAuth setup

Project ref: `bfqfbkldxbojrrxeidcc`  
Production site: `https://coachcore7.netlify.app`  
Supabase callback: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://coachcore7.netlify.app/auth/callback`
- `https://coachcore7.netlify.app/auth/callback/`
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/callback/`

Set **Site URL** to `https://coachcore7.netlify.app` (or your primary deploy URL).

## 2. Enable providers

Under **Authentication → Providers**:

### Google

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console (Web application).
3. Paste **Client ID** and **Client Secret** into Supabase.
4. Add Google authorized redirect: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`
5. Scopes: default `email profile` is enough for CoachCore.

### GitHub

1. Enable GitHub.
2. Create a GitHub OAuth App:
   - Homepage URL: `https://coachcore7.netlify.app`
   - Authorization callback URL: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`
3. Paste **Client ID** and **Client Secret** into Supabase.

## 3. Netlify env (build time)

- `NEXT_PUBLIC_SUPABASE_URL` — project API URL from Supabase Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public JWT from the same page

Redeploy after changing env vars.

## 4. App flow

CoachCore uses Supabase PKCE OAuth:

- Buttons call `supabase.auth.signInWithOAuth()`
- Redirect target is `/auth/callback`
- Callback exchanges the `code` with `exchangeCodeForSession()`
- Local demo data syncs after sign-in, then redirects to `/app`

## 5. Verify

1. Confirm the provider is enabled in Supabase and credentials are saved.
1. Open `/login` on production.
2. Click **Continue with Google** or **Continue with GitHub**.
3. Complete provider login → should land on `/app` with session in browser storage.
4. If it fails, check the callback page error text and Supabase Auth logs.

No secrets belong in this repo.
