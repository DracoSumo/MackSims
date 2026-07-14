import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← CoachCore
        </Link>
        <h1 className="mt-6 text-4xl font-black">Support</h1>
        <p className="mt-4 text-slate-300 leading-7">
          Beta feedback and access questions go to the MackSims team.
        </p>
        <p className="mt-6">
          <a href="mailto:feedback@macksims.com?subject=CoachCore%20Support" className="font-bold text-sky-300">
            feedback@macksims.com
          </a>
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Demo URL:{" "}
          <a href="https://coachcore7.netlify.app" className="text-sky-300">
            coachcore7.netlify.app
          </a>
        </p>
      </div>
    </main>
  );
}
