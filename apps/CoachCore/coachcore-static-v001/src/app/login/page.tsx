import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { EnterDemoButton } from "@/components/auth/EnterDemoButton";
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
          Use Google or GitHub when Supabase is configured, or open the coach workspace on this device.
        </p>

        <div className="mt-6 grid gap-3">
          <OAuthButtons className="mt-1" />

          <EnterDemoButton className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-sky-300" />
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
