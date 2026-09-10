"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AthleteDetailClient } from "@/components/AthleteDetailClient";
import { SectionPage } from "@/components/SectionPage";

function AthleteDetailFromQuery() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  return <AthleteDetailClient athleteId={id} />;
}

export default function AthleteDetailQueryPage() {
  return (
    <Suspense
      fallback={
        <SectionPage eyebrow="Athlete profile" title="Loading…" description="Opening athlete profile.">
          <p className="text-sm text-slate-400">Loading…</p>
        </SectionPage>
      }
    >
      <AthleteDetailFromQuery />
    </Suspense>
  );
}
