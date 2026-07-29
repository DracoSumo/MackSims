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

Facebook Login is implemented in AuthCard but **gated off** until Meta + Supabase are
configured and tested. Do not set `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true` until the
checklist below is complete.

1. Create a dedicated Meta app for Sermon Studio (do not reuse FishCrew/Shutterbid apps).
2. Add **Facebook Login** product. Keep the app in **Development** mode.
3. Valid OAuth Redirect URI (exact):
   `https://zipxwqkmenapnckwyzrh.supabase.co/auth/v1/callback`
4. App domain: `sermonstudio.macksims.com`
5. Privacy Policy URL: `https://macksims-public-site.netlify.app/privacy/`
6. Data deletion URL: `https://macksims-public-site.netlify.app/account-deletion/`
7. Use Cases → Authentication and Account Creation: ensure `email` + `public_profile`.
8. Supabase → Authentication → Providers → Facebook: enable and paste App ID + App Secret.
9. Add yourself as a Meta app tester/admin, then test login.
10. Only then set Netlify `NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true` and redeploy.

## 3. Netlify env (build time)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after changing env vars.

## 4. Verify

1. Open the app header — **AuthCard** shows Google/GitHub when Supabase is configured.
2. Complete provider login → should return to `/` with session active.
3. Without Supabase env, the app stays in **local demo mode** (localStorage).

No secrets belong in this repo.
