"use client";

import { useEffect } from "react";

const REST_NOTIF_ID = 3101;

export type DeviceCoords = { lat: number; lng: number };

export type GeoResult =
  | { ok: true; coords: DeviceCoords }
  | { ok: false; reason: "denied" | "unavailable" | "timeout" };

let awakeCount = 0;
let webWakeLock: WakeLockSentinel | null = null;

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* web-only fallback */
  }
}

export async function hapticTap() {
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    vibrate(12);
  }
}

export async function hapticSuccess() {
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    vibrate([16, 40, 24]);
  }
}

export async function acquireAwake() {
  awakeCount += 1;
  if (awakeCount !== 1) return;
  try {
    const { KeepAwake } = await import("@capacitor-community/keep-awake");
    await KeepAwake.keepAwake();
    return;
  } catch {
    /* fall through to Screen Wake Lock */
  }
  try {
    webWakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
  } catch {
    webWakeLock = null;
  }
}

export async function releaseAwake() {
  awakeCount = Math.max(0, awakeCount - 1);
  if (awakeCount !== 0) return;
  try {
    const { KeepAwake } = await import("@capacitor-community/keep-awake");
    await KeepAwake.allowSleep();
  } catch {
    /* ignore */
  }
  try {
    await webWakeLock?.release();
  } catch {
    /* ignore */
  }
  webWakeLock = null;
}

/** Keep the gym phone from sleeping while a session or rest timer is live. */
export function useKeepAwake(active: boolean) {
  useEffect(() => {
    if (!active) return;
    void acquireAwake();
    return () => {
      void releaseAwake();
    };
  }, [active]);
}

export async function getDeviceLocation(): Promise<GeoResult> {
  try {
    const { Geolocation } = await import("@capacitor/geolocation");
    const perm = await Geolocation.requestPermissions();
    if (perm.location !== "granted" && perm.coarseLocation !== "granted") {
      return { ok: false, reason: "denied" };
    }
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 12000,
    });
    return { ok: true, coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } };
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : "";
    if (message.includes("denied") || message.includes("permission")) {
      return { ok: false, reason: "denied" };
    }
    if (message.includes("timeout")) return { ok: false, reason: "timeout" };
  }

  if (!navigator.geolocation) return { ok: false, reason: "unavailable" };
  return await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ ok: true, coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ ok: false, reason: "denied" });
        else if (err.code === err.TIMEOUT) resolve({ ok: false, reason: "timeout" });
        else resolve({ ok: false, reason: "unavailable" });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30_000 },
    );
  });
}

export function formatDeviceCoords(coords: DeviceCoords) {
  const ns = coords.lat >= 0 ? "N" : "S";
  const ew = coords.lng >= 0 ? "E" : "W";
  return `${Math.abs(coords.lat).toFixed(3)}°${ns}, ${Math.abs(coords.lng).toFixed(3)}°${ew}`;
}

export function geoStatusMessage(result: GeoResult): string {
  if (result.ok) {
    return `Saved this device location (${formatDeviceCoords(result.coords)}). Not a map pin from Google Places — workouts still follow Home / Gym / Outdoor / Travel.`;
  }
  if (result.reason === "denied") {
    return "Location permission denied — pick Home / Gym / Outdoor / Travel as usual.";
  }
  if (result.reason === "timeout") {
    return "Location timed out — pick a training place instead.";
  }
  return "This device location isn’t available — pick Home / Gym / Outdoor / Travel.";
}

export async function scheduleRestDone(seconds: number) {
  if (seconds <= 0) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return;
    await LocalNotifications.cancel({ notifications: [{ id: REST_NOTIF_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REST_NOTIF_ID,
          title: "Rest done",
          body: "Next set — PrimFit",
          schedule: { at: new Date(Date.now() + seconds * 1000), allowWhileIdle: true },
        },
      ],
    });
  } catch {
    /* web / missing plugin */
  }
}

export async function cancelRestDone() {
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.cancel({ notifications: [{ id: REST_NOTIF_ID }] });
  } catch {
    /* ignore */
  }
}
