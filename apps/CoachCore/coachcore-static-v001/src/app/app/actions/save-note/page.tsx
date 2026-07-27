import { MockActionPage, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { athletes, mockGroups } from "@/data/mock";

export default function SaveNotePage() {
  return (
    <MockActionPage
      eyebrow="Coach notes"
      title="Save private coach note"
      description="Private note flow for athlete check-ins, team observations, and staff planning."
      resultTitle="Coach note staged"
      resultBody="CoachCore saves the note privately and connects it to the athlete, group, or staff timeline."
      buttonLabel="Save note"
      successTitle="Coach note saved"
      successBody="Private note added to your coach timeline on this device."
      timelineItems={[
        "Private coach note saved.",
        "Attached to selected athlete or group.",
        "Staff timeline updated.",
      ]}
    >
      <MockSelect label="Attach note to" options={[...athletes.map((athlete) => athlete.name), ...mockGroups]} />
      <MockSelect label="Note type" options={["Check-in", "Film", "Workout", "Fueling", "Recovery", "Behavior", "Leadership"]} />
      <MockTextarea label="Private note" placeholder="Needs check-in before next session. Missed film and low fueling completion." />
    </MockActionPage>
  );
}
