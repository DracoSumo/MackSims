import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  authAvailable,
  exchangeAuthCallbackCode,
  getCurrentUser,
  signInWithOAuth,
  signOut,
  type OAuthProvider,
} from "../services/auth";
import { getSupabaseClient } from "../services/supabaseClient";
import { mergeOnSignIn } from "../services/supabaseSync";

const providers: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
];

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
      <p className="future-note">Sign in with Google or GitHub when Supabase is configured.</p>
      <div className="profile-actions">
        {providers.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="compact-action"
            disabled={!configured || busy !== null}
            title={configured ? label : "Supabase not configured"}
            onClick={() => handleSignIn(id)}
          >
            {busy === id ? "Redirecting…" : label}
          </button>
        ))}
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
      window.history.replaceState({}, "", "/");
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
