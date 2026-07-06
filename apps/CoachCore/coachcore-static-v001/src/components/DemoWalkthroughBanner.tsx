"use client";

import Link from "next/link";
import { useState } from "react";
import { coachCoreConfig } from "@/config/coachcore";

const DISMISS_KEY = "coachcore.demoWalkthroughDismissed";

export function DemoWalkthroughBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  if (dismissed) return null;

  return (
    <div
      className="mx-5 mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50 lg:mx-10"
      role="note"
    >
      <p className="font-bold text-amber-100">Demo walkthrough — not a signed-in coach account</p>
      <p className="mt-1 leading-6 text-amber-50/90">
        {coachCoreConfig.hook} This build uses mock athletes and local-only actions. Real auth, roster data, and
        notifications are not connected.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href="/beta" className="font-bold text-sky-200 underline">
          Request beta access
        </Link>
        <button
          type="button"
          className="font-bold text-amber-100 underline"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          Dismiss for this session
        </button>
      </div>
    </div>
  );
}
