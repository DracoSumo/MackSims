import type {
  BudgetId,
  EquipmentId,
  FoodStapleId,
  IntroRequest,
  TrainingLocationMode,
  UserProfile,
  WeekPlan,
} from "@/data/types";
import { DEFAULT_EQUIPMENT, DEFAULT_FOOD } from "@/data/options";

const PROFILE_KEY = "primfit.profile";
const PLAN_KEY = "primfit.weekPlan";
const GROCERY_CHECKED_KEY = "primfit.groceryChecked";
const PROGRESS_KEY = "primfit.dayProgress";
const INTROS_KEY = "primfit.introRequests";
const EQUIPMENT_KEY = "primfit.equipment";
const FOOD_KEY = "primfit.foodInventory";
const BUDGET_KEY = "primfit.budget";
const GOALS_KEY = "primfit.goals";
const WEEK_STATS_KEY = "primfit.weekStats";
const DAY_STAMPS_KEY = "primfit.dayStamps";

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeProfile(raw: UserProfile | null): UserProfile | null {
  if (!raw || !raw.onboardedAt) return null;
  const fromProfileEq = raw.equipment?.length ? raw.equipment : DEFAULT_EQUIPMENT;
  const fromProfileFood = raw.foodInventory?.length ? raw.foodInventory : DEFAULT_FOOD;
  const equipment = loadJson<EquipmentId[]>(EQUIPMENT_KEY, fromProfileEq);
  const foodInventory = loadJson<FoodStapleId[]>(FOOD_KEY, fromProfileFood);
  const budget = (raw.budget ?? loadJson<BudgetId>(BUDGET_KEY, "moderate")) as BudgetId;
  return {
    ...raw,
    displayName: raw.displayName?.trim() || "Athlete",
    equipment: equipment.length ? equipment : DEFAULT_EQUIPMENT,
    foodInventory: foodInventory.length ? foodInventory : DEFAULT_FOOD,
    locationMode: (raw.locationMode ?? "home") as TrainingLocationMode,
    budget: budget === "tight" || budget === "flexible" ? budget : "moderate",
  };
}

export function getProfile(): UserProfile | null {
  return normalizeProfile(loadJson<UserProfile | null>(PROFILE_KEY, null));
}

export function saveProfile(profile: UserProfile) {
  saveJson(PROFILE_KEY, profile);
  saveEquipment(profile.equipment ?? DEFAULT_EQUIPMENT);
  saveFoodInventory(profile.foodInventory ?? DEFAULT_FOOD);
  saveJson(BUDGET_KEY, profile.budget ?? "moderate");
}

export function getEquipment(): EquipmentId[] {
  return loadJson<EquipmentId[]>(EQUIPMENT_KEY, DEFAULT_EQUIPMENT);
}

export function saveEquipment(equipment: EquipmentId[]) {
  saveJson(EQUIPMENT_KEY, equipment);
}

export function getFoodInventory(): FoodStapleId[] {
  return loadJson<FoodStapleId[]>(FOOD_KEY, DEFAULT_FOOD);
}

export function saveFoodInventory(items: FoodStapleId[]) {
  saveJson(FOOD_KEY, items);
}

export function getWeekPlan(): WeekPlan | null {
  return loadJson<WeekPlan | null>(PLAN_KEY, null);
}

export function saveWeekPlan(plan: WeekPlan) {
  saveJson(PLAN_KEY, plan);
}

export function getGroceryChecked(): Set<string> {
  const ids = loadJson<string[]>(GROCERY_CHECKED_KEY, []);
  return new Set(ids);
}

export function setGroceryChecked(ids: Set<string>) {
  saveJson(GROCERY_CHECKED_KEY, Array.from(ids));
}

export type DayProgress = {
  blocks: string[];
  meals: string[];
  celebrated?: boolean;
};

function progressMap(): Record<string, DayProgress> {
  return loadJson<Record<string, DayProgress>>(PROGRESS_KEY, {});
}

function progressKey(planId: string, dayIndex: number): string {
  return `${planId}:${dayIndex}`;
}

export function getDayProgress(planId: string, dayIndex: number): DayProgress {
  return progressMap()[progressKey(planId, dayIndex)] ?? { blocks: [], meals: [] };
}

export function setDayProgress(planId: string, dayIndex: number, value: DayProgress) {
  const all = progressMap();
  all[progressKey(planId, dayIndex)] = value;
  saveJson(PROGRESS_KEY, all);
}

export function listIntroRequests(): IntroRequest[] {
  return loadJson<IntroRequest[]>(INTROS_KEY, []);
}

export function addIntroRequest(req: IntroRequest) {
  const list = listIntroRequests();
  list.unshift(req);
  saveJson(INTROS_KEY, list.slice(0, 50));
}

export function clearAllPrimFitData() {
  if (typeof window === "undefined") return;
  [
    PROFILE_KEY,
    PLAN_KEY,
    GROCERY_CHECKED_KEY,
    PROGRESS_KEY,
    INTROS_KEY,
    EQUIPMENT_KEY,
    FOOD_KEY,
    BUDGET_KEY,
    GOALS_KEY,
    WEEK_STATS_KEY,
    DAY_STAMPS_KEY,
    "primfit.activeTheme",
    "primfit.ownedPacks",
    "primfit.packReceipts",
    "primfit.dailyMetrics",
    "primfit.deviceWorkouts",
    "primfit.wearableSettings",
  ].forEach((k) => localStorage.removeItem(k));
}
