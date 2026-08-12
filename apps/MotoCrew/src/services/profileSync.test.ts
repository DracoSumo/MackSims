import { beforeEach, describe, expect, it } from "vitest";
import {
  emptyRiderProfile,
  isBlankRiderProfile,
  mergeRiderProfileFields,
  type RiderProfileLocal,
} from "./profileStore";
import { bindSyncOwner, clearLocalSyncStateOnSignOut } from "./supabaseSync";

function installMemoryLocalStorage() {
  const store = new Map<string, string>();
  const memory = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: memory,
    configurable: true,
  });
}

installMemoryLocalStorage();

function richProfile(overrides: Partial<RiderProfileLocal> = {}): RiderProfileLocal {
  return {
    name: "Alex Rider",
    ridingStyle: "Twisties",
    bike: "Yamaha MT-07",
    homeArea: "Chattanooga",
    experienceLevel: "Intermediate",
    emergencyContact: "Sam 555-0100",
    garage: {
      year: "2022",
      make: "Yamaha",
      model: "MT-07",
      setup: "Stock",
      range: "Local",
    },
    ...overrides,
  };
}

describe("rider profile merge (sign-in)", () => {
  it("treats default/empty profiles as blank", () => {
    expect(isBlankRiderProfile(emptyRiderProfile())).toBe(true);
    expect(isBlankRiderProfile(richProfile())).toBe(false);
  });

  it("adopts remote entirely when local is blank (fresh device sign-in)", () => {
    const remote = richProfile();
    const merged = mergeRiderProfileFields(emptyRiderProfile(), remote);
    expect(merged).toEqual(remote);
    expect(isBlankRiderProfile(merged)).toBe(false);
  });

  it("keeps non-empty local fields and fills gaps from remote", () => {
    const local = richProfile({
      name: "Local Name",
      emergencyContact: "",
      bike: "",
    });
    const remote = richProfile({
      name: "Remote Name",
      emergencyContact: "Remote ICE",
      bike: "Remote Bike",
    });
    const merged = mergeRiderProfileFields(local, remote);
    expect(merged.name).toBe("Local Name");
    expect(merged.emergencyContact).toBe("Remote ICE");
    expect(merged.bike).toBe("Remote Bike");
  });

  it("does not invent a blank overwrite when remote is missing", () => {
    const local = emptyRiderProfile();
    const merged = mergeRiderProfileFields(local, null);
    expect(isBlankRiderProfile(merged)).toBe(true);
  });
});

describe("sync owner binding", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("scrubs prior account local profile/drafts/joined on account switch", () => {
    localStorage.setItem("motocrew.syncOwnerUserId", "user-a");
    localStorage.setItem(
      "motocrew.riderProfile",
      JSON.stringify(richProfile({ name: "User A", emergencyContact: "A-ICE" }))
    );
    localStorage.setItem(
      "motocrew.draftRides",
      JSON.stringify([{ id: "11111111-1111-1111-1111-111111111111", title: "A draft" }])
    );
    localStorage.setItem("motocrew.joinedRideIds", JSON.stringify(["ride-a"]));

    const switched = bindSyncOwner("user-b");
    expect(switched).toBe(true);
    expect(localStorage.getItem("motocrew.syncOwnerUserId")).toBe("user-b");
    expect(localStorage.getItem("motocrew.riderProfile")).toBeNull();
    expect(localStorage.getItem("motocrew.draftRides")).toBe("[]");
    expect(localStorage.getItem("motocrew.joinedRideIds")).toBe("[]");
  });

  it("keeps local payload when the same user rebinds", () => {
    localStorage.setItem("motocrew.syncOwnerUserId", "user-a");
    localStorage.setItem("motocrew.riderProfile", JSON.stringify(richProfile()));
    const switched = bindSyncOwner("user-a");
    expect(switched).toBe(false);
    expect(localStorage.getItem("motocrew.riderProfile")).not.toBeNull();
  });

  it("clears sync payload on sign-out", () => {
    localStorage.setItem("motocrew.syncOwnerUserId", "user-a");
    localStorage.setItem("motocrew.riderProfile", JSON.stringify(richProfile()));
    localStorage.setItem("motocrew.draftRides", JSON.stringify([{ id: "d1" }]));
    clearLocalSyncStateOnSignOut();
    expect(localStorage.getItem("motocrew.syncOwnerUserId")).toBeNull();
    expect(localStorage.getItem("motocrew.riderProfile")).toBeNull();
    expect(localStorage.getItem("motocrew.draftRides")).toBe("[]");
  });
});
