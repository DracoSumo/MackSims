import { localGet, localSet } from "@/lib/safeStorage";
import { listActionLog } from "./actionLogStore";
import { listAssignmentRecords, listAssignmentStatuses } from "./assignmentStore";
import { listRosterAthletes, replaceRoster, type RosterAthlete } from "./athleteRosterStore";
import { listCheckIns } from "./checkInStore";
import { listCoachNotes } from "./coachNoteStore";
import { listMealLogs } from "./mealLogStore";
import { notifyLocalDataChanged } from "./localDataEvents";

const BETA_KEY = "coachcore.betaRequests";
const CHECKINS_KEY = "coachcore.athleteCheckIns";
const ACTION_LOG_KEY = "coachcore.actionLog";
const MEALS_KEY = "coachcore.mealLogs";
const NOTES_KEY = "coachcore.coachNotes";
const ASSIGNMENT_STATUS_KEY = "coachcore.assignmentStatus";
const ASSIGNMENT_RECORDS_KEY = "coachcore.assignmentRecords";

export type CoachCoreLocalExport = {
  exportedAt: string;
  athleteRoster: RosterAthlete[];
  athleteCheckIns: ReturnType<typeof listCheckIns>;
  actionLog: ReturnType<typeof listActionLog>;
  mealLogs: ReturnType<typeof listMealLogs>;
  coachNotes: ReturnType<typeof listCoachNotes>;
  assignmentStatuses: ReturnType<typeof listAssignmentStatuses>;
  assignmentRecords: ReturnType<typeof listAssignmentRecords>;
  betaRequests: unknown[];
};

function parseJsonArray(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildLocalExport(): CoachCoreLocalExport {
  return {
    exportedAt: new Date().toISOString(),
    athleteRoster: listRosterAthletes(),
    athleteCheckIns: listCheckIns(),
    actionLog: listActionLog(),
    mealLogs: listMealLogs(),
    coachNotes: listCoachNotes(),
    assignmentStatuses: listAssignmentStatuses(),
    assignmentRecords: listAssignmentRecords(),
    betaRequests: parseJsonArray(localGet(BETA_KEY)),
  };
}

export function downloadLocalExport() {
  const payload = buildLocalExport();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `coachcore-local-data-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function importLocalExport(file: File): Promise<{ ok: true } | { ok: false; error: string }> {
  return file.text().then((raw) => {
    try {
      const parsed = JSON.parse(raw) as Partial<CoachCoreLocalExport>;
      if (parsed.athleteRoster) {
        replaceRoster(parsed.athleteRoster as RosterAthlete[]);
      }
      if (parsed.athleteCheckIns) {
        localSet(CHECKINS_KEY, JSON.stringify(parsed.athleteCheckIns));
      }
      if (parsed.actionLog) {
        localSet(ACTION_LOG_KEY, JSON.stringify(parsed.actionLog));
      }
      if (parsed.mealLogs) {
        localSet(MEALS_KEY, JSON.stringify(parsed.mealLogs));
      }
      if (parsed.coachNotes) {
        localSet(NOTES_KEY, JSON.stringify(parsed.coachNotes));
      }
      if (parsed.assignmentStatuses) {
        localSet(ASSIGNMENT_STATUS_KEY, JSON.stringify(parsed.assignmentStatuses));
      }
      if (parsed.assignmentRecords) {
        localSet(ASSIGNMENT_RECORDS_KEY, JSON.stringify(parsed.assignmentRecords));
      }
      if (parsed.betaRequests) {
        localSet(BETA_KEY, JSON.stringify(parsed.betaRequests));
      }
      notifyLocalDataChanged("all");
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "Invalid CoachCore export JSON." };
    }
  });
}
