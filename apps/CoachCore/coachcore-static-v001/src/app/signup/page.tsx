import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { isSupabaseConfigured } from "@/config/backend";

export default function SignupPage() {
  const live = isSupabaseConfigured;

  return (
    <AuthShell
      eyebrow="Build your team"
      title="Start with the group you coach."
      description="Create a coach profile for your school, club, gym, or performance program."
    >
      <div>
        <h2 className="text-3xl font-black">{live ? "Create your account" : "Join CoachCore"}</h2>
        <p className="mt-2 text-sm text-slate-400">
          {live
            ? "Sign up with Google or GitHub. Profile details sync after your first sign-in."
            : "Auth is ready once Supabase is configured at build time. You can still explore the sample workspace."}
        </p>

        <div className="mt-6 grid gap-3">
          <OAuthButtons />
          <Link
            href="/app"
            className="rounded-2xl border border-white/15 px-5 py-3 text-center font-bold text-white hover:bg-white/5"
          >
            Explore sample workspace
          </Link>
        </div>

        {!live && (
          <div className="mt-6 space-y-4">
            <Field label="Name" placeholder="Coach Davis" />
            <Field label="Email" placeholder="coach@example.com" type="email" />
            <Field label="Organization" placeholder="School, club, gym, or private team" />
          </div>
        )}

        <p className="mt-6 text-sm text-slate-400">
          Already have access?{" "}
          <Link href="/login" className="font-bold text-sky-300">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
