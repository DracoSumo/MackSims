import { localStorageKeys } from "./dataService";

export function downloadMotoCrewLocalData() {
  const keys = [
    localStorageKeys.joinedRideIds,
    localStorageKeys.draftRides,
    localStorageKeys.emergencyContacts,
    localStorageKeys.safetyAcknowledged,
    localStorageKeys.completedChecklistIds,
    "motocrew.riderProfile",
  ];

  const payload: Record<string, unknown> = { exportedAt: new Date().toISOString() };
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      payload[key] = raw ? JSON.parse(raw) : null;
    } catch {
      payload[key] = null;
    }
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `motocrew-local-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
