import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Coach access"
      title="Get back to the command center."
      description="Sign in to review team readiness, film completion, workouts, meal logs, and athlete accountability."
    >
      <div>
        <h2 className="text-3xl font-black">Sign in</h2>
        <p className="mt-2 text-sm text-slate-400">
          Demo shell only. Real auth is not connected — use the dashboard button below.
        </p>

        <div className="mt-6 space-y-4 opacity-60">
          <Field label="Email" placeholder="coach@example.com" type="email" />
          <Field label="Password" placeholder="••••••••" type="password" />
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href="/app"
            className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-sky-300"
          >
            Enter Demo Dashboard
          </Link>

          <button
            type="button"
            disabled
            title="OAuth not available in this demo build"
            className="cursor-not-allowed rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-500"
          >
            Google sign-in — coming with backend
          </button>

          <button
            type="button"
            disabled
            title="OAuth not available in this demo build"
            className="cursor-not-allowed rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-500"
          >
            Apple sign-in — coming with backend
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          New to CoachCore?{" "}
          <Link href="/signup" className="font-bold text-sky-300">
            View signup placeholder
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
