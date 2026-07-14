"use client";

import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { athletePillars } from "@/lib/athleteProgress";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { AthleteProgressBar } from "@/components/AthleteProgressBar";
import { TodaysLoop } from "@/components/TodaysLoop";

export function AthleteProfileView({
  athlete,
  workouts,
  videoMoments,
}: {
  athlete: {
    id: string;
    name: string;
    role: string;
    status: string;
    lastActive: string;
    film: string;
    workouts: string;
    meals: string;
    readiness: string;
    note: string;
  };
  workouts: Array<{ id: string; title: string; type: string; status: string; duration: string; group: string }>;
  videoMoments: Array<{ id: string; title: string; tag: string; watched: string; note: string }>;
}) {
  const pillars = athletePillars({
    film: athlete.film,
    workouts: athlete.workouts,
    meals: athlete.meals,
    readiness: athlete.readiness,
  });

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

      <TodaysLoop current="film" />

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Four pillars today</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <Link
              key={pillar.key}
              href={pillar.href}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                pillar.complete
                  ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                  : "border-amber-300/30 bg-amber-300/10 text-amber-100"
              }`}
            >
              <p className="font-bold">{pillar.label}</p>
              <p className="mt-1 text-xs">{pillar.complete ? "On track" : "Needs attention"} • {pillar.percent}%</p>
            </Link>
          ))}
        </div>
        <AthleteProgressBar
          film={athlete.film}
          workouts={athlete.workouts}
          meals={athlete.meals}
          readiness={athlete.readiness}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/app/actions/send-nudge" className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950">
          Send nudge
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
        <Card title="Coach note" subtitle="Latest staff readout">
          {athlete.note}
        </Card>
        <Card title="Next action" subtitle="Mock recommendation">
          {athlete.status === "Locked in"
            ? "Keep current plan. Assign advanced film and preserve recovery window."
            : "Send a coach nudge, assign missed film, and check hydration/fueling before next session."}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {workouts.slice(0, 2).map((workout) => (
          <Card key={workout.id} title={workout.title} subtitle={`${workout.type} • ${workout.status}`}>
            Duration: {workout.duration} • Group: {workout.group}
            <div className="mt-4">
              <MarkCompleteButton
                itemType="workout"
                itemId={workout.id}
                athleteId={athlete.id}
                label={`${athlete.name} completed ${workout.title}`}
              />
            </div>
          </Card>
        ))}

        {videoMoments.slice(0, 2).map((moment) => (
          <div key={moment.id}>
            <Link href={`/app/video/${moment.id}`} className="block transition hover:-translate-y-1">
              <Card title={moment.title} subtitle={`${moment.tag} • ${moment.watched} watched`}>
                {moment.note}
                <p className="mt-3 font-bold text-sky-300">Open video moment →</p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
