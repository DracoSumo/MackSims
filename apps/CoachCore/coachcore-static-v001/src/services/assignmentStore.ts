import { localGet, localSet } from "@/lib/safeStorage";
import { logCoachAction } from "./actionLogStore";

export type AssignmentStatus = "Assigned" | "In progress" | "Complete" | "Needs nudge";

const STORAGE_KEY = "coachcore.assignmentStatus";

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

export function listAssignmentStatuses(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return parseStatuses(localGet(STORAGE_KEY));
}

export function getAssignmentStatus(id: string, fallback: string): string {
  const statuses = listAssignmentStatuses();
  return statuses[id] ?? fallback;
}

export function setAssignmentStatus(id: string, status: AssignmentStatus): void {
  const statuses = listAssignmentStatuses();
  statuses[id] = status;
  localSet(STORAGE_KEY, JSON.stringify(statuses));
  logCoachAction(`Assignment → ${status}`, id);
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("assignments"),
  );
}
