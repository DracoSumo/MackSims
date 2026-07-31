# MackSims Instagram publishing setup

This repository contains an approval-gated publishing foundation only. It has no Meta IDs or tokens in source and creates no live posts without an explicitly approved queue record.

## 1. Create and configure the Meta app

1. Sign in to [Meta for Developers](https://developers.facebook.com/apps/) with the account that will administer MackSims.
2. Choose **Create app**, select the **Business** app type/use case, and name it for MackSims. Do not reuse a FishCrew-only app.
3. In the app dashboard, add **Instagram** and choose **API setup with Instagram login** (also shown in some dashboard versions as **Instagram API with Instagram Login**).
4. In **Instagram → API setup with Instagram business**, add the confirmed MackSims Professional Business Instagram account.
5. Under app roles, add the Instagram account owner as an app **Administrator, Developer, or Instagram Tester**, then accept the invitation from the Instagram account. Development-mode API calls work only for app-role/test accounts.
6. Configure the Business Login redirect URI exactly:
   - `https://www.macksims.com/meta/instagram-callback/`
7. Configure the policy and deletion URLs:
   - Privacy policy: `https://www.macksims.com/privacy/`
   - Data deletion instructions: `https://www.macksims.com/account-deletion/`
8. Add the production domain `macksims.com` where the dashboard asks for app domains. Keep the app in **Development** mode while only the MackSims role account is used. App Review/Advanced Access is needed before serving Instagram accounts without app roles.

Meta has changed permission labels and OAuth scope values in the past. In the current Instagram Login documentation, publishing needs:

- `instagram_business_basic`
- `instagram_business_content_publish`

The dashboard may display a friendly permission name or a differently prefixed scope. Use the **exact current scope string displayed by the Instagram Login product in your app dashboard**, and verify the generated token shows both basic access and content publishing. Do not substitute the Facebook Login scopes (`instagram_basic`, `instagram_content_publish`) for this Instagram Login implementation.

## 2. Obtain the operator token and Instagram user ID

For this single-account Development-mode foundation, use the dashboard's operator flow:

1. Open **Instagram → API setup with Instagram business**.
2. Next to the MackSims account, choose **Generate token** and authenticate as the app-role account.
3. Confirm the token has the two publishing scopes shown above.
4. Copy the Instagram professional account ID shown by the setup flow (the `user_id`/`<IG_ID>`, not the Meta app ID).
5. Treat the token as a secret. Never paste it into source, chat, an issue, a URL, or a committed `.env` file.

Dashboard-generated Instagram tokens are documented as long-lived and valid for about 60 days. If the flow instead gives a one-hour authorization-code token, exchange it server-side:

1. Exchange the code at `https://api.instagram.com/oauth/access_token` using the app ID, app secret, exact redirect URI, and `grant_type=authorization_code`.
2. Exchange that short-lived token at `https://graph.instagram.com/access_token` using `grant_type=ig_exchange_token`, the app secret, and the short-lived access token.
3. Record the returned expiration date. Do not expose either exchange request to browser JavaScript.

## 3. Set Netlify environment variables

Set secrets in **Netlify UI → Site configuration → Environment variables**, scoped to the MackSims public site. Do not put them in `netlify.toml`.

Required:

- `META_INSTAGRAM_APP_ID` — Meta/Instagram app ID
- `META_INSTAGRAM_APP_SECRET` — Meta/Instagram app secret
- `META_INSTAGRAM_ACCESS_TOKEN` — long-lived Instagram User access token
- `META_INSTAGRAM_USER_ID` — Instagram professional account ID returned by Instagram Login
- `META_INSTAGRAM_API_VERSION=v26.0` — pinned in `netlify.toml` and in Netlify's non-secret `builds`/`functions` environment scopes
- `INSTAGRAM_PUBLISH_ADMIN_SECRET` — the existing high-entropy secret used only for these admin endpoints

`MACKSIMS_INSTAGRAM_ADMIN_SECRET` remains a compatibility alias for older environments, but new configuration and operator commands must use `INSTAGRAM_PUBLISH_ADMIN_SECRET`. If both are present, `INSTAGRAM_PUBLISH_ADMIN_SECRET` takes precedence.

Strongly recommended for expiry visibility:

- `META_INSTAGRAM_TOKEN_EXPIRES_AT` — returned expiry as an ISO-8601 UTC timestamp, for example `2026-09-28T18:00:00Z`

The app secret is used to generate `appsecret_proof`; it is never returned by the health endpoint. The admin secret protects queue creation, approval, listing, and health checks.

Netlify marks these credentials as sensitive. Local `netlify env:get` output may be masked, and `netlify dev:exec` may not inject usable production-sensitive values. Do not treat either local result as a credential failure. Verify secret-backed behavior in a Netlify deploy preview or production Function runtime, and never print tokens or secrets while doing so.

## 4. Database and deployment review

The project uses Netlify Database through `@netlify/database`. Installing that package tells Netlify to provision the site's database on a future deploy. No hosted database has been provisioned or changed by this work.

- Migration: `netlify/database/migrations/20260730140000_create_instagram_publish_queue.sql`
- Netlify applies the migration automatically to deploy previews and production.
- Never run the migration manually against a hosted database and never use direct hosted DDL.
- For local development only, use Netlify CLI 26+ and `netlify database migrations apply`.
- Review in a deploy preview before publishing the production deploy.

The dispatcher runs every ten minutes. It atomically claims only due `approved` records, applies an internal limit of 50 processing/published posts in a rolling 24 hours, and invokes a background worker. Carousels count as one post. Meta currently documents a higher platform ceiling in some surfaces, but the internal limit intentionally remains conservative.

## 5. Admin workflow

All requests require `Authorization: Bearer <INSTAGRAM_PUBLISH_ADMIN_SECRET>`.

1. Create a `draft` with `POST /api/admin/instagram/queue`.
2. Review it with `GET /api/admin/instagram/queue`.
3. Explicitly approve it with `POST /api/admin/instagram/queue/{id}/approve` and JSON `{ "approvedBy": "operator name" }`. Optional `queueNow: true` moves `scheduled_at` to now in the same atomic update so the next dispatcher cycle can claim it.
4. The scheduled dispatcher can then claim it only after `scheduledAt`.
5. Check configuration with `GET /api/admin/instagram/health`. Add `?verify=1` to make a read-only `/me` call to Meta.

Media must already be reachable from a public HTTPS URL when Meta creates the container. This implementation conservatively accepts `.jpg`/`.jpeg` images and `.mp4` videos, 2–10 carousel items, captions up to 2,200 characters, and non-empty alt text. Do not queue private URLs, expiring signed URLs, or credentials in URL query strings.

## 6. Token refresh every 60 days

Long-lived tokens expire after about 60 days. A still-valid token can be refreshed through `https://graph.instagram.com/refresh_access_token` with `grant_type=ig_refresh_token`; Meta requires the token to be old enough to refresh and not expired. An expired token cannot be refreshed.

This project deliberately does **not** refresh automatically. Before expiry:

1. Confirm the MackSims operator is still authorized and the requested scopes have not changed.
2. Perform the refresh server-side using Meta's current dashboard/documentation.
3. replace `META_INSTAGRAM_ACCESS_TOKEN` and `META_INSTAGRAM_TOKEN_EXPIRES_AT` in Netlify.
4. Call the admin health endpoint with `?verify=1`.
5. Keep the old token out of logs and revoke it if Meta does not rotate it automatically.

## Safety rules

- Draft creation never approves or publishes.
- Only a server-authenticated approval changes `draft` to `approved`.
- Failed jobs are not automatically re-approved; inspect their container IDs and error first to avoid duplicate posts.
- Never seed a live queue row in a migration.
- Never call the publishing endpoints during setup or tests.
