"use client";

import { useEffect, useState } from "react";
import { listActionLog, formatActionTime } from "@/services/actionLogStore";
import { downloadLocalExport, importLocalExport } from "@/services/localDataExport";

export function LocalDataPanel() {
  const [actions, setActions] = useState<ReturnType<typeof listActionLog>>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setActions(listActionLog());
  }, []);

  async function handleImport(file: File) {
    const result = await importLocalExport(file);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setActions(listActionLog());
    setMessage("Import complete — refresh pages to see merged local data.");
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Local demo data</p>
      <h2 className="mt-3 text-2xl font-black">Export / import (no API keys)</h2>
      <p className="mt-2 text-sm text-slate-400">
        Check-ins, mock action log, and beta requests saved in this browser. Use export for tester handoff.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadLocalExport()}
          className="rounded-2xl bg-sky-400 px-4 py-2 text-sm font-black text-slate-950"
        >
          Export JSON
        </button>
        <label className="cursor-pointer rounded-2xl border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImport(file);
            }}
          />
        </label>
      </div>

      {message && <p className="mt-3 text-sm text-amber-200">{message}</p>}

      <div className="mt-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Recent mock actions</p>
        {actions.length === 0 ? (
          <p className="text-sm text-slate-500">No mock actions logged yet — run flows from Quick coach actions.</p>
        ) : (
          actions.slice(0, 6).map((item) => (
            <p key={item.id} className="text-sm text-slate-300">
              <span className="text-slate-100">{formatActionTime(item.loggedAt)}</span> — {item.label}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
