"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { createAssignment, listAssignmentRecords } from "@/services/assignmentStore";

const WORKOUT_TYPES = ["Speed", "Strength", "Conditioning", "Recovery", "Functional fitness WOD", "Mobility"];

export default function AssignWorkoutPage() {
  const { athletes, ready } = useResolvedAthletes();
  const [title, setTitle] = useState("");
  const [workoutType, setWorkoutType] = useState(WORKOUT_TYPES[0]);
  const [assigneeId, setAssigneeId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const recent = useMemo(
    () => listAssignmentRecords().filter((row) => row.kind === "training").slice(0, 5),
    [saved],
  );

  useEffect(() => {
    if (!assigneeId && athletes[0]?.id) setAssigneeId(athletes[0].id);
  }, [athletes, assigneeId]);

  const selected = athletes.find((a) => a.id === assigneeId);

  function handleAssign() {
    setError("");
    if (athletes.length === 0) {
      setError("Add athletes to your roster before assigning workouts.");
      return;
    }
    if (!title.trim()) {
      setError("Add a workout title.");
      return;
    }
    if (!selected) {
      setError("Choose an athlete.");
      return;
    }
    createAssignment({
      title: `${title.trim()} (${workoutType})`,
      kind: "training",
      assignee: selected.name,
      status: "Assigned",
    });
    if (instructions.trim()) {
      void import("@/services/coachNoteStore").then(({ saveCoachNote }) =>
        saveCoachNote({
          attachedTo: selected.name,
          noteType: "Workout",
          body: instructions.trim(),
        }),
      );
    }
    setSaved(true);
  }

  if (!ready) {
    return (
      <SectionPage eyebrow="Training" title="Assign workout" description="Loading…">
        <p className="text-sm text-slate-400">Loading roster…</p>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      eyebrow="Training"
      title="Assign workout"
      description="Assign team workouts, WODs, strength blocks, or recovery work to an athlete on your roster."
    >
      <div className="mb-6">
        <Link href="/app" className="text-sm font-bold text-sky-300">
          ← Back to dashboard
        </Link>
      </div>

      {athletes.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-6">
          <p className="text-lg font-black">Roster required</p>
          <p className="mt-2 text-sm text-slate-400">
            Add athletes before assigning training. Assignments save locally and show on the timeline.
          </p>
          <Link
            href="/app/team/add"
            className="mt-4 inline-flex rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950"
          >
            Add athletes →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
            <label className="block text-sm font-bold text-slate-200">
              Workout title
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaved(false);
                }}
                placeholder="Acceleration + Top Speed"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
              />
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-200">
              Workout type
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-400/50"
              >
                {WORKOUT_TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-200">
              Assign to
              <select
                value={selected?.id ?? ""}
                onChange={(e) => {
                  setAssigneeId(e.target.value);
                  setSaved(false);
                }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-400/50"
              >
                {athletes.map((athlete) => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.name} — {athlete.role}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-200">
              Instructions (optional)
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Warmup, sprint mechanics, main sets, cooldown, and coach notes."
                className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
              />
            </label>

            <button
              type="button"
              onClick={handleAssign}
              className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
            >
              {saved ? "Assignment saved ✓" : "Assign workout"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-200" role="alert">
                {error}
              </p>
            )}
            {saved && (
              <p className="mt-3 text-sm text-emerald-200" role="status">
                Training assignment for {selected?.name} is on your timeline.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Recent training</p>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-emerald-50/80">No training assignments on this device yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
                {recent.map((item) => (
                  <li key={`${item.id}-${item.updatedAt}`} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <strong className="text-white">{item.title}</strong>
                    <p>
                      {item.assignee} · {item.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </SectionPage>
  );
}