import { localGet, localSet } from "@/lib/safeStorage";
import { logCoachAction } from "./actionLogStore";

export type MealLog = {
  id: string;
  mealType: string;
  hydration: string;
  notes: string;
  loggedAt: string;
};

const STORAGE_KEY = "coachcore.mealLogs";

function parse(raw: string | null): MealLog[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MealLog[]) : [];
  } catch {
    return [];
  }
}

export function listMealLogs(): MealLog[] {
  if (typeof window === "undefined") return [];
  return parse(localGet(STORAGE_KEY));
}

export function saveMealLog(input: Omit<MealLog, "id" | "loggedAt">): MealLog {
  const record: MealLog = {
    ...input,
    id: crypto.randomUUID(),
    loggedAt: new Date().toISOString(),
  };
  localSet(STORAGE_KEY, JSON.stringify([record, ...listMealLogs()].slice(0, 40)));
  logCoachAction("Meal log", `${record.mealType}${record.hydration ? ` · ${record.hydration}` : ""}`);
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("mealLogs"),
  );
  return record;
}
