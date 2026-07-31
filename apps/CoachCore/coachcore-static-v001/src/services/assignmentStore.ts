import { localGet, localSet } from "@/lib/safeStorage";
import { logCoachAction } from "./actionLogStore";

export type AssignmentStatus = "Assigned" | "In progress" | "Complete" | "Needs nudge";
export type AssignmentKind = "film" | "training" | "fueling" | "playbook" | "other";

export type AssignmentRecord = {
  id: string;
  title: string;
  kind: AssignmentKind;
  status: AssignmentStatus;
  assignee?: string;
  updatedAt: string;
};

const STORAGE_KEY = "coachcore.assignmentStatus";
const RECORDS_KEY = "coachcore.assignmentRecords";

function parseStatuses(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

function parseRecords(raw: string | null): AssignmentRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AssignmentRecord[]) : [];
  } catch {
    return [];
  }
}

export function listAssignmentStatuses(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return parseStatuses(localGet(STORAGE_KEY));
}

export function listAssignmentRecords(): AssignmentRecord[] {
  if (typeof window === "undefined") return [];
  return parseRecords(localGet(RECORDS_KEY));
}

export function getAssignmentStatus(id: string, fallback: string): string {
  const statuses = listAssignmentStatuses();
  return statuses[id] ?? fallback;
}

export function setAssignmentStatus(
  id: string,
  status: AssignmentStatus,
  meta?: { title?: string; kind?: AssignmentKind; assignee?: string },
): void {
  const statuses = listAssignmentStatuses();
  statuses[id] = status;
  localSet(STORAGE_KEY, JSON.stringify(statuses));

  const records = listAssignmentRecords();
  const existing = records.find((r) => r.id === id);
  const next: AssignmentRecord = {
    id,
    title: meta?.title ?? existing?.title ?? id,
    kind: meta?.kind ?? existing?.kind ?? "other",
    status,
    assignee: meta?.assignee ?? existing?.assignee,
    updatedAt: new Date().toISOString(),
  };
  const merged = [next, ...records.filter((r) => r.id !== id)].slice(0, 80);
  localSet(RECORDS_KEY, JSON.stringify(merged));

  logCoachAction(`Assignment → ${status}`, next.title);
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("assignments"),
  );
}

/** Create a new local assignment record (film / training / etc.). */
export function createAssignment(input: {
  title: string;
  kind: AssignmentKind;
  assignee?: string;
  status?: AssignmentStatus;
}): AssignmentRecord {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `asg_${crypto.randomUUID()}`
      : `asg_${Date.now()}`;
  setAssignmentStatus(id, input.status ?? "Assigned", {
    title: input.title.trim() || "Untitled assignment",
    kind: input.kind,
    assignee: input.assignee,
  });
  return listAssignmentRecords().find((row) => row.id === id) ?? {
    id,
    title: input.title,
    kind: input.kind,
    status: input.status ?? "Assigned",
    assignee: input.assignee,
    updatedAt: new Date().toISOString(),
  };
}
