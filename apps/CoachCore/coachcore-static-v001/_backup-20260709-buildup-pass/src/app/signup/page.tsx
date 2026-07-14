import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Build your team"
      title="Start with the group you coach."
      description="Create a coach, athlete, gym, school, club, or performance facility profile. Backend setup comes later."
    >
      <div>
        <h2 className="text-3xl font-black">Create demo workspace</h2>
        <p className="mt-2 text-sm text-slate-400">
          Signup stores locally in demo mode. Real accounts ship with v0.6 Supabase auth.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            href="/app"
            className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-sky-300"
          >
            Create Demo Workspace
          </Link>
          <p className="text-center text-xs text-amber-200/90">Primary path — opens demo dashboard with mock roster.</p>
          <OAuthButtons />
        </div>

        <div className="mt-6 space-y-4 opacity-70">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile fields — coming in v0.6</p>
          <Field label="Name" placeholder="Coach Davis" disabled />
          <Field label="Email" placeholder="coach@example.com" type="email" disabled />
          <Field label="Organization" placeholder="School, club, gym, or private team" disabled />

          <label className="block opacity-70">
            <span className="text-sm font-semibold text-slate-200">Primary role (v0.6)</span>
            <select disabled className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none">
              <option>Coach</option>
            </select>
          </label>

          <label className="block opacity-70">
            <span className="text-sm font-semibold text-slate-200">Program type (v0.6)</span>
            <select disabled className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none">
              <option>Team sport</option>
            </select>
          </label>
        </div>

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
