"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { authAvailable, getCurrentUser, signOut } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { listActionLog } from "@/services/actionLogStore";
import { listCheckIns } from "@/services/checkInStore";
import { listRosterAthletes } from "@/services/athleteRosterStore";
import {
  clearSyncSessionState,
  getSyncDashboard,
  getSyncMeta,
  mergeOnSignIn,
  syncNow,
} from "@/services/supabaseSync";

export function ProfileAuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [localCheckIns, setLocalCheckIns] = useState(0);
  const [localActions, setLocalActions] = useState(0);
  const [localRoster, setLocalRoster] = useState(0);
  const [remoteRoster, setRemoteRoster] = useState<number | null>(null);
  const [teamLabel, setTeamLabel] = useState<string | null>(null);
  const configured = authAvailable();
  const syncMeta = getSyncMeta();

  function refreshLocalCounts() {
    setLocalCheckIns(listCheckIns().length);
    setLocalActions(listActionLog().length);
    setLocalRoster(listRosterAthletes().length);
  }

  async function refreshDashboard() {
    const dash = await getSyncDashboard();
    setRemoteRoster(dash.remote?.roster ?? null);
    setTeamLabel(
      dash.team ? `Primary team · ${dash.team.teamId.slice(0, 8)}…` : "No team context yet",
    );
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
        await refreshDashboard();
        setMessage(err ?? "Signed in — local data merged with Supabase.");
      }
      if (event === "SIGNED_OUT") {
        clearSyncSessionState();
        setRemoteRoster(null);
        setTeamLabel(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRemoteRoster(null);
      setTeamLabel(null);
      return;
    }
    void refreshDashboard();
  }, [user]);

  async function handleSignOut() {
    const err = await signOut();
    clearSyncSessionState();
    setMessage(err ?? "Signed out.");
  }

  async function handleSyncNow() {
    setSyncing(true);
    const err = await syncNow();
    refreshLocalCounts();
    await refreshDashboard();
    setMessage(err ?? "Sync complete.");
    setSyncing(false);
  }

  if (!configured) {
    return (
      <p className="text-sm text-slate-400">
        Supabase auth not configured — local profile and check-ins stay on this device.
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
        for Google or GitHub OAuth. Local roster: {localRoster} · check-ins: {localCheckIns} · actions:{" "}
        {localActions}.
      </p>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <p>
        Signed in as <strong className="text-white">{user.email}</strong>
      </p>
      <p className="text-xs text-slate-500">
        Roster — local: {localRoster}
        {remoteRoster !== null ? ` · Supabase: ${remoteRoster}` : ""}
      </p>
      <p className="text-xs text-slate-500">
        Check-ins — local: {localCheckIns} · Action log — local: {localActions}
      </p>
      {teamLabel && <p className="text-xs text-slate-500">{teamLabel}</p>}
      {syncMeta.lastSyncedAt && (
        <p className="text-xs text-slate-500">
          Last sync: {new Date(syncMeta.lastSyncedAt).toLocaleString()}
        </p>
      )}
      {syncMeta.lastError && <p className="text-xs text-amber-300">{syncMeta.lastError}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={handleSyncNow}
          disabled={syncing}
          className="rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-60"
        >
          {syncing ? "Syncing…" : "Sync now"}
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-xl border border-white/15 px-4 py-2 font-semibold text-slate-200 hover:bg-white/5"
        >
          Sign out
        </button>
      </div>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
