"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authAvailable, getCurrentUser, signOut } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { listCheckIns } from "@/services/checkInStore";
import { listActionLog } from "@/services/actionLogStore";
import { countRemoteCheckIns, countRemoteActionLog, getSyncMeta, mergeOnSignIn } from "@/services/supabaseSync";

export function ProfileAuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [remoteCheckIns, setRemoteCheckIns] = useState<number | null>(null);
  const [remoteActions, setRemoteActions] = useState<number | null>(null);
  const configured = authAvailable();
  const [localCheckIns, setLocalCheckIns] = useState(0);
  const [localActions, setLocalActions] = useState(0);
  const syncMeta = getSyncMeta();

  function refreshLocalCounts() {
    setLocalCheckIns(listCheckIns().length);
    setLocalActions(listActionLog().length);
  }

  useEffect(() => {
    refreshLocalCounts();
  }, [user]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    getCurrentUser().then(setUser);

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (event === "SIGNED_IN" && nextUser) {
        const err = await mergeOnSignIn(nextUser);
        refreshLocalCounts();
        setMessage(err ?? "Signed in — local data merged with Supabase.");
        countRemoteCheckIns().then(setRemoteCheckIns);
        countRemoteActionLog().then(setRemoteActions);
      }
      if (event === "SIGNED_OUT") {
        setRemoteCheckIns(null);
        setRemoteActions(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRemoteCheckIns(null);
      setRemoteActions(null);
      return;
    }
    countRemoteCheckIns().then(setRemoteCheckIns);
    countRemoteActionLog().then(setRemoteActions);
  }, [user]);

  async function handleSignOut() {
    const err = await signOut();
    setMessage(err ?? "Signed out.");
  }

  if (!configured) {
    return (
      <p className="text-sm text-slate-400">
        Supabase auth not configured — profile stays in demo mode.
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-slate-400">
        Not signed in. Use{" "}
        <a href="/login" className="font-bold text-sky-300">
          login
        </a>{" "}
        for Google or GitHub OAuth. Local check-ins: {localCheckIns} · actions: {localActions}.
      </p>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <p>
        Signed in as <strong className="text-white">{user.email}</strong>
      </p>
      <p className="text-xs text-slate-500">
        Check-ins — local: {localCheckIns}
        {remoteCheckIns !== null ? ` · Supabase: ${remoteCheckIns}` : ""}
      </p>
      <p className="text-xs text-slate-500">
        Action log — local: {localActions}
        {remoteActions !== null ? ` · Supabase: ${remoteActions}` : ""}
      </p>
      {syncMeta.lastSyncedAt && (
        <p className="text-xs text-slate-500">
          Last sync: {new Date(syncMeta.lastSyncedAt).toLocaleString()}
        </p>
      )}
      {syncMeta.lastError && <p className="text-xs text-amber-300">{syncMeta.lastError}</p>}
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-xl border border-white/15 px-4 py-2 font-semibold text-slate-200 hover:bg-white/5"
      >
        Sign out
      </button>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
