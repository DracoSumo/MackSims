import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm">
          <Link href="/" className="font-bold text-sky-300">
            ← CoachCore
          </Link>
          {" · "}
          <Link href="/terms" className="text-slate-300 hover:text-white">
            Terms
          </Link>
        </p>
        <h1 className="mt-6 text-4xl font-black">Privacy Policy (Beta)</h1>
        <p className="mt-2 text-sm text-slate-400">Effective 2026-07-27 · MackSims · feedback@macksims.com</p>
        <p className="mt-6 text-slate-300 leading-7">
          CoachCore is a MackSims coaching accountability beta. Demo builds use fictional athletes. Do not enter real
          minors&apos; personal data or protected health information until parental-consent and production privacy
          controls ship.
        </p>
        <h2 className="mt-8 text-xl font-bold">What we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400">
          <li>Optional OAuth account identifiers when you sign in</li>
          <li>Local check-ins, action logs, and beta requests stored on-device or synced when configured</li>
          <li>Feedback emailed to feedback@macksims.com</li>
        </ul>
        <h2 className="mt-8 text-xl font-bold">How we use it</h2>
        <p className="mt-3 text-slate-400 leading-7">
          To operate the beta, improve product quality, and respond to coaches who request access. We do not sell
          personal information.
        </p>
        <h2 className="mt-8 text-xl font-bold">Your choices</h2>
        <p className="mt-3 text-slate-400 leading-7">
          Use demo mode without cloud sync, export/clear local data from the app where offered, or email{" "}
          <a className="text-sky-300" href="mailto:feedback@macksims.com">
            feedback@macksims.com
          </a>{" "}
          for deletion requests.
        </p>
        <p className="mt-8 text-sm text-slate-500">
          Suite policy: <code>legal/PRIVACY.md</code> ·{" "}
          <a className="text-sky-300" href="https://www.macksims.com/">
            macksims.com
          </a>
        </p>
      </div>
    </main>
  );
}
