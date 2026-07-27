"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { logCoachAction } from "@/services/actionLogStore";

export default function NewTrainingPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    logCoachAction("Save workout", "Mock training assignment saved in demo mode");
    setSaved(true);
  }

  return (
    <SectionPage
      eyebrow="Create workout"
      title="Build a training assignment"
      description="Mock form for team workouts, individual blocks, recovery sessions, and functional fitness WODs."
    >
      <div className="mb-6">
        <Link href="/app/training" className="text-sm font-bold text-sky-300">
          ← Back to training
        </Link>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
        <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Workout title" />
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
          <option>Speed block</option>
          <option>Strength</option>
          <option>Recovery</option>
          <option>Functional fitness WOD</option>
          <option>Conditioning</option>
        </select>
        <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Assigned group" />
        <textarea className="min-h-36 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Exercises, notes, and coach instructions" />
        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
        >
          Save Mock Workout
        </button>
        {saved ? (
          <p className="text-sm font-bold text-emerald-300" role="status">
            Saved in demo mode
          </p>
        ) : null}
      </div>
    </SectionPage>
  );
}
