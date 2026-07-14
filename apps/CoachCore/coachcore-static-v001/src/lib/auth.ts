import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";

export type OAuthProvider = "google" | "github";
const authCallbackPath = "/auth/callback";

export function authAvailable(): boolean {
  return isSupabaseConfigured;
}

export function getAuthCallbackUrl(): string {
  if (typeof window === "undefined") return authCallbackPath;
  return new URL(authCallbackPath, window.location.origin).toString();
}

export function getOAuthCallbackParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  hashParams.forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });
  return params;
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and anon key in Netlify env, then redeploy.";
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: getAuthCallbackUrl() },
  });

  return error?.message ?? null;
}

export async function signOut(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { error } = await supabase.auth.signOut();
  return error?.message ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function exchangeAuthCallbackCode(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return "Supabase is not configured.";

  const params = getOAuthCallbackParams();
  const providerError = params.get("error_description") ?? params.get("error");
  if (providerError) return providerError;

  const code = params.get("code");
  if (!code) {
    const { data, error } = await supabase.auth.getSession();
    if (error) return error.message;
    if (data.session) return null;
    return `Missing OAuth code. Confirm Supabase allows ${getAuthCallbackUrl()} as a redirect URL.`;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error?.message ?? null;
}
