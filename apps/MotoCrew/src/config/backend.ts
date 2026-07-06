/** Supabase project — connect when anon key is set at build time. */
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

export function supabaseStatusLabel(): string {
  if (SUPABASE_URL && isValidAnonKey(SUPABASE_ANON_KEY)) {
    return `${SUPABASE_URL} — connected (OAuth + ride drafts/joins sync when signed in)`;
  }
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    return `${SUPABASE_URL} — anon key looks like a placeholder; paste the JWT from Supabase API settings`;
  }
  if (SUPABASE_URL) {
    return `${SUPABASE_URL} — project URL set; add VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY`;
  }
  return "Not configured — set VITE_SUPABASE_URL and anon key in Netlify env";
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && isValidAnonKey(SUPABASE_ANON_KEY));
