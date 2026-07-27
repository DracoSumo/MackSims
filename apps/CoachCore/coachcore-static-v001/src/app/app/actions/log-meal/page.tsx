"use client";

import { useMemo, useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { saveMealLog } from "@/services/mealLogStore";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-training", "Post-training"];

export default function LogMealPage() {
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
  const [hydration, setHydration] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const timestamp = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    [saved],
  );

  function handleSubmit() {
    saveMealLog({ mealType, hydration, notes });
    setSaved(true);
  }

  return (
    <SectionPage
      eyebrow="Fueling"
      title="Log meal"
      description="Athlete fueling log for meals, hydration, recovery, and performance habits."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <div className="grid gap-4">
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
                {timestamp} · {mealType} is on the athlete timeline for this device.
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
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Expected result</p>
          <h2 className="mt-3 text-3xl font-black">Meal log prepared</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/85">
            CoachCore updates the athlete fueling timeline so coaches can spot missing hydration or recovery habits.
          </p>
        </div>
      </div>
    </SectionPage>
  );
}
