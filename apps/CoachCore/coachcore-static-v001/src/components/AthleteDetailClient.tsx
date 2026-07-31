"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, SectionPage } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { listAssignmentRecords } from "@/services/assignmentStore";
import { listCheckIns } from "@/services/checkInStore";
import { listCoachNotes } from "@/services/coachNoteStore";
import { listMealLogs } from "@/services/mealLogStore";

export function AthleteDetailClient({ athleteId }: { athleteId: string }) {
  const { athletes, ready } = useResolvedAthletes();
  const athlete = useMemo(
    () => athletes.find((row) => row.id === athleteId),
    [athletes, athleteId],
  );

  const checkIns = ready ? listCheckIns().filter((row) => row.athleteId === athleteId).slice(0, 5) : [];
  const assignments = ready
    ? listAssignmentRecords()
        .filter((row) => row.assignee === athlete?.name)
        .slice(0, 6)
    : [];
  const notes = ready
    ? listCoachNotes().filter((row) => row.attachedTo === athlete?.name).slice(0, 4)
    : [];
  const meals = ready
    ? listMealLogs()
        .filter((row) => row.athleteId === athleteId || row.athleteName === athlete?.name)
        .slice(0, 4)
    : [];

  if (!ready) {
    return (
      <SectionPage eyebrow="Athlete profile" title="Loading…" description="Reading local roster.">
        <p className="text-sm text-slate-400">Loading athlete…</p>
      </SectionPage>
    );
  }

  if (!athleteId || !athlete) {
    return (
      <SectionPage
        eyebrow="Athlete profile"
        title="Athlete not found"
        description="Add athletes on Team, then open their profile from the roster."
      >
        <EmptyState
          title="No athlete selected"
          body="This profile id is not on your local roster. Add athletes from Team — this build does not invent profiles."
        />
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/app/team/add" className="text-sm font-bold text-sky-300">
            Add athletes →
          </Link>
          <Link href="/app/team" className="text-sm font-bold text-sky-300">
            ← Back to team
          </Link>
        </div>
      </SectionPage>
    );
  }

  const latestCheckIn = checkIns[0];

  return (
    <SectionPage
      eyebrow="Athlete profile"
      title={athlete.name}
      description={`${athlete.role} • ${athlete.status} • Last active: ${athlete.lastActive}`}
    >
      <div className="mb-6">
        <Link href="/app/team" className="text-sm font-bold text-sky-300">
          ← Back to team
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title={latestCheckIn?.readiness ?? athlete.readiness} subtitle="Readiness" />
        <Card title={athlete.film} subtitle="Film" />
        <Card title={athlete.workouts} subtitle="Workouts" />
        <Card title={athlete.meals} subtitle="Fueling" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/app/actions/athlete-check-in"
          className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950"
        >
          Session check-in
        </Link>
        <Link
          href="/app/actions/assign-workout"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10"
        >
          Assign workout
        </Link>
        <Link
          href="/app/actions/save-note"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10"
        >
          Save note
        </Link>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Coach note" subtitle="Staff readout">
          {athlete.note || notes[0]?.body || "No private note yet — save one from Coach notes."}
        </Card>
        <Card title="Recent check-ins" subtitle="This device">
          {checkIns.length === 0 ? (
            <p className="text-sm text-slate-400">No check-ins yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {checkIns.map((item) => (
                <li key={item.id}>
                  <strong className="text-white">{item.readiness}</strong>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Assignments" subtitle="Local film & training">
          {assignments.length === 0 ? (
            <p className="text-sm text-slate-400">No assignments for this athlete yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {assignments.map((item) => (
                <li key={`${item.id}-${item.updatedAt}`}>
                  <strong className="text-white">{item.title}</strong> — {item.status} ({item.kind})
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Fueling logs" subtitle="Recent meals">
          {meals.length === 0 ? (
            <p className="text-sm text-slate-400">No meal logs yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {meals.map((item) => (
                <li key={item.id}>
                  <strong className="text-white">{item.mealType}</strong>
                  {item.hydration ? ` · ${item.hydration}` : ""}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </SectionPage>
  );
}
