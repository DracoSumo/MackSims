import { localGet, localSet } from "@/lib/safeStorage";

export type AthleteCheckIn = {
  id: string;
  athleteId: string;
  athleteName: string;
  readiness: string;
  checkedInAt: string;
};

const STORAGE_KEY = "coachcore.athleteCheckIns";

function parseCheckIns(raw: string | null): AthleteCheckIn[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AthleteCheckIn[]) : [];
  } catch {
    return [];
  }
}

export function listCheckIns(): AthleteCheckIn[] {
  if (typeof window === "undefined") return [];
  return parseCheckIns(localGet(STORAGE_KEY));
}

export function saveCheckIn(input: {
  athleteId: string;
  athleteName: string;
  readiness: string;
}): AthleteCheckIn {
  const record: AthleteCheckIn = {
    id: crypto.randomUUID(),
    athleteId: input.athleteId,
    athleteName: input.athleteName,
    readiness: input.readiness,
    checkedInAt: new Date().toISOString(),
  };

  const existing = listCheckIns();
  localSet(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 30)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) => notifyLocalDataChanged("checkIns"));
  void import("./supabaseSync").then(({ pushCheckIn }) => pushCheckIn(record));
  return record;
}

/** Merge remote rows; local wins when ids collide. */
export function mergeCheckIns(remote: AthleteCheckIn[]): AthleteCheckIn[] {
  const local = listCheckIns();
  const localIds = new Set(local.map((r) => r.id));
  const merged = [...local, ...remote.filter((r) => !localIds.has(r.id))].slice(0, 30);
  localSet(STORAGE_KEY, JSON.stringify(merged));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) => notifyLocalDataChanged("checkIns"));
  return merged;
}

export function formatCheckInTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
