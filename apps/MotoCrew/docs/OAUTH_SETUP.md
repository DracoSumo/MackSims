# MotoCrew — Supabase OAuth setup

Project ref: `npmiwnxnqgonnmwvblyi`  
Production site: `https://motocrew.macksims.com`

Legacy Netlify host: `https://motocrewz.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://motocrewz.netlify.app/auth/callback`
- `https://motocrew.macksims.com/auth/callback`
- `http://localhost:5173/auth/callback` (Vite default dev port)

Set **Site URL** to `https://motocrew.macksims.com`.

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

### Facebook / Meta

Configured and enabled in Supabase with dedicated Meta app `1040026771740958`.
The UI is enabled by default; `VITE_ENABLE_FACEBOOK_AUTH=false` is an emergency
kill switch. The exact provider callback is:

`https://npmiwnxnqgonnmwvblyi.supabase.co/auth/v1/callback`

The Meta app remains in Development mode, so only app-role users can complete login
until the owner finishes role-user testing and deliberately moves it Live.

## 3. Netlify env (build time)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The code accepts legacy `NEXT_PUBLIC_*` aliases, but `VITE_*` is canonical.

Redeploy after changing env vars.

## 4. Verify

1. Open **Profile** screen.
2. Click **Continue with Google**, **GitHub**, or **Facebook**.
3. After provider login, you should return signed in on Profile.

No secrets belong in this repo.
