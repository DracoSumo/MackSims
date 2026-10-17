import { getAuthCallbackUrl } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  GOOGLE_CALENDAR_OAUTH_ENABLED,
  GOOGLE_CALENDAR_SCOPES,
  STRAVA_CLIENT_ID,
  isStravaOAuthConfigured,
} from "@/config/plugins";

export function isGoogleCalendarConnectReady(): boolean {
  return GOOGLE_CALENDAR_OAUTH_ENABLED;
}

export function isStravaConnectReady(): boolean {
  return isStravaOAuthConfigured;
}

export async function startGoogleCalendarOAuth(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return "Supabase is not configured. Sign-in and plugins need NEXT_PUBLIC_SUPABASE_* env vars.";
  }
  if (!GOOGLE_CALENDAR_OAUTH_ENABLED) {
    return "Google Calendar OAuth is disabled until the owner enables Calendar API scopes (see docs/INTEGRATIONS_SETUP.md).";
  }

  const redirectTo = `${getAuthCallbackUrl()}?plugin=google_calendar`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      scopes: GOOGLE_CALENDAR_SCOPES,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  return error?.message ?? null;
}

/** Starts Strava authorize redirect. Token exchange requires a server secret (not present in static beta). */
export function startStravaOAuth(): string | null {
  if (!isStravaOAuthConfigured) {
    return "Strava client id is not configured. Set NEXT_PUBLIC_STRAVA_CLIENT_ID after creating a Strava API app.";
  }
  if (typeof window === "undefined") return "Browser only.";

  const redirectUri = `${window.location.origin}/auth/integrations/strava/`;
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    approval_prompt: "auto",
    scope: "read,activity:read",
  });
  window.location.assign(`https://www.strava.com/oauth/authorize?${params.toString()}`);
  return null;
}
