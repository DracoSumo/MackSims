# CoachCore — Supabase OAuth setup

Project ref: `bfqfbkldxbojrrxeidcc`  
Production site: `https://coachcore7.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://coachcore7.netlify.app/auth/callback`
- `http://localhost:3000/auth/callback`

Set **Site URL** to `https://coachcore7.netlify.app` (or your primary deploy URL).

## 2. Enable providers

Under **Authentication → Providers**:

### Google

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console (Web application).
3. Paste **Client ID** and **Client Secret** into Supabase.
4. Add Google authorized redirect: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`

### GitHub

1. Enable GitHub.
2. Create a GitHub OAuth App (Homepage URL = CoachCore site, callback = Supabase callback above).
3. Paste **Client ID** and **Client Secret** into Supabase.

## 3. Netlify env (build time)

- `NEXT_PUBLIC_SUPABASE_URL` — project API URL from Supabase Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public JWT from the same page

Redeploy after changing env vars.

## 4. Verify

1. Open `/login` on production.
2. Click **Continue with Google** or **Continue with GitHub**.
3. Complete provider login → should land on `/app` with session in browser storage.

No secrets belong in this repo.
