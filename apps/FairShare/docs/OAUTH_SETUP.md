# CurbCue — Supabase OAuth setup

> **Product name:** CurbCue (UI/docs). **Hosting identifiers unchanged** — Netlify site remains `fairshare-v03-20260624`.

Project ref: `dsbwqxhqktzsdleeobbi`  
Production site: `https://fairshare.macksims.com`

Legacy Netlify host: `https://fairshare-v03-20260624.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://fairshare-v03-20260624.netlify.app/auth/callback`
- `https://fairshare.macksims.com/auth/callback`
- `http://localhost:3000/auth/callback`

Set **Site URL** to `https://fairshare.macksims.com`.

## 2. Enable providers

Under **Authentication → Providers**:

### Google

1. Enable Google.
2. Create OAuth credentials in Google Cloud Console (Web application).
3. Paste **Client ID** and **Client Secret** into Supabase.
4. Add Google authorized redirect: `https://dsbwqxhqktzsdleeobbi.supabase.co/auth/v1/callback`

### GitHub

1. Enable GitHub.
2. Create a GitHub OAuth App (callback = Supabase callback above).
3. Paste **Client ID** and **Client Secret** into Supabase.

### Facebook / Meta

Configured and enabled in Supabase with dedicated Meta app `2243402953092342`.
The UI is enabled by default; `VITE_ENABLE_FACEBOOK_AUTH=false` is an emergency
kill switch. The exact provider callback is:

`https://dsbwqxhqktzsdleeobbi.supabase.co/auth/v1/callback`

The Meta app remains in Development mode, so only app-role users can complete login
until the owner finishes role-user testing and deliberately moves it Live.

## 3. Netlify env (build time)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The code accepts legacy `NEXT_PUBLIC_*` aliases, but `VITE_*` is canonical.

Redeploy after changing env vars.

## 4. Verify

1. Open **Settings** → Account section.
2. Click **Continue with Google**, **GitHub**, or **Facebook**.
3. After provider login, you should return to Settings signed in.

No secrets belong in this repo.

## 5. Optional future hosting alias

Client router now accepts `/curbcue`, `/fairshare`, and `/farewave` as home aliases. A Netlify
redirect from a future `curbcue.*` domain is **not** configured in this pass — owner approval required
before changing DNS or `netlify.toml` site identity.
