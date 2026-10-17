export type PublishFinalizeDeps = {
  markPublished: (id: string, lockToken: string, mediaId: string) => Promise<boolean>;
  forceMarkPublished: (id: string, mediaId: string) => Promise<boolean>;
  markFailed: (id: string, lockToken: string, error: string) => Promise<void>;
};

/**
 * Run Meta publish, then record success. Once Meta returns a media id, never
 * transition the queue row to failed — that orphaned live posts and invited
 * duplicate publishes on manual retry.
 */
export async function runPublishAttempt(
  deps: PublishFinalizeDeps,
  job: { id: string; lockToken: string },
  publish: () => Promise<{ mediaId: string }>,
): Promise<"published" | "failed" | "published_unrecorded"> {
  let mediaId: string | null = null;
  try {
    const result = await publish();
    mediaId = result.mediaId;
  } catch (error) {
    await deps.markFailed(
      job.id,
      job.lockToken,
      error instanceof Error ? error.message : "Unknown Instagram publishing error",
    );
    return "failed";
  }

  // Meta already accepted the publish. Recording failures must not mark the row
  // failed — that desyncs the queue from a live post and invites duplicates.
  try {
    if (await deps.markPublished(job.id, job.lockToken, mediaId)) return "published";
  } catch {
    // try lock-independent fallback below
  }
  try {
    if (await deps.forceMarkPublished(job.id, mediaId)) return "published";
  } catch {
    // leave processing/failed unchanged for operator follow-up
  }
  return "published_unrecorded";
}
