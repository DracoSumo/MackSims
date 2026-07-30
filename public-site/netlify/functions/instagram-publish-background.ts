import type { Config } from "@netlify/functions";
import { requireDispatch } from "./_shared/auth.js";
import {
  acquireProcessingJob,
  markFailed,
  markPublished,
  saveContainerIds,
} from "./_shared/instagram-db.js";
import { createMetaClientFromEnv, publishQueueRecord } from "./_shared/meta-instagram.js";

export default async (request: Request): Promise<Response> => {
  const authError = requireDispatch(request);
  if (authError) return authError;
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const body = (await request.json().catch(() => null)) as { id?: unknown; lockToken?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.lockToken !== "string") {
    return Response.json({ error: "id and lockToken are required" }, { status: 400 });
  }

  const job = await acquireProcessingJob(body.id, body.lockToken);
  if (!job) return Response.json({ accepted: false, reason: "Job already handled or lease is invalid" }, { status: 202 });

  try {
    const userId = Netlify.env.get("META_INSTAGRAM_USER_ID");
    if (!userId) throw new Error("META_INSTAGRAM_USER_ID is not configured");
    const result = await publishQueueRecord(createMetaClientFromEnv(), userId, job, {
      onContainerIds: (ids) => saveContainerIds(job.id, job.lockToken!, ids),
    });
    const recorded = await markPublished(job.id, job.lockToken!, result.mediaId);
    if (!recorded) throw new Error("Published media could not be recorded because the worker lease changed");
  } catch (error) {
    await markFailed(
      job.id,
      job.lockToken!,
      error instanceof Error ? error.message : "Unknown Instagram publishing error",
    );
  }

  return Response.json({ accepted: true }, { status: 202 });
};

export const config: Config = {};
