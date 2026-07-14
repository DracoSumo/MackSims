import Link from "next/link";
import { coachCoreConfig } from "@/config/coachcore";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <h1 className="mt-6 text-4xl font-black">Support</h1>
        <p className="mt-4 text-slate-300 leading-7">
          Beta feedback, access questions, and account help go to the MackSims team.
        </p>
        <p className="mt-6">
          <a
            href={`mailto:${coachCoreConfig.supportEmail}?subject=CoachCore%20Support`}
            className="font-bold text-sky-300"
          >
            {coachCoreConfig.supportEmail}
          </a>
        </p>

        <section className="mt-10 space-y-4 text-slate-300 leading-7">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-black text-white">Privacy & data</h2>
            <p className="mt-2 text-sm">{coachCoreConfig.privacySummary}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="font-bold text-sky-300">
                Privacy Policy
              </Link>
              <Link href="/account-deletion" className="font-bold text-sky-300">
                Request account deletion
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Demo URL:{" "}
            <a href={coachCoreConfig.demoUrl} className="text-sky-300">
              {coachCoreConfig.demoUrl.replace("https://", "")}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
