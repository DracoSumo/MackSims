import type { MovementCategory, StrengthLiftId, WeightUnit } from "@/data/types";
import { getMeasurableGoals, huntSnapshot, liftProgressPct, saveMeasurableGoals } from "@/lib/goals";
import { loadJson, saveJson } from "@/lib/storage";

const LOG_KEY = "primfit.loadLog";
const MILESTONE_KEY = "primfit.milestones";

export type LoadKind = "weight" | "band" | "bodyweight" | "other";

export type LoadEntry = {
  key: string;
  kind: LoadKind;
  load?: number;
  unit: WeightUnit;
  band?: string;
  note?: string;
  place?: string;
  updatedAt: string;
};

export function loadLogKey(category: MovementCategory, name: string): string {
  return `${category}:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function loadTakesWeight(category: MovementCategory): boolean {
  return category === "squat" || category === "hinge" || category === "push" || category === "pull" || category === "carry" || category === "power";
}

export function getLoadLog(key: string): LoadEntry | null {
  const all = loadJson<Record<string, LoadEntry>>(LOG_KEY, {});
  return all[key] ?? null;
}

export function saveLoadLog(entry: LoadEntry): LoadEntry {
  const all = loadJson<Record<string, LoadEntry>>(LOG_KEY, {});
  const next = { ...entry, updatedAt: new Date().toISOString() };
  all[entry.key] = next;
  saveJson(LOG_KEY, all);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("primfit-goals"));
  return next;
}

export function formatLoad(entry: LoadEntry): string {
  if (entry.kind === "band") return entry.band?.trim() ? `${entry.band} band` : "Band";
  if (entry.kind === "bodyweight") return "Bodyweight";
  if (entry.load != null) return `${entry.load} ${entry.unit}`;
  if (entry.note?.trim()) return entry.note.trim();
  return "Logged";
}

function inferLift(name: string, category: MovementCategory): StrengthLiftId | null {
  const n = name.toLowerCase();
  if (n.includes("bench")) return "bench";
  if (n.includes("overhead") || n.includes("ohp") || n.includes("shoulder press")) return "ohp";
  if (n.includes("trap") || n.includes("hex")) return "trap-bar";
  if (n.includes("deadlift") || category === "hinge") return "deadlift";
  if (n.includes("squat") || category === "squat") return "squat";
  if (category === "push" && n.includes("press")) return "bench";
  return null;
}

export type MilestoneHit = {
  id: string;
  label: string;
  pct: number;
  cleared: boolean;
};

function markSeen(id: string): boolean {
  const seen = loadJson<string[]>(MILESTONE_KEY, []);
  if (seen.includes(id)) return false;
  saveJson(MILESTONE_KEY, [id, ...seen].slice(0, 40));
  return true;
}

export function applyLoadToGoals(entry: LoadEntry, name: string, category: MovementCategory): MilestoneHit | null {
  if (entry.kind !== "weight" || entry.load == null) return null;
  const liftId = inferLift(name, category);
  if (!liftId) return null;
  const goals = getMeasurableGoals();
  const row = goals.lifts.find((l) => l.liftId === liftId);
  if (!row) return null;
  const nextCurrent = row.current == null ? entry.load : Math.max(row.current, entry.load);
  if (row.current === nextCurrent) return null;
  const nextRow = { ...row, current: nextCurrent, unit: entry.unit };
  saveMeasurableGoals({
    ...goals,
    lifts: goals.lifts.map((l) => (l.liftId === liftId ? nextRow : l)),
  });
  const after = liftProgressPct(nextRow) ?? 0;
  if (after < 80) return null;
  const cleared = after >= 100;
  const id = `${liftId}:${cleared ? "clear" : "boss"}`;
  if (!markSeen(id)) return null;
  return { id, label: name, pct: after, cleared };
}

export function celebrateHunt(): void {
  const snap = huntSnapshot(getMeasurableGoals());
  if (snap.stage !== "boss" && snap.stage !== "clear") return;
  const featured = snap.featured;
  if (!featured || featured.pct == null) return;
  const id = `hunt:${featured.id}:${snap.stage}`;
  if (!markSeen(id)) return;
  fireMilestone({
    id,
    label: featured.label,
    pct: featured.pct,
    cleared: snap.stage === "clear",
  });
}

export function fireMilestone(hit: MilestoneHit) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("primfit-milestone", { detail: hit }));
}

export const LOAD_LOG_STORAGE_KEY = LOG_KEY;
export const MILESTONE_STORAGE_KEY = MILESTONE_KEY;
