# CoachCore integrations / plugins setup

Project: `bfqfbkldxbojrrxeidcc`  
Staging: https://coachcore7.netlify.app  
App path: `/app/integrations`

## What ships in v0.7.2

| Provider | Beta status | What works now |
| --- | --- | --- |
| **Google Calendar** | Available | Connect via existing Supabase Google OAuth + Calendar scopes. Stores connection on `user_integrations`. Does **not** sync events yet. |
| **Strava** | Needs credentials | UI + authorize redirect when `NEXT_PUBLIC_STRAVA_CLIENT_ID` is set. Token exchange needs a server secret — stays **Pending OAuth**, never fake Connected. |
| **Hudl, WHOOP, Oura, Garmin, Fitbit** | Request access | Waitlist row in `integration_access_requests` + local/remote status `requested`. |
| **Apple Health / Health Connect** | Coming soon | Native device flows — not web-OAuth in this beta. |
| **TeamSnap / MaxPreps** | Coming soon | Catalog only. |

Medical / coaching copy remains: coaching support only — not medical advice.

Hudl copy remains careful: supported where API, export, embed, or licensed access is available.

## Database (already applied on staging project)

- `user_integrations` — per-user connect / request / pending / disconnect (RLS: own rows only)
- `integration_access_requests` — waitlist inserts (RLS: own rows only)

Schema stub also lives in `supabase/schema.sql`.

## Owner setup — Google Calendar

Uses the **same Google Cloud OAuth client** already wired into Supabase Auth.

- GCP project: `nutt-362500` (OAuth client id prefix `337788492234-…`)
- Google Calendar API: **enabled**
- Consent scope `calendar.events.readonly`: **added** (sensitive; Testing audience)
- Supabase redirect URI: `https://bfqfbkldxbojrrxeidcc.supabase.co/auth/v1/callback`

If Connect fails for a new Google account while the app is in **Testing**, add that email under Google Auth Platform → **Audience → Test users**.

Optional Netlify / `.env.local` flag (defaults on):  
`NEXT_PUBLIC_ENABLE_GOOGLE_CALENDAR=true`

Verify: sign in → Integrations → **Connect** on Google Calendar → consent → return to Integrations with status Connected (or Pending if `provider_token` is missing).

## Owner setup — Strava (optional)

1. Create a Strava API application: https://developers.strava.com/
2. Authorization Callback Domain / redirect:  
   `https://coachcore7.netlify.app/auth/integrations/strava/`  
   (and localhost equivalent for local testing)
3. Set Netlify env:  
   `NEXT_PUBLIC_STRAVA_CLIENT_ID=<public client id>`  
   `STRAVA_CLIENT_SECRET=<secret>` (server-only; never `NEXT_PUBLIC_*`)
4. Token exchange is implemented at `/api/integrations/strava/token` (`netlify/functions/strava-token.ts`). Redeploy after setting env.
5. Until client id + secret are set, the UI correctly shows **Needs credentials** / **Pending OAuth**.

## Partner APIs (Hudl, WHOOP, etc.)

1. Obtain partner / licensed API access offline.
2. Collect waitlist rows from `integration_access_requests` in Supabase.
3. Only then wire real OAuth/API-key flows and allow `connected`.

No secrets belong in the git repo.
