/**
 * CoachCore plugin catalog — honest beta statuses.
 * Do not mark partner/licensed APIs as connected without real credentials.
 */

export type IntegrationAvailability =
  | "connected"
  | "available"
  | "coming_soon"
  | "needs_credentials"
  | "request_access";

export type IntegrationCategory = "video" | "wearable" | "calendar" | "team" | "health";

export type IntegrationConnectMode =
  | "oauth_google_calendar"
  | "oauth_strava"
  | "request_access"
  | "native_device"
  | "none";

export type IntegrationProvider = {
  id: string;
  name: string;
  category: IntegrationCategory;
  /** Catalog default before user state / env flags */
  availability: IntegrationAvailability;
  connectMode: IntegrationConnectMode;
  blurb: string;
  disclaimer?: string;
  carefulCopy?: string;
};

export const integrationsCatalog: IntegrationProvider[] = [
  {
    id: "hudl",
    name: "Hudl",
    category: "video",
    availability: "request_access",
    connectMode: "request_access",
    blurb: "Film library and highlight workflows for team video review.",
    carefulCopy:
      "Supported where API, export, embed, or licensed integration access is available.",
  },
  {
    id: "apple_health",
    name: "Apple Health",
    category: "health",
    availability: "coming_soon",
    connectMode: "native_device",
    blurb: "Readiness and activity signals from Apple Health (native device flow).",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "google_health_connect",
    name: "Google Health Connect",
    category: "health",
    availability: "coming_soon",
    connectMode: "native_device",
    blurb: "Android Health Connect activity and recovery signals.",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "garmin",
    name: "Garmin",
    category: "wearable",
    availability: "request_access",
    connectMode: "request_access",
    blurb: "Training load and recovery from Garmin Connect (partner API).",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    category: "wearable",
    availability: "request_access",
    connectMode: "request_access",
    blurb: "Activity and sleep summaries via Fitbit Web API (requires OAuth app).",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "whoop",
    name: "WHOOP",
    category: "wearable",
    availability: "request_access",
    connectMode: "request_access",
    blurb: "Strain and recovery insights (partner / licensed API access required).",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "oura",
    name: "Oura",
    category: "wearable",
    availability: "request_access",
    connectMode: "request_access",
    blurb: "Sleep and readiness rings via Oura Cloud API (partner access).",
    disclaimer:
      "Coaching support only — not medical advice, diagnosis, or treatment.",
  },
  {
    id: "strava",
    name: "Strava",
    category: "wearable",
    availability: "needs_credentials",
    connectMode: "oauth_strava",
    blurb: "Workouts and activities via Strava OAuth. Enable when a Strava API app is configured.",
  },
  {
    id: "teamsnap",
    name: "TeamSnap",
    category: "team",
    availability: "coming_soon",
    connectMode: "none",
    blurb: "Team schedules and roster sync — planned for a later beta slice.",
  },
  {
    id: "maxpreps",
    name: "MaxPreps",
    category: "team",
    availability: "coming_soon",
    connectMode: "none",
    blurb: "High-school team context — planned; no public API in this beta.",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "calendar",
    availability: "available",
    connectMode: "oauth_google_calendar",
    blurb: "Link practice and game calendars with Google OAuth (uses your existing Google sign-in app).",
  },
];

/** Landing / dashboard chip list — names only, honest labels. */
export const integrations = integrationsCatalog.map((item) => ({
  name: item.name,
  status: availabilityLabel(item.availability),
}));

export function availabilityLabel(status: IntegrationAvailability): string {
  switch (status) {
    case "connected":
      return "Connected";
    case "available":
      return "Available";
    case "coming_soon":
      return "Coming soon";
    case "needs_credentials":
      return "Needs credentials";
    case "request_access":
      return "Request access";
    default:
      return status;
  }
}

export function getProvider(id: string): IntegrationProvider | undefined {
  return integrationsCatalog.find((p) => p.id === id);
}
