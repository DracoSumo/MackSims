import Link from "next/link";
import { SectionPage } from "@/components/SectionPage";
import { NutritionLogsPanel } from "@/components/NutritionLogsPanel";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip } from "@/components/ui/CoachCards";

export default function NutritionPage() {
  return (
    <SectionPage
      eyebrow="Fueling"
      title="Meal tracking"
      description="Track fueling, hydration, and recovery habits — coaching support for training, not medical advice."
    >
      <p className="mt-4 text-sm leading-6 text-slate-400">{coachCoreConfig.coachingSupportDisclaimer}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/app/actions/log-meal" className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950">
          Log meal
        </Link>
        <CrossLinkStrip current="Nutrition" />
      </div>

      <NutritionLogsPanel />
    </SectionPage>
  );
}
