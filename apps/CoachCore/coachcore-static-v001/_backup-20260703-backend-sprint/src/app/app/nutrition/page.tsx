import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { meals } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip, DemoDisclaimerStrip } from "@/components/ui/CoachCards";

export default function NutritionPage() {
  return (
    <SectionPage
      eyebrow="Fueling"
      title="Meal tracking"
      description="Track fueling, hydration, and recovery habits — coaching support for training, not medical advice."
    >
      <DemoDisclaimerStrip />
      <p className="mt-4 text-sm leading-6 text-slate-400">{coachCoreConfig.coachingSupportDisclaimer}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/app/actions/log-meal" className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950">
          Log mock meal
        </Link>
        <CrossLinkStrip current="Nutrition" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {meals.map((meal) => (
          <Card key={meal.athlete} title={meal.athlete} subtitle={`Hydration: ${meal.hydration}`}>
            <p>Breakfast: {meal.breakfast}</p>
            <p>Lunch: {meal.lunch}</p>
            <p>Dinner: {meal.dinner}</p>
            <Link href="/app/accountability" className="mt-3 inline-block text-sm font-bold text-sky-300">
              See accountability impact →
            </Link>
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
