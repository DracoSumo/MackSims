"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, SectionPage } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockNudgeTargets } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip } from "@/components/ui/CoachCards";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { logCoachAction } from "@/services/actionLogStore";
import type { RosterAthlete } from "@/services/athleteRosterStore";

type AthleteRow = RosterAthlete & { filmCompleteDemo?: boolean };

export default function AccountabilityPage() {
  const { athletes, ready } = useResolvedAthletes();
  const [rows, setRows] = useState<AthleteRow[]>([]);

  useEffect(() => {
    setRows(athletes.map((a) => ({ ...a })));
  }, [athletes]);

  function markFilmComplete(athleteId: string, athleteName: string) {
    logCoachAction("Mark film complete", `${athleteName} film marked complete`);
    void import("@/services/assignmentStore").then(({ createAssignment }) =>
      createAssignment({
        title: `Film complete · ${athleteName}`,
        kind: "film",
        assignee: athleteName,
        status: "Complete",
      }),
    );
    setRows((prev) =>
      prev.map((athlete) =>
        athlete.id === athleteId
          ? {
              ...athlete,
              film: "100%",
              filmCompleteDemo: true,
              status: athlete.status === "At risk" ? "Needs nudge" : athlete.status,
              lastActive: "Just now",
            }
          : athlete,
      ),
    );
  }

  return (
    <SectionPage
      eyebrow="Accountability"
      title="Who is locked in?"
      description={coachCoreConfig.accountabilityDefinition}
    >
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Status legend</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          <p>
            <span className="font-bold text-emerald-200">Locked in</span> — film, workouts, and fueling on track
          </p>
          <p>
            <span className="font-bold text-amber-200">Needs nudge</span> — one or more habits slipping
          </p>
          <p>
            <span className="font-bold text-red-200">At risk</span> — multiple missed assignments
          </p>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">{coachCoreConfig.coachingSupportDisclaimer}</p>
      </div>

      <div className="mt-6">
        <CrossLinkStrip current="Accountability" />
      </div>

      <div className="mt-6 grid gap-4">
        {!ready ? (
          <p className="text-sm text-slate-400">Loading roster…</p>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No athletes to track"
            body="Add your roster to see who is locked in. This board stays empty until you add real athletes."
          />
        ) : (
          rows.map((athlete) => (
            <Card key={athlete.id} title={athlete.name} subtitle={athlete.status}>
              <p className="text-sm text-slate-400">
                {athlete.role} • Last active: {athlete.lastActive}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                <p>Film: {athlete.film}</p>
                <p>Workouts: {athlete.workouts}</p>
                <p>Fueling: {athlete.meals}</p>
                <p>Readiness: {athlete.readiness}</p>
                <Link
                  href={`/app/athletes/detail/?id=${encodeURIComponent(athlete.id)}`}
                  className="font-bold text-sky-300 hover:text-sky-200"
                >
                  View profile →
                </Link>
              </div>
              <div className="mt-4">
                {athlete.filmCompleteDemo ? (
                  <p className="text-sm font-bold text-emerald-300" role="status">
                    Film marked complete
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => markFilmComplete(athlete.id, athlete.name)}
                    className="rounded-2xl border border-sky-300/40 bg-sky-400/15 px-4 py-2 text-sm font-bold text-sky-100 hover:bg-sky-400/25"
                  >
                    Mark film complete
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {rows.length === 0 && ready && (
        <div className="mt-6 text-center">
          <Link
            href="/app/team/add"
            className="inline-flex rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950"
          >
            Add your roster →
          </Link>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-xl font-black">Suggested nudges</h3>
        {mockNudgeTargets.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Nudge suggestions appear after your roster and assignment history fill in.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {mockNudgeTargets.map((target) => (
              <li key={target}>• {target}</li>
            ))}
          </ul>
        )}
        <Link
          href="/app/actions/send-nudge"
          className="mt-4 inline-flex rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950"
        >
          Open nudge flow
        </Link>
      </div>
    </SectionPage>
  );
}
