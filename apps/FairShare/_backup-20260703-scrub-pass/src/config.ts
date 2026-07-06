export const APP_NAME = "FairShare";
export const DEFAULT_MARKET = "Bermuda Pilot";
export const DEFAULT_COUNTRY = "BM";
export const DEFAULT_CITY = "Hamilton";
export const DEFAULT_CURRENCY = "BMD";
export const DEFAULT_LOCALE = "en-BM";
export const WEB_CANONICAL_URL = "https://fareshar.netlify.app/";
export const BUILD_TARGET = "web";
export const VERSION_LABEL = "v0.3";
export const FEEDBACK_EMAIL = "feedback@macksims.com";
export const BETA_LABEL = "External Beta";
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://dsbwqxhqktzsdleeobbi.supabase.co";

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
