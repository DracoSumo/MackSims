"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DayBoard, mealCount } from "@/components/DayBoard";
import { GoalsStrip } from "@/components/GoalsPanel";
import { ProgressRing } from "@/components/ProgressRing";
import { RequirePlan } from "@/components/RequirePlan";
import { useTheme } from "@/components/ThemeProvider";
import { ToolsStrip } from "@/components/ToolsStrip";
import { WearablesGlance } from "@/components/WearablesGlance";
import { WeekGoalBar } from "@/components/WeekGoalBar";
import { getMeasurableGoals } from "@/lib/goals";
import { useKeepAwake } from "@/lib/device";
import { todayDayIndex } from "@/lib/planEngine";
import { getWeekStat, syncWeekProgress, todaySessionComplete } from "@/lib/progress";
import { getDayProgress, getProfile, getWeekPlan } from "@/lib/storage";
import type { MeasurableGoals } from "@/data/types";
import type { WeekDay, WeekPlan } from "@/data/types";

function greeting(name: string) {
  const h = new Date().getHours();
  const when = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${when}, ${name}`;
}

function TodayContent() {
  const { copy } = useTheme();
  const [day, setDay] = useState<WeekDay | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [name, setName] = useState("Athlete");
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [weekDone, setWeekDone] = useState(0);
  const [goals, setGoals] = useState<MeasurableGoals | null>(null);

  function hydrate(nextPlan: WeekPlan) {
    const d = nextPlan.days[todayDayIndex()] ?? nextPlan.days[0];
    setPlan(nextPlan);
    setDay(d);
    const t = d.workout.blocks.length + mealCount(d);
    const p = getDayProgress(nextPlan.id, d.dayIndex);
    setTotal(t);
    setDone(p.blocks.length + p.meals.length);
    const stat = syncWeekProgress(nextPlan);
    setWeekDone(stat.completedTrainingDays);
  }

  useEffect(() => {
    const p = getWeekPlan();
    const profile = getProfile();
    if (profile) setName(profile.displayName);
    setGoals(getMeasurableGoals());
    if (p) hydrate(p);
  }, []);

  const todayDone = Boolean(day && plan && (todaySessionComplete(day, plan.id) || (total > 0 && done >= total)));
  useKeepAwake(Boolean(day && plan && !todayDone && total > 0));

  if (!day || !plan) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="pf-display text-2xl font-bold">No week on this device</h1>
        <p className="text-sm text-[var(--pf-muted)]">Choose your lane and we&apos;ll build today&apos;s session here.</p>
        <Link href="/app/onboarding/" className="pf-btn-primary inline-flex">
          Choose my lane
        </Link>
      </div>
    );
  }
  const { workout } = day;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        {copy.todayEyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-silver)]">
            {copy.todayEyebrow}
          </p>
        ) : null}
        <p className="text-sm text-[var(--pf-muted)]">{greeting(name)}</p>
        <h1 className="pf-display text-3xl font-bold">{day.dayName}</h1>
        <p className="text-sm text-[var(--pf-silver)]">
          {workout.focus}
          {workout.phaseLabel ? ` · ${workout.phaseLabel}` : ""}
        </p>
      </header>

      <div className={`space-y-5 ${todayDone ? "pf-complete-pulse" : ""}`}>
        <ProgressRing done={done} total={total} />
        {todayDone ? <p className="pf-done-banner">Session complete.</p> : null}
        <WeekGoalBar
          compact
          plan={plan}
          completedTrainingDays={weekDone || getWeekStat(plan).completedTrainingDays}
          todayDone={todayDone}
        />
        {goals ? <GoalsStrip goals={goals} compact /> : null}
        <ToolsStrip />
        <WearablesGlance />
      </div>

      <DayBoard
        day={day}
        plan={plan}
        onPlanChange={(next) => hydrate(next)}
        onProgressChange={(d, t) => {
          setDone(d);
          setTotal(t);
          const latest = getWeekPlan();
          if (latest) setWeekDone(syncWeekProgress(latest).completedTrainingDays);
        }}
      />

      <p className="text-center text-xs text-[var(--pf-muted)]">
        <Link href="/app/methods/" className="pf-linkish">
          How this plan is built
        </Link>
      </p>
    </div>
  );
}

export default function TodayPage() {
  return (
    <RequirePlan>
      <TodayContent />
    </RequirePlan>
  );
}
