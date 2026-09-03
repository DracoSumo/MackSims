"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoalsEditor, GoalsStrip } from "@/components/GoalsPanel";
import { RequirePlan } from "@/components/RequirePlan";
import {
  EQUIPMENT_OPTIONS,
  labelBudget,
  labelDietary,
  labelExperience,
  labelGoal,
  labelLocation,
  labelSport,
} from "@/data/options";
import { LegalFooter } from "@/components/LegalFooter";
import { primfitConfig } from "@/config/primfit";
import { ratePrimFit } from "@/components/TesterFeedback";
import { useTheme } from "@/components/ThemeProvider";
import { getMeasurableGoals, saveMeasurableGoals } from "@/lib/goals";
import { formatDeviceCoords, geoStatusMessage, getDeviceLocation } from "@/lib/device";
import { lastWeekStats } from "@/lib/progress";
import { buildWeekPlan } from "@/lib/planEngine";
import {
  clearAllPrimFitData,
  getProfile,
  getWeekPlan,
  listIntroRequests,
  saveProfile,
  saveWeekPlan,
} from "@/lib/storage";
import type { MeasurableGoals, UserProfile, WeekPlan } from "@/data/types";

function gearLabels(ids: string[] | undefined) {
  return (ids ?? [])
    .map((id) => EQUIPMENT_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(" · ");
}

function ProfileContent() {
  const router = useRouter();
  const { copy } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [introCount, setIntroCount] = useState(0);
  const [goals, setGoals] = useState<MeasurableGoals | null>(null);
  const [editingGoals, setEditingGoals] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);
  const weeks = lastWeekStats(4);

  useEffect(() => {
    setProfile(getProfile());
    setPlan(getWeekPlan());
    setIntroCount(listIntroRequests().length);
    setGoals(getMeasurableGoals());
  }, []);

  function regenerate() {
    if (!profile) return;
    const next = buildWeekPlan(profile);
    saveWeekPlan(next);
    setPlan(next);
  }

  function persistGoals(next: MeasurableGoals) {
    setGoals(next);
    saveMeasurableGoals(next);
  }

  async function pinDeviceLocation() {
    if (!profile) return;
    setGeoBusy(true);
    setGeoStatus("Requesting this device location…");
    const result = await getDeviceLocation();
    if (result.ok) {
      const next = {
        ...profile,
        savedPlace: {
          label: profile.savedPlace?.label?.trim() || "This device",
          lat: result.coords.lat,
          lng: result.coords.lng,
        },
      };
      saveProfile(next);
      setProfile(next);
    }
    setGeoStatus(geoStatusMessage(result));
    setGeoBusy(false);
  }

  function resetAll() {
    if (!confirm("Clear all PrimFit data on this device?")) return;
    clearAllPrimFitData();
    router.replace("/");
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="pf-display text-3xl font-bold">{profile.displayName}</h1>
        <p className="mt-1 text-sm text-[var(--pf-silver)]">
          {labelSport(profile.sport)} · {labelGoal(profile.goal)} · {copy.packShortName}
        </p>
      </header>

      <section className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Level</p>
          <p className="mt-1">{labelExperience(profile.experience)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Days</p>
          <p className="mt-1">{profile.daysPerWeek} / week</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Where</p>
          <p className="mt-1">
            {labelLocation(profile.locationMode)}
            {profile.savedPlace?.label ? ` · ${profile.savedPlace.label}` : ""}
          </p>
          {profile.savedPlace?.lat != null && profile.savedPlace?.lng != null ? (
            <p className="mt-1 text-xs text-[var(--pf-muted)]">
              This device: {formatDeviceCoords({ lat: profile.savedPlace.lat, lng: profile.savedPlace.lng })}
            </p>
          ) : null}
          <button
            type="button"
            className="pf-linkish mt-1 px-0"
            disabled={geoBusy}
            onClick={() => void pinDeviceLocation()}
          >
            {geoBusy ? "Locating…" : "Use this device location"}
          </button>
          {geoStatus ? <p className="mt-1 text-xs text-[var(--pf-muted)]">{geoStatus}</p> : null}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Budget</p>
          <p className="mt-1">{labelBudget(profile.budget)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Eat</p>
          <p className="mt-1">{labelDietary(profile.dietary)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Kitchen</p>
          <p className="mt-1">{profile.foodInventory?.length ?? 0} staples</p>
        </div>
      </section>

      <p className="text-xs text-[var(--pf-muted)]">Gear: {gearLabels(profile.equipment) || "Bodyweight"}</p>

      {weeks.length ? (
        <section className="space-y-3">
          <p className="font-semibold">Last 4 weeks</p>
          <div className="space-y-2">
            {weeks.slice(-4).map((entry) => {
              const pct = entry.goalDays > 0 ? Math.min(100, (entry.completedTrainingDays / entry.goalDays) * 100) : 0;
              return (
                <div key={entry.weekKey}>
                  <div className="mb-1 flex justify-between text-[11px] text-[var(--pf-muted)]">
                    <span>Week of {entry.weekKey}</span>
                    <span>
                      {entry.completedTrainingDays}/{entry.goalDays}
                    </span>
                  </div>
                  <div className="pf-mini-bar" role="progressbar" aria-valuenow={Math.round(pct)}>
                    <i style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {goals ? (
        <section className="space-y-3">
          <p className="font-semibold">Goals</p>
          <GoalsStrip goals={goals} />
          <button type="button" className="pf-linkish px-0" onClick={() => setEditingGoals((v) => !v)}>
            {editingGoals ? "Hide editor" : "Edit goals"}
          </button>
          {editingGoals ? (
            <div className="pt-2">
              <GoalsEditor value={goals} onChange={persistGoals} sport={profile.sport} />
            </div>
          ) : null}
        </section>
      ) : null}

      <section>
        <button type="button" className="pf-btn-primary w-full" onClick={regenerate}>
          Build a fresh week
        </button>
        <div className="mt-2">
          <Link href="/app/shop/" className="pf-row-link">
            {copy.shop} — UI packs <span aria-hidden>→</span>
          </Link>
          <Link href="/app/wearables/" className="pf-row-link">
            {copy.wearables} <span aria-hidden>→</span>
          </Link>
          <Link href="/app/onboarding/" className="pf-row-link">
            Change my plan <span aria-hidden>→</span>
          </Link>
          <Link href="/app/methods/" className="pf-row-link">
            {copy.methods} <span aria-hidden>→</span>
          </Link>
          <button type="button" className="pf-row-link" onClick={ratePrimFit}>
            Rate PrimFit <span aria-hidden>→</span>
          </button>
          {introCount > 0 ? (
            <p className="pf-row-link pointer-events-none">
              Pro intros saved
              <span className="text-[var(--pf-muted)]">{introCount}</span>
            </p>
          ) : null}
        </div>
      </section>

      <LegalFooter />

      <p className="text-xs leading-relaxed text-[var(--pf-muted)]">{primfitConfig.shortDisclaimer}</p>

      <button type="button" className="w-full text-center text-xs text-[var(--pf-muted)] underline" onClick={resetAll}>
        Clear all data
      </button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequirePlan>
      <ProfileContent />
    </RequirePlan>
  );
}
