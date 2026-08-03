import { describe, expect, it } from "vitest";
import {
  decideStaleProcessingReclaim,
  MAX_PUBLISH_ATTEMPTS,
  STALE_PROCESSING_AFTER_MS,
} from "../netlify/functions/_shared/instagram-types.js";

const startedFresh = "2026-08-03T10:50:00.000Z";
const startedStale = "2026-08-03T10:00:00.000Z";
const now = Date.parse("2026-08-03T11:00:00.000Z");

describe("decideStaleProcessingReclaim", () => {
  it("recovers rows that already recorded a Meta media id", () => {
    expect(
      decideStaleProcessingReclaim(
        {
          processingStartedAt: startedFresh,
          metaMediaId: "media-123",
          metaContainerIds: ["container-1"],
          attempts: 1,
        },
        { now },
      ),
    ).toBe("mark_published");
  });

  it("keeps an in-flight lease that is still inside the stale window", () => {
    expect(
      decideStaleProcessingReclaim(
        {
          processingStartedAt: startedFresh,
          metaMediaId: null,
          metaContainerIds: [],
          attempts: 1,
        },
        { now, staleAfterMs: STALE_PROCESSING_AFTER_MS },
      ),
    ).toBe("keep");
  });

  it("requeues stale leases that never created Meta containers", () => {
    expect(
      decideStaleProcessingReclaim(
        {
          processingStartedAt: startedStale,
          metaMediaId: null,
          metaContainerIds: [],
          attempts: 1,
        },
        { now },
      ),
    ).toBe("requeue");
  });

  it("fails stale leases after Meta containers exist to avoid duplicate publishes", () => {
    expect(
      decideStaleProcessingReclaim(
        {
          processingStartedAt: startedStale,
          metaMediaId: null,
          metaContainerIds: ["container-1"],
          attempts: 1,
        },
        { now },
      ),
    ).toBe("mark_failed");
  });

  it("fails after the attempt budget even when no containers exist", () => {
    expect(
      decideStaleProcessingReclaim(
        {
          processingStartedAt: startedStale,
          metaMediaId: null,
          metaContainerIds: [],
          attempts: MAX_PUBLISH_ATTEMPTS,
        },
        { now },
      ),
    ).toBe("mark_failed");
  });
});
