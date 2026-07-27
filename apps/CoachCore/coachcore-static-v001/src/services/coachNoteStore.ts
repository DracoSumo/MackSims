import { localGet, localSet } from "@/lib/safeStorage";
import { logCoachAction } from "./actionLogStore";

export type CoachNote = {
  id: string;
  attachedTo: string;
  noteType: string;
  body: string;
  loggedAt: string;
};

const STORAGE_KEY = "coachcore.coachNotes";

function parse(raw: string | null): CoachNote[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CoachNote[]) : [];
  } catch {
    return [];
  }
}

export function listCoachNotes(): CoachNote[] {
  if (typeof window === "undefined") return [];
  return parse(localGet(STORAGE_KEY));
}

export function saveCoachNote(input: Omit<CoachNote, "id" | "loggedAt">): CoachNote {
  const record: CoachNote = {
    ...input,
    id: crypto.randomUUID(),
    loggedAt: new Date().toISOString(),
  };
  localSet(STORAGE_KEY, JSON.stringify([record, ...listCoachNotes()].slice(0, 40)));
  logCoachAction("Coach note", `${record.noteType} · ${record.attachedTo}`);
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("coachNotes"),
  );
  return record;
}
