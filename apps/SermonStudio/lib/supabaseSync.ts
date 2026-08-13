import type { User } from "@supabase/supabase-js";
import { ensureSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import type { Series, Sermon, SermonOutline } from "./types";
import { defaultOutline } from "./types";

export type SyncResult = "skipped" | "ok" | "error";

const SYNC_META_KEY = "sermon-studio.syncMeta";
const SYNC_OWNER_KEY = "sermon-studio.syncOwnerUserId";

export const LS_LIB = "sermon-studio-lib";
export const LS_SERIES = "sermon-studio-series";
export const LS_DRAFT = "sermon-studio-draft";

export type SyncMeta = {
  lastSyncedAt: string | null;
  lastError: string | null;
};

type SermonRow = {
  id: string;
  title: string;
  theme: string;
  date: string | null;
  passages: string[];
  notes: string;
  setlist: number[];
  is_series_item: boolean;
  series_id: string | null;
  outline: SermonOutline;
  created_at?: string;
};

type SeriesRow = {
  id: string;
  name: string;
  color: string;
  created_at?: string;
};

export type SermonWithSync = Sermon & { cloudSynced?: boolean };

type PullOk<T> = { ok: true; data: T };
type PullErr = { ok: false; error: string };
export type PullResult<T> = PullOk<T> | PullErr;

export function getSyncMeta(): SyncMeta {
  if (typeof window === "undefined") return { lastSyncedAt: null, lastError: null };
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (!raw) return { lastSyncedAt: null, lastError: null };
    return JSON.parse(raw) as SyncMeta;
  } catch {
    return { lastSyncedAt: null, lastError: null };
  }
}

function setSyncMeta(patch: Partial<SyncMeta>): void {
  const next = { ...getSyncMeta(), ...patch };
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
}

function removeLocalLibraryKeys(): void {
  try {
    localStorage.removeItem(LS_LIB);
    localStorage.removeItem(LS_SERIES);
    localStorage.removeItem(LS_DRAFT);
    localStorage.removeItem(SYNC_OWNER_KEY);
  } catch {
    // best-effort
  }
}

/** Drop prior account's local library before binding a new uid. */
export function bindSyncOwner(uid: string): boolean {
  if (typeof window === "undefined") return false;
  const prev = localStorage.getItem(SYNC_OWNER_KEY);
  const switched = Boolean(prev && prev !== uid);
  if (switched) {
    localStorage.removeItem(LS_LIB);
    localStorage.removeItem(LS_SERIES);
    localStorage.removeItem(LS_DRAFT);
  }
  localStorage.setItem(SYNC_OWNER_KEY, uid);
  return switched;
}

/** Scrub library/drafts on sign-out so the next account cannot inherit or push them. */
export function clearLocalLibraryOnSignOut(): void {
  removeLocalLibraryKeys();
  setSyncMeta({ lastSyncedAt: null, lastError: null });
}

export async function getAuthedUser(): Promise<User | null> {
  const supabase = await ensureSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export function rowToSermon(row: SermonRow): SermonWithSync {
  const o = row.outline;
  return {
    id: row.id,
    title: row.title || "",
    theme: row.theme || "faith",
    date: row.date || "",
    passages: Array.isArray(row.passages) ? row.passages : [],
    notes: row.notes || "",
    setlist: Array.isArray(row.setlist) ? row.setlist : [],
    isSeriesItem: row.is_series_item ?? false,
    seriesId: row.series_id ?? "",
    outline: {
      keyPoints: Array.isArray(o?.keyPoints) ? o.keyPoints : [],
      illustrations: Array.isArray(o?.illustrations) ? o.illustrations : [],
      application: typeof o?.application === "string" ? o.application : "",
    },
    cloudSynced: true,
  };
}

export function sermonToPayload(sermon: Sermon) {
  return {
    title: sermon.title || "Untitled Sermon",
    theme: sermon.theme,
    date: sermon.date || null,
    passages: sermon.passages,
    notes: sermon.notes,
    setlist: sermon.setlist,
    is_series_item: sermon.isSeriesItem,
    series_id: sermon.seriesId || null,
    outline: sermon.outline ?? defaultOutline(),
  };
}

export async function pullSermons(): Promise<PullResult<SermonWithSync[]>> {
  const supabase = await ensureSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase not configured." };
  if (!(await getAuthedUser())) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Sermon pull returned no data." };
  return { ok: true, data: (data as SermonRow[]).map(rowToSermon) };
}

export async function pullSeries(): Promise<PullResult<Series[]>> {
  const supabase = await ensureSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase not configured." };
  if (!(await getAuthedUser())) return { ok: false, error: "Not signed in." };

  const { data, error } = await supabase
    .from("series")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Series pull returned no data." };
  return { ok: true, data: data as Series[] };
}

export async function pushSermon(sermon: Sermon): Promise<{ sermon?: SermonWithSync; error?: string }> {
  const supabase = await ensureSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) return { error: "Supabase not configured." };
  if (!(await getAuthedUser())) return { error: "Sign in to sync sermons to Supabase." };

  const payload = sermonToPayload(sermon);
  if (sermon.id) {
    const { data, error } = await supabase
      .from("sermons")
      .upsert({ id: sermon.id, ...payload }, { onConflict: "id" })
      .select("*")
      .single();
    if (error) {
      setSyncMeta({ lastError: error.message });
      return { error: error.message };
    }
    setSyncMeta({ lastSyncedAt: new Date().toISOString(), lastError: null });
    return { sermon: rowToSermon(data as SermonRow) };
  }

  const { data, error } = await supabase.from("sermons").insert(payload).select("*").single();
  if (error) {
    setSyncMeta({ lastError: error.message });
    return { error: error.message };
  }
  setSyncMeta({ lastSyncedAt: new Date().toISOString(), lastError: null });
  return { sermon: rowToSermon(data as SermonRow) };
}

export async function pushSeries(series: Series): Promise<{ series?: Series; error?: string }> {
  const supabase = await ensureSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) return { error: "Supabase not configured." };
  if (!(await getAuthedUser())) return { error: "Sign in to sync series to Supabase." };

  const { data, error } = await supabase
    .from("series")
    .insert({ name: series.name, color: series.color })
    .select("*")
    .single();

  if (error) {
    setSyncMeta({ lastError: error.message });
    return { error: error.message };
  }
  setSyncMeta({ lastSyncedAt: new Date().toISOString(), lastError: null });
  return { series: data as Series };
}

/** Merge remote library into local; local wins on id conflicts. */
export function mergeSermonLibrary(local: SermonWithSync[], remote: SermonWithSync[]): SermonWithSync[] {
  const localIds = new Set(local.map((s) => s.id).filter(Boolean));
  const localOnly = local.map((s) => ({ ...s, cloudSynced: s.cloudSynced ?? false }));
  const added = remote.filter((s) => s.id && !localIds.has(s.id));
  return [...localOnly, ...added];
}

export function mergeSeriesList(local: Series[], remote: Series[]): (Series & { cloudSynced?: boolean })[] {
  const localIds = new Set(local.map((s) => s.id));
  const localMarked = local.map((s) => ({
    ...s,
    cloudSynced: (s as Series & { cloudSynced?: boolean }).cloudSynced ?? false,
  }));
  const remoteOnly = remote
    .filter((s) => !localIds.has(s.id))
    .map((s) => ({ ...s, cloudSynced: true }));
  return [...localMarked, ...remoteOnly];
}

export async function mergeOnSignIn(
  localLibrary: SermonWithSync[],
  localSeries: Series[]
): Promise<{ library: SermonWithSync[]; series: Series[]; error?: string; clearedPriorAccount?: boolean }> {
  const supabase = await ensureSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) {
    return { library: localLibrary, series: localSeries };
  }

  try {
    const user = await getAuthedUser();
    if (!user) {
      return { library: localLibrary, series: localSeries, error: "Not signed in." };
    }

    const switched = bindSyncOwner(user.id);
    const scopedLibrary = switched ? [] : localLibrary;
    const scopedSeries = switched ? [] : localSeries;

    const [remoteSermons, remoteSeries] = await Promise.all([pullSermons(), pullSeries()]);
    if (!remoteSermons.ok || !remoteSeries.ok) {
      const msg = !remoteSermons.ok
        ? `Sermon pull failed — sync aborted to avoid overwriting cloud data. (${remoteSermons.error})`
        : `Series pull failed — sync aborted to avoid overwriting cloud data. (${remoteSeries.error})`;
      setSyncMeta({ lastError: msg });
      return {
        library: scopedLibrary,
        series: scopedSeries,
        error: msg,
        clearedPriorAccount: switched,
      };
    }

    const library = mergeSermonLibrary(scopedLibrary, remoteSermons.data);
    const series = mergeSeriesList(scopedSeries, remoteSeries.data);

    const remoteIds = new Set(remoteSermons.data.map((s) => s.id));
    const pushResults = await Promise.all(
      library.filter((s) => s.id && !s.cloudSynced && !remoteIds.has(s.id)).map((s) => pushSermon(s))
    );
    const hadError = pushResults.some((r) => r.error);

    setSyncMeta({
      lastSyncedAt: new Date().toISOString(),
      lastError: hadError ? "Some local sermons failed to push." : null,
    });

    return {
      library,
      series,
      error: hadError ? "Some local sermons could not sync." : undefined,
      clearedPriorAccount: switched,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sync merge failed.";
    setSyncMeta({ lastError: msg });
    return { library: localLibrary, series: localSeries, error: msg };
  }
}
