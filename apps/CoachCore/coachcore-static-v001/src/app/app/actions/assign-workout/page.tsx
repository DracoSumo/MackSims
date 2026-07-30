import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { mockGroups } from "@/data/mock";

export default function AssignWorkoutPage() {
  return (
    <MockActionPage
      eyebrow="Training"
      title="Assign workout"
      description="Mock flow for team workouts, WODs, strength blocks, recovery work, and position-specific training."
      resultTitle="Workout assignment staged"
      resultBody="CoachCore would push the workout to the group, track completions, and flag missed work."
      buttonLabel="Record workout preview"
      successTitle="Workout preview recorded"
      successBody="A generic activity marker was stored locally; workout field values were not saved. No assignment, tracking, or athlete notification was made."
      timelineItems={[
        "Generic workout preview activity recorded locally.",
        "Workout and group field values left unsaved.",
        "No backend or athlete push was used.",
      ]}
    >
      <MockField label="Workout title" placeholder="Acceleration + Top Speed" />
      <MockSelect label="Workout type" options={["Speed", "Strength", "Conditioning", "Recovery", "Functional fitness WOD", "Mobility"]} />
      <MockSelect label="Assign to" options={mockGroups} />
      <MockTextarea label="Workout instructions" placeholder="Warmup, sprint mechanics, main sets, cooldown, and coach notes." />
    </MockActionPage>
  );
}
