import type { User } from "@supabase/supabase-js";
import { isFacebookAuthEnabled, isSupabaseConfigured } from "../config";
import { getSupabaseClient } from "./supabaseClient";

export type OAuthProvider = "google" | "github" | "facebook";

export const OAUTH_PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
  { id: "facebook", label: "Continue with Facebook" },
];

export function isOAuthProviderEnabled(provider: OAuthProvider): boolean {
  if (provider === "facebook") return isFacebookAuthEnabled;
  return true;
}

const AUTH_RETURN_TO_KEY = "curbcue.auth.returnTo";

export function sanitizeAuthReturnTo(
  value: string | null | undefined,
  fallback = "/settings",
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  try {
    const parsed = new URL(value, "https://curbcue.invalid");
    if (parsed.origin !== "https://curbcue.invalid" || parsed.pathname === "/auth/callback") {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function rememberAuthReturnTo(value?: string): void {
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, sanitizeAuthReturnTo(value, current));
}

export function consumeAuthReturnTo(fallback = "/settings"): string {
  const value = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  return sanitizeAuthReturnTo(value, fallback);
}

export function authAvailable(): boolean {
  return isSupabaseConfigured;
}

export function getAuthCallbackUrl(): string {
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<string | null> {
  if (!isOAuthProviderEnabled(provider)) {
    return "Facebook login is not enabled yet. Complete Meta + Supabase Facebook setup, then set VITE_ENABLE_FACEBOOK_AUTH=true.";
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return "Supabase is not configured. Set VITE_SUPABASE_URL and anon key in Netlify env, then redeploy.";
  }

  rememberAuthReturnTo();
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

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return "Missing OAuth code.";

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error?.message ?? null;
}
