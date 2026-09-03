"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  BudgetId,
  DietaryId,
  EquipmentId,
  ExperienceId,
  FoodStapleId,
  GoalId,
  MeasurableGoals,
  SportId,
  TrainingLocationMode,
} from "@/data/types";
import {
  DAYS_OPTIONS,
  DEFAULT_EQUIPMENT,
  DEFAULT_FOOD,
  EXPERIENCE,
  GOALS,
  SPORTS,
  labelBudget,
  labelLocation,
} from "@/data/options";
import { ChoiceButton, ChoiceChip } from "@/components/ChoiceButton";
import { SportPicker } from "@/components/SportPicker";
import { LocationModeEditor } from "@/components/InventoryEditors";
import { emptyGoals, getMeasurableGoals, saveMeasurableGoals } from "@/lib/goals";
import { buildWeekPlan } from "@/lib/planEngine";
import { getProfile, saveProfile, saveWeekPlan } from "@/lib/storage";
import { geoStatusMessage, getDeviceLocation } from "@/lib/device";

/** Short path: diet / budget / numbers / pantry use defaults — adjust later in You. */
const STEPS = ["Welcome", "Sport", "Goal", "Experience", "Schedule", "Location", "Done"] as const;

function applyLocationGear(
  mode: TrainingLocationMode,
  current: EquipmentId[],
): EquipmentId[] {
  const next = new Set(current);
  next.add("bodyweight");
  if (mode === "commercial-gym") next.add("full-gym");
  return Array.from(next);
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [sport, setSport] = useState<SportId>("general-strength");
  const [goal, setGoal] = useState<GoalId>("maintain");
  const [experience, setExperience] = useState<ExperienceId>("beginner");
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 6>(4);
  const [dietary] = useState<DietaryId>("none");
  const [budget] = useState<BudgetId>("moderate");
  const [measurable, setMeasurable] = useState<MeasurableGoals>(emptyGoals);
  const [equipment, setEquipment] = useState<EquipmentId[]>(DEFAULT_EQUIPMENT);
  const [foodInventory] = useState<FoodStapleId[]>(DEFAULT_FOOD);
  const [locationMode, setLocationMode] = useState<TrainingLocationMode>("home");
  const [placeLabel, setPlaceLabel] = useState("");
  const [placeLat, setPlaceLat] = useState<number | undefined>();
  const [placeLng, setPlaceLng] = useState<number | undefined>();
  const [geoStatus, setGeoStatus] = useState("");

  useEffect(() => {
    const existing = getProfile();
    setMeasurable(getMeasurableGoals());
    if (!existing) return;
    if (existing.displayName) setDisplayName(existing.displayName);
    if (existing.sport) setSport(existing.sport);
    if (existing.goal) setGoal(existing.goal);
    if (existing.experience) setExperience(existing.experience);
    if (existing.daysPerWeek) setDaysPerWeek(existing.daysPerWeek);
    if (existing.equipment?.length) setEquipment(existing.equipment);
    if (existing.locationMode) setLocationMode(existing.locationMode);
    if (existing.savedPlace?.label) setPlaceLabel(existing.savedPlace.label);
    if (existing.savedPlace?.lat != null) setPlaceLat(existing.savedPlace.lat);
    if (existing.savedPlace?.lng != null) setPlaceLng(existing.savedPlace.lng);
  }, []);

  async function requestGeo() {
    setGeoStatus("Requesting this device location…");
    const result = await getDeviceLocation();
    if (result.ok) {
      setPlaceLat(result.coords.lat);
      setPlaceLng(result.coords.lng);
      if (!placeLabel.trim()) setPlaceLabel("This device");
    }
    setGeoStatus(geoStatusMessage(result));
  }

  function handleLocationChange(mode: TrainingLocationMode) {
    setLocationMode(mode);
    setEquipment((prev) => applyLocationGear(mode, prev));
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function finish() {
    const gear = applyLocationGear(locationMode, equipment.length ? equipment : ["bodyweight"]);
    const food = foodInventory.length ? foodInventory : DEFAULT_FOOD;
    const profile = {
      sport,
      goal,
      experience,
      daysPerWeek,
      dietary,
      budget,
      displayName: displayName.trim() || "Athlete",
      onboardedAt: new Date().toISOString(),
      equipment: gear,
      foodInventory: food,
      locationMode,
      savedPlace: placeLabel.trim()
        ? { label: placeLabel.trim(), lat: placeLat, lng: placeLng }
        : placeLat != null
          ? { label: placeLabel.trim() || "Saved location", lat: placeLat, lng: placeLng }
          : undefined,
    };
    saveProfile(profile);
    saveMeasurableGoals(measurable);
    saveWeekPlan(buildWeekPlan(profile));
    router.replace("/app/today/");
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--pf-header-h)-2rem)] flex-col">
      <div className="flex-1 space-y-6 pb-4">
        <div className="flex gap-1" aria-hidden>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[var(--pf-purple)]" : "bg-white/10"}`}
            />
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-wide text-[var(--pf-muted)]">
          {step + 1} of {STEPS.length} · about a minute
        </p>

        {step === 0 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Choose your lane</h1>
            <p className="text-sm text-[var(--pf-muted)]">
              Sport, goal, and where you train. Diet, budget, and pantry start on sensible defaults — tweak anytime in
              You. Ages 13+. Not medical advice.
            </p>
            <label className="block text-sm">
              What should we call you?
              <input
                className="pf-input mt-2"
                placeholder="Chris"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="given-name"
              />
            </label>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">What&apos;s your sport?</h2>
            <SportPicker value={sport} onChange={setSport} />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">What&apos;s the aim?</h2>
            {GOALS.map((g) => (
              <ChoiceButton
                key={g.id}
                selected={goal === g.id}
                onClick={() => setGoal(g.id)}
                title={g.label}
                description={g.description}
              />
            ))}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">How long have you been training?</h2>
            {EXPERIENCE.map((e) => (
              <ChoiceButton
                key={e.id}
                selected={experience === e.id}
                onClick={() => setExperience(e.id)}
                title={e.label}
                description={e.description}
              />
            ))}
          </section>
        )}

        {step === 4 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">How many days this week?</h2>
            <div className="flex flex-wrap gap-2">
              {DAYS_OPTIONS.map((d) => (
                <ChoiceChip key={d} selected={daysPerWeek === d} onClick={() => setDaysPerWeek(d)}>
                  {d} days
                </ChoiceChip>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Where do you train?</h2>
            <p className="text-sm text-[var(--pf-muted)]">
              We match gear defaults to this place. Full equipment and pantry lists live under You.
            </p>
            <LocationModeEditor
              mode={locationMode}
              onModeChange={handleLocationChange}
              placeLabel={placeLabel}
              onPlaceLabelChange={setPlaceLabel}
              onRequestGeo={requestGeo}
              geoStatus={geoStatus}
            />
          </section>
        )}

        {step === 6 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">You&apos;re set</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[var(--pf-muted)]">Name:</span> {displayName || "Athlete"}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Sport:</span>{" "}
                {SPORTS.find((s) => s.id === sport)?.label}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Goal:</span>{" "}
                {GOALS.find((g) => g.id === goal)?.label} · {daysPerWeek} days/week
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Location:</span> {labelLocation(locationMode)}
                {placeLabel ? ` · ${placeLabel}` : ""}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Defaults:</span> {labelBudget(budget)} grocery · open diet ·
                starter pantry
              </p>
            </div>
            <p className="text-xs text-[var(--pf-muted)]">
              Not medical advice. Ages 13+.{" "}
              <Link href="/app/profile/" className="pf-linkish">
                Adjust later in You
              </Link>
              .
            </p>
          </section>
        )}
      </div>

      <div className="pf-sticky-actions">
        <div className="flex gap-3">
          {step > 0 ? (
            <button type="button" className="pf-btn-ghost flex-1" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <button type="button" className="pf-btn-primary flex-1" onClick={goNext}>
              Continue
            </button>
          ) : (
            <button type="button" className="pf-btn-primary flex-1" onClick={finish}>
              Start my week
            </button>
          )}
        </div>
        {step < STEPS.length - 1 ? (
          <button type="button" className="mt-2 w-full text-sm text-[var(--pf-muted)]" onClick={finish}>
            Use defaults and start
          </button>
        ) : null}
      </div>
    </div>
  );
}
