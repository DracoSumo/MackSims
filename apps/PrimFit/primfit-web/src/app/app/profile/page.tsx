"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoalsEditor, GoalsStrip } from "@/components/GoalsPanel";
import { RequirePlan } from "@/components/RequirePlan";
import {
  EQUIPMENT_OPTIONS,
  labelBudget,
  labelExperience,
  labelLocation,
  labelSport,
} from "@/data/options";
import { LegalFooter } from "@/components/LegalFooter";
import { useTheme } from "@/components/ThemeProvider";
import { primfitConfig } from "@/config/primfit";
import { ratePrimFit } from "@/components/TesterFeedback";
import { getCampaign, getPlayClass, rankFor } from "@/lib/campaign";
import { getMeasurableGoals, saveMeasurableGoals } from "@/lib/goals";
import { celebrateHunt } from "@/lib/loadLog";
import { getAccountHint, memberEmail, rememberEmail } from "@/lib/account";
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
import { dietSummary } from "@/lib/diet";
import { labelAims, profileAims } from "@/lib/aims";
import { describeSplit } from "@/lib/trainingDays";
import type { MeasurableGoals, UserProfile, WeekPlan } from "@/data/types";

function gearLabels(ids: string[] | undefined) {
  return (ids ?? [])
    .map((id) => EQUIPMENT_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(" · ");
}

function ProfileContent() {
  const router = useRouter();
  const { copy, theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [introCount, setIntroCount] = useState(0);
  const [goals, setGoals] = useState<MeasurableGoals | null>(null);
  const [editingGoals, setEditingGoals] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);
  const [memberMail, setMemberMail] = useState<string | null>(null);
  const [mailDraft, setMailDraft] = useState("");
  const [editingMail, setEditingMail] = useState(false);
  const weeks = lastWeekStats(4);

  useEffect(() => {
    setProfile(getProfile());
    setPlan(getWeekPlan());
    setIntroCount(listIntroRequests().length);
    setGoals(getMeasurableGoals());
    const mail = memberEmail(getAccountHint());
    setMemberMail(mail);
    setMailDraft(mail ?? "");
    if (typeof window !== "undefined" && window.location.hash === "#goals") {
      setEditingGoals(true);
    }
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
    celebrateHunt();
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

  const rank = rankFor(theme);
  const playClass = getPlayClass(theme);
  const campaign = getCampaign();
  const xp = campaign.xp;

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="pf-display text-3xl font-bold">{profile.displayName}</h1>
        <p className="mt-1 text-sm text-[var(--pf-silver)]">
          {labelSport(profile.sport)} · {labelAims(profileAims(profile))} · {copy.packShortName}
        </p>
      </header>

      <section className="pf-system-card space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">On this device</p>
        {memberMail && !editingMail ? (
          <>
            <p className="text-sm">{memberMail}</p>
            <p className="text-xs text-[var(--pf-muted)]">
              Email stays here for now. Later it will restore your week on a new phone. No cloud account yet.
            </p>
            <button type="button" className="pf-linkish px-0 text-sm" onClick={() => setEditingMail(true)}>
              Change email
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-[var(--pf-muted)]">
              Add an email so returning on this device — and later on a new one — knows it&apos;s you.
            </p>
            <input
              className="pf-input w-full"
              type="email"
              placeholder="you@email.com"
              value={mailDraft}
              onChange={(e) => setMailDraft(e.target.value)}
              autoComplete="email"
            />
            <button
              type="button"
              className="pf-btn-ghost w-full text-sm"
              disabled={!mailDraft.trim()}
              onClick={() => {
                const next = rememberEmail(mailDraft);
                setMemberMail(next.email ?? null);
                setEditingMail(false);
              }}
            >
              Save email on this device
            </button>
          </>
        )}
      </section>

      <section className="pf-system-card space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">{copy.worldTag}</p>
        <p className="pf-display text-xl font-semibold">{rank.label}</p>
        <p className="text-sm text-[var(--pf-muted)]">
          {playClass ? `${playClass.label} · ` : ""}
          {xp} XP
          {rank.nextLabel ? ` · ${rank.xpNeed - rank.xpInto} to ${rank.nextLabel}` : ""}
          {campaign.streak ? ` · ${campaign.streak}-day chain` : ""}
        </p>
        <div className="pf-bar" role="progressbar" aria-valuenow={Math.round(rank.progress * 100)}>
          <div className="pf-bar-fill" style={{ width: `${rank.progress * 100}%` }} />
        </div>
        <Link href="/app/shop/" className="pf-linkish px-0 text-sm">
          Change play style
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Level</p>
          <p className="mt-1">{labelExperience(profile.experience)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Days</p>
          <p className="mt-1">{profile.daysPerWeek} / week</p>
          {profile.trainingDays?.length ? (
            <p className="mt-1 text-xs text-[var(--pf-muted)]">{describeSplit(profile.trainingDays)}</p>
          ) : null}
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
          <p className="mt-1">{dietSummary(profile)}</p>
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
        <section id="goals" className="pf-system-card space-y-3 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">Numbers</p>
          <h2 className="pf-display text-xl font-semibold">Goals</h2>
          <p className="text-sm text-[var(--pf-muted)]">
            Scale, lifts, challenges — the hunt on Today fills from these. Edit anytime.
          </p>
          <GoalsStrip goals={goals} />
          <button
            type="button"
            className={editingGoals ? "pf-btn-ghost w-full" : "pf-btn-primary w-full"}
            onClick={() => setEditingGoals((v) => !v)}
          >
            {editingGoals ? "Done" : "Edit my numbers"}
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
