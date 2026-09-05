"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DayBoard, mealCount } from "@/components/DayBoard";
import { GoalHuntCard } from "@/components/GoalHuntCard";
import { ProgressRing } from "@/components/ProgressRing";
import { RequirePlan } from "@/components/RequirePlan";
import { useTheme } from "@/components/ThemeProvider";
import { ToolsStrip } from "@/components/ToolsStrip";
import { WearablesGlance } from "@/components/WearablesGlance";
import { CampaignPanel } from "@/components/CampaignPanel";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { FlavorToast } from "@/components/FlavorToast";
import { WorldPulse } from "@/components/WorldPulse";
import { WeekGoalBar } from "@/components/WeekGoalBar";
import { flavorCompleteBanner, flavorGreeting, flavorProgressHint, flavorProgressLabel, flavorRankUpLabel } from "@/lib/flavor";
import { claimDailyCheckin, type FlavorEvent } from "@/lib/campaign";
import type { WeekDay, WeekPlan } from "@/data/types";
import { useKeepAwake } from "@/lib/device";
import { todayDayIndex } from "@/lib/planEngine";
import { getWeekStat, syncWeekProgress, todaySessionComplete } from "@/lib/progress";
import { getDayProgress, getProfile, getWeekPlan } from "@/lib/storage";
import { SaveWeekPrompt } from "@/components/SaveWeekPrompt";

function TodayContent() {
  const { copy, theme, ready } = useTheme();
  const [day, setDay] = useState<WeekDay | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [name, setName] = useState("Athlete");
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [weekDone, setWeekDone] = useState(0);
  const [checkin, setCheckin] = useState<FlavorEvent | null>(null);

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
    if (!ready) return;
    const p = getWeekPlan();
    const profile = getProfile();
    if (profile) setName(profile.displayName);
    if (p) hydrate(p);
    const claimed = claimDailyCheckin(theme);
    if (claimed) setCheckin(claimed);
  }, [theme, ready]);

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
      <SaveWeekPrompt />
      <header className="space-y-1">
        {copy.todayEyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-silver)]">
            {copy.todayEyebrow}
          </p>
        ) : null}
        <p className="text-sm text-[var(--pf-muted)]">{flavorGreeting(theme, name)}</p>
        <h1 className="pf-display text-3xl font-bold">{day.dayName}</h1>
        <p className="text-sm text-[var(--pf-silver)]">
          {workout.focus}
          {workout.phaseLabel ? ` · ${workout.phaseLabel}` : ""}
        </p>
      </header>

      <WorldPulse />
      <CampaignPanel focus={workout.focus} isRest={workout.isRest} />
      <FlavorToast
        message={checkin ? checkin.toast : null}
        rankedUp={checkin?.rankedUp}
        rankLabel={flavorRankUpLabel(theme)}
        onDone={() => setCheckin(null)}
      />

      <div className={`space-y-5 ${todayDone ? "pf-complete-pulse" : ""}`}>
        <ConfettiBurst play={todayDone} />
        <ProgressRing
          done={done}
          total={total}
          label={flavorProgressLabel(theme, todayDone, done, total)}
          hint={flavorProgressHint(theme, todayDone, workout.isRest)}
        />
        {todayDone ? <p className="pf-done-banner">{flavorCompleteBanner(theme)}</p> : null}
        <WeekGoalBar
          compact
          plan={plan}
          completedTrainingDays={weekDone || getWeekStat(plan).completedTrainingDays}
          todayDone={todayDone}
        />
        <GoalHuntCard />
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
