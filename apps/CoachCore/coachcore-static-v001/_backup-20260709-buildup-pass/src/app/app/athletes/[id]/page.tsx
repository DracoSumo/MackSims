import { notFound } from "next/navigation";
import { AthleteProfileView } from "@/components/AthleteProfileView";
import { athletes, videoMoments, workouts } from "@/data/mock";

export function generateStaticParams() {
  return athletes.map((athlete) => ({
    id: athlete.id,
  }));
}

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const athlete = athletes.find((item) => item.id === id);

  if (!athlete) {
    notFound();
  }

  return <AthleteProfileView athlete={athlete} workouts={workouts} videoMoments={videoMoments} />;
}
