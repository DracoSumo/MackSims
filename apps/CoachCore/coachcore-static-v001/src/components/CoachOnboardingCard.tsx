"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { coachCoreConfig } from "@/config/coachcore";
import { localGet, localSet } from "@/lib/safeStorage";

const DISMISS_KEY = "coachcore.coachOnboardingDismissed";

export function CoachOnboardingCard() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localGet(DISMISS_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="mt-6 rounded-[2rem] border border-sky-300/25 bg-sky-300/10 p-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">Coach quick start</p>
      <h2 className="mt-3 text-2xl font-black">What does “locked in” mean?</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-50/90">
        {coachCoreConfig.accountabilityDefinition}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-50/75">
        Athletes: {coachCoreConfig.athleteTodayPrompt}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/app/accountability"
          className="rounded-2xl bg-sky-400 px-5 py-2.5 text-sm font-black text-slate-950 hover:bg-sky-300"
        >
          Open accountability board
        </Link>
        <button
          type="button"
          className="rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          onClick={() => {
            localSet(DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          Got it — hide this card
        </button>
      </div>
    </div>
  );
}
