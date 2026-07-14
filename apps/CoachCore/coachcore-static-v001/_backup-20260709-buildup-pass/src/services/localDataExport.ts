import { listActionLog } from "./actionLogStore";
import { listCheckIns } from "./checkInStore";

const BETA_KEY = "coachcore.betaRequests";

export type CoachCoreLocalExport = {
  exportedAt: string;
  athleteCheckIns: ReturnType<typeof listCheckIns>;
  actionLog: ReturnType<typeof listActionLog>;
  betaRequests: unknown[];
};

export function buildLocalExport(): CoachCoreLocalExport {
  let betaRequests: unknown[] = [];
  try {
    betaRequests = JSON.parse(localStorage.getItem(BETA_KEY) || "[]") as unknown[];
  } catch {
    betaRequests = [];
  }

  return {
    exportedAt: new Date().toISOString(),
    athleteCheckIns: listCheckIns(),
    actionLog: listActionLog(),
    betaRequests,
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
        localStorage.setItem("coachcore.athleteCheckIns", JSON.stringify(parsed.athleteCheckIns));
      }
      if (parsed.actionLog) {
        localStorage.setItem("coachcore.actionLog", JSON.stringify(parsed.actionLog));
      }
      if (parsed.betaRequests) {
        localStorage.setItem(BETA_KEY, JSON.stringify(parsed.betaRequests));
      }
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "Invalid CoachCore export JSON." };
    }
  });
}
