"use client";

import { useState } from "react";
import {
  authAvailable,
  isOAuthProviderEnabled,
  OAUTH_PROVIDERS,
  signInWithOAuth,
  type OAuthProvider,
} from "@/lib/auth";

export function OAuthButtons({ className = "" }: { className?: string }) {
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const configured = authAvailable();

  async function handleSignIn(provider: OAuthProvider) {
    if (!isOAuthProviderEnabled(provider)) return;
    setBusy(provider);
    setError(null);
    const message = await signInWithOAuth(provider);
    if (message) {
      setError(message);
      setBusy(null);
    }
  }

  return (
    <div className={className}>
      <div className="grid gap-3">
        {OAUTH_PROVIDERS.map(({ id, label }) => {
          const providerReady = configured && isOAuthProviderEnabled(id);
          return (
            <button
              key={id}
              type="button"
              disabled={!providerReady || busy !== null}
              title={
                !configured
                  ? "Supabase not configured — set env vars and redeploy"
                  : !isOAuthProviderEnabled(id)
                    ? "Facebook login pending Meta + Supabase setup"
                    : `Sign in with ${id}`
              }
              onClick={() => handleSignIn(id)}
              className={
                providerReady
                  ? "rounded-2xl border border-white/15 px-5 py-3 font-bold text-white transition hover:border-sky-300/50 hover:bg-white/5 disabled:opacity-60"
                  : "cursor-not-allowed rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-500"
              }
            >
              {busy === id
                ? "Redirecting…"
                : !isOAuthProviderEnabled(id)
                  ? `${label} (coming soon)`
                  : label}
            </button>
          );
        })}
      </div>
      {!configured && (
        <p className="mt-3 text-xs text-slate-500">
          OAuth needs Supabase URL + anon key at build time. Demo dashboard still works below.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
