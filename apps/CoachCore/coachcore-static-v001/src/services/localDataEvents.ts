/** Same-tab broadcast when localStorage-backed data changes (storage event only fires cross-tab). */
export const LOCAL_DATA_CHANGED = "coachcore:local-data-changed";

export function notifyLocalDataChanged(scope: "checkIns" | "actionLog" | "all" = "all"): void {
  if (typeof window === "undefined") return;
  if (typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(LOCAL_DATA_CHANGED, { detail: { scope } }));
}

export function onLocalDataChanged(
  handler: (scope: "checkIns" | "actionLog" | "all") => void,
): () => void {
  const listener = (event: Event) => {
    const scope = (event as CustomEvent<{ scope?: "checkIns" | "actionLog" | "all" }>).detail?.scope ?? "all";
    handler(scope);
  };
  window.addEventListener(LOCAL_DATA_CHANGED, listener);
  return () => window.removeEventListener(LOCAL_DATA_CHANGED, listener);
}
