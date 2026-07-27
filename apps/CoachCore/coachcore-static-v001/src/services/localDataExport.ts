import { localGet, localSet } from "@/lib/safeStorage";
import { listActionLog } from "./actionLogStore";
import { listCheckIns } from "./checkInStore";

const BETA_KEY = "coachcore.betaRequests";
const CHECKINS_KEY = "coachcore.athleteCheckIns";
const ACTION_LOG_KEY = "coachcore.actionLog";

export type CoachCoreLocalExport = {
  exportedAt: string;
  athleteCheckIns: ReturnType<typeof listCheckIns>;
  actionLog: ReturnType<typeof listActionLog>;
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
    athleteCheckIns: listCheckIns(),
    actionLog: listActionLog(),
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
      if (parsed.athleteCheckIns) {
        localSet(CHECKINS_KEY, JSON.stringify(parsed.athleteCheckIns));
      }
      if (parsed.actionLog) {
        localSet(ACTION_LOG_KEY, JSON.stringify(parsed.actionLog));
      }
      if (parsed.betaRequests) {
        localSet(BETA_KEY, JSON.stringify(parsed.betaRequests));
      }
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "Invalid CoachCore export JSON." };
    }
  });
}
