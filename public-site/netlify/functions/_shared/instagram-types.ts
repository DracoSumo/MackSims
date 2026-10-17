export const QUEUE_STATES = ["draft", "approved", "processing", "published", "failed", "archived"] as const;
export type QueueState = (typeof QUEUE_STATES)[number];

export const CONTENT_TYPES = ["IMAGE", "CAROUSEL", "REELS"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export type MediaItem = {
  url: string;
  altText: string;
  mediaType: "IMAGE" | "VIDEO";
};

export type QueueInput = {
  scheduledAt: string;
  caption: string;
  contentType: ContentType;
  media: MediaItem[];
  idempotencyKey: string;
};

export type QueueRecord = QueueInput & {
  id: string;
  state: QueueState;
  approvedAt: string | null;
  approvedBy: string | null;
  attempts: number;
  lastError: string | null;
  metaContainerIds: string[];
  metaMediaId: string | null;
  processingStartedAt: string | null;
  lockToken: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

const JPEG_URL = /\.jpe?g(?:[?#].*)?$/i;
const VIDEO_URL = /\.mp4(?:[?#].*)?$/i;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,199}$/;

function isPublicHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return false;
    const hostname = url.hostname.toLowerCase();
    return (
      hostname !== "localhost" &&
      hostname !== "::1" &&
      !hostname.endsWith(".local") &&
      !/^127\./.test(hostname) &&
      !/^10\./.test(hostname) &&
      !/^192\.168\./.test(hostname) &&
      !/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
  } catch {
    return false;
  }
}

export function validateQueueInput(value: unknown): QueueInput {
  if (!value || typeof value !== "object") throw new Error("Request body must be an object");
  const input = value as Record<string, unknown>;
  const contentType = input.contentType;
  if (!CONTENT_TYPES.includes(contentType as ContentType)) throw new Error("Invalid contentType");

  const caption = typeof input.caption === "string" ? input.caption.trim() : "";
  if (caption.length > 2_200) throw new Error("Caption must be 2,200 characters or fewer");

  if (typeof input.scheduledAt !== "string" || Number.isNaN(Date.parse(input.scheduledAt))) {
    throw new Error("scheduledAt must be an ISO date-time");
  }

  if (typeof input.idempotencyKey !== "string" || !IDEMPOTENCY_KEY.test(input.idempotencyKey)) {
    throw new Error("idempotencyKey must be 8-200 safe characters");
  }

  if (!Array.isArray(input.media)) throw new Error("media must be an array");
  const media = input.media.map((raw, index): MediaItem => {
    if (!raw || typeof raw !== "object") throw new Error(`media[${index}] must be an object`);
    const item = raw as Record<string, unknown>;
    if (typeof item.url !== "string" || !isPublicHttpsUrl(item.url)) {
      throw new Error(`media[${index}].url must be a public HTTPS URL`);
    }
    if (typeof item.altText !== "string" || item.altText.trim().length === 0 || item.altText.length > 1_000) {
      throw new Error(`media[${index}].altText must be 1-1,000 characters`);
    }
    if (item.mediaType !== "IMAGE" && item.mediaType !== "VIDEO") {
      throw new Error(`media[${index}].mediaType must be IMAGE or VIDEO`);
    }
    if (item.mediaType === "IMAGE" && !JPEG_URL.test(item.url)) {
      throw new Error(`media[${index}] images must use a .jpg or .jpeg URL`);
    }
    if (item.mediaType === "VIDEO" && !VIDEO_URL.test(item.url)) {
      throw new Error(`media[${index}] videos must use an .mp4 URL`);
    }
    return { url: item.url, altText: item.altText.trim(), mediaType: item.mediaType };
  });

  if (contentType === "IMAGE" && (media.length !== 1 || media[0]?.mediaType !== "IMAGE")) {
    throw new Error("IMAGE posts require exactly one JPEG");
  }
  if (contentType === "REELS" && (media.length !== 1 || media[0]?.mediaType !== "VIDEO")) {
    throw new Error("REELS posts require exactly one MP4");
  }
  if (contentType === "CAROUSEL" && (media.length < 2 || media.length > 10)) {
    throw new Error("CAROUSEL posts require 2-10 media items");
  }

  return {
    scheduledAt: new Date(input.scheduledAt).toISOString(),
    caption,
    contentType: contentType as ContentType,
    media,
    idempotencyKey: input.idempotencyKey,
  };
}

export function canTransition(from: QueueState, to: QueueState): boolean {
  return (
    (from === "draft" && (to === "approved" || to === "archived")) ||
    (from === "approved" && to === "processing") ||
    (from === "processing" && (to === "published" || to === "failed"))
  );
}

/** Background workers get ~15m; reclaim a bit after that so leases cannot stick forever. */
export const STALE_PROCESSING_AFTER_MS = 20 * 60 * 1000;
export const MAX_PUBLISH_ATTEMPTS = 5;

export type StaleProcessingDecision = "mark_published" | "requeue" | "mark_failed" | "keep";

/**
 * Decide how to recover a processing queue row after a worker crash/timeout.
 * Never auto-requeue once Meta containers exist — that risks duplicate publishes.
 */
export function decideStaleProcessingReclaim(
  input: {
    processingStartedAt: string | null;
    metaMediaId: string | null;
    metaContainerIds: string[];
    attempts: number;
  },
  options: { now?: number; staleAfterMs?: number; maxAttempts?: number } = {},
): StaleProcessingDecision {
  if (input.metaMediaId) return "mark_published";

  const now = options.now ?? Date.now();
  const staleAfterMs = options.staleAfterMs ?? STALE_PROCESSING_AFTER_MS;
  const maxAttempts = options.maxAttempts ?? MAX_PUBLISH_ATTEMPTS;
  const started = input.processingStartedAt ? Date.parse(input.processingStartedAt) : Number.NaN;
  if (!Number.isFinite(started) || now - started < staleAfterMs) return "keep";

  const hasMetaContainers = input.metaContainerIds.length > 0;
  if (!hasMetaContainers && input.attempts < maxAttempts) return "requeue";
  return "mark_failed";
}

export function hasSameIdempotentPayload(existing: QueueRecord, input: QueueInput): boolean {
  return (
    existing.scheduledAt === input.scheduledAt &&
    existing.caption === input.caption &&
    existing.contentType === input.contentType &&
    JSON.stringify(existing.media) === JSON.stringify(input.media) &&
    existing.idempotencyKey === input.idempotencyKey
  );
}
