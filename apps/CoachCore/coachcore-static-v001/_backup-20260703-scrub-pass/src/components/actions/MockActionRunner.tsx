"use client";

import { useMemo, useState } from "react";

export function MockActionRunner({
  buttonLabel = "Run Mock Action",
  successTitle,
  successBody,
  timelineItems,
}: {
  buttonLabel?: string;
  successTitle: string;
  successBody: string;
  timelineItems: string[];
}) {
  const [hasRun, setHasRun] = useState(false);

  const timestamp = useMemo(() => {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [hasRun]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setHasRun(true)}
        className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
      >
        {hasRun ? "Mock Action Complete" : buttonLabel}
      </button>

      {hasRun ? (
        <div className="mt-5 rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
            Success simulation
          </p>
          <h3 className="mt-3 text-2xl font-black text-white">{successTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-emerald-50/85">{successBody}</p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Activity timeline
            </p>
            <div className="mt-4 space-y-3">
              {timelineItems.map((item, index) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                  <p>
                    <span className="font-bold text-slate-100">{timestamp}</span>{" "}
                    {index === 0 ? item : item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasRun(false)}
            className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Reset mock state
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Static demo only. Clicking this simulates the workflow locally in your browser.
        </p>
      )}
    </div>
  );
}
