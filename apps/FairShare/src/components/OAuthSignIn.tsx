import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  authAvailable,
  consumeAuthReturnTo,
  exchangeAuthCallbackCode,
  getCurrentUser,
  isOAuthProviderEnabled,
  OAUTH_PROVIDERS,
  signInWithOAuth,
  signOut,
  type OAuthProvider,
} from "../lib/auth";
import { getSupabaseClient } from "../lib/supabaseClient";
import { mergeOnSignIn } from "../lib/supabaseSync";

export function OAuthSignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const configured = authAvailable();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    getCurrentUser().then(setUser);

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (event === "SIGNED_IN" && nextUser) {
        const err = await mergeOnSignIn(nextUser);
        setSyncNote(err ?? "Local data merged with Supabase.");
        window.dispatchEvent(new Event("fairshare:auth-changed"));
      }
      if (event === "SIGNED_OUT") {
        setSyncNote(null);
        window.dispatchEvent(new Event("fairshare:auth-changed"));
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignIn(provider: OAuthProvider) {
    if (!isOAuthProviderEnabled(provider)) return;
    setBusy(provider);
    setMessage(null);
    const err = await signInWithOAuth(provider);
    if (err) {
      setMessage(err);
      setBusy(null);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const err = await signOut();
      setMessage(err ?? "Signed out.");
      if (!err) setUser(null);
    } finally {
      setSigningOut(false);
    }
  }

  if (user) {
    return (
      <div className="oauth-panel">
        <p className="muted">
          Signed in as <strong>{user.email}</strong>
        </p>
        <button type="button" className="text-button" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
        {syncNote && <p className="muted">{syncNote}</p>}
        {message && <p className="muted">{message}</p>}
      </div>
    );
  }

  return (
    <div className="oauth-panel">
      <p className="subtle-copy">Sign in with Google, GitHub, or Facebook when Supabase is configured.</p>
      <div className="oauth-actions">
        {OAUTH_PROVIDERS.map(({ id, label }) => {
          const providerReady = configured && isOAuthProviderEnabled(id);
          return (
            <button
              key={id}
              type="button"
              className="primary-action"
              disabled={!providerReady || busy !== null}
              title={
                !configured
                  ? "Supabase not configured"
                  : !isOAuthProviderEnabled(id)
                    ? "Facebook login pending Meta + Supabase setup"
                    : label
              }
              onClick={() => handleSignIn(id)}
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
        <p className="muted">OAuth unavailable until URL + anon key are set at build time.</p>
      )}
      {message && <p className="muted">{message}</p>}
    </div>
  );
}

export function AuthCallbackScreen({ onDone }: { onDone: (path: string) => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    exchangeAuthCallbackCode().then(async (message) => {
      if (message) {
        setError(message);
        return;
      }
      const { getCurrentUser } = await import("../lib/auth");
      const user = await getCurrentUser();
      if (user) {
        const { mergeOnSignIn } = await import("../lib/supabaseSync");
        const syncErr = await mergeOnSignIn(user);
        if (syncErr) {
          setError(syncErr);
          return;
        }
      }
      onDone(consumeAuthReturnTo());
    });
  }, [onDone]);

  if (error) {
    return (
      <div className="page-stack">
        <section className="panel">
          <h1>Sign-in failed</h1>
          <p className="muted">{error}</p>
          <button type="button" className="text-button" onClick={() => onDone("/settings")}>
            Back to settings
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="muted">Signing you in…</p>
      </section>
    </div>
  );
}
