import { createHmac } from "node:crypto";
import type { MediaItem, QueueRecord } from "./instagram-types.js";

type MetaIdResponse = { id: string };
type MetaStatusResponse = { status_code?: string; status?: string };

export interface MetaApi {
  createContainer(userId: string, parameters: Record<string, string>): Promise<string>;
  getContainerStatus(containerId: string): Promise<MetaStatusResponse>;
  publishContainer(userId: string, containerId: string): Promise<string>;
  getIdentity(): Promise<Record<string, unknown>>;
}

export class MetaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown,
  ) {
    super(message);
  }
}

export class InstagramGraphClient implements MetaApi {
  private readonly root: string;
  private readonly appSecretProof: string;

  constructor(
    private readonly accessToken: string,
    private readonly userId: string,
    appSecret: string,
    apiVersion: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    if (!/^v\d+\.\d+$/.test(apiVersion)) throw new Error("META_INSTAGRAM_API_VERSION must look like vNN.N");
    this.root = `https://graph.instagram.com/${apiVersion}`;
    this.appSecretProof = createHmac("sha256", appSecret).update(accessToken).digest("hex");
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("authorization", `Bearer ${this.accessToken}`);
    const response = await this.fetcher(`${this.root}${path}`, { ...init, headers });
    const body = (await response.json().catch(() => null)) as T | { error?: { message?: string } } | null;
    if (!response.ok) {
      const message =
        body && typeof body === "object" && "error" in body && body.error?.message
          ? body.error.message
          : `Meta API request failed with HTTP ${response.status}`;
      throw new MetaApiError(message, response.status, body);
    }
    return body as T;
  }

  async createContainer(userId: string, parameters: Record<string, string>): Promise<string> {
    const body = new URLSearchParams({ ...parameters, appsecret_proof: this.appSecretProof });
    const result = await this.request<MetaIdResponse>(`/${encodeURIComponent(userId)}/media`, {
      method: "POST",
      body,
    });
    if (!result.id) throw new Error("Meta did not return a container ID");
    return result.id;
  }

  async getContainerStatus(containerId: string): Promise<MetaStatusResponse> {
    return this.request<MetaStatusResponse>(
      `/${encodeURIComponent(containerId)}?fields=status_code&appsecret_proof=${this.appSecretProof}`,
    );
  }

  async publishContainer(userId: string, containerId: string): Promise<string> {
    const body = new URLSearchParams({
      creation_id: containerId,
      appsecret_proof: this.appSecretProof,
    });
    const result = await this.request<MetaIdResponse>(`/${encodeURIComponent(userId)}/media_publish`, {
      method: "POST",
      body,
    });
    if (!result.id) throw new Error("Meta did not return a published media ID");
    return result.id;
  }

  async getIdentity(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(
      `/me?fields=id,user_id,username,account_type&appsecret_proof=${this.appSecretProof}`,
    );
  }

  configuredUserId(): string {
    return this.userId;
  }
}

export function createMetaClientFromEnv(): InstagramGraphClient {
  const accessToken = Netlify.env.get("META_INSTAGRAM_ACCESS_TOKEN");
  const userId = Netlify.env.get("META_INSTAGRAM_USER_ID");
  const appSecret = Netlify.env.get("META_INSTAGRAM_APP_SECRET");
  const apiVersion = Netlify.env.get("META_INSTAGRAM_API_VERSION");
  if (!accessToken || !userId || !appSecret || !apiVersion) {
    throw new Error("Meta Instagram publishing credentials are not fully configured");
  }
  return new InstagramGraphClient(accessToken, userId, appSecret, apiVersion);
}

type PublishOptions = {
  sleep?: (milliseconds: number) => Promise<void>;
  pollIntervalMs?: number;
  maxPolls?: number;
  onContainerIds?: (ids: string[]) => Promise<void>;
};

function childParameters(item: MediaItem): Record<string, string> {
  if (item.mediaType === "VIDEO") {
    return { media_type: "VIDEO", video_url: item.url, is_carousel_item: "true" };
  }
  return { image_url: item.url, alt_text: item.altText, is_carousel_item: "true" };
}

export async function waitForContainer(
  api: MetaApi,
  containerId: string,
  options: PublishOptions = {},
): Promise<void> {
  const sleep = options.sleep ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
  const maxPolls = options.maxPolls ?? 60;
  const pollIntervalMs = options.pollIntervalMs ?? 10_000;
  for (let poll = 0; poll < maxPolls; poll += 1) {
    const result = await api.getContainerStatus(containerId);
    const status = result.status_code ?? result.status;
    if (status === "FINISHED" || status === "PUBLISHED") return;
    if (status === "ERROR" || status === "EXPIRED") {
      throw new Error(`Meta container ${containerId} entered ${status} status`);
    }
    await sleep(pollIntervalMs);
  }
  throw new Error(`Timed out waiting for Meta container ${containerId}`);
}

export async function publishQueueRecord(
  api: MetaApi,
  userId: string,
  record: QueueRecord,
  options: PublishOptions = {},
): Promise<{ mediaId: string; containerIds: string[] }> {
  const containerIds: string[] = [];
  const remember = async (id: string) => {
    containerIds.push(id);
    await options.onContainerIds?.([...containerIds]);
  };

  let publishableContainerId: string;
  if (record.contentType === "IMAGE") {
    publishableContainerId = await api.createContainer(userId, {
      image_url: record.media[0]!.url,
      alt_text: record.media[0]!.altText,
      caption: record.caption,
    });
    await remember(publishableContainerId);
    await waitForContainer(api, publishableContainerId, options);
  } else if (record.contentType === "REELS") {
    publishableContainerId = await api.createContainer(userId, {
      media_type: "REELS",
      video_url: record.media[0]!.url,
      caption: record.caption,
      share_to_feed: "true",
    });
    await remember(publishableContainerId);
    await waitForContainer(api, publishableContainerId, options);
  } else {
    const childIds: string[] = [];
    for (const item of record.media) {
      const childId = await api.createContainer(userId, childParameters(item));
      childIds.push(childId);
      await remember(childId);
      await waitForContainer(api, childId, options);
    }
    publishableContainerId = await api.createContainer(userId, {
      media_type: "CAROUSEL",
      children: childIds.join(","),
      caption: record.caption,
    });
    await remember(publishableContainerId);
    await waitForContainer(api, publishableContainerId, options);
  }

  const mediaId = await api.publishContainer(userId, publishableContainerId);
  return { mediaId, containerIds };
}
