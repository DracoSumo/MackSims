import { localGet, localSet } from "@/lib/safeStorage";

export type CoachActionLog = {
  id: string;
  label: string;
  detail: string;
  loggedAt: string;
};

const STORAGE_KEY = "coachcore.actionLog";

function parseActionLog(raw: string | null): CoachActionLog[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CoachActionLog[]) : [];
  } catch {
    return [];
  }
}

export function listActionLog(): CoachActionLog[] {
  if (typeof window === "undefined") return [];
  return parseActionLog(localGet(STORAGE_KEY));
}

export function logCoachAction(label: string, detail = ""): CoachActionLog {
  const record: CoachActionLog = {
    id: crypto.randomUUID(),
    label,
    detail,
    loggedAt: new Date().toISOString(),
  };
  const existing = listActionLog();
  localSet(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 40)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) => notifyLocalDataChanged("actionLog"));
  void import("./supabaseSync").then(({ pushActionLog }) => pushActionLog(record));
  return record;
}

/** Merge remote rows; local wins when ids collide. */
export function mergeActionLog(remote: CoachActionLog[]): CoachActionLog[] {
  const local = listActionLog();
  const localIds = new Set(local.map((r) => r.id));
  const merged = [...local, ...remote.filter((r) => !localIds.has(r.id))].slice(0, 40);
  localSet(STORAGE_KEY, JSON.stringify(merged));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) => notifyLocalDataChanged("actionLog"));
  return merged;
}

export function formatActionTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
