import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { AthleteCheckIn } from "./checkInStore";
import { listCheckIns, mergeCheckIns } from "./checkInStore";
import type { CoachActionLog } from "./actionLogStore";
import { listActionLog, mergeActionLog } from "./actionLogStore";

export type SyncResult = "skipped" | "ok" | "error";

export type SyncMeta = {
  lastSyncedAt: string | null;
  lastError: string | null;
  lastResult: SyncResult | null;
};

const SYNC_META_KEY = "coachcore.syncMeta";

type CheckInRow = {
  id: string;
  athlete_id: string;
  athlete_name: string;
  readiness: string;
  checked_in_at: string;
};

type ActionLogRow = {
  id: string;
  label: string;
  detail: string;
  logged_at: string;
};

export type BetaIntakePayload = {
  name: string;
  email: string;
  organization: string;
  lane: string;
  message: string;
};

export function getSyncMeta(): SyncMeta {
  if (typeof window === "undefined") {
    return { lastSyncedAt: null, lastError: null, lastResult: null };
  }
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
  if (typeof window === "undefined") return;
  const next = { ...getSyncMeta(), ...patch };
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
}

async function currentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function rowToCheckIn(row: CheckInRow): AthleteCheckIn {
  return {
    id: row.id,
    athleteId: row.athlete_id,
    athleteName: row.athlete_name,
    readiness: row.readiness,
    checkedInAt: row.checked_in_at,
  };
}

function rowToActionLog(row: ActionLogRow): CoachActionLog {
  return {
    id: row.id,
    label: row.label,
    detail: row.detail ?? "",
    loggedAt: row.logged_at,
  };
}

export async function upsertCoachProfile(user: User): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Coach";

  const { error } = await supabase.from("coach_profiles").upsert(
    {
      user_id: user.id,
      display_name: displayName,
      role: "coach",
      organization: "",
    },
    { onConflict: "user_id" }
  );

  return error ? "error" : "ok";
}

export async function pushCheckIn(record: AthleteCheckIn): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  if (!(await currentUserId())) return "skipped";

  const { error } = await supabase.from("athlete_check_ins").upsert(
    {
      id: record.id,
      athlete_id: record.athleteId,
      athlete_name: record.athleteName,
      readiness: record.readiness,
      checked_in_at: record.checkedInAt,
    },
    { onConflict: "id" }
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushActionLog(record: CoachActionLog): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  if (!(await currentUserId())) return "skipped";

  const { error } = await supabase.from("coach_action_log").upsert(
    {
      id: record.id,
      label: record.label,
      detail: record.detail,
      logged_at: record.loggedAt,
    },
    { onConflict: "id" }
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushBetaRequest(payload: BetaIntakePayload): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";

  const userId = await currentUserId();
  const { error } = await supabase.from("beta_requests").insert({
    name: payload.name,
    email: payload.email,
    organization: payload.organization,
    lane: payload.lane,
    message: payload.message,
    ...(userId ? { submitted_by: userId } : {}),
  });

  return error ? "error" : "ok";
}

export async function pullCheckIns(): Promise<AthleteCheckIn[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("athlete_check_ins")
    .select("id, athlete_id, athlete_name, readiness, checked_in_at")
    .order("checked_in_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as CheckInRow[]).map(rowToCheckIn);
}

export async function pullActionLog(): Promise<CoachActionLog[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("coach_action_log")
    .select("id, label, detail, logged_at")
    .order("logged_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return (data as ActionLogRow[]).map(rowToActionLog);
}

export async function mergeOnSignIn(user: User): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const profileResult = await upsertCoachProfile(user);
  if (profileResult === "error") {
    const msg = "Coach profile sync failed — check RLS policies.";
    setSyncMeta({ lastResult: "error", lastError: msg });
    return msg;
  }

  try {
    const [remoteCheckIns, remoteActions] = await Promise.all([pullCheckIns(), pullActionLog()]);

    // localStorage wins on id conflicts; add remote-only rows
    mergeCheckIns(remoteCheckIns);
    mergeActionLog(remoteActions);

    const localCheckIns = listCheckIns();
    const localActions = listActionLog();
    const remoteCheckInIds = new Set(remoteCheckIns.map((r) => r.id));
    const remoteActionIds = new Set(remoteActions.map((r) => r.id));

    const pushResults = await Promise.all([
      ...localCheckIns.filter((r) => !remoteCheckInIds.has(r.id)).map((r) => pushCheckIn(r)),
      ...localActions.filter((r) => !remoteActionIds.has(r.id)).map((r) => pushActionLog(r)),
    ]);

    const hadError = pushResults.some((r) => r === "error");
    setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      lastResult: hadError ? "error" : "ok",
      lastError: hadError ? "Some rows failed to push — saved locally." : null,
    });

    return hadError ? "Some local rows could not sync to Supabase." : null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sync merge failed.";
    setSyncMeta({ lastResult: "error", lastError: msg });
    return msg;
  }
}

export async function countRemoteCheckIns(): Promise<number | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  if (!(await currentUserId())) return null;

  const { count, error } = await supabase
    .from("athlete_check_ins")
    .select("*", { count: "exact", head: true });

  return error ? null : count ?? 0;
}

export async function countRemoteActionLog(): Promise<number | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  if (!(await currentUserId())) return null;

  const { count, error } = await supabase
    .from("coach_action_log")
    .select("*", { count: "exact", head: true });

  return error ? null : count ?? 0;
}

export async function getSyncDashboard() {
  const meta = getSyncMeta();
  const uid = await currentUserId();
  const local = {
    checkIns: listCheckIns().length,
    actionLog: listActionLog().length,
  };
  const remote =
    uid !== null
      ? {
          checkIns: await countRemoteCheckIns(),
          actionLog: await countRemoteActionLog(),
        }
      : null;

  return { meta, local, remote, signedIn: uid !== null };
}

export function syncStatusLabel(last: SyncResult | null): string {
  if (last === "ok") return "Last save synced to Supabase.";
  if (last === "error") return "Saved locally; Supabase sync blocked (run schema policies or sign in).";
  if (last === "skipped") return "Local only — Supabase not configured at build time.";
  return "Local-first; sync runs when Supabase is configured.";
}
