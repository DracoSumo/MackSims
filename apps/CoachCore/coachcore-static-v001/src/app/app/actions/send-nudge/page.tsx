import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { mockNudgeTargets } from "@/data/mock";

export default function SendNudgePage() {
  return (
    <MockActionPage
      eyebrow="Coach action"
      title="Send athlete nudge"
      description="Reminder flow for athletes who missed film, fueling, workouts, or playbook installs."
      resultTitle="Nudge ready to send"
      resultBody="CoachCore notifies the selected athletes and records the nudge in their accountability timeline."
      buttonLabel="Send nudge"
      successTitle="Nudge sent"
      successBody="The selected athlete group now has a reminder event in your activity timeline."
      timelineItems={[
        "Coach nudge created.",
        "Target group flagged for follow-up.",
        "Accountability timeline updated.",
      ]}
    >
      <MockSelect label="Target group" options={mockNudgeTargets} />
      <MockTextarea label="Message" placeholder="Film is due before tomorrow's lift. Get it done tonight." />
    </MockActionPage>
  );
}
