"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getDayProgress, saveWeekPlan, setDayProgress } from "@/lib/storage";
import { syncWeekProgress } from "@/lib/progress";

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
  const profile: UserProfile = plan.profile;
  const [progress, setProgress] = useState(() => getDayProgress(plan.id, day.dayIndex));
  const [cuesOpen, setCuesOpen] = useState<Record<string, boolean>>({});
  const [videoOpen, setVideoOpen] = useState<Record<string, boolean>>({});
  const [swapBlockId, setSwapBlockId] = useState<string | null>(null);
  const [swapMealSlot, setSwapMealSlot] = useState<MealSlot | null>(null);

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

  function toggleBlock(id: string) {
    const blocks = progress.blocks.includes(id)
      ? progress.blocks.filter((x) => x !== id)
      : [...progress.blocks, id];
    const next = { ...progress, blocks };
    const wasDone = progress.blocks.length + progress.meals.length >= total && total > 0;
    const nowDone = blocks.length + progress.meals.length >= total && total > 0;
    persist(next, !wasDone && nowDone);
  }

  function toggleMeal(id: string) {
    const meals = progress.meals.includes(id)
      ? progress.meals.filter((x) => x !== id)
      : [...progress.meals, id];
    const next = { ...progress, meals };
    const wasDone = progress.blocks.length + progress.meals.length >= total && total > 0;
    const nowDone = progress.blocks.length + meals.length >= total && total > 0;
    persist(next, !wasDone && nowDone);
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
      <section className="space-y-3">
        {!compact ? (
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {day.workout.isRest ? "Recovery" : "Today’s session"}
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
                      <p className="pf-board-name">{b.name}</p>
                      {b.durationMin ? (
                        <span className="shrink-0 pt-1 text-xs tabular-nums text-[var(--pf-muted)]">
                          {b.durationMin} min
                        </span>
                      ) : null}
                    </div>
                    <p className="pf-board-effort">{b.detail}</p>
                    {effortLine(b) ? <p className="pf-board-effort">{effortLine(b)}</p> : null}
                  </div>
                </div>
                {b.restSec ? <RestTimer seconds={b.restSec} /> : null}
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
        <h2 className="text-lg font-semibold tracking-tight">Meals</h2>
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
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">{slot}</p>
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
            <p className="font-semibold">Swap exercise</p>
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
            <p className="font-semibold">Swap {swapMealSlot}</p>
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
