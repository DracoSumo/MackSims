/**
 * MotoCrew community safety — local-first with optional Supabase schema.
 */

export type ReportCategory =
  | "spam"
  | "harassment"
  | "illegal"
  | "inappropriate"
  | "other";

export type ReportStatus = "open" | "in_review" | "actioned" | "dismissed";

export type ContentReport = {
  id: string;
  targetType: "message" | "ride" | "user";
  targetId: string;
  targetLabel: string;
  category: ReportCategory;
  details: string;
  status: ReportStatus;
  createdAt: string;
  reporterKey?: string;
  actionTaken?: string | null;
  reviewedAt?: string | null;
};

const BLOCKS_KEY = "motocrew.blockedUsers.v1";
const REPORTS_KEY = "motocrew.contentReports.v1";
const MAX_REPORTS = 100;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort
  }
}

export function listBlockedUsers(): string[] {
  const list = readJson<string[]>(BLOCKS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function isBlocked(userId: string): boolean {
  return listBlockedUsers().includes(userId);
}

export function blockUser(userId: string): string[] {
  if (!userId) return listBlockedUsers();
  const next = Array.from(new Set([...listBlockedUsers(), userId]));
  writeJson(BLOCKS_KEY, next);
  return next;
}

export function unblockUser(userId: string): string[] {
  const next = listBlockedUsers().filter((id) => id !== userId);
  writeJson(BLOCKS_KEY, next);
  return next;
}

export function listReports(): ContentReport[] {
  const list = readJson<ContentReport[]>(REPORTS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function listOpenReports(): ContentReport[] {
  return listReports().filter((r) => r.status === "open" || r.status === "in_review");
}

export function submitReport(input: {
  targetType: ContentReport["targetType"];
  targetId: string;
  targetLabel: string;
  category: ReportCategory;
  details?: string;
  reporterKey?: string;
}): { report: ContentReport; deduped: boolean } {
  const existing = listReports();
  const hour = new Date().toISOString().slice(0, 13);
  const dup = existing.find(
    (r) =>
      r.targetId === input.targetId &&
      r.category === input.category &&
      r.reporterKey === (input.reporterKey || "anon") &&
      r.createdAt.startsWith(hour),
  );
  if (dup) return { report: dup, deduped: true };

  const report: ContentReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    targetType: input.targetType,
    targetId: input.targetId,
    targetLabel: input.targetLabel,
    category: input.category,
    details: (input.details || "").trim().slice(0, 1000),
    status: "open",
    createdAt: new Date().toISOString(),
    reporterKey: input.reporterKey || "anon",
    actionTaken: null,
    reviewedAt: null,
  };
  writeJson(REPORTS_KEY, [report, ...existing].slice(0, MAX_REPORTS));
  return { report, deduped: false };
}

export function resolveReport(
  reportId: string,
  action: "hide" | "remove" | "dismiss" | "approve",
): ContentReport | null {
  const reports = listReports();
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx < 0) return null;
  const status: ReportStatus = action === "dismiss" ? "dismissed" : "actioned";
  const next = {
    ...reports[idx],
    status,
    actionTaken: action,
    reviewedAt: new Date().toISOString(),
  };
  reports[idx] = next;
  writeJson(REPORTS_KEY, reports);
  return next;
}

export const REPORT_CATEGORIES: { id: ReportCategory; label: string }[] = [
  { id: "spam", label: "Spam" },
  { id: "harassment", label: "Harassment" },
  { id: "inappropriate", label: "Inappropriate" },
  { id: "illegal", label: "Illegal / unsafe" },
  { id: "other", label: "Other" },
];
