"use client";

import { useState } from "react";
import { coachCoreConfig } from "@/config/coachcore";

export function VideoUploadPanel() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-dashed border-white/20 bg-white/[0.03] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Video upload scaffold</p>
      <p className="mt-2 text-sm text-slate-400">
        Select a clip to simulate upload. Real Supabase Storage wiring ships when auth and RLS are stable.
      </p>
      <label className="mt-4 flex cursor-pointer flex-col items-center rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-8 hover:bg-white/5">
        <span className="text-sm font-bold text-sky-200">Choose video file (demo only)</span>
        <input
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file ? file.name : null);
          }}
        />
      </label>
      {fileName ? (
        <p className="mt-3 text-sm text-emerald-200">
          Ready to upload: {fileName} — not sent (static demo).
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">{coachCoreConfig.safetyNote}</p>
      )}
    </div>
  );
}
