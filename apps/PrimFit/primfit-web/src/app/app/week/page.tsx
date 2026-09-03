"use client";

import { useEffect, useState } from "react";
import { RequirePlan } from "@/components/RequirePlan";
import { ToolsStrip } from "@/components/ToolsStrip";
import { useTheme } from "@/components/ThemeProvider";
import { DaySheet, WeekCalendar } from "@/components/WeekCalendar";
import { WeekGoalBar } from "@/components/WeekGoalBar";
import { getWeekPlan } from "@/lib/storage";
import { getWeekStat, syncWeekProgress, todaySessionComplete } from "@/lib/progress";
import { todayDayIndex } from "@/lib/planEngine";
import { currentPlanWeek } from "@/lib/weekCalendar";
import type { WeekPlan } from "@/data/types";

function WeekContent() {
  const { copy } = useTheme();
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [sheetIndex, setSheetIndex] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [weekDone, setWeekDone] = useState(0);
  const week = currentPlanWeek();

  useEffect(() => {
    const p = getWeekPlan();
    setPlan(p);
    if (p) setWeekDone(syncWeekProgress(p).completedTrainingDays);
  }, []);

  useEffect(() => {
    if (sheetIndex == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetIndex]);

  if (!plan) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="pf-display text-2xl font-bold">Week is empty</h1>
        <p className="text-sm text-[var(--pf-muted)]">Finish onboarding once and this calendar fills with your training days.</p>
        <a href="/app/onboarding/" className="pf-btn-primary inline-flex">
          Choose my lane
        </a>
      </div>
    );
  }
  const todayIdx = todayDayIndex();
  const today = plan.days[todayIdx] ?? plan.days[0];
  const todayDone = todaySessionComplete(today, plan.id);
  const sheetDay = sheetIndex != null ? (plan.days[sheetIndex] ?? null) : null;
  const sheetDate = sheetIndex != null ? (week.dates[sheetIndex] ?? week.dates[0]) : week.dates[0];

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        {copy.weekEyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-silver)]">
            {copy.weekEyebrow}
          </p>
        ) : null}
        <h1 className="pf-display text-3xl font-bold">{week.monthTitle}</h1>
        <p className="text-sm text-[var(--pf-muted)]">
          {week.rangeLabel} · {plan.profile.daysPerWeek} training days
        </p>
      </header>

      <ToolsStrip />

      <WeekCalendar
        days={plan.days}
        dates={week.dates}
        planId={plan.id}
        todayIndex={today.dayIndex}
        selectedIndex={sheetIndex}
        onSelect={setSheetIndex}
      />

      <p className="text-xs text-[var(--pf-muted)]">{copy.weekHint}</p>

      <WeekGoalBar
        compact
        plan={plan}
        completedTrainingDays={weekDone || getWeekStat(plan).completedTrainingDays}
        todayDone={todayDone}
      />

      {sheetDay ? (
        <DaySheet
          day={sheetDay}
          date={sheetDate}
          plan={plan}
          isToday={sheetDay.dayIndex === today.dayIndex}
          tick={tick}
          onClose={() => setSheetIndex(null)}
          onPlanChange={(next) => {
            setPlan(next);
            setWeekDone(syncWeekProgress(next).completedTrainingDays);
            setTick((n) => n + 1);
          }}
          onProgressChange={() => {
            setWeekDone(syncWeekProgress(plan).completedTrainingDays);
            setTick((n) => n + 1);
          }}
        />
      ) : null}
    </div>
  );
}

export default function WeekPage() {
  return (
    <RequirePlan>
      <WeekContent />
    </RequirePlan>
  );
}
