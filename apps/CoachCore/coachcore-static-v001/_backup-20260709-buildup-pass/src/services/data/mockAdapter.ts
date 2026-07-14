import { athletes, workouts, playbookItems, meals, videoMoments } from "@/data/mock";
import { listCheckIns } from "@/services/checkInStore";
import { listActionLog } from "@/services/actionLogStore";
import { listCompletions } from "@/services/assignmentStore";
import type { CoachCoreDataAdapter } from "./types";

export const mockDataAdapter: CoachCoreDataAdapter = {
  async listAthletes() {
    return athletes;
  },
  async listWorkouts() {
    return workouts;
  },
  async listPlaybookItems() {
    return playbookItems;
  },
  async listMeals() {
    return meals;
  },
  async listVideoMoments() {
    return videoMoments;
  },
  async listCheckIns() {
    return listCheckIns();
  },
  async listActionLog() {
    return listActionLog();
  },
  async listCompletions() {
    return listCompletions();
  },
};
