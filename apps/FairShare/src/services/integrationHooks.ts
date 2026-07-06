import { SUPABASE_URL, isSupabaseConfigured, supabaseStatusLabel } from "../config";

export const integrationRoadmap = [
  {
    area: "Supabase project",
    status: isSupabaseConfigured ? "client ready" : SUPABASE_URL ? "url only" : "not set",
    note: supabaseStatusLabel()
  },
  {
    area: "Fare and ETA APIs",
    status: "placeholder",
    note: "TODO: Connect approved transport provider, taxi dispatch, shuttle schedule, and rideshare estimate APIs here."
  },
  {
    area: "Maps and geocoding",
    status: "placeholder",
    note: "TODO: Add user-consented location, address autocomplete, routing, and pickup-zone geofencing later."
  },
  {
    area: "Crowd poll submissions",
    status: "placeholder",
    note: "TODO: Store voluntary crowd reports with abuse controls, expiry windows, and privacy safeguards."
  },
  {
    area: "Government reporting",
    status: "placeholder",
    note: "TODO: Export aggregate pilot reports only after policy, access, and retention rules are approved."
  },
  {
    area: "POS and security systems",
    status: "placeholder",
    note: "TODO: Keep POS, venue security, and surveillance-adjacent integrations disabled until explicitly scoped."
  }
];
