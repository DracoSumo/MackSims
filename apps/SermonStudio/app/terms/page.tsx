import Link from "next/link";

export const metadata = {
  title: "Terms of Use — Pastor's Sermon Studio",
  description: "MackSims terms of use for Pastor's Sermon Studio beta."
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <p className="text-sm">
        <Link href="/" className="text-[var(--accent,#6b4f2e)] underline-offset-2 hover:underline">
          ← Sermon Studio
        </Link>
        {" · "}
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy
        </Link>
      </p>
      <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight">Terms of Use (Beta)</h1>
      <p className="mt-2 text-sm text-stone-500">Effective 2026-07-27 · MackSims · feedback@macksims.com</p>
      <div className="mt-8 space-y-4 text-stone-700">
        <p>
          Sermon Studio assists preparation. Ministry judgment, copyright compliance for songs/Scripture editions, and
          pastoral care remain your responsibility.
        </p>
        <h2 className="font-serif text-xl">As-is beta</h2>
        <p>Features may change. Local storage can be cleared by the browser — export libraries you care about.</p>
        <h2 className="font-serif text-xl">Acceptable use</h2>
        <p>No abuse of shared infrastructure. Do not upload unlawful content.</p>
        <h2 className="font-serif text-xl">Limitation</h2>
        <p>
          To the maximum extent permitted by law, liability for beta use is limited to the greater of fees paid to
          MackSims for the beta in the prior three months or USD $50.
        </p>
        <p className="text-sm text-stone-500">
          Canonical suite terms: monorepo <code>legal/TERMS.md</code>.
        </p>
      </div>
    </main>
  );
}
