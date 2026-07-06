import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <h1 className="mt-6 text-4xl font-black">Terms (placeholder)</h1>
        <p className="mt-4 text-slate-300 leading-7">
          CoachCore is a coaching accountability tool — not medical advice, not licensed CrossFit software, and not a substitute for qualified coaching judgment.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-400">
          <li>Demo builds are provided as-is for evaluation.</li>
          <li>Coaches remain responsible for athlete safety and program design.</li>
          <li>Production terms will publish before paid or roster-backed launch.</li>
        </ul>
      </div>
    </main>
  );
}
