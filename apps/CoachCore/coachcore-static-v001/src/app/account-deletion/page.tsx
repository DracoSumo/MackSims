import Link from "next/link";
import { coachCoreConfig } from "@/config/coachcore";

export default function AccountDeletionPage() {
  const mailto = `mailto:${coachCoreConfig.privacyEmail}?subject=${encodeURIComponent("CoachCore account deletion request")}&body=${encodeURIComponent(
    [
      "CoachCore account deletion request",
      "",
      "Email tied to account:",
      "Organization / team (if applicable):",
      "What to delete (account, team data, beta request, etc.):",
      "",
      "We will verify this request and confirm when deletion is complete.",
    ].join("\n"),
  )}`;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/privacy" className="text-sm font-bold text-sky-300">
          ← Privacy Policy
        </Link>
        <h1 className="mt-6 text-4xl font-black">Account deletion</h1>
        <p className="mt-4 text-slate-300 leading-7">
          You can request deletion of your CoachCore account and associated cloud data at any time. MackSims does not
          sell your data — deletion removes what we store to operate the app for you.
        </p>

        <section className="mt-8 space-y-5 text-slate-300 leading-7">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-black text-white">Request deletion by email</h2>
            <p className="mt-3">
              Send a request from the email address tied to your account to{" "}
              <a href={mailto} className="font-bold text-sky-300">
                {coachCoreConfig.privacyEmail}
              </a>
              .
            </p>
            <a
              href={mailto}
              className="mt-4 inline-flex rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
            >
              Email deletion request
            </a>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">What we delete</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Your account and profile</li>
              <li>Cloud-synced check-ins, action logs, and beta requests tied to your account</li>
              <li>Team data you own, when you are the organization owner and request full removal</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Demo / local-only data</h2>
            <p className="mt-3">
              If you used demo mode without signing in, data may exist only on your device. Clear site data for CoachCore
              in your browser or app settings to remove it locally.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Timing</h2>
            <p className="mt-3">
              We aim to complete verified deletion of live cloud data within 30 days. Backup residual copies typically
              age out within about 90 days. You will receive a confirmation email when processing is finished.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Publisher: MackSims LLC · 1211 Sweet Gum Drive, Brandon, FL 33511 · Also listed at{" "}
              <a href="https://macksims-public-site.netlify.app/account-deletion/" className="text-sky-300">
                macksims.com/account-deletion
              </a>
              .
            </p>
          </div>
        </section>

        <p className="mt-10 text-sm text-slate-500">
          Questions?{" "}
          <a href={`mailto:${coachCoreConfig.supportEmail}`} className="text-sky-300">
            {coachCoreConfig.supportEmail}
          </a>
        </p>
      </div>
    </main>
  );
}
