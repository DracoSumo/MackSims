"use client";

import Link from "next/link";
import { COACH_DISCLAIMER, COACH_INFLUENCES } from "@/data/coachInfluences";
import { GLOSSARY } from "@/data/glossary";
import { CORE_PRINCIPLES, SCIENCE_SOURCES } from "@/data/science";
import { SPORT_GROUPS, SPORTS } from "@/data/options";
import { primfitConfig } from "@/config/primfit";
import { useTheme } from "@/components/ThemeProvider";

export default function MethodsPage() {
  const { copy } = useTheme();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="pf-display text-2xl font-bold">{copy.methods} & science</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          Original PrimFit templates informed by published frameworks and widely respected coaching
          principles. Not medical advice.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--pf-purple-bright)]">Plain-language glossary</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          The plan stays the same scientifically — these are the words we used to hide on beginners.
        </p>
        {GLOSSARY.map((g) => (
          <div key={g.id} className="pf-card p-4">
            <p className="font-medium">{g.plain}</p>
            <p className="text-xs text-[var(--pf-silver)]">{g.expand}</p>
            <p className="mt-1 text-sm text-[var(--pf-muted)]">{g.meaning}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--pf-purple-bright)]">Core principles</h2>
        {CORE_PRINCIPLES.map((p) => (
          <div key={p.name} className="pf-card p-4">
            <p className="font-medium">{p.name}</p>
            <p className="mt-1 text-sm text-[var(--pf-muted)]">{p.detail}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--pf-purple-bright)]">Science sources</h2>
        <p className="text-xs text-[var(--pf-muted)]">
          Paraphrased for education — we do not copy copyrighted manuals verbatim.
        </p>
        {SCIENCE_SOURCES.map((s) => (
          <div key={s.id} className="pf-card p-4 text-sm">
            <p className="font-medium">
              {s.org} · {s.title}
            </p>
            <p className="text-xs text-[var(--pf-silver)]">{s.year}</p>
            <p className="mt-2 text-[var(--pf-muted)]">{s.use}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--pf-purple-bright)]">Coach influences</h2>
        <p className="text-xs text-[var(--pf-muted)]">{COACH_DISCLAIMER}</p>
        {COACH_INFLUENCES.map((c) => (
          <div key={c.id} className="pf-card space-y-2 p-4 text-sm">
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-[var(--pf-silver)]">{c.domain}</p>
            <ul className="list-inside list-disc text-[var(--pf-muted)]">
              {c.keyPrinciples.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
            <p>
              <span className="text-[var(--pf-muted)]">How PrimFit uses this: </span>
              {c.howPrimFitUses}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--pf-purple-bright)]">Sport catalog</h2>
        {SPORT_GROUPS.map((g) => (
          <div key={g.id} className="pf-card p-4">
            <p className="mb-2 text-sm font-semibold">{g.label}</p>
            <p className="text-sm text-[var(--pf-muted)]">
              {SPORTS.filter((s) => s.group === g.id)
                .map((s) => s.label)
                .join(" · ")}
            </p>
          </div>
        ))}
      </section>

      <section className="pf-card space-y-2 p-4 text-sm">
        <h2 className="font-semibold">Location & inventory (v1 honesty)</h2>
        <p className="text-[var(--pf-muted)]">
          Workouts filter by training location mode (Home / Commercial gym / Outdoor / Travel) and
          your declared equipment. Meals prefer pantry staples you mark. We do not scrape gym floors
          via Maps — Places API facility detection is future.
        </p>
      </section>

      <p className="text-xs text-[var(--pf-muted)]">{primfitConfig.disclaimer}</p>

      <Link href="/app/today/" className="pf-btn-primary block w-full text-center">
        Back to Today
      </Link>
    </div>
  );
}
