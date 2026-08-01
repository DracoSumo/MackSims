import { describe, expect, it, vi } from "vitest";
import { runPublishAttempt } from "../netlify/functions/_shared/instagram-publish-finalize.js";

describe("runPublishAttempt", () => {
  it("marks failed only when Meta publish itself throws", async () => {
    const markPublished = vi.fn(async () => true);
    const forceMarkPublished = vi.fn(async () => true);
    const markFailed = vi.fn(async () => undefined);

    const outcome = await runPublishAttempt(
      { markPublished, forceMarkPublished, markFailed },
      { id: "q1", lockToken: "lease-1" },
      async () => {
        throw new Error("Meta container ERROR");
      },
    );

    expect(outcome).toBe("failed");
    expect(markFailed).toHaveBeenCalledWith("q1", "lease-1", "Meta container ERROR");
    expect(markPublished).not.toHaveBeenCalled();
    expect(forceMarkPublished).not.toHaveBeenCalled();
  });

  it("records publish with the worker lease on the happy path", async () => {
    const markPublished = vi.fn(async () => true);
    const forceMarkPublished = vi.fn(async () => true);
    const markFailed = vi.fn(async () => undefined);

    const outcome = await runPublishAttempt(
      { markPublished, forceMarkPublished, markFailed },
      { id: "q1", lockToken: "lease-1" },
      async () => ({ mediaId: "media-123" }),
    );

    expect(outcome).toBe("published");
    expect(markPublished).toHaveBeenCalledWith("q1", "lease-1", "media-123");
    expect(forceMarkPublished).not.toHaveBeenCalled();
    expect(markFailed).not.toHaveBeenCalled();
  });

  it("force-records after Meta success when the worker lease no longer matches", async () => {
    const markPublished = vi.fn(async () => false);
    const forceMarkPublished = vi.fn(async () => true);
    const markFailed = vi.fn(async () => undefined);

    const outcome = await runPublishAttempt(
      { markPublished, forceMarkPublished, markFailed },
      { id: "q1", lockToken: "stale-lease" },
      async () => ({ mediaId: "media-123" }),
    );

    expect(outcome).toBe("published");
    expect(forceMarkPublished).toHaveBeenCalledWith("q1", "media-123");
    expect(markFailed).not.toHaveBeenCalled();
  });

  it("never marks failed after Meta returns a media id, even if recording fails", async () => {
    const markPublished = vi.fn(async () => {
      throw new Error("database unavailable");
    });
    const forceMarkPublished = vi.fn(async () => false);
    const markFailed = vi.fn(async () => undefined);

    const outcome = await runPublishAttempt(
      { markPublished, forceMarkPublished, markFailed },
      { id: "q1", lockToken: "lease-1" },
      async () => ({ mediaId: "media-live" }),
    );

    expect(outcome).toBe("published_unrecorded");
    expect(forceMarkPublished).toHaveBeenCalledWith("q1", "media-live");
    expect(markFailed).not.toHaveBeenCalled();
  });

  it("recovers via force-record when leased markPublished throws after Meta success", async () => {
    const markPublished = vi.fn(async () => {
      throw new Error("database unavailable");
    });
    const forceMarkPublished = vi.fn(async () => true);
    const markFailed = vi.fn(async () => undefined);

    const outcome = await runPublishAttempt(
      { markPublished, forceMarkPublished, markFailed },
      { id: "q1", lockToken: "lease-1" },
      async () => ({ mediaId: "media-live" }),
    );

    expect(outcome).toBe("published");
    expect(forceMarkPublished).toHaveBeenCalledWith("q1", "media-live");
    expect(markFailed).not.toHaveBeenCalled();
  });
});
