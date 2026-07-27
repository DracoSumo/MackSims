"use client";

import { useEffect, useMemo, useState } from "react";
import { activityTimeline } from "@/data/mock";
import { formatActionTime, listActionLog } from "@/services/actionLogStore";
import { formatCheckInTime, listCheckIns } from "@/services/checkInStore";
import { listAssignmentRecords } from "@/services/assignmentStore";
import { listCoachNotes } from "@/services/coachNoteStore";
import { listMealLogs } from "@/services/mealLogStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

type TimelineItem = {
  key: string;
  time: string;
  title: string;
  type: string;
  body: string;
  sortKey: number;
};

function buildTimeline(): TimelineItem[] {
  const mockBase = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const mockItems: TimelineItem[] = activityTimeline.map((item, index) => ({
    key: `mock-${item.title}-${item.time}`,
    time: item.time,
    title: item.title,
    type: item.type,
    body: item.body,
    sortKey: mockBase - index * 60 * 60 * 1000,
  }));

  const actionItems: TimelineItem[] = listActionLog().map((item) => ({
    key: `action-${item.id}`,
    time: formatActionTime(item.loggedAt),
    title: item.label,
    type: "Action",
    body: item.detail || "Coach action logged on this device.",
    sortKey: Date.parse(item.loggedAt) || 0,
  }));

  const checkInItems: TimelineItem[] = listCheckIns().map((item) => ({
    key: `checkin-${item.id}`,
    time: formatCheckInTime(item.checkedInAt),
    title: `${item.athleteName} checked in`,
    type: "Check-in",
    body: `Readiness: ${item.readiness}`,
    sortKey: Date.parse(item.checkedInAt) || 0,
  }));

  const assignmentItems: TimelineItem[] = listAssignmentRecords().map((item) => ({
    key: `assignment-${item.id}-${item.updatedAt}`,
    time: formatActionTime(item.updatedAt),
    title: item.title,
    type: `Assignment · ${item.kind}`,
    body: `Status: ${item.status}${item.assignee ? ` · ${item.assignee}` : ""}`,
    sortKey: Date.parse(item.updatedAt) || 0,
  }));

  const mealItems: TimelineItem[] = listMealLogs().map((item) => ({
    key: `meal-${item.id}`,
    time: formatActionTime(item.loggedAt),
    title: `Meal log · ${item.mealType}`,
    type: "Fueling",
    body: [item.hydration, item.notes].filter(Boolean).join(" · ") || "Fueling logged on this device.",
    sortKey: Date.parse(item.loggedAt) || 0,
  }));

  const noteItems: TimelineItem[] = listCoachNotes().map((item) => ({
    key: `note-${item.id}`,
    time: formatActionTime(item.loggedAt),
    title: `Note · ${item.noteType}`,
    type: "Coach note",
    body: `${item.attachedTo}: ${item.body || "Private coach note."}`,
    sortKey: Date.parse(item.loggedAt) || 0,
  }));

  return [...mockItems, ...actionItems, ...checkInItems, ...assignmentItems, ...mealItems, ...noteItems].sort(
    (a, b) => b.sortKey - a.sortKey,
  );
}

export function LiveTimelinePanel({ limit = 8 }: { limit?: number }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onStorage = () => setTick((n) => n + 1);
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "actionLog" || scope === "checkIns" || scope === "assignments" || scope === "mealLogs" || scope === "coachNotes") {
        setTick((n) => n + 1);
      }
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  const items = useMemo(() => buildTimeline().slice(0, limit), [tick, limit]);

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-400">No timeline events yet. Log a check-in, meal, note, or assignment to seed this device.</p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.key} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {item.time} • {item.type}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
