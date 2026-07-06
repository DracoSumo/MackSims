import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <h1 className="mt-6 text-4xl font-black">Privacy (placeholder)</h1>
        <p className="mt-4 text-slate-300 leading-7">
          CoachCore may handle team rosters, training logs, and athlete-adjacent data. This static demo stores nothing on a server.
          A full privacy policy will ship before any production athlete data collection.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-400">
          <li>Demo mode: mock athletes only — no real minors or health records.</li>
          <li>Beta requests (when wired) will require explicit consent and parental notice where required.</li>
          <li>Questions: feedback@macksims.com</li>
        </ul>
      </div>
    </main>
  );
}
