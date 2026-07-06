import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function LogMealPage() {
  return (
    <MockActionPage
      eyebrow="Fueling"
      title="Log meal"
      description="Mock athlete fueling log for meals, hydration, recovery, and performance habits."
      resultTitle="Meal log prepared"
      resultBody="CoachCore would update the athlete fueling timeline and help coaches spot missing hydration or recovery habits."
      buttonLabel="Submit Mock Meal Log"
      successTitle="Meal log submitted in demo mode"
      successBody="A fake fueling record was added to the local timeline. Nothing was saved to a backend."
      timelineItems={[
        "Fueling log submitted.",
        "Hydration check simulated.",
        "Coach visibility event added locally.",
      ]}
    >
      <MockSelect label="Meal type" options={["Breakfast", "Lunch", "Dinner", "Snack", "Pre-training", "Post-training"]} />
      <MockField label="Hydration" placeholder="72 oz" />
      <MockTextarea label="Fueling notes" placeholder="Chicken, rice, fruit, water, electrolyte packet." />
    </MockActionPage>
  );
}
