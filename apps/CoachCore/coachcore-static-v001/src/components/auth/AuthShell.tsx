import Link from "next/link";
import { isSupabaseConfigured } from "@/config/backend";
import { coachCoreConfig } from "@/config/coachcore";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const live = isSupabaseConfigured;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_34%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <Link href="/" className="inline-block">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-300">MackSims</p>
            <h1 className="mt-2 text-3xl font-black">CoachCore</h1>
          </Link>

          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">{eyebrow}</p>
            <h2 className="mt-4 text-5xl font-black tracking-tight lg:text-7xl">{title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{description}</p>
          </div>

          <div
            className={`mt-8 rounded-3xl border p-5 ${
              live
                ? "border-emerald-300/25 bg-emerald-300/10"
                : "border-white/10 bg-white/[0.06]"
            }`}
          >
            <p className={`font-black ${live ? "text-emerald-100" : "text-sky-100"}`}>
              {live ? `${coachCoreConfig.version} live beta` : "Config required"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {live
                ? "Sign in with Google or GitHub to sync check-ins and coach actions. Sample roster data remains until your team is imported. No payments, Hudl, or wearables yet."
                : "Supabase URL + anon key must be set at build time for OAuth. You can still explore the sample dashboard."}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur">
          {children}
        </section>
      </div>
    </main>
  );
}

export function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/60"
      />
    </label>
  );
}
