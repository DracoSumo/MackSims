export type AssignmentItemType = "film" | "workout" | "meal" | "message";

export type AssignmentCompletion = {
  id: string;
  itemType: AssignmentItemType;
  itemId: string;
  athleteId?: string;
  label: string;
  completedAt: string;
};

const STORAGE_KEY = "coachcore.assignmentCompletions";

export function listCompletions(): AssignmentCompletion[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as AssignmentCompletion[];
  } catch {
    return [];
  }
}

export function isItemComplete(itemType: AssignmentItemType, itemId: string): boolean {
  return listCompletions().some((row) => row.itemType === itemType && row.itemId === itemId);
}

export function markComplete(input: {
  itemType: AssignmentItemType;
  itemId: string;
  athleteId?: string;
  label: string;
}): AssignmentCompletion {
  const existing = listCompletions().find(
    (row) => row.itemType === input.itemType && row.itemId === input.itemId,
  );
  if (existing) return existing;

  const record: AssignmentCompletion = {
    id: crypto.randomUUID(),
    itemType: input.itemType,
    itemId: input.itemId,
    athleteId: input.athleteId,
    label: input.label,
    completedAt: new Date().toISOString(),
  };

  const rows = listCompletions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...rows].slice(0, 60)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("assignments"),
  );
  void import("./actionLogStore").then(({ logCoachAction }) =>
    logCoachAction(`Marked ${input.itemType} complete`, input.label),
  );
  return record;
}

export function mergeCompletions(remote: AssignmentCompletion[]): AssignmentCompletion[] {
  const local = listCompletions();
  const localKeys = new Set(local.map((r) => `${r.itemType}:${r.itemId}`));
  const merged = [
    ...local,
    ...remote.filter((r) => !localKeys.has(`${r.itemType}:${r.itemId}`)),
  ].slice(0, 60);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("assignments"),
  );
  return merged;
}

export function formatCompletionTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
