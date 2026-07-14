import { notFound } from "next/navigation";
import { VideoMomentDetail } from "@/components/VideoMomentDetail";
import { videoMoments } from "@/data/mock";

export function generateStaticParams() {
  return videoMoments.map((moment) => ({
    id: moment.id,
  }));
}

export default async function VideoMomentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moment = videoMoments.find((item) => item.id === id);

  if (!moment) {
    notFound();
  }

  return <VideoMomentDetail moment={moment} />;
}
