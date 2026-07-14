import { isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { athletes, workouts, playbookItems, meals, videoMoments } from "@/data/mock";
import { listCheckIns, type AthleteCheckIn } from "@/services/checkInStore";
import { listActionLog, type CoachActionLog } from "@/services/actionLogStore";
import { listCompletions, type AssignmentCompletion } from "@/services/assignmentStore";
import type { CoachCoreDataAdapter } from "./types";

async function currentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const supabaseDataAdapter: CoachCoreDataAdapter = {
  async listAthletes() {
    if (!isSupabaseConfigured || !(await currentUserId())) return athletes;
    const supabase = getSupabaseClient();
    if (!supabase) return athletes;
    const { data } = await supabase.from("team_members").select("athlete_name, role, status").limit(50);
    if (!data?.length) return athletes;
    return athletes;
  },
  async listWorkouts() {
    if (!isSupabaseConfigured || !(await currentUserId())) return workouts;
    const supabase = getSupabaseClient();
    if (!supabase) return workouts;
    const { data } = await supabase.from("workouts").select("id, title, type, duration, group_name, status").limit(50);
    if (!data?.length) return workouts;
    return data.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      type: String(row.type),
      duration: String(row.duration ?? ""),
      group: String(row.group_name ?? ""),
      status: String(row.status ?? "Assigned"),
    }));
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
  async listCheckIns(): Promise<AthleteCheckIn[]> {
    return listCheckIns();
  },
  async listActionLog(): Promise<CoachActionLog[]> {
    return listActionLog();
  },
  async listCompletions(): Promise<AssignmentCompletion[]> {
    return listCompletions();
  },
};
