import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";
import { mockGroups } from "@/data/mock";

export default function AssignVideoPage() {
  return (
    <MockActionPage
      eyebrow="Film room"
      title="Assign video moment"
      description="Mock flow for assigning a clip, drill example, technique correction, or movement standard."
      resultTitle="Video assignment staged"
      resultBody="CoachCore would assign the clip, track open rate, track watch percentage, and show completion in the accountability dashboard."
      buttonLabel="Record video preview"
      successTitle="Video preview recorded"
      successBody="A generic activity marker was stored locally; video field values were not saved. No film assignment, tracking, or athlete notification was made."
      timelineItems={[
        "Generic video preview activity recorded locally.",
        "Video and group field values left unsaved.",
        "No backend or watch-tracking API was used.",
      ]}
    >
      <MockField label="Video title" placeholder="Route stem correction" />
      <MockSelect label="Assign to" options={mockGroups} />
      <MockSelect label="Tag" options={["Correction", "Great effort", "Missed assignment", "Technique", "Footwork", "Conditioning", "Leadership"]} />
      <MockTextarea label="Coach note" placeholder="Watch before individual period. Pay attention to hip angle and timing." />
    </MockActionPage>
  );
}
