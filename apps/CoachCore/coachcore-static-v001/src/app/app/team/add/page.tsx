"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { addRosterAthlete, importRosterNames } from "@/services/athleteRosterStore";

export default function AddAthletePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bulk, setBulk] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleAddOne() {
    setError("");
    setMessage("");
    try {
      const athlete = addRosterAthlete({ name, role });
      setName("");
      setRole("");
      setMessage(`${athlete.name} added to your roster.`);
      window.setTimeout(() => router.push("/app/team"), 400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add athlete.");
    }
  }

  function handleBulkImport() {
    setError("");
    setMessage("");
    const created = importRosterNames(bulk);
    if (created.length === 0) {
      setError("Paste at least one athlete name (one per line).");
      return;
    }
    setBulk("");
    setMessage(`Imported ${created.length} athlete${created.length === 1 ? "" : "s"}.`);
    window.setTimeout(() => router.push("/app/team"), 400);
  }

  return (
    <SectionPage
      eyebrow="Roster"
      title="Add athletes"
      description="Build your team on this device. Names stay local until cloud roster sync is connected."
    >
      <div className="mb-6">
        <Link href="/app/team" className="text-sm font-bold text-sky-300">
          ← Back to team
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h2 className="text-xl font-black">Add one athlete</h2>
          <label className="mt-4 block text-sm font-bold text-slate-200">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-200">
            Role / group (optional)
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="WR / Speed Group"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
            />
          </label>
          <button
            type="button"
            onClick={handleAddOne}
            className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
          >
            Add to roster
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h2 className="text-xl font-black">Paste a list</h2>
          <p className="mt-2 text-sm text-slate-400">
            One name per line. Optional format: <span className="text-slate-200">Name — Role</span>
          </p>
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={"Marcus Reed — WR\nJalen Brooks — RB\nCam Ortiz"}
            className="mt-4 min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
          />
          <button
            type="button"
            onClick={handleBulkImport}
            className="mt-6 w-full rounded-2xl border border-sky-300/40 bg-sky-400/15 px-5 py-3 font-black text-sky-100 hover:bg-sky-400/25"
          >
            Import list
          </button>
        </div>
      </div>

      {(error || message) && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
            error
              ? "border-red-300/30 bg-red-400/10 text-red-100"
              : "border-emerald-300/25 bg-emerald-300/10 text-emerald-50"
          }`}
          role="status"
        >
          {error || message}
        </div>
      )}
    </SectionPage>
  );
}
