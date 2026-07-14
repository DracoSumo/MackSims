"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { isSupabaseConfigured } from "@/config/backend";
import { athletes } from "@/data/mock";
import { formatCheckInTime, listCheckIns, saveCheckIn } from "@/services/checkInStore";
import { getSyncMeta } from "@/services/supabaseSync";

const readinessOptions = ["Locked in", "Showing up — need warmup", "Recovering / limited"];

export default function AthleteCheckInPage() {
  const [athleteId, setAthleteId] = useState(athletes[0]?.id ?? "");
  const [readiness, setReadiness] = useState(readinessOptions[0]);
  const [phase, setPhase] = useState<"idle" | "submitting" | "saved">("idle");
  const [recentTick, setRecentTick] = useState(0);
  const recent = useMemo(() => listCheckIns().slice(0, 5), [phase, recentTick]);
  const syncMeta = getSyncMeta();

  const selectedAthlete = athletes.find((a) => a.id === athleteId) ?? athletes[0];

  function handleSubmit() {
    if (!selectedAthlete || phase === "submitting") return;
    setPhase("submitting");
    saveCheckIn({
      athleteId: selectedAthlete.id,
      athleteName: selectedAthlete.name,
      readiness,
    });
    setRecentTick((n) => n + 1);
    window.setTimeout(() => setPhase("saved"), 200);
  }

  const syncNote =
    syncMeta.lastResult === "ok"
      ? "Check-in synced to Supabase."
      : syncMeta.lastResult === "error"
        ? "Saved locally; cloud sync failed — sign in on Profile and check RLS."
        : isSupabaseConfigured
          ? "Saved on this device — sign in on Profile to sync."
          : "Saved on this device (demo mode).";

  return (
    <SectionPage
      eyebrow="Athlete action"
      title="Session check-in"
      description="Records check-ins in this browser. Mock athlete names — not real roster data."
    >
      <div className="mb-6">
        <Link href="/app" className="text-sm font-bold text-sky-300">
          ← Back to dashboard
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <label className="block text-sm font-bold text-slate-200">
            Athlete
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-400/50"
              value={athleteId}
              onChange={(e) => {
                setAthleteId(e.target.value);
                setPhase("idle");
              }}
            >
              {athletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name} — {athlete.role}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-bold text-slate-200">
            Readiness (self-report)
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-400/50"
              value={readiness}
              onChange={(e) => {
                setReadiness(e.target.value);
                setPhase("idle");
              }}
            >
              {readinessOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={phase === "submitting"}
            className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            {phase === "submitting" ? "Saving…" : phase === "saved" ? "Check-in saved ✓" : "Submit check-in"}
          </button>

          {phase === "saved" && (
            <div className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3" role="status">
              <p className="font-bold text-emerald-100">{selectedAthlete?.name} checked in</p>
              <p className="mt-1 text-sm text-emerald-50/90">{readiness}</p>
              <p className="mt-2 text-xs text-emerald-100/70">{syncNote}</p>
              {isSupabaseConfigured && syncMeta.lastResult !== "ok" && (
                <Link href="/login" className="mt-2 inline-block text-xs font-bold text-sky-300">
                  Sign in to sync →
                </Link>
              )}
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Local-first on this device. Dashboard updates immediately after submit.
          </p>
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Recent check-ins</p>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-50/80">No check-ins yet on this browser.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
              {recent.map((item) => (
                <li key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <strong className="text-white">{item.athleteName}</strong>
                  <p>{item.readiness}</p>
                  <p className="text-xs text-slate-400">{formatCheckInTime(item.checkedInAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
