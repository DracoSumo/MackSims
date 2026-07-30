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
      buttonLabel="Record nudge preview"
      successTitle="Nudge preview recorded"
      successBody="A generic activity marker was stored locally; the target and message were not saved. No athlete notification, SMS, or push was sent."
      timelineItems={[
        "Generic nudge preview activity recorded locally.",
        "Target and message field values left unsaved.",
        "No backend, database, or notification was used.",
      ]}
    >
      <MockSelect label="Target group" options={mockNudgeTargets} />
      <MockTextarea label="Message" placeholder="Film is due before tomorrow's lift. Get it done tonight." />
    </MockActionPage>
  );
}
