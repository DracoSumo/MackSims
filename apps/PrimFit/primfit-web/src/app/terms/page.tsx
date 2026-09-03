import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms | PrimFit",
  description: "PrimFit terms of use — general fitness templates, not medical advice, as-is, Florida law.",
  alternates: { canonical: "https://primfit.macksims.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-[var(--pf-purple-bright)]">
        ← PrimFit
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--pf-muted)]">Terms</p>
      <h1 className="mt-2 text-2xl font-bold">PrimFit terms of use</h1>
      <p className="mt-2 text-xs text-[var(--pf-muted)]">Last updated 17 August 2026 · MackSims LLC · Ages 13+</p>

      <div className="mt-6 space-y-6 text-sm leading-6 text-[var(--pf-muted)]">
        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">The product</h2>
          <p className="mt-2">
            PrimFit provides general fitness and nutrition templates matched to sport, gear, and kitchen choices
            you enter. It is not medical advice, diagnosis, or treatment. It is not a substitute for a physician,
            registered dietitian, or qualified coach. You are responsible for how you train and eat, including
            checking with a professional before starting a new program.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Eligibility</h2>
          <p className="mt-2">
            You must be at least 13 years old to use PrimFit. If you are 13–17, use the app only with a parent
            or guardian’s permission where required.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Pro intros</h2>
          <p className="mt-2">
            Sample trainer and nutritionist listings are examples. Intro requests in this version are saved on
            this device only — not bookings, payments, or verified credentials.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">As-is and limitation of liability</h2>
          <p className="mt-2">
            PrimFit is provided as-is and as-available, including during beta. To the maximum extent allowed by
            law, MackSims LLC is not liable for injuries, diet outcomes, missed workouts, data loss on your
            device, or indirect or consequential damages. Some jurisdictions do not allow certain limitations;
            those limits apply only to the extent permitted.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Governing law</h2>
          <p className="mt-2">
            These terms are governed by the laws of the State of Florida, without regard to conflict-of-law
            rules. Exclusive venue for disputes that may be brought in court is the state or federal courts in
            Hillsborough County, Florida (Tampa area), except where consumer law requires otherwise.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--pf-ink)]">Contact</h2>
          <p className="mt-2">
            MackSims LLC, 1211 Sweet Gum Drive, Brandon, FL 33511, United States.{" "}
            <a href="mailto:support@macksims.com">support@macksims.com</a> ·{" "}
            <a href="mailto:legal@macksims.com">legal@macksims.com</a>
          </p>
        </section>
      </div>

      <p className="mt-8 text-xs text-[var(--pf-muted)]">
        MackSims LLC · Ages 13+ · <Link href="/privacy">Privacy</Link>
        {" · "}
        <a href="https://macksims.com/support">macksims.com/support</a>
      </p>
    </main>
  );
}
