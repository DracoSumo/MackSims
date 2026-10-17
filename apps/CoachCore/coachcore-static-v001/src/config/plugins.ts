/**
 * Optional plugin credentials / feature flags.
 * Never invent secrets — leave unset until the owner configures provider apps.
 */

function truthy(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Public Strava client id (safe in browser). Secret stays server-side only. */
export const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID?.trim() ?? "";

/**
 * When true, Google Calendar Connect requests Calendar scopes via existing Supabase Google OAuth.
 * Owner must enable Calendar API + scopes on the same Google Cloud OAuth client used by Supabase.
 */
export const GOOGLE_CALENDAR_OAUTH_ENABLED = truthy(
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_CALENDAR ?? "true"
);

export const isStravaOAuthConfigured = Boolean(STRAVA_CLIENT_ID.length > 0);

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.readonly",
].join(" ");
