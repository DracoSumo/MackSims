"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyExerciseSwap,
  applyMealSwap,
  exerciseOptionsFor,
  mealOptionsFor,
  type ExerciseOption,
  type MealOption,
} from "@/data/alternatives";
import type { MealSlot, UserProfile, WeekDay, WeekPlan } from "@/data/types";
import { CheckOff } from "@/components/CheckOff";
import { VideoBlock } from "@/components/VideoBlock";
import { RestTimer } from "@/components/RestTimer";
import { FlavorToast } from "@/components/FlavorToast";
import { useTheme } from "@/components/ThemeProvider";
import { hapticSuccess } from "@/lib/device";
import { getDayProgress, saveWeekPlan, setDayProgress } from "@/lib/storage";
import { syncWeekProgress } from "@/lib/progress";
import { awardOnce, revokeAward, tryCrit, type FlavorEvent } from "@/lib/campaign";
import {
  flavorBlockName,
  flavorMealsTitle,
  flavorMealSlot,
  flavorRankUpLabel,
  flavorSessionTitle,
  flavorSwapTitle,
} from "@/lib/flavor";
import { comboToast } from "@/lib/world";
import { LoadLog } from "@/components/LoadLog";

const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export function mealCount(day: WeekDay): number {
  return MEAL_SLOTS.filter((s) => day.meals[s]).length;
}

function effortLine(block: { setsReps?: string; rpe?: string }) {
  return [block.setsReps, block.rpe].filter(Boolean).join(" · ");
}

export function DayBoard({
  day,
  plan,
  compact,
  onPlanChange,
  onProgressChange,
}: {
  day: WeekDay;
  plan: WeekPlan;
  compact?: boolean;
  onPlanChange: (plan: WeekPlan) => void;
  onProgressChange?: (done: number, total: number, justFinished: boolean) => void;
}) {
  const { theme } = useTheme();
  const profile: UserProfile = plan.profile;
  const [progress, setProgress] = useState(() => getDayProgress(plan.id, day.dayIndex));
  const [cuesOpen, setCuesOpen] = useState<Record<string, boolean>>({});
  const [videoOpen, setVideoOpen] = useState<Record<string, boolean>>({});
  const [swapBlockId, setSwapBlockId] = useState<string | null>(null);
  const [swapMealSlot, setSwapMealSlot] = useState<MealSlot | null>(null);
  const [flavor, setFlavor] = useState<FlavorEvent | null>(null);
  const comboRef = useRef(0);

  const total = day.workout.blocks.length + mealCount(day);
  const done = progress.blocks.length + progress.meals.length;

  useEffect(() => {
    setProgress(getDayProgress(plan.id, day.dayIndex));
  }, [plan.id, day.dayIndex]);

  function persist(next: typeof progress, justFinished = false) {
    setProgress(next);
    setDayProgress(plan.id, day.dayIndex, next);
    syncWeekProgress(plan);
    const nDone = next.blocks.length + next.meals.length;
    onProgressChange?.(nDone, total, justFinished);
  }

  function ping(event: FlavorEvent | null) {
    if (!event) return;
    const withCombo =
      event.combo && event.combo >= 2 ? { ...event, toast: `${event.toast} · ${comboToast(event.combo)}` } : event;
    setFlavor(withCombo);
    if (event.rankedUp || event.crit) void hapticSuccess();
  }

  function grantCheck(kind: "block" | "meal", key: string, xp: number) {
    comboRef.current += 1;
    const combo = comboRef.current;
    const base = awardOnce({ key, theme, kind, xp, combo });
    const crit = tryCrit(theme, key);
    if (crit && base) {
      ping({
        ...crit,
        toast: `${base.toast} · ${crit.toast}${combo >= 2 ? ` · ${comboToast(combo)}` : ""}`,
        combo,
        rankedUp: base.rankedUp || crit.rankedUp,
        rank: crit.rankedUp ? crit.rank : base.rank,
      });
    } else {
      ping(base);
    }
  }

  function toggleBlock(id: string) {
    const checking = !progress.blocks.includes(id);
    const blocks = checking ? [...progress.blocks, id] : progress.blocks.filter((x) => x !== id);
    const next = { ...progress, blocks };
    const wasDone = progress.blocks.length + progress.meals.length >= total && total > 0;
    const nowDone = blocks.length + progress.meals.length >= total && total > 0;
    const key = `${plan.id}:${day.dayIndex}:b:${id}`;
    if (checking) grantCheck("block", key, 8);
    else {
      comboRef.current = 0;
      revokeAward(key, 8);
    }
    persist(next, !wasDone && nowDone);
    if (!wasDone && nowDone) {
      ping(awardOnce({ key: `${plan.id}:${day.dayIndex}:session`, theme, kind: "session", xp: 20 }));
    }
  }

  function toggleMeal(id: string) {
    const checking = !progress.meals.includes(id);
    const meals = checking ? [...progress.meals, id] : progress.meals.filter((x) => x !== id);
    const next = { ...progress, meals };
    const wasDone = progress.blocks.length + progress.meals.length >= total && total > 0;
    const nowDone = progress.blocks.length + meals.length >= total && total > 0;
    const key = `${plan.id}:${day.dayIndex}:m:${id}`;
    if (checking) grantCheck("meal", key, 4);
    else {
      comboRef.current = 0;
      revokeAward(key, 4);
    }
    persist(next, !wasDone && nowDone);
    if (!wasDone && nowDone) {
      ping(awardOnce({ key: `${plan.id}:${day.dayIndex}:session`, theme, kind: "session", xp: 20 }));
    }
  }

  function swapExercise(option: ExerciseOption) {
    if (!swapBlockId) return;
    const next = applyExerciseSwap(plan, day.dayIndex, swapBlockId, option);
    saveWeekPlan(next);
    onPlanChange(next);
    setSwapBlockId(null);
  }

  function swapMeal(option: MealOption) {
    if (!swapMealSlot) return;
    const next = applyMealSwap(plan, day.dayIndex, swapMealSlot, option);
    saveWeekPlan(next);
    onPlanChange(next);
    setSwapMealSlot(null);
  }

  const swappingBlock = day.workout.blocks.find((b) => b.id === swapBlockId);
  const exerciseAlts = useMemo(
    () => (swappingBlock ? exerciseOptionsFor(swappingBlock.movementCategory, profile) : []),
    [swappingBlock, profile],
  );
  const mealAlts = useMemo(
    () => (swapMealSlot ? mealOptionsFor(swapMealSlot, profile) : []),
    [swapMealSlot, profile],
  );

  return (
    <div className="space-y-8">
      <FlavorToast
        message={flavor ? (flavor.rankedUp ? `${flavor.rank.label} · ${flavor.toast}` : flavor.toast) : null}
        rankedUp={flavor?.rankedUp}
        crit={flavor?.crit || flavor?.kind === "crit"}
        rankLabel={flavorRankUpLabel(theme)}
        onDone={() => setFlavor(null)}
      />
      <section className="space-y-3">
        {!compact ? (
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {flavorSessionTitle(theme, day.workout.isRest)}
            </h2>
            {day.workout.whyThisDay ? (
              <p className="mt-1 text-sm text-[var(--pf-muted)]">{day.workout.whyThisDay}</p>
            ) : null}
            {day.workout.fuelingTip ? (
              <p className="mt-1 text-xs text-[var(--pf-silver)]">Eat: {day.workout.fuelingTip}</p>
            ) : null}
          </div>
        ) : null}
        <ul className="space-y-3">
          {day.workout.blocks.map((b) => {
            const checked = progress.blocks.includes(b.id);
            const cuesShown = cuesOpen[b.id];
            const showVideo = videoOpen[b.id];
            return (
              <li key={b.id} className={`pf-board-card ${checked ? "is-done" : ""}`}>
                <div className="flex items-start gap-3">
                  <CheckOff checked={checked} onToggle={() => toggleBlock(b.id)} label={`Mark ${b.name} done`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="pf-board-name">{flavorBlockName(theme, b.name, b.movementCategory)}</p>
                      {b.durationMin ? (
                        <span className="shrink-0 pt-1 text-xs tabular-nums text-[var(--pf-muted)]">
                          {b.durationMin} min
                        </span>
                      ) : null}
                    </div>
                    {flavorBlockName(theme, b.name, b.movementCategory) !== b.name ? (
                      <p className="text-[11px] text-[var(--pf-muted)]">{b.name}</p>
                    ) : null}
                    <p className="pf-board-effort">{b.detail}</p>
                    {effortLine(b) ? <p className="pf-board-effort">{effortLine(b)}</p> : null}
                    <LoadLog
                      category={b.movementCategory}
                      name={b.name}
                      place={profile.savedPlace?.label}
                    />
                  </div>
                </div>
                {b.restSec ? (
                  <RestTimer
                    seconds={b.restSec}
                    onComplete={() =>
                      ping(
                        awardOnce({
                          key: `${plan.id}:${day.dayIndex}:rest:${b.id}`,
                          theme,
                          kind: "rest",
                          xp: theme === "dnd" ? 2 : 0,
                          roll: theme === "dnd",
                        }),
                      )
                    }
                  />
                ) : null}
                <div className="pf-board-actions">
                  <button
                    type="button"
                    className="pf-linkish"
                    onClick={() => setVideoOpen((m) => ({ ...m, [b.id]: !m[b.id] }))}
                  >
                    {showVideo ? "Hide video" : "Watch"}
                  </button>
                  <button type="button" className="pf-linkish" onClick={() => setSwapBlockId(b.id)}>
                    Swap
                  </button>
                  {b.coachingCues?.length || b.coachInsight ? (
                    <button
                      type="button"
                      className="pf-linkish"
                      onClick={() => setCuesOpen((m) => ({ ...m, [b.id]: !m[b.id] }))}
                    >
                      {cuesShown ? "Hide how" : "How to do it"}
                    </button>
                  ) : null}
                </div>
                {cuesShown ? (
                  <div className="mt-2 space-y-1">
                    {b.coachingCues?.map((c) => (
                      <p key={c} className="text-xs text-[var(--pf-muted)]">
                        {c}
                      </p>
                    ))}
                    {b.coachInsight ? (
                      <p className="text-xs text-[var(--pf-silver)]">{b.coachInsight}</p>
                    ) : null}
                  </div>
                ) : null}
                {showVideo ? (
                  <VideoBlock url={b.videoUrl} title={b.videoTitle} compact={compact} cueSteps={b.cueSteps} forceOpen />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">{flavorMealsTitle(theme)}</h2>
        {MEAL_SLOTS.map((slot) => {
          const m = day.meals[slot];
          if (!m) return null;
          const checked = progress.meals.includes(m.id);
          const showVideo = videoOpen[m.id];
          return (
            <div key={slot} className={`pf-board-card ${checked ? "is-done" : ""}`}>
              <div className="flex items-start gap-3">
                <CheckOff checked={checked} onToggle={() => toggleMeal(m.id)} label={`Mark ${m.name} done`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">
                    {flavorMealSlot(theme, slot)}
                  </p>
                  <p className="pf-board-name">{m.name}</p>
                  {m.fuelingTip ? <p className="pf-board-effort">{m.fuelingTip}</p> : null}
                  <ul className="mt-2 space-y-1 text-sm text-[var(--pf-silver)]">
                    {m.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {m.prepNote ? <p className="mt-2 text-xs text-[var(--pf-muted)]">{m.prepNote}</p> : null}
                </div>
              </div>
              <div className="pf-board-actions">
                <button
                  type="button"
                  className="pf-linkish"
                  onClick={() => setVideoOpen((map) => ({ ...map, [m.id]: !map[m.id] }))}
                >
                  {showVideo ? "Hide video" : "Watch"}
                </button>
                <button type="button" className="pf-linkish" onClick={() => setSwapMealSlot(slot)}>
                  Swap
                </button>
              </div>
              {m.coachInsight ? (
                <p className="mt-2 text-xs text-[var(--pf-muted)]">{m.coachInsight}</p>
              ) : null}
              {showVideo ? (
                <VideoBlock url={m.videoUrl} title={m.videoTitle} compact cueSteps={m.cueSteps} forceOpen />
              ) : null}
            </div>
          );
        })}
      </section>

      {swapBlockId ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4" role="dialog">
          <div className="pf-card max-h-[80vh] w-full max-w-lg overflow-y-auto p-4">
            <p className="font-semibold">{flavorSwapTitle(theme, "exercise")}</p>
            <p className="mt-1 text-xs text-[var(--pf-muted)]">Matches the gear you listed.</p>
            <ul className="mt-3 space-y-2">
              {exerciseAlts.map((opt) => (
                <li key={opt.key}>
                  <button
                    type="button"
                    className="pf-board-card pf-press w-full text-left"
                    onClick={() => swapExercise(opt)}
                  >
                    <span className="pf-board-name text-base">{opt.name}</span>
                    <span className="pf-board-effort block">{opt.detail}</span>
                  </button>
                </li>
              ))}
              {exerciseAlts.length === 0 ? (
                <p className="text-sm text-[var(--pf-muted)]">No swaps for this gear yet.</p>
              ) : null}
            </ul>
            <button type="button" className="pf-btn-ghost mt-3 w-full" onClick={() => setSwapBlockId(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {swapMealSlot ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4" role="dialog">
          <div className="pf-card max-h-[80vh] w-full max-w-lg overflow-y-auto p-4">
            <p className="font-semibold">
              {flavorSwapTitle(theme, "meal")}
              {swapMealSlot ? ` · ${flavorMealSlot(theme, swapMealSlot)}` : ""}
            </p>
            <p className="mt-1 text-xs text-[var(--pf-muted)]">Matches how you eat; pantry items float up.</p>
            <ul className="mt-3 space-y-2">
              {mealAlts.map((opt) => (
                <li key={opt.key}>
                  <button
                    type="button"
                    className="pf-board-card pf-press w-full text-left"
                    onClick={() => swapMeal(opt)}
                  >
                    <span className="pf-board-name text-base">{opt.name}</span>
                    <span className="pf-board-effort block">{opt.items.join(" · ")}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="pf-btn-ghost mt-3 w-full" onClick={() => setSwapMealSlot(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
