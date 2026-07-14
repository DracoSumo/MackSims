/** Safe browser storage — never throw (private WebViews / blocked storage). */

export function safeGetItem(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSetItem(storage: Storage | undefined, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    /* ignore quota / security errors */
  }
}

export function sessionGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return safeGetItem(window.sessionStorage, key);
}

export function sessionSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  safeSetItem(window.sessionStorage, key, value);
}

export function localGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return safeGetItem(window.localStorage, key);
}

export function localSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  safeSetItem(window.localStorage, key, value);
}
