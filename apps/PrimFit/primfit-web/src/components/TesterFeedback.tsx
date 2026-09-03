"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function HomeBackConfirm() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/app/today" || pathname === "/app/today/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = () => {
      if (open) {
        setOpen(false);
        return;
      }
      if (!isHome) {
        router.push("/app/today/");
        return;
      }
      setOpen(true);
    };
    const cap = (window as unknown as { Capacitor?: { Plugins?: { App?: { addListener?: (e: string, cb: () => void) => { remove?: () => void } | Promise<{ remove?: () => void }>; exitApp?: () => void } } } }).Capacitor;
    const app = cap?.Plugins?.App;
    let remove: (() => void) | undefined;
    if (app?.addListener) {
      const result = app.addListener("backButton", handle);
      if (result && typeof (result as Promise<unknown>).then === "function") {
        void (result as Promise<{ remove?: () => void }>).then((listener) => {
          remove = () => listener.remove?.();
        });
      } else {
        remove = () => (result as { remove?: () => void })?.remove?.();
      }
    }
    return () => remove?.();
  }, [isHome, open, router]);

  if (!open) return null;
  const leave = () => {
    const cap = (window as unknown as { Capacitor?: { Plugins?: { App?: { exitApp?: () => void } } } }).Capacitor;
    if (cap?.Plugins?.App?.exitApp) {
      cap.Plugins.App.exitApp();
      return;
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="pf-exit-title">
      <div className="pf-card w-full max-w-sm p-5">
        <h2 id="pf-exit-title" className="text-xl font-bold">Exit PrimFit?</h2>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">This keeps you from backing out of Today by accident.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="pf-btn-primary flex-1" onClick={() => setOpen(false)}>Stay</button>
          <button type="button" className="pf-btn-ghost flex-1" onClick={leave}>Leave</button>
        </div>
      </div>
    </div>
  );
}

export function ratePrimFit() {
  const play = "https://play.google.com/store/apps/details?id=com.macksims.primfit";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const onAndroid = /Android/i.test(ua);
  const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  const nativeAndroid = cap?.getPlatform?.() === "android";
  if (onAndroid || nativeAndroid) {
    window.open(play, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href =
    "mailto:support@macksims.com?subject=" +
    encodeURIComponent("Rate PrimFit") +
    "&body=" +
    encodeURIComponent(
      "PrimFit is not on the App Store listing yet. Share what worked and what didn't.\n\nPlay (when live): " +
        play,
    );
}
