"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityRings } from "@/components/ActivityRings";
import { LegalFooter } from "@/components/LegalFooter";
import { useTheme } from "@/components/ThemeProvider";
import { primfitConfig } from "@/config/primfit";
import {
  VENDOR_SYNC_NOTE,
  WEARABLE_VENDORS,
  computeRingScores,
  formatSleep,
  getTodayMetrics,
  getWearableSettings,
  hrZones,
  lastNDaysMetrics,
  localDateKey,
  mergeImportedMetrics,
  parseMetricsFile,
  saveDeviceWorkout,
  saveMetrics,
  saveWearableSettings,
  statusLabel,
  weekdayShort,
  workoutsLastDays,
  type DailyMetrics,
  type DeviceWorkout,
  type WearableSettings,
} from "@/lib/wearables";

function emptyToday(): DailyMetrics {
  return { date: localDateKey(), source: "manual" };
}

export default function WearablesPage() {
  const { copy } = useTheme();
  const [ready, setReady] = useState(false);
  const [metrics, setMetrics] = useState<DailyMetrics>(emptyToday);
  const [settings, setSettings] = useState<WearableSettings>({ stepGoal: 8000, activeGoal: 30 });
  const [workouts, setWorkouts] = useState<DeviceWorkout[]>([]);
  const [logTitle, setLogTitle] = useState("");
  const [logMinutes, setLogMinutes] = useState("30");
  const [logHr, setLogHr] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMetrics(getTodayMetrics() ?? emptyToday());
    setSettings(getWearableSettings());
    setWorkouts(workoutsLastDays(14));
    setReady(true);
  }, []);

  const week = useMemo(() => lastNDaysMetrics(7), [tick, metrics]);
  const scores = useMemo(() => computeRingScores(), [tick, metrics]);
  const zones = useMemo(() => hrZones(settings), [settings]);
  const todayKey = localDateKey();
  if (!ready) return null;

  function persistMetrics(next: DailyMetrics) {
    const clean: DailyMetrics = { ...next, source: next.source ?? "manual", date: todayKey };
    saveMetrics(clean);
    setMetrics(clean);
    setTick((n) => n + 1);
    setSavedMsg("Saved on this device.");
  }

  function field<K extends keyof DailyMetrics>(key: K, value: DailyMetrics[K]) {
    persistMetrics({ ...metrics, [key]: value, source: "manual" });
  }

  function numField(key: keyof DailyMetrics, raw: string) {
    const n = raw.trim() === "" ? undefined : Number(raw);
    field(key, (Number.isFinite(n as number) ? n : undefined) as DailyMetrics[typeof key]);
  }

  async function onImport(file: File) {
    const text = await file.text();
    const parsed = parseMetricsFile(text);
    if (parsed.error) {
      setImportMsg(parsed.error);
      return;
    }
    if (!parsed.metrics.length) {
      setImportMsg("No dated rows found. Include a date column (YYYY-MM-DD).");
      return;
    }
    const count = mergeImportedMetrics(parsed.metrics);
    setMetrics(getTodayMetrics() ?? emptyToday());
    setTick((n) => n + 1);
    setImportMsg(`Imported ${count} day(s) on this device. Not synced with Apple, Garmin, or Fitbit.`);
  }

  function addWorkout() {
    const minutes = Number(logMinutes);
    if (!logTitle.trim() || !Number.isFinite(minutes) || minutes <= 0) return;
    const entry: DeviceWorkout = {
      id: `wo-${Date.now()}`,
      date: todayKey,
      title: logTitle.trim(),
      minutes,
      avgHr: logHr.trim() ? Number(logHr) : undefined,
      createdAt: new Date().toISOString(),
    };
    saveDeviceWorkout(entry);
    setWorkouts(workoutsLastDays(14));
    setLogTitle("");
    setLogHr("");
  }

  function countAsSession(entry: DeviceWorkout) {
    const next = { ...entry, countedTowardSession: true };
    saveDeviceWorkout(next);
    setWorkouts(workoutsLastDays(14));
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-muted)]">
          {copy.wearables}
        </p>
        <h1 className="pf-display text-3xl font-bold">Body metrics</h1>
        <p className="text-sm text-[var(--pf-muted)]">{VENDOR_SYNC_NOTE}</p>
      </header>

      <section className="pf-card space-y-4 p-4">
        <h2 className="pf-display text-lg font-semibold">Activity rings</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          {copy.rings.train} from PrimFit check-offs. {copy.rings.move} from steps or active minutes.{" "}
          {copy.rings.recover} from sleep or a 1–5 self-report.
        </p>
        <ActivityRings scores={scores} />
        <div className="flex justify-between gap-1 pt-1">
          {week.map((d) => {
            const pct = d.metrics?.steps ? Math.min(1, d.metrics.steps / (settings.stepGoal ?? 8000)) : 0;
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-9 w-full items-end justify-center">
                  <span
                    className="block w-1.5 rounded-full bg-[var(--pf-purple-bright)]"
                    style={{ height: `${Math.max(4, pct * 36)}px`, opacity: d.metrics ? 1 : 0.25 }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-wide text-[var(--pf-muted)]">
                  {weekdayShort(d.date).slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pf-card space-y-3 p-4">
        <h2 className="pf-display text-lg font-semibold">Today</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-[var(--pf-muted)]">
            Steps
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.steps ?? ""}
              onChange={(e) => numField("steps", e.target.value)}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Active minutes
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.activeMinutes ?? ""}
              onChange={(e) => numField("activeMinutes", e.target.value)}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Calories (optional)
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.calories ?? ""}
              onChange={(e) => numField("calories", e.target.value)}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Resting HR
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.restingHr ?? ""}
              onChange={(e) => numField("restingHr", e.target.value)}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Avg HR
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.avgHr ?? ""}
              onChange={(e) => numField("avgHr", e.target.value)}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Max HR (today)
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={metrics.maxHr ?? ""}
              onChange={(e) => numField("maxHr", e.target.value)}
            />
          </label>
        </div>
        {savedMsg ? <p className="text-xs text-[var(--pf-silver)]">{savedMsg}</p> : null}
      </section>

      <section className="pf-card space-y-3 p-4">
        <h2 className="pf-display text-lg font-semibold">Sleep + recovery</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          Self-reported only. This is not a sleep study, diagnosis, or medical reading.
        </p>
        <label className="text-xs text-[var(--pf-muted)]">
          Sleep minutes
          <input
            className="pf-input mt-1"
            inputMode="numeric"
            value={metrics.sleepMinutes ?? ""}
            onChange={(e) => numField("sleepMinutes", e.target.value)}
            placeholder="e.g. 420 for 7h"
          />
        </label>
        {metrics.sleepMinutes != null ? (
          <p className="text-sm text-[var(--pf-silver)]">{formatSleep(metrics.sleepMinutes)}</p>
        ) : null}
        <p className="text-xs font-semibold text-[var(--pf-muted)]">Sleep quality</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`pf-chip ${metrics.sleepQuality === n ? "pf-chip-active" : ""}`}
              onClick={() => field("sleepQuality", n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-[var(--pf-muted)]">Recovery (self-report)</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`pf-chip ${metrics.recovery === n ? "pf-chip-active" : ""}`}
              onClick={() => field("recovery", n)}
            >
              {n}
            </button>
          ))}
        </div>
        <label className="text-xs text-[var(--pf-muted)]">
          Notes
          <textarea
            className="pf-input mt-1 min-h-[72px]"
            value={metrics.notes ?? ""}
            onChange={(e) => field("notes", e.target.value)}
          />
        </label>
      </section>

      <section className="pf-card space-y-3 p-4">
        <h2 className="pf-display text-lg font-semibold">Heart-rate zones</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          Zone math from the age or max HR you enter — not a lab test or medical reading. Ages {primfitConfig.ageRating}.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-[var(--pf-muted)]">
            Age
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={settings.age ?? ""}
              onChange={(e) => {
                const age = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...settings, age };
                setSettings(next);
                saveWearableSettings(next);
              }}
            />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Max HR (optional)
            <input
              className="pf-input mt-1"
              inputMode="numeric"
              value={settings.maxHr ?? ""}
              onChange={(e) => {
                const maxHr = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...settings, maxHr };
                setSettings(next);
                saveWearableSettings(next);
              }}
            />
          </label>
        </div>
        <p className="text-xs text-[var(--pf-silver)]">{zones.source}</p>
        <ul className="space-y-2">
          {zones.zones.map((z) => (
            <li key={z.id} className="flex items-center justify-between text-sm">
              <span>
                {z.name} · {z.label}
              </span>
              <span className="text-[var(--pf-muted)]">
                {z.loBpm && z.hiBpm ? `${z.loBpm}–${z.hiBpm} bpm` : `${Math.round(z.loPct * 100)}–${Math.round(z.hiPct * 100)}%`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="pf-card space-y-3 p-4">
        <h2 className="pf-display text-lg font-semibold">Device workout log</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          Last 14 days on this device. Counting a log as today&apos;s session does not check off your PrimFit plan.
        </p>
        <label className="text-xs text-[var(--pf-muted)]">
          Title
          <input className="pf-input mt-1" value={logTitle} onChange={(e) => setLogTitle(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-[var(--pf-muted)]">
            Minutes
            <input className="pf-input mt-1" inputMode="numeric" value={logMinutes} onChange={(e) => setLogMinutes(e.target.value)} />
          </label>
          <label className="text-xs text-[var(--pf-muted)]">
            Avg HR (optional)
            <input className="pf-input mt-1" inputMode="numeric" value={logHr} onChange={(e) => setLogHr(e.target.value)} />
          </label>
        </div>
        <button type="button" className="pf-btn-primary w-full" onClick={addWorkout}>
          Add to today&apos;s log
        </button>
        <ul className="space-y-2">
          {workouts.length ? (
            workouts.map((w) => (
              <li key={w.id} className="rounded-[var(--pf-radius)] border border-[var(--pf-line)] p-3">
                <p className="font-semibold">{w.title}</p>
                <p className="text-xs text-[var(--pf-muted)]">
                  {w.date} · {w.minutes} min{w.avgHr ? ` · ${w.avgHr} bpm` : ""}
                  {w.countedTowardSession ? " · counted as session log" : ""}
                </p>
                {w.date === todayKey && !w.countedTowardSession ? (
                  <button type="button" className="pf-linkish mt-1 px-0" onClick={() => countAsSession(w)}>
                    Count this as today&apos;s session
                  </button>
                ) : null}
              </li>
            ))
          ) : (
            <li className="text-sm text-[var(--pf-muted)]">No device workouts logged yet.</li>
          )}
        </ul>
      </section>

      <section className="pf-card space-y-3 p-4">
        <h2 className="pf-display text-lg font-semibold">Import CSV / JSON</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          Headers: date, steps, activeMinutes, calories, restingHr, avgHr, maxHr, sleepMinutes, sleepQuality,
          recovery, notes. Stays on this device.
        </p>
        <input
          type="file"
          accept=".csv,.json,text/csv,application/json"
          className="text-sm text-[var(--pf-silver)]"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onImport(file);
          }}
        />
        {importMsg ? <p className="text-xs text-[var(--pf-silver)]">{importMsg}</p> : null}
      </section>

      <section className="space-y-3">
        <h2 className="pf-display text-lg font-semibold">Device hub</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          These cards describe the feature set. Status is preview, manual, imported, or coming soon — never a live
          vendor connection.
        </p>
        <ul className="space-y-3">
          {WEARABLE_VENDORS.map((v) => (
            <li key={v.id} className="pf-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{v.name}</p>
                <span className="pf-chip pointer-events-none text-[10px]">{statusLabel(v.status)}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--pf-muted)]">{v.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-[var(--pf-muted)]">
        Body metrics, imports, and workout logs stay on this device in localStorage. {VENDOR_SYNC_NOTE}{" "}
        {primfitConfig.disclaimer} Ages {primfitConfig.ageRating}.
      </p>

      <LegalFooter />
    </div>
  );
}
