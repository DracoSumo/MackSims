import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { athletes, mockGroups } from "@/data/mock";

export default function SaveNotePage() {
  return (
    <MockActionPage
      eyebrow="Coach notes"
      title="Save private coach note"
      description="Mock private note flow for athlete check-ins, team observations, and staff planning."
      resultTitle="Coach note staged"
      resultBody="CoachCore would save the note privately and connect it to the athlete, group, or staff timeline."
      buttonLabel="Save Mock Note"
      successTitle="Coach note saved in demo mode"
      successBody="A fake private note was added to the local coach timeline. No real data was stored."
      timelineItems={[
        "Private coach note staged.",
        "Attached to selected athlete or group.",
        "Staff timeline simulated locally.",
      ]}
    >
      <MockSelect label="Attach note to" options={[...athletes.map((athlete) => athlete.name), ...mockGroups]} />
      <MockSelect label="Note type" options={["Check-in", "Film", "Workout", "Fueling", "Recovery", "Behavior", "Leadership"]} />
      <MockTextarea label="Private note" placeholder="Needs check-in before next session. Missed film and low fueling completion." />
    </MockActionPage>
  );
}
