import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function AiWorkoutPage() {
  return (
    <MockActionPage
      eyebrow="AI planner mock"
      title="Generate workout draft"
      description="Mock AI-assisted programming. Coach review is always required before assigning."
      resultTitle="4-week plan generated"
      resultBody="Week 1 builds mechanics, Week 2 adds volume, Week 3 increases intensity, and Week 4 tapers into performance testing. This is mock output only."
      buttonLabel="Record AI draft preview"
      successTitle="AI workout preview recorded"
      successBody="A generic activity marker was stored locally; the prompt and field values were not saved. No AI API call or athlete assignment was made."
      timelineItems={[
        "Generic AI preview activity recorded locally.",
        "Prompt and field values left unsaved.",
        "No AI provider, backend, or athlete push was used.",
      ]}
    >
      <MockSelect label="Program goal" options={["Speed", "Strength", "Conditioning", "Recovery", "Functional fitness", "Game week prep"]} />
      <MockSelect label="Athlete group" options={["Skill Players", "Linemen", "WOD Group", "6 AM Class", "Full Team", "High Load Athletes"]} />
      <MockTextarea label="Coach prompt" placeholder="Create a 4-week speed and conditioning block for high school football skill players." />
    </MockActionPage>
  );
}
