import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function LogMealPage() {
  return (
    <MockActionPage
      eyebrow="Fueling"
      title="Log meal"
      description="Mock athlete fueling log for meals, hydration, recovery, and performance habits."
      resultTitle="Meal log prepared"
      resultBody="CoachCore would update the athlete fueling timeline and help coaches spot missing hydration or recovery habits."
      buttonLabel="Record fueling preview"
      successTitle="Fueling preview recorded"
      successBody="A generic activity marker was stored locally; meal, hydration, and note values were not saved. No athlete backend or coach notification was used."
      timelineItems={[
        "Generic fueling preview activity recorded locally.",
        "Meal, hydration, and note values left unsaved.",
        "No backend or notification was used.",
      ]}
    >
      <MockSelect label="Meal type" options={["Breakfast", "Lunch", "Dinner", "Snack", "Pre-training", "Post-training"]} />
      <MockField label="Hydration" placeholder="72 oz" />
      <MockTextarea label="Fueling notes" placeholder="Chicken, rice, fruit, water, electrolyte packet." />
    </MockActionPage>
  );
}
