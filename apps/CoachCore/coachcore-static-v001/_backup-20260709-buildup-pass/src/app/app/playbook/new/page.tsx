import Link from "next/link";
import { SectionPage } from "@/components/SectionPage";

export default function NewPlaybookPage() {
  return (
    <SectionPage
      eyebrow="Create install"
      title="Add a play, drill, or movement standard"
      description="Mock form for coach playbooks, sport installs, practice plans, and functional fitness movement standards."
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
        <button className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950">
          Save Mock Playbook Item
        </button>
      </div>
    </SectionPage>
  );
}
