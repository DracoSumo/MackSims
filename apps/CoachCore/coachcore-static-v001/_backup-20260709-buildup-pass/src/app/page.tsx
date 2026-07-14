import Link from "next/link";
import { integrations } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { DemoDisclaimerStrip } from "@/components/ui/CoachCards";

const featureCards = [
  {
    title: "Team command center",
    body: "Group chats, announcements, rosters, parent channels, and coach-only spaces in one clean hub.",
  },
  {
    title: "Playbooks and drills",
    body: "Build plays, practice plans, movement standards, WODs, drills, and coach notes for every group.",
  },
  {
    title: "Film accountability",
    body: "Assign clips, tag moments, highlight corrections, and track in-app watch time and completion.",
  },
  {
    title: "Fueling and readiness",
    body: "Meal logs, hydration, workouts, and recovery signals for coaching support — not medical diagnosis.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_35%),linear-gradient(135deg,#060e18,#0a1628_50%,#060e18)] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">MackSims</p>
            <h2 className="mt-1 text-xl font-black">CoachCore</h2>
          </div>

          <Link
            href="/app"
            className="rounded-full border border-emerald-300/40 px-5 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/10"
          >
            Sign In
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
              All-sports + functional fitness coaching platform
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
              No more guessing who is locked in.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CoachCore gives coaches one place to manage teams, workouts, meals,
              playbooks, film, and athlete accountability.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              {coachCoreConfig.accountabilityDefinition}
            </p>

            <div className="mt-6 max-w-2xl">
              <DemoDisclaimerStrip />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/beta"
                className="rounded-full bg-emerald-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300"
              >
                Start Demo
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-white/15 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <p className="text-sm font-bold text-sky-300">Coach alert</p>
              <h3 className="mt-3 text-3xl font-black">12 of 18 watched film.</h3>
              <p className="mt-3 text-slate-300">
                5 missed meal logs. 3 have not opened this week&apos;s playbook.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Readiness", "82%"],
                  ["Workout", "76%"],
                  ["Film", "67%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <h3 className="font-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Plugin-ready</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {integrations.map((item) => (
              <span key={item.name} className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200">
                {item.name}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Hudl and similar video-platform integrations will be supported where API, export, embed, or licensed access is available.
            CoachCore tracks in-app watch time and engagement immediately.
          </p>
        </section>
      </section>
    </main>
  );
}
