import Link from "next/link";
import { coachCoreConfig } from "@/config/coachcore";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <h1 className="mt-6 text-4xl font-black">Terms of use</h1>
        <p className="mt-4 text-slate-300 leading-7">
          CoachCore is a coaching accountability tool for {coachCoreConfig.targetAudience.toLowerCase()} — not medical
          advice, not licensed CrossFit software, and not a substitute for qualified coaching judgment.
        </p>

        <section className="mt-8 space-y-5 text-slate-300 leading-7">
          <div>
            <h2 className="text-xl font-black text-white">Service</h2>
            <p className="mt-2">
              MackSims provides CoachCore to help coaches track film, training, fueling, messaging, and accountability.
              Demo builds may use mock data; production accounts sync when cloud auth is enabled.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Your responsibilities</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Coaches remain responsible for athlete safety and program design.</li>
              <li>Programs using youth athletes must follow applicable laws and organizational policies.</li>
              <li>Do not enter medical diagnoses or treatment plans as coaching data.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Data & privacy</h2>
            <p className="mt-2">{coachCoreConfig.privacySummary}</p>
            <p className="mt-2">
              See our{" "}
              <Link href="/privacy" className="font-bold text-sky-300">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/account-deletion" className="font-bold text-sky-300">
                Account deletion
              </Link>{" "}
              pages for details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Disclaimer</h2>
            <p className="mt-2">{coachCoreConfig.coachingSupportDisclaimer}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
