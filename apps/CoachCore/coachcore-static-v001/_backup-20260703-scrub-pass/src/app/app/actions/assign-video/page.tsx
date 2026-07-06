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
      buttonLabel="Assign Mock Video"
      successTitle="Video assignment simulated"
      successBody="The selected group now has a fake film assignment with watch tracking staged in the demo."
      timelineItems={[
        "Video moment assigned.",
        "Watch tracking simulation started.",
        "Film room accountability event created locally.",
      ]}
    >
      <MockField label="Video title" placeholder="Route stem correction" />
      <MockSelect label="Assign to" options={mockGroups} />
      <MockSelect label="Tag" options={["Correction", "Great effort", "Missed assignment", "Technique", "Footwork", "Conditioning", "Leadership"]} />
      <MockTextarea label="Coach note" placeholder="Watch before individual period. Pay attention to hip angle and timing." />
    </MockActionPage>
  );
}
