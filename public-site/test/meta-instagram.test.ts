import { describe, expect, it, vi } from "vitest";
import {
  publishQueueRecord,
  type MetaApi,
} from "../netlify/functions/_shared/meta-instagram.js";
import type { QueueRecord } from "../netlify/functions/_shared/instagram-types.js";

function carouselRecord(): QueueRecord {
  return {
    id: "queue-1",
    state: "processing",
    scheduledAt: "2026-08-01T14:00:00.000Z",
    caption: "Two product views.",
    contentType: "CAROUSEL",
    media: [
      { url: "https://cdn.example.com/one.jpg", altText: "First product view.", mediaType: "IMAGE" },
      { url: "https://cdn.example.com/two.mp4", altText: "Second product demo.", mediaType: "VIDEO" },
    ],
    idempotencyKey: "carousel-001",
    approvedAt: "2026-07-30T14:00:00.000Z",
    approvedBy: "MackSims operator",
    attempts: 1,
    lastError: null,
    metaContainerIds: [],
    metaMediaId: null,
    processingStartedAt: "2026-08-01T14:00:00.000Z",
    lockToken: "worker-token",
    createdAt: "2026-07-30T13:00:00.000Z",
    updatedAt: "2026-08-01T14:00:00.000Z",
    publishedAt: null,
  };
}

describe("Meta container workflow", () => {
  it("creates and waits for children, creates the carousel, then publishes once", async () => {
    const ids = ["child-image", "child-video", "carousel"];
    const api: MetaApi = {
      createContainer: vi.fn(async () => ids.shift()!),
      getContainerStatus: vi.fn(async () => ({ status_code: "FINISHED" })),
      publishContainer: vi.fn(async () => "published-media"),
      getIdentity: vi.fn(),
    };
    const persisted: string[][] = [];

    const result = await publishQueueRecord(api, "ig-user-id", carouselRecord(), {
      sleep: async () => undefined,
      pollIntervalMs: 0,
      onContainerIds: async (containerIds) => {
        persisted.push(containerIds);
      },
    });

    expect(result).toEqual({
      mediaId: "published-media",
      containerIds: ["child-image", "child-video", "carousel"],
    });
    expect(api.createContainer).toHaveBeenCalledTimes(3);
    expect(api.publishContainer).toHaveBeenCalledOnce();
    expect(api.publishContainer).toHaveBeenCalledWith("ig-user-id", "carousel");
    expect(persisted.at(-1)).toEqual(["child-image", "child-video", "carousel"]);
  });

  it("does not publish a container that enters ERROR status", async () => {
    const api: MetaApi = {
      createContainer: vi.fn(async () => "reel-container"),
      getContainerStatus: vi.fn(async () => ({ status_code: "ERROR" })),
      publishContainer: vi.fn(async () => "should-not-publish"),
      getIdentity: vi.fn(),
    };
    const record = {
      ...carouselRecord(),
      contentType: "REELS" as const,
      media: [{ url: "https://cdn.example.com/reel.mp4", altText: "Reel demo.", mediaType: "VIDEO" as const }],
    };

    await expect(
      publishQueueRecord(api, "ig-user-id", record, { sleep: async () => undefined, pollIntervalMs: 0 }),
    ).rejects.toThrow(/ERROR/);
    expect(api.publishContainer).not.toHaveBeenCalled();
  });
});
