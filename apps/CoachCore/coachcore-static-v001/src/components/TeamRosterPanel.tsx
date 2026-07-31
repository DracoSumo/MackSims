"use client";

import Link from "next/link";
import { Card } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { removeRosterAthlete } from "@/services/athleteRosterStore";

export function TeamRosterPanel() {
  const { athletes, rosterCount, ready } = useResolvedAthletes();

  if (!ready) {
    return <p className="mt-6 text-sm text-slate-400">Loading roster…</p>;
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/app/team/add"
          className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-sky-300"
        >
          Add athletes
        </Link>
        {rosterCount > 0 && (
          <p className="self-center text-sm text-slate-400">
            {rosterCount} on this device
            {athletes.length > rosterCount ? " · demo fixtures also available" : ""}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {athletes.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              title="No athletes on your roster"
              body="Add athletes manually or paste a list. This build does not show fabricated athlete profiles."
            />
            <div className="mt-4 text-center">
              <Link href="/app/team/add" className="text-sm font-bold text-sky-300">
                Add your first athlete →
              </Link>
            </div>
          </div>
        ) : (
          athletes.map((athlete) => (
            <div key={athlete.id} className="relative">
              <Link href={`/app/athletes/detail/?id=${encodeURIComponent(athlete.id)}`}>
                <Card title={athlete.name} subtitle={athlete.role}>
                  <p>Status: {athlete.status}</p>
                  <p>Last active: {athlete.lastActive}</p>
                  <p>
                    Film: {athlete.film} • Workouts: {athlete.workouts} • Fueling: {athlete.meals} •
                    Readiness: {athlete.readiness}
                  </p>
                  <p className="mt-2 text-sm font-bold text-sky-300">Open profile →</p>
                </Card>
              </Link>
              {rosterCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeRosterAthlete(athlete.id);
                  }}
                  className="absolute right-4 top-4 rounded-xl border border-white/10 px-2 py-1 text-xs font-bold text-slate-400 hover:border-red-300/40 hover:text-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
