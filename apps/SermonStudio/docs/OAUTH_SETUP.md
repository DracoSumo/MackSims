# Sermon Studio — Supabase OAuth setup

Project ref: `zipxwqkmenapnckwyzrh`  
Production site: `https://sermonstudio.macksims.com`

Legacy Netlify host: `https://sermon-studio-beta.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://sermon-studio-beta.netlify.app/auth/callback`
- `https://sermonstudio.macksims.com/auth/callback`
- `http://localhost:3000/auth/callback`

Set **Site URL** to `https://sermonstudio.macksims.com`.

## 2. Enable providers

Under **Authentication → Providers**:

### Google

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console (Web application).
3. Paste **Client ID** and **Client Secret** into Supabase.
4. Add Google authorized redirect: `https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback`

### GitHub

1. Enable GitHub.
2. Create a GitHub OAuth App (callback = Supabase callback above).
3. Paste **Client ID** and **Client Secret** into Supabase.

### Facebook / Meta

Configured and enabled in Supabase with dedicated Meta app `1616615176822509`.
The UI is enabled by default; `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=false` is an
emergency kill switch. The exact provider callback is:

`https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback`

The Meta app remains in Development mode, so only app-role users can complete login
until the owner finishes role-user testing and deliberately moves it Live.

## 3. Netlify env (build time)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after changing env vars.

## 4. Verify

1. Open the app header — **AuthCard** shows Google/GitHub/Facebook when Supabase is configured.
2. Complete provider login → should return to `/` with session active.
3. Without Supabase env, the app stays in **local demo mode** (localStorage).

No secrets belong in this repo.
