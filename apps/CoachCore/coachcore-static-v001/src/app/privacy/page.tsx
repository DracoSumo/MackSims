import Link from "next/link";
import { coachCoreConfig } from "@/config/coachcore";

const dataUses = [
  {
    title: "Account & profile",
    body: "Name, email, role (coach, athlete, parent, admin), and organization — used to sign you in and show the right team view.",
  },
  {
    title: "Teams & rosters",
    body: "Athlete names, groups, positions, and team membership — used to manage accountability and assignments inside your program.",
  },
  {
    title: "Training & playbook",
    body: "Workouts, WODs, drills, plays, and assignment status — used to track what athletes should complete.",
  },
  {
    title: "Fueling & readiness",
    body: "Meal logs, hydration notes, and readiness check-ins — coaching support only, not medical records.",
  },
  {
    title: "Film & video",
    body: "Assigned clips, watch completion, and coach notes — used for movement review and teachable moments.",
  },
  {
    title: "Team messaging",
    body: "Messages within team channels — used for coach announcements, group chat, and daily communication.",
  },
  {
    title: "Accountability & activity",
    body: "Check-ins, completions, nudges, and coach action logs — used to show who is locked in.",
  },
  {
    title: "Beta requests",
    body: "Name, email, and organization when you request early access — used only to respond to your request.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Privacy Policy</p>
        <h1 className="mt-3 text-4xl font-black">Your data stays in the app.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">{coachCoreConfig.privacySummary}</p>
        <p className="mt-3 text-sm text-slate-500">Last updated: July 14, 2026 · {coachCoreConfig.version}</p>

        <section className="mt-10 space-y-6 text-slate-300 leading-7">
          <div>
            <h2 className="text-2xl font-black text-white">Controller</h2>
            <p className="mt-3">
              CoachCore is published by <strong className="text-white">MackSims LLC</strong>, 1211 Sweet Gum Drive,
              Brandon, FL 33511, United States (Florida LLC L26000335172). Registered agent: ZenBusiness Inc., 336 E.
              College Ave., Suite 301, Tallahassee, FL 32301.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Site-wide policy:{" "}
              <a href="https://macksims-public-site.netlify.app/privacy/" className="font-bold text-sky-300">
                macksims.com/privacy
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Who CoachCore is for</h2>
            <p className="mt-3">{coachCoreConfig.targetAudience}</p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">What we collect</h2>
            <p className="mt-3">
              CoachCore collects only what is needed to run coaching workflows — rosters, assignments, film, training,
              fueling logs, messaging, and accountability status. Demo mode may store some actions locally on your device
              until you clear browser data.
            </p>
            <ul className="mt-5 space-y-4">
              {dataUses.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="mt-2 text-sm">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">How we use data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Operate CoachCore features you use (teams, assignments, chat, accountability).</li>
              <li>Sync your account when cloud sign-in is enabled.</li>
              <li>Respond to support and beta requests.</li>
              <li>Improve reliability and security of the service.</li>
            </ul>
            <p className="mt-4 font-semibold text-white">We do not sell your data. We do not use your data for advertising.</p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Who can see data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Coaches and authorized staff see data for teams they manage.</li>
              <li>Athletes see their own assignments, messages, and status.</li>
              <li>Parents/guardians see only information their program shares with them.</li>
              <li>MackSims processes data only to operate the app — not for unrelated purposes.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Third-party services</h2>
            <p className="mt-3">
              When enabled, CoachCore may use Supabase for authentication and cloud storage, and OAuth providers (Google or
              GitHub) for sign-in. Those providers process data under their own policies. We do not share roster or
              coaching data with advertisers or data brokers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Health & nutrition disclaimer</h2>
            <p className="mt-3">{coachCoreConfig.coachingSupportDisclaimer}</p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Data retention & deletion</h2>
            <p className="mt-3">
              We keep account and team data while your account is active. You may request deletion at any time — after
              verification we remove live cloud account data within 30 days. Encrypted backups may retain residual
              copies until purged on rotation within about 90 days.
            </p>
            <p className="mt-3">
              Email{" "}
              <a href={`mailto:${coachCoreConfig.privacyEmail}?subject=CoachCore%20account%20deletion`} className="font-bold text-sky-300">
                {coachCoreConfig.privacyEmail}
              </a>{" "}
              from the address tied to your account, or use our{" "}
              <Link href="/account-deletion" className="font-bold text-sky-300">
                account deletion page
              </Link>
              {" "}
              or{" "}
              <a href="https://macksims-public-site.netlify.app/account-deletion/" className="font-bold text-sky-300">
                macksims.com/account-deletion
              </a>
              .
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Demo-only data stored in your browser can be cleared by removing site data for this app in your device
              settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Contact</h2>
            <p className="mt-3">
              Privacy:{" "}
              <a href={`mailto:${coachCoreConfig.privacyEmail}`} className="font-bold text-sky-300">
                {coachCoreConfig.privacyEmail}
              </a>
              <br />
              Support:{" "}
              <a href={`mailto:${coachCoreConfig.supportEmail}`} className="font-bold text-sky-300">
                {coachCoreConfig.supportEmail}
              </a>
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="font-bold text-sky-300">
            Terms
          </Link>
          <Link href="/support" className="font-bold text-sky-300">
            Support
          </Link>
          <Link href="/account-deletion" className="font-bold text-sky-300">
            Account deletion
          </Link>
        </div>
      </div>
    </main>
  );
}
