import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "../config/backend";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    // detectSessionInUrl must stay false: AuthCallbackHandler owns the one-shot
    // exchangeCodeForSession. Leaving auto-detect on consumes the PKCE code first,
    // then the callback's second exchange fails with "PKCE code verifier not found".
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { flowType: "pkce", detectSessionInUrl: false },
    });
  }
  return client;
}

export async function checkSupabaseConnection(): Promise<{
  state: "connected" | "error";
  detail: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      state: "error",
      detail: SUPABASE_URL
        ? "Anon key missing or placeholder at build time — set a real JWT in Netlify env and redeploy."
        : "URL or anon key not set at build time.",
    };
  }

  const { error } = await supabase.auth.getSession();
  if (error) {
    return { state: "error", detail: error.message };
  }

  return {
    state: "connected",
    detail: `Reachable at ${SUPABASE_URL} (auth endpoint OK).`,
  };
}
