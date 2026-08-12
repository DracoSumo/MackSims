import { isSupabaseConfigured } from "../config/backend";
import { getSupabaseClient } from "./supabaseClient";
import type { RiderProfileLocal } from "./profileStore";
import {
  emptyRiderProfile,
  isBlankRiderProfile,
  loadRiderProfile,
  mergeRiderProfileFields,
  resetRiderProfile,
  saveRiderProfileLocal,
} from "./profileStore";
import type { DraftRide } from "../types";

export type SyncResult = "skipped" | "ok" | "error";

export type SyncMeta = {
  lastSyncedAt: string | null;
  lastError: string | null;
  lastResult: SyncResult | null;
};

const SYNC_META_KEY = "motocrew.syncMeta";
const SYNC_OWNER_KEY = "motocrew.syncOwnerUserId";
const DRAFTS_KEY = "motocrew.draftRides";
const JOINED_KEY = "motocrew.joinedRideIds";

export const PROFILE_SYNCED_EVENT = "motocrew:profile-synced";

type RideDraftRow = {
  id: string;
  user_id: string | null;
  name: string;
  meet_location: string;
  route_summary: string;
  estimated_miles: number;
  pace: string;
  difficulty: string;
  created_at: string;
};

type JoinedRideRow = {
  ride_id: string;
  joined_at: string;
};

type RiderProfileRow = {
  user_id: string;
  display_name: string | null;
  riding_style: string | null;
  bike: string | null;
  home_area: string | null;
  experience_level: string | null;
  emergency_contact: string | null;
  garage: RiderProfileLocal["garage"] | null;
};

async function userId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function getSyncMeta(): SyncMeta {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
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
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
}

function loadDraftRides(): DraftRide[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDraftRides(drafts: DraftRide[]): void {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

function loadJoinedRideIds(): string[] {
  try {
    const raw = localStorage.getItem(JOINED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveJoinedRideIds(ids: string[]): void {
  localStorage.setItem(JOINED_KEY, JSON.stringify(ids));
}

function rowToDraftRide(row: RideDraftRow): DraftRide {
  return {
    id: row.id,
    title: row.name,
    meetSpot: row.meet_location,
    routeType: row.difficulty || row.route_summary || "Backroads",
    pace: (row.pace as DraftRide["pace"]) || "Moderate",
    dateTime: new Date(row.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
    visibility: "Pack invite",
    notes: row.route_summary || "",
    savedAt: new Date(row.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
  };
}

function draftToRow(draft: DraftRide, uid: string): Omit<RideDraftRow, "created_at"> & { created_at?: string } {
  return {
    id: draft.id,
    user_id: uid,
    name: draft.title,
    meet_location: draft.meetSpot,
    route_summary: `${draft.routeType} — ${draft.notes}`.trim(),
    estimated_miles: 0,
    pace: draft.pace,
    difficulty: draft.routeType,
  };
}

function rowToRiderProfile(row: RiderProfileRow): RiderProfileLocal {
  const garage = row.garage && typeof row.garage === "object" ? row.garage : emptyRiderProfile().garage;
  return {
    name: row.display_name ?? "",
    ridingStyle: row.riding_style ?? "",
    bike: row.bike ?? "",
    homeArea: row.home_area ?? "",
    experienceLevel: row.experience_level ?? "",
    emergencyContact: row.emergency_contact ?? "",
    garage: {
      year: garage.year ?? "",
      make: garage.make ?? "",
      model: garage.model ?? "",
      setup: garage.setup ?? "",
      range: garage.range ?? "",
    },
  };
}

/** Drop prior account's local sync payload before binding a new uid. */
export function bindSyncOwner(uid: string): boolean {
  const prev = localStorage.getItem(SYNC_OWNER_KEY);
  const switched = Boolean(prev && prev !== uid);
  if (switched) {
    resetRiderProfile();
    saveDraftRides([]);
    saveJoinedRideIds([]);
  }
  localStorage.setItem(SYNC_OWNER_KEY, uid);
  return switched;
}

/** Scrub syncable local state on sign-out so the next account cannot inherit it. */
export function clearLocalSyncStateOnSignOut(): void {
  resetRiderProfile();
  saveDraftRides([]);
  saveJoinedRideIds([]);
  localStorage.removeItem(SYNC_OWNER_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_SYNCED_EVENT));
  }
}

export async function pullRiderProfile(): Promise<RiderProfileLocal | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const uid = await userId();
  if (!uid) return null;

  const { data, error } = await supabase
    .from("rider_profiles")
    .select(
      "user_id, display_name, riding_style, bike, home_area, experience_level, emergency_contact, garage"
    )
    .eq("user_id", uid)
    .maybeSingle();

  if (error || !data) return null;
  return rowToRiderProfile(data as RiderProfileRow);
}

export async function pushRiderProfile(profile: RiderProfileLocal): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("rider_profiles").upsert(
    {
      user_id: uid,
      display_name: profile.name,
      riding_style: profile.ridingStyle,
      bike: profile.bike,
      home_area: profile.homeArea,
      experience_level: profile.experienceLevel,
      emergency_contact: profile.emergencyContact,
      garage: profile.garage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushRideDraft(draft: DraftRide): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("ride_drafts").upsert(draftToRow(draft, uid), { onConflict: "id" });
  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushJoinedRide(rideId: string): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await userId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("joined_rides").upsert(
    { user_id: uid, ride_id: rideId, joined_at: new Date().toISOString() },
    { onConflict: "user_id,ride_id" }
  );

  return error ? "error" : "ok";
}

export async function pullRideDrafts(): Promise<DraftRide[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const uid = await userId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("ride_drafts")
    .select("id, user_id, name, meet_location, route_summary, estimated_miles, pace, difficulty, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data) return [];
  return (data as RideDraftRow[]).map(rowToDraftRide);
}

export async function pullJoinedRides(): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const uid = await userId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("joined_rides")
    .select("ride_id, joined_at")
    .eq("user_id", uid);

  if (error || !data) return [];
  return (data as JoinedRideRow[]).map((r) => r.ride_id);
}

export function mergeDraftRides(remote: DraftRide[]): DraftRide[] {
  const local = loadDraftRides();
  const localIds = new Set(local.map((r) => r.id));
  const merged = [...local, ...remote.filter((r) => !localIds.has(r.id))].slice(0, 8);
  saveDraftRides(merged);
  return merged;
}

export function mergeJoinedRideIds(remote: string[]): string[] {
  const local = loadJoinedRideIds();
  const merged = Array.from(new Set([...local, ...remote]));
  saveJoinedRideIds(merged);
  return merged;
}

/**
 * On sign-in: bind owner (scrub prior account locals), pull remote profile,
 * merge without blanking cloud, then merge drafts/joined.
 */
export async function mergeOnSignIn(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const uid = await userId();
    if (!uid) return null;

    bindSyncOwner(uid);

    const remoteProfile = await pullRiderProfile();
    const localProfile = loadRiderProfile();
    const mergedProfile = mergeRiderProfileFields(localProfile, remoteProfile);
    saveRiderProfileLocal(mergedProfile);

    // Never upsert a blank profile when we could not read remote — that wiped cloud rows
    // on fresh-device sign-in before SELECT policies existed (and still if pull fails).
    const shouldPushProfile =
      !isBlankRiderProfile(mergedProfile) || remoteProfile !== null;
    if (shouldPushProfile) {
      const profileResult = await pushRiderProfile(mergedProfile);
      if (profileResult === "error") {
        const msg = "Rider profile sync failed — check RLS policies.";
        setSyncMeta({ lastResult: "error", lastError: msg });
        return msg;
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(PROFILE_SYNCED_EVENT));
    }

    const [remoteDrafts, remoteJoined] = await Promise.all([pullRideDrafts(), pullJoinedRides()]);
    mergeDraftRides(remoteDrafts);
    mergeJoinedRideIds(remoteJoined);

    const localDrafts = loadDraftRides();
    const remoteDraftIds = new Set(remoteDrafts.map((r) => r.id));
    const pushResults = await Promise.all(
      localDrafts.filter((d) => !remoteDraftIds.has(d.id)).map((d) => pushRideDraft(d))
    );

    const hadError = pushResults.some((r) => r === "error");
    setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      lastResult: hadError ? "error" : "ok",
      lastError: hadError ? "Some drafts failed to push." : null,
    });

    return hadError ? "Some local drafts could not sync." : null;
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
    drafts: loadDraftRides().length,
    joined: loadJoinedRideIds().length,
  };

  let remote: { drafts: number | null; joined: number | null } | null = null;
  if (uid) {
    const client = getSupabaseClient();
    if (client) {
      const [drafts, joined] = await Promise.all([
        client.from("ride_drafts").select("*", { count: "exact", head: true }).eq("user_id", uid),
        client.from("joined_rides").select("*", { count: "exact", head: true }).eq("user_id", uid),
      ]);
      remote = {
        drafts: drafts.error ? null : drafts.count ?? 0,
        joined: joined.error ? null : joined.count ?? 0,
      };
    }
  }

  return { meta, local, remote, signedIn: uid !== null };
}

export function syncStatusLabel(last: SyncResult | null): string {
  if (last === "ok") return "Profile synced to Supabase.";
  if (last === "error") return "Saved locally; sync blocked until RLS policies are applied.";
  if (last === "skipped") return "Local profile only — sign in + Supabase env to sync.";
  return "Local-first rider profile.";
}
