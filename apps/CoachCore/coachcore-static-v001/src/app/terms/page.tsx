import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm">
          <Link href="/" className="font-bold text-sky-300">
            ← CoachCore
          </Link>
          {" · "}
          <Link href="/privacy" className="text-slate-300 hover:text-white">
            Privacy
          </Link>
        </p>
        <h1 className="mt-6 text-4xl font-black">Terms of Use (Beta)</h1>
        <p className="mt-2 text-sm text-slate-400">Effective 2026-07-27 · MackSims · feedback@macksims.com</p>
        <p className="mt-6 text-slate-300 leading-7">
          CoachCore helps coaches track accountability signals. It is <strong>not</strong> medical advice, nutritional
          counseling, or a substitute for qualified coaching judgment. CrossFit® and other marks belong to their owners;
          MackSims is not affiliated unless explicitly stated.
        </p>
        <h2 className="mt-8 text-xl font-bold">As-is beta</h2>
        <p className="mt-3 text-slate-400 leading-7">
          Demo builds are provided for evaluation. Features may be simulated. Coaches remain responsible for athlete
          safety and program design.
        </p>
        <h2 className="mt-8 text-xl font-bold">Acceptable use</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400">
          <li>Do not store real youth athlete PII in demo fields</li>
          <li>Do not abuse shared infrastructure or misrepresent MackSims affiliation</li>
          <li>Respect athlete privacy and organizational policies</li>
        </ul>
        <h2 className="mt-8 text-xl font-bold">Limitation</h2>
        <p className="mt-3 text-slate-400 leading-7">
          To the maximum extent permitted by law, liability for beta use is limited to the greater of fees paid to
          MackSims for the beta in the prior three months or USD $50.
        </p>
        <p className="mt-8 text-sm text-slate-500">
          Suite terms: <code>legal/TERMS.md</code>
        </p>
      </div>
    </main>
  );
}
