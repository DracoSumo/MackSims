import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { isSupabaseConfigured } from "@/config/backend";

export default function LoginPage() {
  const live = isSupabaseConfigured;

  return (
    <AuthShell
      eyebrow="Coach access"
      title="Get back to the command center."
      description="Sign in to review team readiness, film completion, workouts, meal logs, and athlete accountability."
    >
      <div>
        <h2 className="text-3xl font-black">Sign in</h2>
        <p className="mt-2 text-sm text-slate-400">
          {live
            ? "Continue with Google or GitHub, or open the sample dashboard while you explore."
            : "OAuth needs Supabase at build time. You can still open the sample dashboard below."}
        </p>

        <div className="mt-6 grid gap-3">
          <OAuthButtons />

          <Link
            href="/app"
            className="rounded-2xl border border-white/15 px-5 py-3 text-center font-bold text-white hover:bg-white/5"
          >
            {live ? "Explore sample dashboard" : "Enter sample dashboard"}
          </Link>
        </div>

        {!live && (
          <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Email/password — coming soon
            </p>
            <Field label="Email" placeholder="coach@example.com" type="email" />
            <Field label="Password" placeholder="••••••••" type="password" />
          </div>
        )}

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
