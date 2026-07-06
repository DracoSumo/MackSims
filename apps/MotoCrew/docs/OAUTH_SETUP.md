# MotoCrew — Supabase OAuth setup

Project ref: `npmiwnxnqgonnmwvblyi`  
Production site: `https://motocrewz.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://motocrewz.netlify.app/auth/callback`
- `http://localhost:5173/auth/callback` (Vite default dev port)

Set **Site URL** to `https://motocrewz.netlify.app`.

## 2. Enable providers

Under **Authentication → Providers**:

### Google

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console (Web application).
3. Paste **Client ID** and **Client Secret** into Supabase.
4. Add Google authorized redirect: `https://npmiwnxnqgonnmwvblyi.supabase.co/auth/v1/callback`

### GitHub

1. Enable GitHub.
2. Create a GitHub OAuth App (callback = Supabase callback above).
3. Paste **Client ID** and **Client Secret** into Supabase.

## 3. Netlify env (build time)

- `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after changing env vars.

## 4. Verify

1. Open **Profile** screen.
2. Click **Continue with Google** or **Continue with GitHub**.
3. After provider login, you should return signed in on Profile.

No secrets belong in this repo.
