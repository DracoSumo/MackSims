import Link from "next/link";

const betaLanes = [
  "Youth and travel teams",
  "High school programs",
  "Private performance coaches",
  "Functional fitness gyms",
  "Sport clubs and academies",
  "Strength and conditioning facilities",
];

export default function BetaPage() {
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

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {betaLanes.map((lane) => (
                <div key={lane} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold text-slate-200">
                  {lane}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30">
            <h3 className="text-3xl font-black">Request beta access</h3>
            <p className="mt-2 text-sm text-slate-400">
              Placeholder form for now. Real submission storage comes in a later backend patch.
            </p>

            <div className="mt-6 grid gap-4">
              <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600" placeholder="Name" />
              <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600" placeholder="Email" />
              <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600" placeholder="Team, gym, or organization" />

              <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                <option>Team sport</option>
                <option>Functional fitness / CrossFit-style gym</option>
                <option>Private performance coaching</option>
                <option>School / club athletics</option>
                <option>Other</option>
              </select>

              <textarea
                className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                placeholder="What do you want CoachCore to help you track?"
              />

              <button className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300">
                Request Beta Access
              </button>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Demo only. This form does not submit yet.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
