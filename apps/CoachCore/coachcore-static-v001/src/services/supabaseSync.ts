import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { CoachActionLog } from "./actionLogStore";
import { listActionLog, mergeActionLog } from "./actionLogStore";
import type { AssignmentRecord } from "./assignmentStore";
import { listAssignmentRecords, mergeAssignmentRecords } from "./assignmentStore";
import type { RosterAthlete } from "./athleteRosterStore";
import { listRosterAthletes, mergeRosterAthletes } from "./athleteRosterStore";
import type { AthleteCheckIn } from "./checkInStore";
import { listCheckIns, mergeCheckIns } from "./checkInStore";
import type { CoachNote } from "./coachNoteStore";
import { listCoachNotes, mergeCoachNotes } from "./coachNoteStore";
import type { MealLog } from "./mealLogStore";
import { listMealLogs, mergeMealLogs } from "./mealLogStore";

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

type RosterRow = {
  id: string;
  name: string;
  role: string;
  status: string;
  last_active: string;
  film: string;
  workouts: string;
  meals: string;
  readiness: string;
  note: string;
};

type AssignmentRow = {
  id: string;
  title: string;
  kind: string;
  status: string;
  assignee: string;
  updated_at: string;
};

type MealLogRow = {
  id: string;
  meal_type: string;
  hydration: string;
  notes: string;
  athlete_id: string | null;
  athlete_name: string | null;
  logged_at: string;
};

type CoachNoteRow = {
  id: string;
  attached_to: string;
  note_type: string;
  body: string;
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

function rowToRoster(row: RosterRow): RosterAthlete {
  return {
    id: row.id,
    name: row.name,
    role: row.role || "Athlete",
    status: row.status || "Needs nudge",
    lastActive: row.last_active || "Not yet",
    film: row.film || "—",
    workouts: row.workouts || "—",
    meals: row.meals || "—",
    readiness: row.readiness || "—",
    note: row.note || "",
  };
}

function rowToAssignment(row: AssignmentRow): AssignmentRecord {
  return {
    id: row.id,
    title: row.title || row.id,
    kind: (row.kind as AssignmentRecord["kind"]) || "other",
    status: (row.status as AssignmentRecord["status"]) || "Assigned",
    assignee: row.assignee || undefined,
    updatedAt: row.updated_at,
  };
}

function rowToMealLog(row: MealLogRow): MealLog {
  return {
    id: row.id,
    mealType: row.meal_type,
    hydration: row.hydration ?? "",
    notes: row.notes ?? "",
    athleteId: row.athlete_id ?? undefined,
    athleteName: row.athlete_name ?? undefined,
    loggedAt: row.logged_at,
  };
}

function rowToCoachNote(row: CoachNoteRow): CoachNote {
  return {
    id: row.id,
    attachedTo: row.attached_to,
    noteType: row.note_type,
    body: row.body ?? "",
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
  if (!(await currentUserId())) return "skipped";

  const { error } = await supabase.from("beta_requests").insert({
    name: payload.name,
    email: payload.email,
    organization: payload.organization,
    lane: payload.lane,
    message: payload.message,
  });

  return error ? "error" : "ok";
}

export async function pushRosterAthlete(record: RosterAthlete): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("athlete_roster").upsert(
    {
      id: record.id,
      name: record.name,
      role: record.role,
      status: record.status,
      last_active: record.lastActive,
      film: record.film,
      workouts: record.workouts,
      meals: record.meals,
      readiness: record.readiness,
      note: record.note,
      owner_user_id: uid,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushRosterAthletes(records: RosterAthlete[]): Promise<SyncResult> {
  if (records.length === 0) return "skipped";
  const results = await Promise.all(records.map((row) => pushRosterAthlete(row)));
  if (results.every((r) => r === "skipped")) return "skipped";
  return results.some((r) => r === "error") ? "error" : "ok";
}

export async function deleteRosterAthleteRemote(id: string): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  if (!(await currentUserId())) return "skipped";

  const { error } = await supabase.from("athlete_roster").delete().eq("id", id);
  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushAssignment(record: AssignmentRecord): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("assignments").upsert(
    {
      id: record.id,
      title: record.title,
      kind: record.kind,
      status: record.status,
      assignee: record.assignee ?? "",
      updated_at: record.updatedAt,
      owner_user_id: uid,
    },
    { onConflict: "id" },
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushMealLog(record: MealLog): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("meal_logs").upsert(
    {
      id: record.id,
      meal_type: record.mealType,
      hydration: record.hydration,
      notes: record.notes,
      athlete_id: record.athleteId ?? null,
      athlete_name: record.athleteName ?? null,
      logged_at: record.loggedAt,
      owner_user_id: uid,
    },
    { onConflict: "id" },
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
}

export async function pushCoachNote(record: CoachNote): Promise<SyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("coach_notes").upsert(
    {
      id: record.id,
      attached_to: record.attachedTo,
      note_type: record.noteType,
      body: record.body,
      logged_at: record.loggedAt,
      owner_user_id: uid,
    },
    { onConflict: "id" },
  );

  const result = error ? "error" : "ok";
  setSyncMeta({ lastResult: result, lastError: error?.message ?? null });
  return result;
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

export async function pullRoster(): Promise<RosterAthlete[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("athlete_roster")
    .select("id, name, role, status, last_active, film, workouts, meals, readiness, note")
    .order("updated_at", { ascending: false })
    .limit(120);

  if (error || !data) return [];
  return (data as RosterRow[]).map(rowToRoster);
}

export async function pullAssignments(): Promise<AssignmentRecord[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("assignments")
    .select("id, title, kind, status, assignee, updated_at")
    .order("updated_at", { ascending: false })
    .limit(80);

  if (error || !data) return [];
  return (data as AssignmentRow[]).map(rowToAssignment);
}

export async function pullMealLogs(): Promise<MealLog[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("meal_logs")
    .select("id, meal_type, hydration, notes, athlete_id, athlete_name, logged_at")
    .order("logged_at", { ascending: false })
    .limit(40);

  if (error || !data) return [];
  return (data as MealLogRow[]).map(rowToMealLog);
}

export async function pullCoachNotes(): Promise<CoachNote[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  if (!(await currentUserId())) return [];

  const { data, error } = await supabase
    .from("coach_notes")
    .select("id, attached_to, note_type, body, logged_at")
    .order("logged_at", { ascending: false })
    .limit(40);

  if (error || !data) return [];
  return (data as CoachNoteRow[]).map(rowToCoachNote);
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
    const [
      remoteCheckIns,
      remoteActions,
      remoteRoster,
      remoteAssignments,
      remoteMeals,
      remoteNotes,
    ] = await Promise.all([
      pullCheckIns(),
      pullActionLog(),
      pullRoster(),
      pullAssignments(),
      pullMealLogs(),
      pullCoachNotes(),
    ]);

    // localStorage wins on id conflicts; add remote-only rows
    mergeCheckIns(remoteCheckIns);
    mergeActionLog(remoteActions);
    mergeRosterAthletes(remoteRoster);
    mergeAssignmentRecords(remoteAssignments);
    mergeMealLogs(remoteMeals);
    mergeCoachNotes(remoteNotes);

    const localCheckIns = listCheckIns();
    const localActions = listActionLog();
    const localRoster = listRosterAthletes();
    const localAssignments = listAssignmentRecords();
    const localMeals = listMealLogs();
    const localNotes = listCoachNotes();

    const remoteCheckInIds = new Set(remoteCheckIns.map((r) => r.id));
    const remoteActionIds = new Set(remoteActions.map((r) => r.id));
    const remoteRosterIds = new Set(remoteRoster.map((r) => r.id));
    const remoteAssignmentIds = new Set(remoteAssignments.map((r) => r.id));
    const remoteMealIds = new Set(remoteMeals.map((r) => r.id));
    const remoteNoteIds = new Set(remoteNotes.map((r) => r.id));

    const pushResults = await Promise.all([
      ...localCheckIns.filter((r) => !remoteCheckInIds.has(r.id)).map((r) => pushCheckIn(r)),
      ...localActions.filter((r) => !remoteActionIds.has(r.id)).map((r) => pushActionLog(r)),
      ...localRoster.filter((r) => !remoteRosterIds.has(r.id)).map((r) => pushRosterAthlete(r)),
      ...localAssignments.filter((r) => !remoteAssignmentIds.has(r.id)).map((r) => pushAssignment(r)),
      ...localMeals.filter((r) => !remoteMealIds.has(r.id)).map((r) => pushMealLog(r)),
      ...localNotes.filter((r) => !remoteNoteIds.has(r.id)).map((r) => pushCoachNote(r)),
    ]);

    const hadError = pushResults.some((r) => r === "error");
    setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      lastResult: hadError ? "error" : "ok",
      lastError: hadError
        ? "Some rows failed to push — apply v0.7.4 roster sync migration, or saved locally."
        : null,
    });

    return hadError
      ? "Some local rows could not sync — apply the coach-scoped roster migration if tables are missing."
      : null;
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

async function countRemoteTable(table: string): Promise<number | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  if (!(await currentUserId())) return null;

  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  return error ? null : count ?? 0;
}

export async function getSyncDashboard() {
  const meta = getSyncMeta();
  const uid = await currentUserId();
  const local = {
    checkIns: listCheckIns().length,
    actionLog: listActionLog().length,
    roster: listRosterAthletes().length,
    assignments: listAssignmentRecords().length,
    mealLogs: listMealLogs().length,
    coachNotes: listCoachNotes().length,
  };
  const remote =
    uid !== null
      ? {
          checkIns: await countRemoteCheckIns(),
          actionLog: await countRemoteActionLog(),
          roster: await countRemoteTable("athlete_roster"),
          assignments: await countRemoteTable("assignments"),
          mealLogs: await countRemoteTable("meal_logs"),
          coachNotes: await countRemoteTable("coach_notes"),
        }
      : null;

  return { meta, local, remote, signedIn: uid !== null };
}

export function syncStatusLabel(last: SyncResult | null): string {
  if (last === "ok") return "Last save synced to Supabase.";
  if (last === "error") {
    return "Saved locally; Supabase sync blocked (apply v0.7.4 migration, check RLS, or sign in).";
  }
  if (last === "skipped") return "Local only — Supabase not configured at build time.";
  return "Local-first; roster, assignments, meals, and notes sync when signed in.";
}
