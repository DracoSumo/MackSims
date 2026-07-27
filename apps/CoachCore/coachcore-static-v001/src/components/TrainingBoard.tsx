"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/SectionPage";
import { workouts } from "@/data/mock";
import {
  getAssignmentStatus,
  setAssignmentStatus,
  type AssignmentStatus,
} from "@/services/assignmentStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CYCLE: AssignmentStatus[] = ["Assigned", "In progress", "Complete"];

function nextStatus(current: string): AssignmentStatus {
  const idx = CYCLE.indexOf(current as AssignmentStatus);
  if (idx === -1) return "In progress";
  return CYCLE[(idx + 1) % CYCLE.length];
}

export function TrainingBoard() {
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
      {workouts.map((workout) => {
        const id = slugFromTitle(workout.title);
        const status = getAssignmentStatus(id, workout.status);
        const upcoming = nextStatus(status);
        return (
          <Card key={workout.title} title={workout.title} subtitle={`${workout.type} • ${workout.group}`}>
            <p>Duration: {workout.duration}</p>
            <p>
              Status: <span className="font-bold text-sky-300">{status}</span>
            </p>
            <button
              type="button"
              onClick={() =>
                setAssignmentStatus(id, upcoming, {
                  title: workout.title,
                  kind: "training",
                  assignee: workout.group,
                })
              }
              className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
            >
              Mark {upcoming}
            </button>
          </Card>
        );
      })}
    </div>
  );
}
