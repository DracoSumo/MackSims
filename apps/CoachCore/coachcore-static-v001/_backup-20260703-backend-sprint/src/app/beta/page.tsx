"use client";

import Link from "next/link";
import { useState } from "react";

const STORAGE_KEY = "coachcore.betaRequests";

type BetaRequest = {
  id: string;
  name: string;
  email: string;
  organization: string;
  lane: string;
  message: string;
  savedAt: string;
};

export default function BetaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [lane, setLane] = useState("Team sport");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setStatus("error");
      return;
    }

    const record: BetaRequest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim(),
      lane,
      message: message.trim(),
      savedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BetaRequest[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 20)));
      setStatus("saved");
      setName("");
      setEmail("");
      setOrganization("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.22),_transparent_36%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <Link href="/">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-300">MackSims</p>
            <h1 className="mt-1 text-2xl font-black">CoachCore Beta</h1>
          </Link>

          <Link
            href="/app"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-bold hover:bg-white/10"
          >
            View Demo
          </Link>
        </header>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Early access</p>
            <h2 className="mt-4 text-5xl font-black tracking-tight lg:text-7xl">
              Bring accountability to your team before everyone else.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CoachCore is being built for coaches, teams, gyms, trainers, and athletes who need proof that the work is getting done.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30"
          >
            <h3 className="text-3xl font-black">Request beta access</h3>
            <p className="mt-2 text-sm text-slate-400">
              Saved locally in this browser until backend intake is wired. No server submission yet.
            </p>

            <div className="mt-6 grid gap-4">
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                placeholder="Team, gym, or organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />

              <select
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                value={lane}
                onChange={(e) => setLane(e.target.value)}
              >
                <option>Team sport</option>
                <option>Functional fitness / CrossFit-style gym</option>
                <option>Private performance coaching</option>
                <option>School / club athletics</option>
                <option>Other</option>
              </select>

              <textarea
                className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                placeholder="What do you want CoachCore to help you track?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                type="submit"
                className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
              >
                Save Beta Request (local)
              </button>
            </div>

            {status === "saved" && (
              <p className="mt-5 text-sm text-emerald-300">
                Request saved on this device. We will follow up when backend intake opens.
              </p>
            )}
            {status === "error" && (
              <p className="mt-5 text-sm text-amber-300">
                Enter name and email, or allow local storage in this browser.
              </p>
            )}

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Not medical advice. CoachCore tracks training habits — not health diagnosis. See{" "}
              <Link href="/privacy" className="text-sky-300">
                Privacy
              </Link>
              .
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
