# CurbCue — Supabase OAuth setup

> **Product name:** CurbCue (UI/docs). **Hosting identifiers unchanged** — Netlify site remains `fairshare-v03-20260624`.

Project ref: `dsbwqxhqktzsdleeobbi`  
Production site: `https://fairshare-v03-20260624.netlify.app`

## 1. Supabase Dashboard → Authentication → URL Configuration

Add these **Redirect URLs**:

- `https://fairshare-v03-20260624.netlify.app/auth/callback`
- `http://localhost:3000/auth/callback`

Set **Site URL** to the production Netlify URL.

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

## 3. Netlify env (build time)

- `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after changing env vars.

## 4. Verify

1. Open **Settings** → Account section.
2. Click **Continue with Google** or **Continue with GitHub**.
3. After provider login, you should return to Settings signed in.

No secrets belong in this repo.

## 5. Optional future hosting alias

Client router now accepts `/curbcue`, `/fairshare`, and `/farewave` as home aliases. A Netlify
redirect from a future `curbcue.*` domain is **not** configured in this pass — owner approval required
before changing DNS or `netlify.toml` site identity.
