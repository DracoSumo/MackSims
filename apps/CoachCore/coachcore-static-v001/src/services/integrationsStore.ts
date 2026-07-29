import type { IntegrationAvailability } from "@/data/integrationsCatalog";

export type UserIntegrationStatus =
  | "connected"
  | "requested"
  | "pending_oauth"
  | "disconnected";

export type UserIntegrationRecord = {
  id: string;
  providerId: string;
  status: UserIntegrationStatus;
  displayName: string;
  notes: string;
  connectedAt: string | null;
  requestedAt: string | null;
  updatedAt: string;
};

const STORAGE_KEY = "coachcore.userIntegrations";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function listUserIntegrations(): UserIntegrationRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserIntegrationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getUserIntegration(providerId: string): UserIntegrationRecord | null {
  return listUserIntegrations().find((r) => r.providerId === providerId) ?? null;
}

export function upsertUserIntegration(
  patch: Omit<UserIntegrationRecord, "id" | "updatedAt"> & { id?: string }
): UserIntegrationRecord {
  const now = new Date().toISOString();
  const rows = listUserIntegrations();
  const existing = rows.find((r) => r.providerId === patch.providerId);
  const next: UserIntegrationRecord = {
    id: patch.id ?? existing?.id ?? crypto.randomUUID(),
    providerId: patch.providerId,
    status: patch.status,
    displayName: patch.displayName,
    notes: patch.notes,
    connectedAt: patch.connectedAt,
    requestedAt: patch.requestedAt,
    updatedAt: now,
  };

  const without = rows.filter((r) => r.providerId !== patch.providerId);
  without.push(next);
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(without));
  }
  return next;
}

export function removeUserIntegration(providerId: string): void {
  if (!canUseStorage()) return;
  const next = listUserIntegrations().filter((r) => r.providerId !== providerId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function mergeUserIntegrations(remote: UserIntegrationRecord[]): void {
  const local = listUserIntegrations();
  const byProvider = new Map<string, UserIntegrationRecord>();
  for (const row of remote) byProvider.set(row.providerId, row);
  for (const row of local) {
    const remoteRow = byProvider.get(row.providerId);
    if (!remoteRow) {
      byProvider.set(row.providerId, row);
      continue;
    }
    // Newer updatedAt wins
    if (row.updatedAt > remoteRow.updatedAt) {
      byProvider.set(row.providerId, row);
    }
  }
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...byProvider.values()]));
  }
}

export function effectiveAvailability(
  catalogDefault: IntegrationAvailability,
  userStatus: UserIntegrationStatus | null | undefined
): IntegrationAvailability {
  if (userStatus === "connected") return "connected";
  if (userStatus === "requested" || userStatus === "pending_oauth") return "request_access";
  return catalogDefault;
}
