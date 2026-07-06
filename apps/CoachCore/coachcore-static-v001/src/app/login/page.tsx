import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

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
          Use Google or GitHub when Supabase is configured, or enter the demo dashboard below.
        </p>

        <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Demo credentials (not connected)</p>
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

          <OAuthButtons className="mt-1" />
        </div>

        <p className="mt-6 text-sm text-slate-400">
          New to CoachCore?{" "}
          <Link href="/signup" className="font-bold text-sky-300">
            View signup
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
