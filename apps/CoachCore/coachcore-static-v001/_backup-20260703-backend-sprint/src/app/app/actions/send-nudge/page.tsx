import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { mockNudgeTargets } from "@/data/mock";

export default function SendNudgePage() {
  return (
    <MockActionPage
      eyebrow="Coach action"
      title="Send athlete nudge"
      description="Mock reminder flow for athletes who missed film, fueling, workouts, or playbook installs."
      resultTitle="Nudge ready to send"
      resultBody="CoachCore would notify the selected athletes and record the nudge in their accountability timeline."
      buttonLabel="Send Mock Nudge"
      successTitle="Nudge sent in demo mode"
      successBody="The selected athlete group now has a simulated reminder event in the local activity timeline."
      timelineItems={[
        "Coach nudge created.",
        "Target group flagged for follow-up.",
        "Accountability timeline simulated locally.",
      ]}
    >
      <MockSelect label="Target group" options={mockNudgeTargets} />
      <MockTextarea label="Message" placeholder="Film is due before tomorrow's lift. Get it done tonight." />
    </MockActionPage>
  );
}
