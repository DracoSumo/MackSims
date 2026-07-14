/** Supabase project — connect when anon key is set at build time. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

function isValidAnonKey(key: string): boolean {
  return key.length > 40 && key.startsWith("eyJ") && !key.includes("your-anon-key");
}

export const supabaseProjectRef = SUPABASE_URL
  ? SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")
  : "";

export function supabaseStatusLabel(): string {
  if (SUPABASE_URL && isValidAnonKey(SUPABASE_ANON_KEY)) {
    return `${SUPABASE_URL} — client ready (schema/auth wiring is v0.6)`;
  }
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    return `${SUPABASE_URL} — anon key looks like a placeholder; paste the JWT from Supabase API settings`;
  }
  if (SUPABASE_URL) {
    return `${SUPABASE_URL} — project URL set; add NEXT_PUBLIC_SUPABASE_ANON_KEY to connect`;
  }
  return "Not configured — set NEXT_PUBLIC_SUPABASE_URL and anon key in Netlify env";
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && isValidAnonKey(SUPABASE_ANON_KEY));
