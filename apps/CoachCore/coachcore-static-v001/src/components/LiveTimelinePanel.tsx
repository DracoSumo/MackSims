"use client";

import { useEffect, useMemo, useState } from "react";
import { activityTimeline } from "@/data/mock";
import { listActionLog, formatActionTime } from "@/services/actionLogStore";
import { listCheckIns, formatCheckInTime } from "@/services/checkInStore";
import { listCompletions, formatCompletionTime } from "@/services/assignmentStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

type TimelineRow = {
  id: string;
  title: string;
  time: string;
  type: string;
  body: string;
  source: "mock" | "local";
};

function buildLocalTimeline(): TimelineRow[] {
  const rows: TimelineRow[] = [];

  for (const item of listCompletions()) {
    rows.push({
      id: item.id,
      title: item.label,
      time: formatCompletionTime(item.completedAt),
      type: "Assignment",
      body: `Marked ${item.itemType} complete in demo.`,
      source: "local",
    });
  }

  for (const item of listActionLog()) {
    rows.push({
      id: item.id,
      title: item.label,
      time: formatActionTime(item.loggedAt),
      type: "Coach action",
      body: item.detail || "Coach action logged on this device.",
      source: "local",
    });
  }

  for (const item of listCheckIns()) {
    rows.push({
      id: item.id,
      title: `${item.athleteName} checked in`,
      time: formatCheckInTime(item.checkedInAt),
      type: "Check-in",
      body: `Readiness: ${item.readiness}`,
      source: "local",
    });
  }

  return rows.sort((a, b) => (a.time < b.time ? 1 : -1));
}

export function LiveTimelinePanel({ limit = 8 }: { limit?: number }) {
  const [localRows, setLocalRows] = useState<TimelineRow[]>([]);

  useEffect(() => {
    setLocalRows(buildLocalTimeline());
    const refresh = () => setLocalRows(buildLocalTimeline());
    window.addEventListener("storage", refresh);
    const off = onLocalDataChanged(() => refresh());
    return () => {
      window.removeEventListener("storage", refresh);
      off();
    };
  }, []);

  const rows = useMemo(() => {
    const mockRows: TimelineRow[] = activityTimeline.map((item, index) => ({
      id: `mock-${index}`,
      title: item.title,
      time: item.time,
      type: item.type,
      body: item.body,
      source: "mock",
    }));
    return [...localRows, ...mockRows].slice(0, limit);
  }, [localRows, limit]);

  return (
    <div className="space-y-3">
      {rows.map((item) => (
        <div
          key={item.id}
          className="rounded-3xl border border-white/10 bg-slate-950/60 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {item.time} • {item.type}
                {item.source === "local" && (
                  <span className="ml-2 text-emerald-300">• live demo</span>
                )}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
