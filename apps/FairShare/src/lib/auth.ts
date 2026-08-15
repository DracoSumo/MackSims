import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../config";
import { getSupabaseClient } from "./supabaseClient";

export type OAuthProvider = "google" | "github";

export function authAvailable(): boolean {
  return isSupabaseConfigured;
}

export function getAuthCallbackUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return "Supabase is not configured. Set VITE_SUPABASE_URL and anon key in Netlify env, then redeploy.";
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

/**
 * Complete the OAuth redirect. Prefer an already-established session (idempotent
 * remount / accidental double-call). Otherwise exchange the one-time `code`.
 * Returns an error message, or null on success.
 */
export async function exchangeAuthCallbackCode(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return "Supabase is not configured.";

  const existing = await supabase.auth.getSession();
  if (existing.data.session) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return "Missing OAuth code.";

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Race: another caller may have finished the exchange between getSession and here.
    const retry = await supabase.auth.getSession();
    if (retry.data.session) return null;
    return error.message;
  }
  return null;
}
