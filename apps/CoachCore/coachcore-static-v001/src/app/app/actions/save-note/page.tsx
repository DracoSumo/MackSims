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
      buttonLabel="Record note preview"
      successTitle="Coach-note preview recorded"
      successBody="A generic activity marker was stored locally; the private-note text was not saved. No cloud note or staff timeline write was made."
      timelineItems={[
        "Generic coach-note preview activity recorded locally.",
        "Private-note and attachment field values left unsaved.",
        "No backend or staff sync was used.",
      ]}
    >
      <MockSelect label="Attach note to" options={[...athletes.map((athlete) => athlete.name), ...mockGroups]} />
      <MockSelect label="Note type" options={["Check-in", "Film", "Workout", "Fueling", "Recovery", "Behavior", "Leadership"]} />
      <MockTextarea label="Private note" placeholder="Needs check-in before next session. Missed film and low fueling completion." />
    </MockActionPage>
  );
}
