import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function LogMealPage() {
  return (
    <MockActionPage
      eyebrow="Fueling"
      title="Log meal"
      description="Athlete fueling log for meals, hydration, recovery, and performance habits."
      resultTitle="Meal log prepared"
      resultBody="CoachCore updates the athlete fueling timeline so coaches can spot missing hydration or recovery habits."
      buttonLabel="Submit meal log"
      successTitle="Meal log submitted"
      successBody="Fueling check is on the athlete timeline for this device."
      timelineItems={[
        "Fueling log submitted.",
        "Hydration check recorded.",
        "Coach visibility event added.",
      ]}
    >
      <MockSelect label="Meal type" options={["Breakfast", "Lunch", "Dinner", "Snack", "Pre-training", "Post-training"]} />
      <MockField label="Hydration" placeholder="72 oz" />
      <MockTextarea label="Fueling notes" placeholder="Chicken, rice, fruit, water, electrolyte packet." />
    </MockActionPage>
  );
}
