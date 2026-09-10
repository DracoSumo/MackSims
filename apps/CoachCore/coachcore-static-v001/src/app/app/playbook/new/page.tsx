"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { logCoachAction } from "@/services/actionLogStore";

export default function NewPlaybookPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    logCoachAction("Save playbook item", "Playbook item saved");
    setSaved(true);
  }

  return (
    <SectionPage
      eyebrow="Create install"
      title="Add a play, drill, or movement standard"
      description="Form for coach playbooks, sport installs, practice plans, and functional fitness movement standards."
    >
      <div className="mb-6">
        <Link href="/app/playbook" className="text-sm font-bold text-sky-300">
          ← Back to playbook
        </Link>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
        <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Title" />
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
          <option>Play</option>
          <option>Drill</option>
          <option>Game plan</option>
          <option>Practice plan</option>
          <option>Movement standard</option>
          <option>Functional fitness WOD standard</option>
        </select>
        <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Assigned group" />
        <textarea className="min-h-36 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Coach notes, responsibilities, standards, or teaching points" />
        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
        >
          Save playbook item
        </button>
        {saved ? (
          <p className="text-sm font-bold text-emerald-300" role="status">
            Saved on this device
          </p>
        ) : null}
      </div>
    </SectionPage>
  );
}
