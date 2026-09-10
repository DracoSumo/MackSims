import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Pastor's Sermon Studio",
  description: "MackSims privacy policy for Pastor's Sermon Studio beta."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <p className="text-sm">
        <Link href="/" className="text-[var(--accent,#6b4f2e)] underline-offset-2 hover:underline">
          ← Sermon Studio
        </Link>
        {" · "}
        <Link href="/terms" className="underline-offset-2 hover:underline">
          Terms
        </Link>
      </p>
      <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight">Privacy Policy (Beta)</h1>
      <p className="mt-2 text-sm text-stone-500">Effective 2026-07-27 · MackSims · feedback@macksims.com</p>
      <div className="prose prose-stone mt-8 max-w-none space-y-4 text-stone-700">
        <p>
          Pastor&apos;s Sermon Studio is a MackSims beta. By default, drafts and library items stay in your browser
          (<code>localStorage</code>). If you sign in with cloud sync enabled, we process account identifiers and the
          sermons/series you choose to sync.
        </p>
        <h2 className="font-serif text-xl">What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Content you author (outlines, notes, series, setlists)</li>
          <li>Optional account email / OAuth identifiers</li>
          <li>Beta feedback you send to feedback@macksims.com</li>
        </ul>
        <h2 className="font-serif text-xl">Your content</h2>
        <p>Sermon content you create remains yours. We use it only to operate the workspace you use.</p>
        <h2 className="font-serif text-xl">Deletion</h2>
        <p>
          Clear site data to wipe local libraries. For cloud deletion requests email{" "}
          <a href="mailto:feedback@macksims.com">feedback@macksims.com</a>.
        </p>
        <p className="text-sm text-stone-500">
          Full suite policy: see monorepo <code>legal/PRIVACY.md</code> or{" "}
          <a href="https://www.macksims.com/">macksims.com</a>.
        </p>
      </div>
    </main>
  );
}
