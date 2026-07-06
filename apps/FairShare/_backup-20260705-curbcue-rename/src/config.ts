export const APP_NAME = "CurbCue";
export const APP_TAGLINE = "Know where to ride before you book.";
export const APP_SHORT_DESCRIPTION =
  "Compare rides, spot surge pressure, and choose the smarter pickup before prices jump.";
export const APP_LONG_DESCRIPTION =
  "CurbCue turns ride prices, crowd pressure, surge risk, and pickup options into one clear signal before you book.";
export const APP_FEEDBACK_SUBJECT = "CurbCue Beta Feedback";
export const DEFAULT_MARKET = "Bermuda Pilot";
export const DEFAULT_COUNTRY = "BM";
export const DEFAULT_CITY = "Hamilton";
export const DEFAULT_CURRENCY = "BMD";
export const DEFAULT_LOCALE = "en-BM";
export const WEB_CANONICAL_URL = "https://fairshare-v03-20260624.netlify.app/";
export const BUILD_TARGET = "web";
export const VERSION_LABEL = "v0.3";
export const FEEDBACK_EMAIL = "feedback@macksims.com";
export const BETA_LABEL = "External Beta";
/** Set via VITE_SUPABASE_* at build time — project assigned, anon key required to connect. */
/** Accept VITE_* or NEXT_PUBLIC_* (Netlify currently uses NEXT_PUBLIC_* on all sites). */
function readSupabaseEnv(name: "URL" | "ANON_KEY"): string {
  const env = import.meta.env as Record<string, string | undefined>;
  if (name === "URL") {
    return String(env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  }
  return String(env.VITE_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
}

export const SUPABASE_URL = readSupabaseEnv("URL");
export const SUPABASE_ANON_KEY = readSupabaseEnv("ANON_KEY");

function isValidAnonKey(key: string): boolean {
  return key.length > 40 && key.startsWith("eyJ") && !key.includes("your-anon-key");
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && isValidAnonKey(SUPABASE_ANON_KEY));

export function supabaseStatusLabel(): string {
  if (isSupabaseConfigured) {
    return `${SUPABASE_URL} — connected (OAuth + saved comparisons sync when signed in)`;
  }
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    return `${SUPABASE_URL} — anon key looks like a placeholder; paste the JWT from Supabase API settings`;
  }
  if (SUPABASE_URL) {
    return `${SUPABASE_URL} — project URL set; add VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY`;
  }
  return "Not configured — set Supabase URL and anon key in Netlify env";
}

export interface MarketReadinessConfig {
  id: string;
  label: string;
  country: string;
  defaultCity: string;
  currency: string;
  locale: string;
  supportedContexts: string[];
  status: "pilot" | "planned" | "future";
}

export const marketsReadiness: MarketReadinessConfig[] = [
  {
    id: "bermuda",
    label: DEFAULT_MARKET,
    country: DEFAULT_COUNTRY,
    defaultCity: DEFAULT_CITY,
    currency: DEFAULT_CURRENCY,
    locale: DEFAULT_LOCALE,
    supportedContexts: ["airport", "hotel", "cruise port", "events", "tourist districts"],
    status: "pilot"
  },
  {
    id: "tampa",
    label: "Tampa",
    country: "US",
    defaultCity: "Tampa",
    currency: "USD",
    locale: "en-US",
    supportedContexts: ["airport", "events", "downtown nightlife", "tourist districts"],
    status: "planned"
  },
  {
    id: "global-template",
    label: "Global Market Template",
    country: "TBD",
    defaultCity: "TBD",
    currency: "USD",
    locale: "en",
    supportedContexts: ["airports", "cruise ports", "stadiums", "hotels", "local transit hubs"],
    status: "future"
  }
];
