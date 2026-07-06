import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../config";
import { getSupabaseClient } from "./supabaseClient";
import type { CrowdPoll, SavedComparison, UserSettings } from "./storage";
import {
  loadCrowdPolls,
  loadSavedComparisons,
  loadUserSettings,
  mergeCrowdPolls,
  mergeSavedComparisons,
} from "./storage";

export type SyncResult = "skipped" | "ok" | "error";

export type SyncMeta = {
  lastSyncedAt: string | null;
  lastError: string | null;
  lastResult: SyncResult | null;
};

const SYNC_META_KEY = "fairshare.syncMeta";

type SavedComparisonRow = {
  id: string;
  user_id: string | null;
  label: string;
  pickup: string;
  dropoff: string;
  zone_id: string;
  estimate_id: string;
  saved_at: string;
};

type CrowdPollRow = {
  id: string;
  user_id: string | null;
  location_name: string;
  level: "Low" | "Medium" | "High";
  note: string;
  submitted_at: string;
};

async function userId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function getSyncMeta(): SyncMeta {
  try {
    const raw = window.localStorage.getItem(SYNC_META_KEY);
    if (!raw) return { lastSyncedAt: null, lastError: null, lastResult: null };
    const parsed = JSON.parse(raw) as Partial<SyncMeta>;
    return {
      lastSyncedAt: parsed.lastSyncedAt ?? null,
      lastError: parsed.lastError ?? null,
      lastResult: parsed.lastResult ?? null,
    };
  } catch {
    return { lastSyncedAt: null, lastError: null, lastResult: null };
  }
}

function setSyncMeta(patch: Partial<SyncMeta>): void {
  const next = { ...getSyncMeta(), ...patch };
  try {
    window.localStorage.setItem(SYNC_META_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
}

function rowToSavedComparison(row: SavedComparisonRow): SavedComparison {
  return {
    id: row.id,
    label: row.label,
    pickup: row.pickup,
    dropoff: row.dropoff,
    zoneId: row.zone_id,
    estimateId: row.estimate_id,
    savedAt: new Date(row.saved_at).getTime(),
  };
}

function rowToCrowdPoll(row: CrowdPollRow): CrowdPoll {
  return {
    id: row.id,
    locationName: row.location_name,
    level: row.level,
    note: row.note ?? "",
    submittedAt: new Date(row.submitted_at).getTime(),
  };
}

export async function pushSavedComparison(record: SavedComparison): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("saved_comparisons").upsert(
    {
      id: record.id,
      user_id: uid,
      label: record.label,
      pickup: record.pickup,
      dropoff: record.dropoff,
      zone_id: record.zoneId,
      estimate_id: record.estimateId,
      saved_at: new Date(record.savedAt).toISOString(),
    },
    { onConflict: "id" }
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushCrowdPoll(record: CrowdPoll): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();

  const { error } = await supabase.from("crowd_polls").upsert(
    {
      id: record.id,
      user_id: uid,
      location_name: record.locationName,
      level: record.level,
      note: record.note,
      submitted_at: new Date(record.submittedAt).toISOString(),
    },
    { onConflict: "id" }
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushUserProfile(settings: UserSettings): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: uid,
      display_name: settings.name,
      role: settings.role,
      home_market_id: settings.homeMarketId,
    },
    { onConflict: "user_id" }
  );

  return error ? "error" : "ok";
}

export async function pullSavedComparisons(): Promise<SavedComparison[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const uid = await userId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("saved_comparisons")
    .select("id, user_id, label, pickup, dropoff, zone_id, estimate_id, saved_at")
    .eq("user_id", uid)
    .order("saved_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return (data as SavedComparisonRow[]).map(rowToSavedComparison);
}

export async function pullCrowdPolls(): Promise<CrowdPoll[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const uid = await userId();

  let query = supabase
    .from("crowd_polls")
    .select("id, user_id, location_name, level, note, submitted_at")
    .order("submitted_at", { ascending: false })
    .limit(30);

  if (uid) {
    query = query.or(`user_id.eq.${uid},user_id.is.null`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as CrowdPollRow[]).map(rowToCrowdPoll);
}

export async function mergeOnSignIn(user: User): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const settings = loadUserSettings();
    const profileResult = await pushUserProfile(settings);
    if (profileResult === "error") {
      const msg = "Profile sync failed — check RLS policies.";
      setSyncMeta({ lastResult: "error", lastError: msg });
      return msg;
    }

    const [remoteComparisons, remotePolls] = await Promise.all([
      pullSavedComparisons(),
      pullCrowdPolls(),
    ]);

    mergeSavedComparisons(remoteComparisons);
    mergeCrowdPolls(remotePolls);

    const localComparisons = loadSavedComparisons();
    const remoteComparisonIds = new Set(remoteComparisons.map((r) => r.id));

    const pushResults = await Promise.all(
      localComparisons
        .filter((r) => !remoteComparisonIds.has(r.id))
        .map((r) => pushSavedComparison(r))
    );

    const hadError = pushResults.some((r) => r === "error");
    setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      lastResult: hadError ? "error" : "ok",
      lastError: hadError ? "Some comparisons failed to push." : null,
    });

    return hadError ? "Some local comparisons could not sync." : null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sync merge failed.";
    setSyncMeta({ lastResult: "error", lastError: msg });
    return msg;
  }
}

export async function getSyncDashboard() {
  const meta = getSyncMeta();
  const uid = await userId();
  const local = {
    comparisons: loadSavedComparisons().length,
    polls: loadCrowdPolls().length,
  };

  let remote: { comparisons: number | null; polls: number | null } | null = null;
  if (uid) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const [cmp, poll] = await Promise.all([
        supabase.from("saved_comparisons").select("*", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("crowd_polls").select("*", { count: "exact", head: true }),
      ]);
      remote = {
        comparisons: cmp.error ? null : cmp.count ?? 0,
        polls: poll.error ? null : poll.count ?? 0,
      };
    }
  }

  return { meta, local, remote, signedIn: uid !== null };
}

export function syncStatusLabel(last: SyncResult | null): string {
  if (last === "ok") return "Synced to Supabase.";
  if (last === "error") return "Saved locally; Supabase sync needs schema policies or sign-in.";
  if (last === "skipped") return "Local only until Supabase env is set at build time.";
  return "Local-first with optional Supabase sync.";
}
