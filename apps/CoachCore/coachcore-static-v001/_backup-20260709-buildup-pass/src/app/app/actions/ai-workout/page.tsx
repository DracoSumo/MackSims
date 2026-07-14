import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { AiWorkoutReview } from "@/components/AiWorkoutReview";

export default function AiWorkoutPage() {
  return (
    <MockActionPage
      eyebrow="AI planner mock"
      title="Generate workout draft"
      description="Mock AI-assisted programming. Coach review is always required before assigning."
      resultTitle="4-week plan generated"
      resultBody="Week 1 builds mechanics, Week 2 adds volume, Week 3 increases intensity, and Week 4 tapers into performance testing. This is mock output only."
      buttonLabel="Generate Mock Plan"
      successTitle="AI workout draft generated"
      successBody="CoachCore simulated a 4-week plan draft. Coach review remains required before assignment."
      timelineItems={[
        "Coach prompt received.",
        "Mock training plan generated.",
        "Draft marked as coach-review required.",
      ]}
    >
      <MockSelect label="Program goal" options={["Speed", "Strength", "Conditioning", "Recovery", "Functional fitness", "Game week prep"]} />
      <MockSelect label="Athlete group" options={["Skill Players", "Linemen", "WOD Group", "6 AM Class", "Full Team", "High Load Athletes"]} />
      <MockTextarea label="Coach prompt" placeholder="Create a 4-week speed and conditioning block for high school football skill players." />
      <div className="mt-6">
        <AiWorkoutReview />
      </div>
    </MockActionPage>
  );
}
