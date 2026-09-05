"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  BodyContextId,
  BudgetId,
  DaysPerWeek,
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
  BODY_CONTEXTS,
  DAYS_OPTIONS,
  DEFAULT_EQUIPMENT,
  DEFAULT_FOOD,
  DIETARY,
  EXPERIENCE,
  GOALS,
  SPORTS,
  labelBudget,
  labelLocation,
} from "@/data/options";
import { ChoiceButton, ChoiceChip } from "@/components/ChoiceButton";
import { SportPicker } from "@/components/SportPicker";
import { LocationModeEditor } from "@/components/InventoryEditors";
import { NearbyGyms } from "@/components/NearbyGyms";
import { WeekDayPicker } from "@/components/WeekDayPicker";
import { markJustOnboarded } from "@/components/SaveWeekPrompt";
import { emptyGoals, getMeasurableGoals, saveMeasurableGoals } from "@/lib/goals";
import { buildWeekPlan } from "@/lib/planEngine";
import { getProfile, saveProfile, saveWeekPlan } from "@/lib/storage";
import { geoStatusMessage, getDeviceLocation } from "@/lib/device";
import { useTheme } from "@/components/ThemeProvider";
import { PACKS, applyThemeToDocument, getActiveTheme, type ThemeId } from "@/lib/themes";
import { dietFlags, primaryDietary } from "@/lib/diet";
import { labelAims, profileAims, toggleAim } from "@/lib/aims";
import { defaultTrainingDays, describeSplit, isDaysPerWeek, normalizeTrainingDays } from "@/lib/trainingDays";

const STEPS = ["Welcome", "Sport", "Aim", "Experience", "Schedule", "Diet", "Location", "Done"] as const;

function applyLocationGear(mode: TrainingLocationMode, current: EquipmentId[]): EquipmentId[] {
  const next = new Set(current);
  next.add("bodyweight");
  if (mode === "commercial-gym") next.add("full-gym");
  return Array.from(next);
}

export function OnboardingWizard() {
  const router = useRouter();
  const { buy, preview } = useTheme();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [sport, setSport] = useState<SportId>("general-strength");
  const [aims, setAims] = useState<GoalId[]>([]);
  const [goalNote, setGoalNote] = useState("");
  const [bodyContext, setBodyContext] = useState<BodyContextId>("unspecified");
  const [bodyContextNote, setBodyContextNote] = useState("");
  const [experience, setExperience] = useState<ExperienceId>("beginner");
  const [daysPerWeek, setDaysPerWeek] = useState<DaysPerWeek>(4);
  const [trainingDays, setTrainingDays] = useState<number[]>(defaultTrainingDays(4));
  const [dietaryFlags, setDietaryFlags] = useState<DietaryId[]>([]);
  const [budget] = useState<BudgetId>("moderate");
  const [measurable, setMeasurable] = useState<MeasurableGoals>(emptyGoals);
  const [equipment, setEquipment] = useState<EquipmentId[]>(DEFAULT_EQUIPMENT);
  const [foodInventory] = useState<FoodStapleId[]>(DEFAULT_FOOD);
  const [locationMode, setLocationMode] = useState<TrainingLocationMode>("home");
  const [placeLabel, setPlaceLabel] = useState("");
  const [placeLat, setPlaceLat] = useState<number | undefined>();
  const [placeLng, setPlaceLng] = useState<number | undefined>();
  const [geoStatus, setGeoStatus] = useState("");
  const [vibe, setVibe] = useState<ThemeId>("sleek");

  useEffect(() => {
    applyThemeToDocument("sleek");
    return () => {
      applyThemeToDocument(getActiveTheme());
    };
  }, []);

  useEffect(() => {
    const existing = getProfile();
    setMeasurable(getMeasurableGoals());
    if (!existing) return;
    if (existing.displayName) setDisplayName(existing.displayName);
    if (existing.sport) setSport(existing.sport);
    if (existing.goal || existing.aims?.length) setAims(profileAims(existing));
    if (existing.goalNote) setGoalNote(existing.goalNote);
    if (existing.bodyContext) setBodyContext(existing.bodyContext);
    if (existing.bodyContextNote) setBodyContextNote(existing.bodyContextNote);
    if (existing.experience) setExperience(existing.experience);
    if (isDaysPerWeek(existing.daysPerWeek)) {
      setDaysPerWeek(existing.daysPerWeek);
      setTrainingDays(normalizeTrainingDays(existing.trainingDays, existing.daysPerWeek));
    }
    setDietaryFlags(dietFlags(existing));
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

  function handleDaysPerWeek(next: DaysPerWeek) {
    setDaysPerWeek(next);
    setTrainingDays(defaultTrainingDays(next));
  }

  function toggleDiet(id: DietaryId) {
    if (id === "none") {
      setDietaryFlags([]);
      return;
    }
    setDietaryFlags((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function goNext() {
    if (step === 2 && aims.length === 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function finish() {
    const gear = applyLocationGear(locationMode, equipment.length ? equipment : ["bodyweight"]);
    const food = foodInventory.length ? foodInventory : DEFAULT_FOOD;
    const flags = dietaryFlags;
    const days = normalizeTrainingDays(trainingDays, daysPerWeek);
    const savedAims: GoalId[] = aims.length ? aims : ["maintain"];
    const primary = savedAims[0];
    const profile = {
      sport,
      goal: primary,
      aims: savedAims,
      goalNote:
        savedAims.includes("something-else") ||
        savedAims.includes("grow-glutes") ||
        savedAims.includes("grow-upper") ||
        goalNote.trim()
          ? goalNote.trim() || undefined
          : undefined,
      bodyContext,
      bodyContextNote: bodyContext === "self-describe" ? bodyContextNote.trim() || undefined : undefined,
      experience,
      daysPerWeek,
      trainingDays: days,
      dietary: primaryDietary(flags),
      dietaryFlags: flags,
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
    buy(vibe);
    markJustOnboarded();
    if (typeof window !== "undefined") {
      window.location.assign("/app/today/");
      return;
    }
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
              Sport, aims, and where you train. Diet, budget, and pantry start on sensible defaults — tweak anytime in
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
            <div className="space-y-2">
              <p className="text-sm font-semibold">Pick a world</p>
              <p className="text-xs text-[var(--pf-muted)]">
                Tap one — font, color, and background change so you can see the app. Same workouts underneath. Preview
                unlock on this device. Not official tie-ins.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {PACKS.map((pack) => (
                  <ChoiceButton
                    key={pack.id}
                    selected={vibe === pack.id}
                    onClick={() => {
                      setVibe(pack.id);
                      applyThemeToDocument(pack.id);
                      preview(pack.id);
                    }}
                    title={pack.name}
                    description={pack.vibe}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">What&apos;s your sport?</h2>
            <p className="text-sm text-[var(--pf-muted)]">Tap one, then continue.</p>
            <SportPicker value={sport} onChange={setSport} />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">What&apos;s the aim?</h2>
            <p className="text-sm text-[var(--pf-muted)]">Tap all that apply, then continue. We blend the week around them.</p>
            {aims.length === 0 ? (
              <p className="text-xs text-[var(--pf-silver)]">Pick at least one so the week has a direction.</p>
            ) : null}
            {GOALS.map((g) => (
              <ChoiceButton
                key={g.id}
                selected={aims.includes(g.id)}
                onClick={() => setAims((prev) => toggleAim(prev, g.id))}
                title={g.label}
                description={g.description}
              />
            ))}
            {aims.includes("something-else") || aims.includes("grow-glutes") || aims.includes("grow-upper") ? (
              <label className="block text-sm">
                Anything more specific?
                <input
                  className="pf-input mt-2"
                  placeholder="Grow my butt, bigger arms, first 5K…"
                  value={goalNote}
                  onChange={(e) => setGoalNote(e.target.value)}
                />
              </label>
            ) : null}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-semibold">Optional — who&apos;s this for?</p>
              <p className="text-xs text-[var(--pf-muted)]">Skip if you don&apos;t want to say. Helps copy, not medical use.</p>
              <div className="flex flex-wrap gap-2">
                {BODY_CONTEXTS.map((b) => (
                  <ChoiceChip key={b.id} selected={bodyContext === b.id} onClick={() => setBodyContext(b.id)}>
                    {b.label}
                  </ChoiceChip>
                ))}
              </div>
              {bodyContext === "self-describe" ? (
                <input
                  className="pf-input"
                  placeholder="Your words"
                  value={bodyContextNote}
                  onChange={(e) => setBodyContextNote(e.target.value)}
                />
              ) : null}
            </div>
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
                <ChoiceChip key={d} selected={daysPerWeek === d} onClick={() => handleDaysPerWeek(d)}>
                  {d} days
                </ChoiceChip>
              ))}
            </div>
            <WeekDayPicker
              daysPerWeek={daysPerWeek}
              selected={trainingDays}
              onChange={setTrainingDays}
              expert={experience === "advanced"}
            />
          </section>
        )}

        {step === 5 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">How do you eat?</h2>
            <p className="text-sm text-[var(--pf-muted)]">
              Tap any that apply. Meals and grocery follow this. Skip if none.
            </p>
            <div className="flex flex-wrap gap-2">
              <ChoiceChip selected={dietaryFlags.length === 0} onClick={() => toggleDiet("none")}>
                No restrictions
              </ChoiceChip>
              {DIETARY.filter((d) => d.id !== "none").map((d) => (
                <ChoiceChip key={d.id} selected={dietaryFlags.includes(d.id)} onClick={() => toggleDiet(d.id)}>
                  {d.label}
                </ChoiceChip>
              ))}
            </div>
          </section>
        )}

        {step === 6 && (
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
            {locationMode === "commercial-gym" ? (
              <NearbyGyms
                lat={placeLat}
                lng={placeLng}
                query={placeLabel}
                selected={placeLabel}
                onPick={setPlaceLabel}
              />
            ) : null}
          </section>
        )}

        {step === 7 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">You&apos;re set</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[var(--pf-muted)]">Name:</span> {displayName || "Athlete"}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Sport:</span> {SPORTS.find((s) => s.id === sport)?.label}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Aim:</span> {labelAims(aims)}
                {goalNote ? ` · ${goalNote}` : ""} · {daysPerWeek} days/week
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Days:</span> {describeSplit(trainingDays)}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Eat:</span>{" "}
                {dietaryFlags.length ? dietaryFlags.map((id) => DIETARY.find((d) => d.id === id)?.label).join(" · ") : "Open"}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Location:</span> {labelLocation(locationMode)}
                {placeLabel ? ` · ${placeLabel}` : ""}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">World:</span> {PACKS.find((p) => p.id === vibe)?.name}
              </p>
              <p>
                <span className="text-[var(--pf-muted)]">Defaults:</span> {labelBudget(budget)} grocery · starter pantry
              </p>
            </div>
            <p className="text-xs text-[var(--pf-muted)]">
              Start my week opens Today. Sign-in is optional after you see the plan. Not medical advice. Ages 13+.{" "}
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
            <button
              type="button"
              className="pf-btn-primary flex-1"
              onClick={goNext}
              disabled={step === 2 && aims.length === 0}
            >
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
