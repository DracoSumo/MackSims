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
      buttonLabel="Assign Mock Workout"
      successTitle="Workout assignment simulated"
      successBody="The selected group now has a fake training assignment staged for completion tracking."
      timelineItems={[
        "Workout assigned to group.",
        "Completion tracking simulation started.",
        "Missed-work flag will appear in future static timeline.",
      ]}
    >
      <MockField label="Workout title" placeholder="Acceleration + Top Speed" />
      <MockSelect label="Workout type" options={["Speed", "Strength", "Conditioning", "Recovery", "Functional fitness WOD", "Mobility"]} />
      <MockSelect label="Assign to" options={mockGroups} />
      <MockTextarea label="Workout instructions" placeholder="Warmup, sprint mechanics, main sets, cooldown, and coach notes." />
    </MockActionPage>
  );
}
