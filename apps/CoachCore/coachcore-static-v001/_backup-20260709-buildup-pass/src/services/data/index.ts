import { isSupabaseConfigured } from "@/config/backend";
import { mockDataAdapter } from "./mockAdapter";
import { supabaseDataAdapter } from "./supabaseAdapter";
import type { CoachCoreDataAdapter } from "./types";

export function getDataAdapter(): CoachCoreDataAdapter {
  return isSupabaseConfigured ? supabaseDataAdapter : mockDataAdapter;
}

export type { CoachCoreDataAdapter } from "./types";
