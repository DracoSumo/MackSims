import Link from "next/link";
import { LegalFooter } from "@/components/LegalFooter";
import { primfitConfig } from "@/config/primfit";

export default function HomePage() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-lg flex-col overflow-hidden px-4 pb-10 pt-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% -10%, var(--pf-purple-dim), transparent), radial-gradient(ellipse 60% 40% at 90% 20%, var(--pf-silver-dim), transparent)",
        }}
      />

      <div className="flex-1 space-y-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--pf-silver)]">{primfitConfig.company}</p>
          <h1 className="pf-display mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-[var(--pf-purple-bright)]">Prim</span>
            <span className="text-[var(--pf-silver)]">Fit</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--pf-silver)]">{primfitConfig.hook}</p>
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-[var(--pf-muted)]">{primfitConfig.tagline}</p>

        <p className="text-xs leading-relaxed text-[var(--pf-muted)]">{primfitConfig.shortDisclaimer}</p>
        <p className="text-xs text-[var(--pf-muted)]">Ages {primfitConfig.ageRating} · v{primfitConfig.version}</p>
      </div>

      <div className="space-y-3 pt-10">
        <Link href="/app/onboarding/" className="pf-btn-primary w-full text-center">
          Choose my lane
        </Link>
        <Link href="/app/today/" className="pf-btn-ghost block w-full text-center">
          I already have a plan
        </Link>
        <p className="text-center text-[11px] text-[var(--pf-muted)]">
          Returning? Opens Today. New here? You&apos;ll be sent to choose a lane first.
        </p>
        <LegalFooter />
      </div>
    </div>
  );
}
