import { describe, expect, it } from "vitest";
import {
  canTransition,
  hasSameIdempotentPayload,
  validateQueueInput,
  type QueueRecord,
} from "../netlify/functions/_shared/instagram-types.js";

const validInput = {
  scheduledAt: "2026-08-01T14:00:00.000Z",
  caption: "A MackSims update.",
  contentType: "IMAGE",
  media: [{ url: "https://cdn.example.com/post.jpg", altText: "Product screen.", mediaType: "IMAGE" }],
  idempotencyKey: "launch-post-001",
} as const;

describe("Instagram queue validation", () => {
  it("accepts a conservative single-JPEG post", () => {
    expect(validateQueueInput(validInput)).toMatchObject(validInput);
  });

  it("rejects non-HTTPS media and oversized carousels", () => {
    expect(() =>
      validateQueueInput({
        ...validInput,
        contentType: "CAROUSEL",
        media: Array.from({ length: 11 }, (_, index) => ({
          url: `http://cdn.example.com/${index}.jpg`,
          altText: "Slide",
          mediaType: "IMAGE",
        })),
      }),
    ).toThrow(/HTTPS|2-10/);
  });
});

describe("queue state and idempotency rules", () => {
  it("allows only the approval-gated state path", () => {
    expect(canTransition("draft", "approved")).toBe(true);
    expect(canTransition("draft", "archived")).toBe(true);
    expect(canTransition("approved", "processing")).toBe(true);
    expect(canTransition("processing", "published")).toBe(true);
    expect(canTransition("processing", "failed")).toBe(true);
    expect(canTransition("draft", "processing")).toBe(false);
    expect(canTransition("published", "processing")).toBe(false);
    expect(canTransition("archived", "approved")).toBe(false);
  });

  it("accepts a duplicate key only for the same normalized payload", () => {
    const normalized = validateQueueInput(validInput);
    const existing: QueueRecord = {
      ...normalized,
      id: "queue-1",
      state: "draft",
      approvedAt: null,
      approvedBy: null,
      attempts: 0,
      lastError: null,
      metaContainerIds: [],
      metaMediaId: null,
      processingStartedAt: null,
      lockToken: null,
      createdAt: "2026-07-30T14:00:00.000Z",
      updatedAt: "2026-07-30T14:00:00.000Z",
      publishedAt: null,
    };
    expect(hasSameIdempotentPayload(existing, normalized)).toBe(true);
    expect(hasSameIdempotentPayload(existing, { ...normalized, caption: "Changed" })).toBe(false);
  });
});
