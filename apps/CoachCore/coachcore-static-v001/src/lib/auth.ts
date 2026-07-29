import type { User } from "@supabase/supabase-js";
import { isFacebookAuthEnabled, isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";

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

const AUTH_RETURN_TO_KEY = "coachcore.auth.returnTo";

export function sanitizeAuthReturnTo(value: string | null | undefined, fallback = "/app/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  try {
    const parsed = new URL(value, "https://coachcore.invalid");
    if (parsed.origin !== "https://coachcore.invalid" || parsed.pathname.startsWith("/auth/callback")) {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function rememberAuthReturnTo(value?: string): void {
  if (typeof window === "undefined") return;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const fallback = current.startsWith("/login") || current.startsWith("/signup") ? "/app/" : current;
  window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, sanitizeAuthReturnTo(value, fallback));
}

export function consumeAuthReturnTo(fallback = "/app/"): string {
  if (typeof window === "undefined") return fallback;
  const value = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  return sanitizeAuthReturnTo(value, fallback);
}

export function authAvailable(): boolean {
  return isSupabaseConfigured;
}

export function getAuthCallbackUrl(): string {
  if (typeof window === "undefined") return "/auth/callback/";
  return `${window.location.origin}/auth/callback/`;
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<string | null> {
  if (!isOAuthProviderEnabled(provider)) {
    return "Facebook login is not enabled yet. Complete Meta + Supabase Facebook setup, then set NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH=true.";
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and anon key in Netlify env, then redeploy.";
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
