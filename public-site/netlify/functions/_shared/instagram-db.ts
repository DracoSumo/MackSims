import { getDatabase } from "@netlify/database";
import { randomUUID } from "node:crypto";
import { hasSameIdempotentPayload, type QueueInput, type QueueRecord } from "./instagram-types.js";

type QueryResult<T> = { rows: T[]; rowCount: number | null };
type Queryable = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
};

type QueueRow = {
  id: string;
  state: QueueRecord["state"];
  scheduled_at: Date | string;
  caption: string;
  content_type: QueueRecord["contentType"];
  media: QueueRecord["media"];
  approved_at: Date | string | null;
  approved_by: string | null;
  attempts: number;
  last_error: string | null;
  meta_container_ids: string[];
  meta_media_id: string | null;
  idempotency_key: string;
  processing_started_at: Date | string | null;
  lock_token: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  published_at: Date | string | null;
};

function queryable(): Queryable {
  return getDatabase().pool as unknown as Queryable;
}

function iso(value: Date | string | null): string | null {
  return value === null ? null : new Date(value).toISOString();
}

function mapRow(row: QueueRow): QueueRecord {
  return {
    id: row.id,
    state: row.state,
    scheduledAt: iso(row.scheduled_at)!,
    caption: row.caption,
    contentType: row.content_type,
    media: row.media,
    approvedAt: iso(row.approved_at),
    approvedBy: row.approved_by,
    attempts: row.attempts,
    lastError: row.last_error,
    metaContainerIds: row.meta_container_ids ?? [],
    metaMediaId: row.meta_media_id,
    idempotencyKey: row.idempotency_key,
    processingStartedAt: iso(row.processing_started_at),
    lockToken: row.lock_token,
    createdAt: iso(row.created_at)!,
    updatedAt: iso(row.updated_at)!,
    publishedAt: iso(row.published_at),
  };
}

async function audit(
  queueId: string,
  action: string,
  actor: string,
  fromState: string | null,
  toState: string | null,
  details: Record<string, unknown> = {},
): Promise<void> {
  await queryable().query(
    `INSERT INTO instagram_publish_audit
      (queue_id, action, actor, from_state, to_state, details)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [queueId, action, actor, fromState, toState, JSON.stringify(details)],
  );
}

export async function createDraft(input: QueueInput, actor: string): Promise<{ record: QueueRecord; created: boolean }> {
  const id = randomUUID();
  const result = await queryable().query<QueueRow>(
    `INSERT INTO instagram_publish_queue
      (id, scheduled_at, caption, content_type, media, idempotency_key)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING *`,
    [id, input.scheduledAt, input.caption, input.contentType, JSON.stringify(input.media), input.idempotencyKey],
  );
  if (result.rows[0]) {
    await audit(id, "draft_created", actor, null, "draft");
    return { record: mapRow(result.rows[0]), created: true };
  }
  const existing = await queryable().query<QueueRow>(
    "SELECT * FROM instagram_publish_queue WHERE idempotency_key = $1",
    [input.idempotencyKey],
  );
  if (!existing.rows[0]) throw new Error("Idempotency conflict could not be resolved");
  const record = mapRow(existing.rows[0]);
  if (!hasSameIdempotentPayload(record, input)) {
    throw new Error("idempotencyKey is already associated with a different payload");
  }
  return { record, created: false };
}

export async function listQueue(limit = 50): Promise<QueueRecord[]> {
  const result = await queryable().query<QueueRow>(
    "SELECT * FROM instagram_publish_queue ORDER BY scheduled_at DESC, created_at DESC LIMIT $1",
    [Math.max(1, Math.min(limit, 100))],
  );
  return result.rows.map(mapRow);
}

export async function approveDraft(id: string, approvedBy: string): Promise<QueueRecord | null> {
  const result = await queryable().query<QueueRow>(
    `UPDATE instagram_publish_queue
     SET state = 'approved', approved_at = now(), approved_by = $2, updated_at = now()
     WHERE id = $1 AND state = 'draft'
     RETURNING *`,
    [id, approvedBy],
  );
  if (!result.rows[0]) return null;
  await audit(id, "approved", approvedBy, "draft", "approved");
  return mapRow(result.rows[0]);
}

export async function claimDueApproved(limit = 5): Promise<QueueRecord[]> {
  const lockToken = randomUUID();
  const result = await queryable().query<QueueRow>(
    `WITH quota_lock AS MATERIALIZED (
       SELECT pg_advisory_xact_lock(hashtext('macksims-instagram-publish-quota'))
     ),
     quota AS (
       SELECT GREATEST(0, 50 - count(*))::int AS remaining
       FROM instagram_publish_queue, quota_lock
       WHERE (state = 'published' AND published_at >= now() - interval '24 hours')
          OR (state = 'processing' AND processing_started_at >= now() - interval '24 hours')
     ),
     candidates AS (
       SELECT id
       FROM instagram_publish_queue, quota
       WHERE state = 'approved' AND scheduled_at <= now()
       ORDER BY scheduled_at, created_at
       FOR UPDATE OF instagram_publish_queue SKIP LOCKED
       LIMIT LEAST($1, (SELECT remaining FROM quota))
     )
     UPDATE instagram_publish_queue AS queue
     SET state = 'processing',
         attempts = attempts + 1,
         processing_started_at = now(),
         lock_token = $2,
         last_error = NULL,
         updated_at = now()
     FROM candidates
     WHERE queue.id = candidates.id
     RETURNING queue.*`,
    [Math.max(1, Math.min(limit, 10)), lockToken],
  );
  await Promise.all(
    result.rows.map((row) =>
      audit(row.id, "dispatcher_claimed", "scheduled-dispatcher", "approved", "processing", {
        attempt: row.attempts,
        lockToken,
      }),
    ),
  );
  return result.rows.map(mapRow);
}

export async function acquireProcessingJob(id: string, dispatchToken: string): Promise<QueueRecord | null> {
  const workerToken = randomUUID();
  const result = await queryable().query<QueueRow>(
    `UPDATE instagram_publish_queue
     SET lock_token = $3, updated_at = now()
     WHERE id = $1 AND state = 'processing' AND lock_token = $2
     RETURNING *`,
    [id, dispatchToken, workerToken],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function saveContainerIds(id: string, lockToken: string, ids: string[]): Promise<void> {
  await queryable().query(
    `UPDATE instagram_publish_queue
     SET meta_container_ids = $3::jsonb, updated_at = now()
     WHERE id = $1 AND state = 'processing' AND lock_token = $2`,
    [id, lockToken, JSON.stringify(ids)],
  );
}

export async function markPublished(id: string, lockToken: string, mediaId: string): Promise<boolean> {
  const result = await queryable().query<{ attempts: number }>(
    `UPDATE instagram_publish_queue
     SET state = 'published', meta_media_id = $3, published_at = now(),
         lock_token = NULL, last_error = NULL, updated_at = now()
     WHERE id = $1 AND state = 'processing' AND lock_token = $2 AND meta_media_id IS NULL
     RETURNING attempts`,
    [id, lockToken, mediaId],
  );
  if (!result.rows[0]) return false;
  await audit(id, "published", "background-publisher", "processing", "published", { mediaId });
  return true;
}

export async function markFailed(id: string, lockToken: string, error: string): Promise<void> {
  const result = await queryable().query(
    `UPDATE instagram_publish_queue
     SET state = 'failed', last_error = $3, lock_token = NULL, updated_at = now()
     WHERE id = $1 AND state = 'processing' AND lock_token = $2
     RETURNING id`,
    [id, lockToken, error.slice(0, 4_000)],
  );
  if (result.rowCount) {
    await audit(id, "publish_failed", "background-publisher", "processing", "failed", {
      error: error.slice(0, 1_000),
    });
  }
}
