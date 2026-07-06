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
          Demo shell only. Use the dashboard button to enter without real credentials.
        </p>

        <div className="mt-6 space-y-4">
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

          <button className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10">
            Continue with Google
          </button>

          <button className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10">
            Continue with Apple
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          New to CoachCore?{" "}
          <Link href="/signup" className="font-bold text-sky-300">
            Create a demo account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
