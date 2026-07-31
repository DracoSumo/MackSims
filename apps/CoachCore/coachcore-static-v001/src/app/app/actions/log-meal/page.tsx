"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { saveMealLog } from "@/services/mealLogStore";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-training", "Post-training"];

export default function LogMealPage() {
  const { athletes, ready } = useResolvedAthletes();
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
  const [hydration, setHydration] = useState("");
  const [notes, setNotes] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [saved, setSaved] = useState(false);
  const timestamp = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    [saved],
  );

  useEffect(() => {
    if (!athleteId && athletes[0]?.id) setAthleteId(athletes[0].id);
  }, [athletes, athleteId]);

  const selected = athletes.find((a) => a.id === athleteId);

  function handleSubmit() {
    saveMealLog({
      mealType,
      hydration,
      notes,
      athleteId: selected?.id,
      athleteName: selected?.name,
    });
    setSaved(true);
  }

  if (!ready) {
    return (
      <SectionPage eyebrow="Fueling" title="Log meal" description="Loading…">
        <p className="text-sm text-slate-400">Loading…</p>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      eyebrow="Fueling"
      title="Log meal"
      description="Athlete fueling log for meals, hydration, recovery, and performance habits."
    >
      <div className="mb-6">
        <Link href="/app/nutrition" className="text-sm font-bold text-sky-300">
          ← Back to nutrition
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <div className="grid gap-4">
            {athletes.length > 0 && (
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Athlete (optional)</span>
                <select
                  value={selected?.id ?? ""}
                  onChange={(e) => setAthleteId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300/60"
                >
                  {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Meal type</span>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300/60"
              >
                {MEAL_TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Hydration</span>
              <input
                value={hydration}
                onChange={(e) => setHydration(e.target.value)}
                placeholder="72 oz"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/60"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Fueling notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chicken, rice, fruit, water, electrolyte packet."
                className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/60"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
          >
            {saved ? "Saved on this device" : "Submit meal log"}
          </button>

          {saved ? (
            <div className="mt-5 rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Saved</p>
              <h3 className="mt-3 text-2xl font-black text-white">Meal log submitted</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                {timestamp} · {mealType}
                {selected ? ` for ${selected.name}` : ""} is on the nutrition board and timeline.
              </p>
              <button
                type="button"
                onClick={() => setSaved(false)}
                className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                Log another
              </button>
            </div>
          ) : (
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Saves to this device and your coach activity log.
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">On this device</p>
          <h2 className="mt-3 text-3xl font-black">Meal log ready</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/85">
            Fueling entries show on Nutrition and the live timeline so coaches can spot missing hydration habits.
          </p>
          {athletes.length === 0 && (
            <Link href="/app/team/add" className="mt-4 inline-block text-sm font-bold text-sky-200">
              Add roster to attach meals to athletes →
            </Link>
          )}
        </div>
      </div>
    </SectionPage>
  );
}
