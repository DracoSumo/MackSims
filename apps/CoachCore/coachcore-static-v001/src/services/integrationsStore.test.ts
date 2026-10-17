import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  effectiveAvailability,
  listUserIntegrations,
  mergeUserIntegrations,
  upsertUserIntegration,
} from "./integrationsStore";
import { availabilityLabel, integrationsCatalog } from "@/data/integrationsCatalog";

describe("integrationsCatalog", () => {
  it("keeps Hudl careful and does not fake connected defaults", () => {
    const hudl = integrationsCatalog.find((p) => p.id === "hudl");
    expect(hudl?.availability).toBe("request_access");
    expect(hudl?.carefulCopy?.toLowerCase()).toContain("licensed");
  });

  it("labels statuses for UI chips", () => {
    expect(availabilityLabel("needs_credentials")).toBe("Needs credentials");
    expect(availabilityLabel("available")).toBe("Available");
  });
});

describe("integrationsStore", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "integ-uuid",
    });
  });

  it("upserts and lists user integrations", () => {
    upsertUserIntegration({
      providerId: "google_calendar",
      displayName: "Google Calendar",
      status: "connected",
      notes: "test",
      connectedAt: "2026-07-23T12:00:00.000Z",
      requestedAt: null,
    });
    const rows = listUserIntegrations();
    expect(rows).toHaveLength(1);
    expect(rows[0].providerId).toBe("google_calendar");
    expect(rows[0].status).toBe("connected");
  });

  it("merges remote and local preferring newer updatedAt", () => {
    upsertUserIntegration({
      providerId: "hudl",
      displayName: "Hudl",
      status: "requested",
      notes: "local",
      connectedAt: null,
      requestedAt: "2026-07-23T10:00:00.000Z",
    });
    mergeUserIntegrations([
      {
        id: "remote-1",
        providerId: "hudl",
        displayName: "Hudl",
        status: "connected",
        notes: "remote",
        connectedAt: "2026-07-23T11:00:00.000Z",
        requestedAt: null,
        updatedAt: "2020-01-01T00:00:00.000Z",
      },
    ]);
    expect(listUserIntegrations()[0].status).toBe("requested");
  });

  it("maps user connected over catalog default", () => {
    expect(effectiveAvailability("request_access", "connected")).toBe("connected");
    expect(effectiveAvailability("available", null)).toBe("available");
  });
});
