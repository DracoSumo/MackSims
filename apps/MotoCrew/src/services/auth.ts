import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../config/backend";
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

export async function getCurrentUser(timeoutMs = 2000): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const result = await Promise.race([
      supabase.auth.getUser().then(({ data }) => data.user ?? null),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
    return result;
  } catch {
    return null;
  }
}

export async function exchangeAuthCallbackCode(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return "Supabase is not configured.";

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return "Missing OAuth code.";

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error?.message ?? null;
}
