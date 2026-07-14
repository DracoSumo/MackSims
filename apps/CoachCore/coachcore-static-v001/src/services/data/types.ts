import type { AthleteCheckIn } from "@/services/checkInStore";
import type { CoachActionLog } from "@/services/actionLogStore";
import type { AssignmentCompletion } from "@/services/assignmentStore";
import { athletes, workouts, playbookItems, meals, videoMoments } from "@/data/mock";

export type CoachCoreDataAdapter = {
  listAthletes(): Promise<typeof athletes>;
  listWorkouts(): Promise<typeof workouts>;
  listPlaybookItems(): Promise<typeof playbookItems>;
  listMeals(): Promise<typeof meals>;
  listVideoMoments(): Promise<typeof videoMoments>;
  listCheckIns(): Promise<AthleteCheckIn[]>;
  listActionLog(): Promise<CoachActionLog[]>;
  listCompletions(): Promise<AssignmentCompletion[]>;
};
