"use client";

import { useState } from "react";
import { enableDemoFixtures } from "@/config/demoFixtures";
import { logCoachAction } from "@/services/actionLogStore";

/**
 * Saves a local coach action draft only.
 * Never claims notifications, backend writes, or partner API success.
 */
export function MockActionRunner({
  buttonLabel = "Record local preview",
  successTitle,
  successBody,
  timelineItems,
  actionLabel,
}: {
  buttonLabel?: string;
  successTitle: string;
  successBody: string;
  timelineItems: string[];
  actionLabel?: string;
}) {
  const [hasRun, setHasRun] = useState(false);
  const [timestamp, setTimestamp] = useState("");

  function handleRun() {
    setTimestamp(
      new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    );
    setHasRun(true);
    if (actionLabel) {
      logCoachAction(
        actionLabel,
        `${successTitle} (generic local preview marker; form values not stored)`,
        { sync: false },
      );
    }
  }

  if (!enableDemoFixtures) {
    return (
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <p className="text-sm font-bold text-slate-200">Not connected yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          This action is available in the product shell, but it does not send notifications or write to a live team
          backend in this build. Import your roster and connect integrations before expecting live delivery.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 min-h-12 w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-3 font-black text-slate-500"
        >
          {buttonLabel} — unavailable
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRun}
        disabled={hasRun}
        className="mt-6 min-h-12 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-default disabled:bg-sky-200"
      >
        {hasRun ? "Local preview recorded" : buttonLabel}
      </button>

      {hasRun ? (
        <div
          className="mt-5 rounded-3xl border border-sky-300/25 bg-sky-300/10 p-5"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">Local preview only</p>
          <h3 className="mt-3 text-2xl font-black text-white">{successTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-sky-50/85">{successBody}</p>
          <p className="mt-3 text-xs leading-5 text-sky-100/70">
            A generic activity marker was stored on this device. Form values were not saved, and no athlete
            notification, cloud write, or partner API call was made.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Example activity log</p>
            <div className="mt-4 space-y-3">
              {timelineItems.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" />
                  <p>
                    <span className="font-bold text-slate-100">{timestamp}</span> {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasRun(false)}
            className="mt-4 min-h-11 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            Reset preview
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Example mode. Records only a generic local activity marker; field values are not saved.
        </p>
      )}
    </div>
  );
}
