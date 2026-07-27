"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { videoMoments } from "@/data/mock";
import { getAssignmentStatus, setAssignmentStatus } from "@/services/assignmentStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

function fallbackFromWatched(watched: string): string {
  const pct = Number.parseInt(watched.replace("%", ""), 10);
  return pct >= 100 ? "Complete" : "Assigned";
}

export function VideoMomentsBoard() {
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {videoMoments.map((moment) => {
        const status = getAssignmentStatus(moment.id, fallbackFromWatched(moment.watched));
        return (
          <div key={moment.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
            <Link href={`/app/video/${moment.id}`} className="block transition hover:-translate-y-0.5">
              <h2 className="text-xl font-black">{moment.title}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {moment.tag} • {moment.assigned}
              </p>
              <div className="mt-4 text-sm leading-6 text-slate-300">
                <p>Watched: {moment.watched}</p>
                <p>{moment.note}</p>
                <p className="mt-2">
                  Status: <span className="font-bold text-sky-300">{status}</span>
                </p>
                <p className="mt-3 font-bold text-sky-300">Open video detail →</p>
              </div>
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAssignmentStatus(moment.id, "In progress")}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
              >
                Mark in progress
              </button>
              <button
                type="button"
                onClick={() => setAssignmentStatus(moment.id, "Complete")}
                className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-black text-slate-950"
              >
                Mark complete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
