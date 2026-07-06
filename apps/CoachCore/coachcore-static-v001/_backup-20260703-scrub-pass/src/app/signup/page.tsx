import Link from "next/link";
import { AuthShell, Field } from "@/components/auth/AuthShell";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Build your team"
      title="Start with the group you coach."
      description="Create a coach, athlete, gym, school, club, or performance facility profile. Backend setup comes later."
    >
      <div>
        <h2 className="text-3xl font-black">Create demo account</h2>
        <p className="mt-2 text-sm text-slate-400">
          This is an auth-ready placeholder for v0.1.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Name" placeholder="Coach Davis" />
          <Field label="Email" placeholder="coach@example.com" type="email" />
          <Field label="Organization" placeholder="School, club, gym, or private team" />

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Primary role</span>
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-300/60">
              <option>Coach</option>
              <option>Athlete</option>
              <option>Parent / Guardian</option>
              <option>Gym Owner</option>
              <option>Performance Trainer</option>
              <option>Organization Admin</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Program type</span>
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-300/60">
              <option>Team sport</option>
              <option>Functional fitness / CrossFit-style box</option>
              <option>Private performance coaching</option>
              <option>School / club athletics</option>
              <option>Mixed program</option>
            </select>
          </label>
        </div>

        <Link
          href="/app"
          className="mt-6 block rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-sky-300"
        >
          Create Demo Workspace
        </Link>

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
