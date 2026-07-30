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
} from "../services/auth";
import { getSupabaseClient } from "../services/supabaseClient";
import { mergeOnSignIn } from "../services/supabaseSync";

export function OAuthSignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const configured = authAvailable();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    getCurrentUser().then(setUser);

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (event === "SIGNED_IN" && nextUser) {
        const err = await mergeOnSignIn();
        setMessage(err ?? "Signed in — local data merged with Supabase.");
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
    const err = await signOut();
    setMessage(err ?? "Signed out.");
    setUser(null);
  }

  if (user) {
    return (
      <div className="oauth-panel">
        <p className="future-note">
          Signed in as <strong>{user.email}</strong>
        </p>
        <button type="button" className="compact-action" onClick={handleSignOut}>
          Sign out
        </button>
        {message && <p className="future-note">{message}</p>}
      </div>
    );
  }

  return (
    <div className="oauth-panel">
      <p className="future-note">Sign in with Google, GitHub, or Facebook when Supabase is configured.</p>
      <div className="profile-actions">
        {OAUTH_PROVIDERS.map(({ id, label }) => {
          const providerReady = configured && isOAuthProviderEnabled(id);
          return (
            <button
              key={id}
              type="button"
              className="compact-action"
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
        <p className="future-note">OAuth unavailable until URL + anon key are set at build time.</p>
      )}
      {message && <p className="future-note">{message}</p>}
    </div>
  );
}

export function AuthCallbackHandler({ onComplete }: { onComplete: () => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    exchangeAuthCallbackCode().then(async (message) => {
      if (message) {
        setError(message);
        return;
      }
      const user = await getCurrentUser();
      if (user) {
        const syncErr = await mergeOnSignIn();
        if (syncErr) {
          setError(syncErr);
          return;
        }
      }
      const returnTo = consumeAuthReturnTo();
      window.history.replaceState({}, "", returnTo);
      onComplete();
    });
  }, [onComplete]);

  if (error) {
    return (
      <div className="screen-content">
        <section className="profile-card">
          <h2>Sign-in failed</h2>
          <p className="future-note">{error}</p>
          <button type="button" className="compact-action" onClick={onComplete}>
            Back to profile
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="screen-content">
      <section className="profile-card">
        <p className="future-note">Signing you in…</p>
      </section>
    </div>
  );
}
