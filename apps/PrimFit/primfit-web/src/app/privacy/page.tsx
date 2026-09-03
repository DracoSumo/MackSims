import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | PrimFit",
  description: "PrimFit privacy policy — how MackSims LLC handles on-device plans, optional location, and intro emails.",
  alternates: { canonical: "https://primfit.macksims.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-[var(--pf-purple-bright)]">
        ← PrimFit
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--pf-muted)]">Privacy</p>
      <h1 className="mt-2 text-2xl font-bold">PrimFit privacy policy</h1>
      <p className="mt-2 text-xs text-[var(--pf-muted)]">Last updated 17 August 2026 · MackSims LLC · Ages 13+</p>

      <div className="mt-6 space-y-6 text-sm leading-6 text-[var(--pf-muted)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Who we are</h2>
          <p className="mt-2">
            PrimFit is operated by <strong>MackSims LLC</strong>, 1211 Sweet Gum Drive, Brandon, FL 33511, United
            States (Florida LLC document no. L26000335172). Privacy:{" "}
            <a href="mailto:privacy@macksims.com">privacy@macksims.com</a>. Support:{" "}
            <a href="mailto:support@macksims.com">support@macksims.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">What this app stores</h2>
          <p className="mt-2">
            PrimFit is local-first. Sport, schedule, equipment, pantry, workout and meal templates, check-offs,
            grocery lists, optional goals (including optional weight or lift targets), and optional pro-intro
            requests are saved in this browser or on this device (localStorage). We do not operate a PrimFit
            cloud account in this version.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Optional email</strong> on a pro intro request is saved on this device only. It is not sold
              and is not emailed to a trainer until a later version connects a backend.
            </li>
            <li>
              <strong>Optional location</strong> is used only if you turn on location mode, to label a place (home /
              gym / outdoor / travel). Workouts do not require live maps. Precise GPS is not sent to MackSims
              servers in this version.
            </li>
            <li>
              <strong>Hosting logs:</strong> visiting primfit.macksims.com may create ordinary web logs (IP,
              browser, timestamps) at our host.
            </li>
          </ul>
          <p className="mt-2">
            Fitness and nutrition templates are general wellness content, not medical records. PrimFit is not a
            HIPAA covered entity or business associate, and we do not claim HIPAA compliance.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">How we use information</h2>
          <p className="mt-2">
            To build your week of workouts and meals on this device, remember preferences, and (if you later
            contact us) answer support or privacy requests. We do not sell personal information and do not
            “share” it for cross-context behavioral advertising under California law. We do not run advertising
            SDKs in this version.
          </p>
          <p className="mt-2">
            Where EU/UK data protection law applies, MackSims LLC is the controller. Typical lawful bases:
            performance of the service you request (on-device plan), consent for optional location or optional
            email on an intro, and legitimate interests in security and answering support.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Cookies, local storage, and Do Not Track</h2>
          <p className="mt-2">
            We use essential local storage to run the app. We do not use non-essential advertising cookies. We
            do not currently alter behavior in response to browser Do Not Track signals because we do not use
            third-party ads or cross-site tracking pixels. Hosting providers may still process technical logs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Your controls and rights</h2>
          <p className="mt-2">
            Clear this site’s storage (or uninstall the app) to delete on-device PrimFit data. Email{" "}
            <a href="mailto:privacy@macksims.com?subject=Privacy%20Request">privacy@macksims.com</a> with subject
            “Privacy Request” to access, correct, or delete any personal information we hold, or to object or
            restrict processing where the law gives you those rights (including GDPR/UK GDPR). California and
            certain other US residents may also request to know, delete, or correct, subject to verification.
            We may need to confirm it is you. Appeal a denial with subject “Privacy Appeal.”
          </p>
          <p className="mt-2">
            Company-wide deletion help:{" "}
            <a href="https://macksims.com/account-deletion">macksims.com/account-deletion</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Children</h2>
          <p className="mt-2">
            PrimFit is for ages 13 and up. It is not directed to children under 13, and we do not knowingly
            collect personal information from children. Contact us if you believe a child provided data and we
            will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Store privacy labels</h2>
          <p className="mt-2">
            Apple App Privacy and Google Play Data Safety should match this notice: no account, no ads SDK, no
            sale of data; optional on-device health/fitness inputs; optional location for a place label; optional
            email only if you type it on an intro request. Those console forms are filled by the owner before
            production submit.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Email</h2>
          <p className="mt-2">
            If we send commercial email, we identify MackSims, include a valid postal address, and honor opt-out
            requests (CAN-SPAM). This version does not send marketing email from intro requests.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Transfers, retention, security</h2>
          <p className="mt-2">
            We are based in the United States. Hosting logs may be processed in the US. On-device data stays on
            your device until you clear it. Hosting logs are typically kept on the order of about 90 days.
            Support email may be kept about 24 months after a request is closed. We use HTTPS. If a breach of
            covered personal information requires notice under Florida or other law, we will notify as required.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Changes</h2>
          <p className="mt-2">We may update this policy and will revise the date above. Material changes may also be noted in-app.</p>
        </section>
      </div>

      <p className="mt-8 text-xs text-[var(--pf-muted)]">
        MackSims LLC · Ages 13+ · <Link href="/terms">Terms</Link>
        {" · "}
        <a href="https://macksims.com/support">macksims.com/support</a>
      </p>
    </main>
  );
}
