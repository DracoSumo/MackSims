import { getDayProgress, getWeekPlan, loadJson, saveJson } from "@/lib/storage";
import { trainingDayComplete } from "@/lib/progress";
import { todayDayIndex } from "@/lib/planEngine";

export const METRICS_KEY = "primfit.dailyMetrics";
export const WORKOUTS_KEY = "primfit.deviceWorkouts";
export const WEARABLE_SETTINGS_KEY = "primfit.wearableSettings";

export type MetricSource = "manual" | "import";

export type DailyMetrics = {
  date: string;
  steps?: number;
  activeMinutes?: number;
  calories?: number;
  restingHr?: number;
  avgHr?: number;
  maxHr?: number;
  sleepMinutes?: number;
  sleepQuality?: number;
  recovery?: number;
  notes?: string;
  source: MetricSource;
};

export type DeviceWorkout = {
  id: string;
  date: string;
  title: string;
  minutes: number;
  avgHr?: number;
  notes?: string;
  countedTowardSession?: boolean;
  createdAt: string;
};

export type WearableSettings = {
  age?: number;
  maxHr?: number;
  stepGoal?: number;
  activeGoal?: number;
};

export type VendorStatus = "preview" | "manual" | "imported" | "coming-soon";

export type WearableVendor = {
  id: string;
  name: string;
  blurb: string;
  status: VendorStatus;
};

export const WEARABLE_VENDORS: WearableVendor[] = [
  {
    id: "apple",
    name: "Apple Watch / Health",
    blurb: "HealthKit needs an Apple developer setup. Log or import on this device for now.",
    status: "preview",
  },
  {
    id: "garmin",
    name: "Garmin",
    blurb: "Garmin Connect APIs need owner keys. Not connected. Manual or file import only.",
    status: "preview",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    blurb: "Fitbit Web API needs owner keys. Not connected. Manual or file import only.",
    status: "preview",
  },
  {
    id: "whoop",
    name: "Whoop",
    blurb: "Whoop API is not wired. Strain and recovery here are self-reported.",
    status: "preview",
  },
  {
    id: "oura",
    name: "Oura",
    blurb: "Oura cloud sync is not live. Sleep scores here are what you enter.",
    status: "preview",
  },
  {
    id: "samsung",
    name: "Samsung / Health Connect",
    blurb: "Health Connect plugin is not in this build. Coming later on Android.",
    status: "coming-soon",
  },
  {
    id: "polar",
    name: "Polar / chest strap",
    blurb: "No Bluetooth strap pairing yet. Type heart-rate numbers from the watch or strap screen.",
    status: "manual",
  },
];

export const VENDOR_SYNC_NOTE =
  "Vendor sync is not live. Metrics stay on this device. Not connected to Apple, Garmin, Fitbit, Whoop, Oura, or Samsung.";

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return localDateKey(dt);
}

function metricsMap(): Record<string, DailyMetrics> {
  return loadJson<Record<string, DailyMetrics>>(METRICS_KEY, {});
}

export function getMetrics(date: string): DailyMetrics | null {
  return metricsMap()[date] ?? null;
}

export function getTodayMetrics(): DailyMetrics | null {
  return getMetrics(localDateKey());
}

export function saveMetrics(next: DailyMetrics) {
  const all = metricsMap();
  all[next.date] = next;
  saveJson(METRICS_KEY, all);
}

export function lastNDaysMetrics(n = 7): { date: string; metrics: DailyMetrics | null }[] {
  const today = localDateKey();
  const out: { date: string; metrics: DailyMetrics | null }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = shiftDateKey(today, -i);
    out.push({ date, metrics: getMetrics(date) });
  }
  return out;
}

export function getWearableSettings(): WearableSettings {
  return loadJson<WearableSettings>(WEARABLE_SETTINGS_KEY, { stepGoal: 8000, activeGoal: 30 });
}

export function saveWearableSettings(next: WearableSettings) {
  saveJson(WEARABLE_SETTINGS_KEY, next);
}

export function listDeviceWorkouts(): DeviceWorkout[] {
  return loadJson<DeviceWorkout[]>(WORKOUTS_KEY, []);
}

export function saveDeviceWorkout(entry: DeviceWorkout) {
  const list = listDeviceWorkouts().filter((w) => w.id !== entry.id);
  list.unshift(entry);
  saveJson(WORKOUTS_KEY, list.slice(0, 60));
}

export function workoutsLastDays(days = 14): DeviceWorkout[] {
  const cutoff = shiftDateKey(localDateKey(), -(days - 1));
  return listDeviceWorkouts()
    .filter((w) => w.date >= cutoff)
    .sort((a, b) => (a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)));
}

export type RingScores = {
  train: number;
  move: number;
  recover: number;
};

export function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function computeRingScores(date = localDateKey()): RingScores {
  const metrics = getMetrics(date);
  const settings = getWearableSettings();
  const plan = getWeekPlan();

  let train = 0;
  if (plan) {
    const day = date === localDateKey() ? (plan.days[todayDayIndex()] ?? plan.days[0]) : null;
    if (day) {
      if (day.workout.isRest) train = metrics?.recovery ? clamp01((metrics.recovery ?? 0) / 5) : 1;
      else if (trainingDayComplete(day, plan.id)) train = 1;
      else {
        const p = getDayProgress(plan.id, day.dayIndex);
        const total = day.workout.blocks.length;
        train = total > 0 ? clamp01(p.blocks.length / total) : 0;
      }
    }
  }

  const stepGoal = settings.stepGoal ?? 8000;
  const activeGoal = settings.activeGoal ?? 30;
  const stepScore = metrics?.steps != null ? clamp01(metrics.steps / stepGoal) : 0;
  const activeScore = metrics?.activeMinutes != null ? clamp01(metrics.activeMinutes / activeGoal) : 0;
  const move = Math.max(stepScore, activeScore);

  const sleepScore = metrics?.sleepMinutes != null ? clamp01(metrics.sleepMinutes / 420) : 0;
  const recoveryScore = metrics?.recovery != null ? clamp01(metrics.recovery / 5) : 0;
  const recover = Math.max(sleepScore, recoveryScore);

  return { train, move, recover };
}

export type HrZone = {
  id: number;
  name: string;
  label: string;
  loPct: number;
  hiPct: number;
  loBpm?: number;
  hiBpm?: number;
};

export function hrZones(settings: WearableSettings): { zones: HrZone[]; maxHr?: number; source: string } {
  const age = settings.age && settings.age >= 13 && settings.age <= 90 ? settings.age : undefined;
  const maxHr =
    settings.maxHr && settings.maxHr >= 80 && settings.maxHr <= 230
      ? settings.maxHr
      : age
        ? 220 - age
        : undefined;
  const defs: Omit<HrZone, "loBpm" | "hiBpm">[] = [
    { id: 1, name: "Zone 1", label: "Easy", loPct: 0.5, hiPct: 0.6 },
    { id: 2, name: "Zone 2", label: "Steady", loPct: 0.6, hiPct: 0.7 },
    { id: 3, name: "Zone 3", label: "Tempo", loPct: 0.7, hiPct: 0.8 },
    { id: 4, name: "Zone 4", label: "Hard", loPct: 0.8, hiPct: 0.9 },
    { id: 5, name: "Zone 5", label: "Max", loPct: 0.9, hiPct: 1 },
  ];
  const zones: HrZone[] = defs.map((z) => ({
    ...z,
    loBpm: maxHr ? Math.round(maxHr * z.loPct) : undefined,
    hiBpm: maxHr ? Math.round(maxHr * z.hiPct) : undefined,
  }));
  const source = settings.maxHr
    ? "Your entered max HR"
    : age
      ? `Estimated max HR (220 − age ${age})`
      : "Percent of max HR — enter age or max HR for bpm";
  return { zones, maxHr, source };
}

function num(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function clampScore(n: number | undefined) {
  if (n == null) return undefined;
  const r = Math.round(n);
  if (r < 1 || r > 5) return undefined;
  return r;
}

function normalizeMetric(raw: Record<string, unknown>, source: MetricSource): DailyMetrics | null {
  const dateRaw = String(raw.date ?? raw.Date ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return null;
  const sleepQuality = clampScore(num(raw.sleepQuality ?? raw.sleep_quality));
  const recovery = clampScore(num(raw.recovery));
  return {
    date: dateRaw,
    steps: num(raw.steps),
    activeMinutes: num(raw.activeMinutes ?? raw.active_minutes ?? raw.activeMin),
    calories: num(raw.calories),
    restingHr: num(raw.restingHr ?? raw.resting_hr ?? raw.rhr),
    avgHr: num(raw.avgHr ?? raw.avg_hr),
    maxHr: num(raw.maxHr ?? raw.max_hr),
    sleepMinutes: num(raw.sleepMinutes ?? raw.sleep_minutes ?? raw.sleepMin),
    sleepQuality,
    recovery,
    notes: raw.notes != null ? String(raw.notes) : undefined,
    source,
  };
}

export function parseMetricsFile(text: string): { metrics: DailyMetrics[]; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { metrics: [], error: "File was empty." };
  try {
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      const data = JSON.parse(trimmed) as unknown;
      const arr = Array.isArray(data)
        ? data
        : Array.isArray((data as { metrics?: unknown[] }).metrics)
          ? (data as { metrics: unknown[] }).metrics
          : Array.isArray((data as { days?: unknown[] }).days)
            ? (data as { days: unknown[] }).days
            : null;
      if (!arr) return { metrics: [], error: "JSON needs an array, or { metrics: [] }." };
      const metrics = arr
        .map((row) => (row && typeof row === "object" ? normalizeMetric(row as Record<string, unknown>, "import") : null))
        .filter((row): row is DailyMetrics => Boolean(row));
      return { metrics };
    }

    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
    const header = lines[0]?.split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    if (!header?.length) return { metrics: [], error: "CSV needs a header row." };
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const raw: Record<string, unknown> = {};
      header.forEach((key, i) => {
        raw[key] = cols[i];
      });
      return normalizeMetric(raw, "import");
    });
    return { metrics: rows.filter((row): row is DailyMetrics => Boolean(row)) };
  } catch {
    return { metrics: [], error: "Could not parse that file. Use CSV or JSON with a date column." };
  }
}

export function mergeImportedMetrics(incoming: DailyMetrics[]): number {
  const all = metricsMap();
  incoming.forEach((row) => {
    all[row.date] = { ...all[row.date], ...row, source: "import" };
  });
  saveJson(METRICS_KEY, all);
  return incoming.length;
}

export function formatSleep(minutes?: number) {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function weekdayShort(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, { weekday: "short" });
}

export function statusLabel(status: VendorStatus) {
  if (status === "coming-soon") return "Coming soon";
  if (status === "imported") return "Imported";
  if (status === "manual") return "Manual";
  return "Preview";
}
