"use client";

import { useEffect, useState } from "react";
import {
  getAssignmentStatus,
  setAssignmentStatus,
  type AssignmentStatus,
} from "@/services/assignmentStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

function fallbackFromWatched(watched: string): string {
  const pct = Number.parseInt(watched.replace("%", ""), 10);
  return pct >= 100 ? "Complete" : "Assigned";
}

export function VideoMomentActions({
  momentId,
  watched,
}: {
  momentId: string;
  watched: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onStorage = () => setTick((n) => n + 1);
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "assignments") setTick((n) => n + 1);
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  void tick;
  const status = getAssignmentStatus(momentId, fallbackFromWatched(watched));

  const actions: { label: string; status: AssignmentStatus }[] = [
    { label: "Mark in progress", status: "In progress" },
    { label: "Mark complete", status: "Complete" },
    { label: "Needs nudge", status: "Needs nudge" },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Assignment status</p>
      <p className="mt-3 text-2xl font-black">{status}</p>
      <p className="mt-2 text-sm text-slate-400">Simulated on this device only — no backend write.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            onClick={() => setAssignmentStatus(momentId, action.status)}
            className={
              action.status === "Complete"
                ? "rounded-xl bg-sky-400 px-4 py-2 text-sm font-black text-slate-950"
                : "rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
            }
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
