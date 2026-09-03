"use client";

import { useState } from "react";
import type {
  ChallengeGoal,
  MeasurableGoals,
  StrengthGoal,
  StrengthLiftId,
  StrengthTrackMode,
  WeightUnit,
} from "@/data/types";
import { STRENGTH_LIFTS } from "@/data/options";
import { ChoiceChip } from "@/components/ChoiceButton";
import {
  challengeCountdown,
  liftCopy,
  liftProgressPct,
  progressPct,
  suggestedChallenge,
  suggestedLift,
  weightCopy,
} from "@/lib/goals";

function numOrEmpty(v?: number): string {
  return v == null || Number.isNaN(v) ? "" : String(v);
}

function parseNum(raw: string): number | undefined {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function GoalsStrip({
  goals,
  compact,
}: {
  goals: MeasurableGoals;
  compact?: boolean;
}) {
  const bits: { label: string; detail: string; pct: number | null }[] = [];
  if (goals.weight && (goals.weight.current != null || goals.weight.target != null)) {
    bits.push({
      label: "Scale",
      detail: weightCopy(goals.weight),
      pct: progressPct(goals.weight.current, goals.weight.target, goals.weight.start),
    });
  }
  for (const lift of goals.lifts.slice(0, 2)) {
    bits.push({ label: liftCopy(lift).split(":")[0], detail: liftCopy(lift), pct: liftProgressPct(lift) });
  }
  const openChallenge = goals.challenges.find((c) => !c.completed) ?? goals.challenges[0];
  if (openChallenge) {
    bits.push({
      label: openChallenge.name,
      detail: challengeCountdown(openChallenge),
      pct: openChallenge.completed ? 100 : null,
    });
  }
  if (!bits.length) return null;
  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {bits.slice(0, 3).map((b) => (
          <div key={b.label + b.detail} className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">
              {b.label}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-[var(--pf-silver)]">{b.detail}</p>
            {b.pct != null ? (
              <div className="pf-mini-bar mt-2" role="progressbar" aria-valuenow={b.pct} aria-valuemin={0} aria-valuemax={100}>
                <i style={{ width: `${b.pct}%` }} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return (
    <section className="space-y-3">
      {bits.map((b) => (
        <div key={b.label + b.detail}>
          <p className="text-sm font-medium">{b.label}</p>
          <p className="text-xs text-[var(--pf-muted)]">{b.detail}</p>
          {b.pct != null ? (
            <div className="pf-mini-bar mt-1" role="progressbar" aria-valuenow={b.pct} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${b.pct}%` }} />
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function GoalsEditor({
  value,
  onChange,
  sport,
  compact,
}: {
  value: MeasurableGoals;
  onChange: (next: MeasurableGoals) => void;
  sport?: string;
  compact?: boolean;
}) {
  const [challengeName, setChallengeName] = useState("");
  const [challengeDate, setChallengeDate] = useState("");
  const unit: WeightUnit = value.weight?.unit ?? "lb";
  const liftUnit: WeightUnit = value.lifts[0]?.unit ?? unit;

  function setWeight(patch: Partial<NonNullable<MeasurableGoals["weight"]>>) {
    const prev = value.weight ?? { unit };
    const next = { ...prev, ...patch };
    if (next.start == null && next.current != null) next.start = next.current;
    onChange({ ...value, weight: next });
  }

  function upsertLift(liftId: StrengthLiftId) {
    const existing = value.lifts.find((l) => l.liftId === liftId);
    if (existing) {
      onChange({ ...value, lifts: value.lifts.filter((l) => l.liftId !== liftId) });
      return;
    }
    const row: StrengthGoal = {
      liftId,
      unit: liftUnit,
      mode: "estimated-single",
    };
    onChange({ ...value, lifts: [...value.lifts, row] });
  }

  function patchLift(liftId: StrengthLiftId, patch: Partial<StrengthGoal>) {
    onChange({
      ...value,
      lifts: value.lifts.map((l) => (l.liftId === liftId ? { ...l, ...patch } : l)),
    });
  }

  function addChallenge() {
    const name = challengeName.trim() || suggestedChallenge(sport ?? "general-strength");
    const row: ChallengeGoal = {
      id: `ch-${Date.now()}`,
      name,
      targetDate: challengeDate || undefined,
      completed: false,
    };
    onChange({ ...value, challenges: [...value.challenges, row] });
    setChallengeName("");
    setChallengeDate("");
  }

  function toggleChallenge(id: string) {
    onChange({
      ...value,
      challenges: value.challenges.map((c) =>
        c.id === id
          ? { ...c, completed: !c.completed, completedAt: !c.completed ? new Date().toISOString() : undefined }
          : c,
      ),
    });
  }

  const suggestLift = suggestedLift(sport ?? "general-strength");

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <h3 className="font-semibold">Goal weight (optional)</h3>
        <p className="text-xs text-[var(--pf-muted)]">
          Current and target. The scale moves around — this is a trend, not medical advice.
        </p>
        <div className="flex flex-wrap gap-2">
          <ChoiceChip selected={unit === "lb"} onClick={() => setWeight({ unit: "lb" })}>
            lb
          </ChoiceChip>
          <ChoiceChip selected={unit === "kg"} onClick={() => setWeight({ unit: "kg" })}>
            kg
          </ChoiceChip>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">
            Now
            <input
              className="mt-1 w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5"
              inputMode="decimal"
              placeholder="180"
              value={numOrEmpty(value.weight?.current)}
              onChange={(e) => setWeight({ current: parseNum(e.target.value) })}
            />
          </label>
          <label className="text-sm">
            Target
            <input
              className="mt-1 w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5"
              inputMode="decimal"
              placeholder="170"
              value={numOrEmpty(value.weight?.target)}
              onChange={(e) => setWeight({ target: parseNum(e.target.value) })}
            />
          </label>
        </div>
        {value.weight && (value.weight.current != null || value.weight.target != null) ? (
          <p className="text-xs text-[var(--pf-silver)]">{weightCopy(value.weight)}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">Heaviest single lift (optional)</h3>
        <p className="text-xs text-[var(--pf-muted)]">
          The heaviest you can lift once with good form — or track a 5-rep weight instead. Beginners do not need a true
          max-out test; estimates are fine.
        </p>
        <div className="flex flex-wrap gap-2">
          {STRENGTH_LIFTS.map((l) => (
            <ChoiceChip
              key={l.id}
              selected={value.lifts.some((x) => x.liftId === l.id)}
              onClick={() => upsertLift(l.id)}
            >
              {l.label}
              {l.id === suggestLift ? " · sport pick" : ""}
            </ChoiceChip>
          ))}
        </div>
        {value.lifts.map((lift) => (
          <div key={lift.liftId} className="pf-card space-y-2 p-3">
            <p className="text-sm font-medium">{liftCopy(lift)}</p>
            <div className="flex flex-wrap gap-2">
              {(["estimated-single", "five-rep"] as StrengthTrackMode[]).map((mode) => (
                <ChoiceChip key={mode} selected={lift.mode === mode} onClick={() => patchLift(lift.liftId, { mode })}>
                  {mode === "five-rep" ? "I’d rather track a 5-rep weight" : "Estimated heaviest single"}
                </ChoiceChip>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm">
                Now ({lift.unit})
                <input
                  className="mt-1 w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5"
                  inputMode="decimal"
                  value={numOrEmpty(lift.current)}
                  onChange={(e) => patchLift(lift.liftId, { current: parseNum(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                Goal ({lift.unit})
                <input
                  className="mt-1 w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5"
                  inputMode="decimal"
                  value={numOrEmpty(lift.target)}
                  onChange={(e) => patchLift(lift.liftId, { target: parseNum(e.target.value) })}
                />
              </label>
            </div>
            {liftProgressPct(lift) != null ? (
              <div className="pf-mini-bar" role="progressbar" aria-valuenow={liftProgressPct(lift) ?? 0}>
                <i style={{ width: `${liftProgressPct(lift)}%` }} />
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">Challenge or event (optional)</h3>
        <p className="text-xs text-[var(--pf-muted)]">
          First 5K, HYROX, a pull-up, 30-day consistency — name it and optionally pick a date.
        </p>
        {value.challenges.map((ch) => (
          <label key={ch.id} className="pf-card pf-press flex cursor-pointer items-start gap-3 p-3">
            <input
              type="checkbox"
              checked={ch.completed}
              onChange={() => toggleChallenge(ch.id)}
              className="mt-1 h-5 w-5 accent-[var(--pf-purple)]"
            />
            <span>
              <span className="block font-medium">{ch.name}</span>
              <span className="block text-xs text-[var(--pf-muted)]">{challengeCountdown(ch)}</span>
            </span>
          </label>
        ))}
        {!compact || value.challenges.length === 0 ? (
          <div className="space-y-2">
            <input
              className="w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5 text-sm"
              placeholder={suggestedChallenge(sport ?? "general-strength")}
              value={challengeName}
              onChange={(e) => setChallengeName(e.target.value)}
            />
            <input
              type="date"
              className="w-full rounded-lg border border-[var(--pf-line)] bg-white/5 px-3 py-2.5 text-sm"
              value={challengeDate}
              onChange={(e) => setChallengeDate(e.target.value)}
            />
            <button type="button" className="pf-btn-ghost w-full text-sm" onClick={addChallenge}>
              Add challenge
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
