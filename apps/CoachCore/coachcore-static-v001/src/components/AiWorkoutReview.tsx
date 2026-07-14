"use client";

import { useState } from "react";
import { logCoachAction } from "@/services/actionLogStore";

const draftBlocks = [
  "Day 1 — Acceleration ladder + 4x30m sprints (full recovery)",
  "Day 2 — Lower strength: trap bar RDL, split squat, core anti-rotation",
  "Day 3 — Active recovery + mobility (20 min coach-led)",
  "Day 4 — Top-speed mechanics + resisted starts",
];

export function AiWorkoutReview() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="rounded-[2rem] border border-violet-300/20 bg-violet-300/10 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">AI draft review</p>
      <h2 className="mt-3 text-2xl font-black">4-week speed block (mock)</h2>
      <ul className="mt-4 space-y-2 text-sm text-violet-50/90">
        {draftBlocks.map((block) => (
          <li key={block}>• {block}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-violet-100/70">
        Coach must approve before assigning. No external AI API is connected in this demo.
      </p>
      {approved ? (
        <p className="mt-5 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
          Approved for demo assignment — saved to action log.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            logCoachAction("AI workout approved", "4-week speed block ready for assignment");
            setApproved(true);
          }}
          className="mt-5 rounded-2xl bg-violet-400 px-5 py-3 font-black text-slate-950 hover:bg-violet-300"
        >
          Approve draft (demo)
        </button>
      )}
    </div>
  );
}
