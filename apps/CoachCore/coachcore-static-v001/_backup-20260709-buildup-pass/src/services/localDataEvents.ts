/** Same-tab broadcast when localStorage-backed data changes (storage event only fires cross-tab). */
export const LOCAL_DATA_CHANGED = "coachcore:local-data-changed";

export type LocalDataScope =
  | "checkIns"
  | "actionLog"
  | "assignments"
  | "messages"
  | "notifications"
  | "all";

export function notifyLocalDataChanged(scope: LocalDataScope = "all"): void {
  if (typeof window === "undefined") return;
  if (typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(LOCAL_DATA_CHANGED, { detail: { scope } }));
}

export function onLocalDataChanged(handler: (scope: LocalDataScope) => void): () => void {
  const listener = (event: Event) => {
    const scope =
      (event as CustomEvent<{ scope?: LocalDataScope }>).detail?.scope ?? "all";
    handler(scope);
  };
  window.addEventListener(LOCAL_DATA_CHANGED, listener);
  return () => window.removeEventListener(LOCAL_DATA_CHANGED, listener);
}
