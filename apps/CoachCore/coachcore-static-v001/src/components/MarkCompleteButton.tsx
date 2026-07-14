"use client";

import { useEffect, useState } from "react";
import {
  isItemComplete,
  markComplete,
  type AssignmentItemType,
} from "@/services/assignmentStore";

export function MarkCompleteButton({
  itemType,
  itemId,
  label,
  athleteId,
}: {
  itemType: AssignmentItemType;
  itemId: string;
  label: string;
  athleteId?: string;
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isItemComplete(itemType, itemId));
  }, [itemType, itemId]);

  if (done) {
    return (
      <p className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-center text-sm font-bold text-emerald-100">
        Marked complete (this device)
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        markComplete({ itemType, itemId, label, athleteId });
        setDone(true);
      }}
      className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 hover:bg-emerald-300"
    >
      Mark complete
    </button>
  );
}
