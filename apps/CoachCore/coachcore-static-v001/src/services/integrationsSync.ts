import { isSupabaseConfigured } from "@/config/backend";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  listUserIntegrations,
  mergeUserIntegrations,
  upsertUserIntegration,
  type UserIntegrationRecord,
  type UserIntegrationStatus,
} from "./integrationsStore";

export type IntegrationsSyncResult = "skipped" | "ok" | "error";

type IntegrationRow = {
  id: string;
  provider_id: string;
  status: UserIntegrationStatus;
  display_name: string;
  notes: string;
  connected_at: string | null;
  requested_at: string | null;
  updated_at: string;
};

async function currentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function rowToRecord(row: IntegrationRow): UserIntegrationRecord {
  return {
    id: row.id,
    providerId: row.provider_id,
    status: row.status,
    displayName: row.display_name ?? "",
    notes: row.notes ?? "",
    connectedAt: row.connected_at,
    requestedAt: row.requested_at,
    updatedAt: row.updated_at,
  };
}

export async function pullUserIntegrations(): Promise<UserIntegrationRecord[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const uid = await currentUserId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("user_integrations")
    .select("id, provider_id, status, display_name, notes, connected_at, requested_at, updated_at")
    .eq("user_id", uid)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as IntegrationRow[]).map(rowToRecord);
}

export async function pushUserIntegration(
  record: UserIntegrationRecord
): Promise<IntegrationsSyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { data: existing } = await supabase
    .from("user_integrations")
    .select("id")
    .eq("user_id", uid)
    .eq("provider_id", record.providerId)
    .maybeSingle();

  const rowId = (existing?.id as string | undefined) ?? record.id;

  const { error } = await supabase.from("user_integrations").upsert(
    {
      id: rowId,
      user_id: uid,
      provider_id: record.providerId,
      status: record.status,
      display_name: record.displayName,
      notes: record.notes,
      connected_at: record.connectedAt,
      requested_at: record.requestedAt,
      updated_at: record.updatedAt,
    },
    { onConflict: "id" }
  );

  return error ? "error" : "ok";
}

export async function deleteRemoteUserIntegration(
  providerId: string
): Promise<IntegrationsSyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase
    .from("user_integrations")
    .delete()
    .eq("user_id", uid)
    .eq("provider_id", providerId);

  return error ? "error" : "ok";
}

export async function submitAccessRequest(input: {
  providerId: string;
  providerName: string;
  message?: string;
  organization?: string;
}): Promise<IntegrationsSyncResult> {
  if (!isSupabaseConfigured) return "skipped";
  const supabase = getSupabaseClient();
  if (!supabase) return "skipped";
  const uid = await currentUserId();
  if (!uid) return "skipped";

  const { error } = await supabase.from("integration_access_requests").insert({
    user_id: uid,
    provider_id: input.providerId,
    provider_name: input.providerName,
    message: input.message ?? "",
    organization: input.organization ?? "",
  });

  return error ? "error" : "ok";
}

export async function syncIntegrationsOnSignIn(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const uid = await currentUserId();
  if (!uid) return null;

  try {
    const remote = await pullUserIntegrations();
    mergeUserIntegrations(remote);

    const local = listUserIntegrations();
    const remoteIds = new Set(remote.map((r) => r.providerId));
    const pushResults = await Promise.all(
      local.filter((r) => !remoteIds.has(r.providerId)).map((r) => pushUserIntegration(r))
    );

    // Also push locals that are newer
    for (const row of local) {
      const rem = remote.find((r) => r.providerId === row.providerId);
      if (rem && row.updatedAt > rem.updatedAt) {
        pushResults.push(await pushUserIntegration(row));
      }
    }

    if (pushResults.some((r) => r === "error")) {
      return "Some integration rows could not sync.";
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Integration sync failed.";
  }
}

export async function connectProviderLocally(input: {
  providerId: string;
  displayName: string;
  status: UserIntegrationStatus;
  notes?: string;
}): Promise<UserIntegrationRecord> {
  const now = new Date().toISOString();
  const record = upsertUserIntegration({
    providerId: input.providerId,
    displayName: input.displayName,
    status: input.status,
    notes: input.notes ?? "",
    connectedAt: input.status === "connected" ? now : null,
    requestedAt: input.status === "requested" || input.status === "pending_oauth" ? now : null,
  });
  await pushUserIntegration(record);
  return record;
}
