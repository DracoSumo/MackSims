"use client";

import Link from "next/link";
import { useState } from "react";
import { isSupabaseConfigured } from "@/config/backend";
import { enableDemoFixtures } from "@/config/demoFixtures";
import { coachCoreConfig } from "@/config/coachcore";

const DISMISS_KEY = "coachcore.demoWalkthroughDismissed";

export function DemoWalkthroughBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  if (dismissed) return null;

  const live = isSupabaseConfigured;

  return (
    <div
      className={`mx-5 mt-4 rounded-2xl border px-4 py-3 text-sm lg:mx-10 ${
        live
          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-50"
          : "border-amber-300/25 bg-amber-300/10 text-amber-50"
      }`}
      role="note"
    >
      <p className={`font-bold ${live ? "text-emerald-100" : "text-amber-100"}`}>
        {live ? "Live beta — connect your roster" : "Auth not configured on this deploy"}
      </p>
      <p className={`mt-1 leading-6 ${live ? "text-emerald-50/90" : "text-amber-50/90"}`}>
        {coachCoreConfig.hook}{" "}
        {enableDemoFixtures
          ? "Example roster fixtures are enabled for this build only."
          : live
            ? "Sign in from Profile to sync check-ins and coach actions. Empty states mean your team data is not imported yet — not fake athletes."
            : "Set Supabase env vars to enable sign-in. Roster screens stay empty until real team data is connected."}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href={live ? "/login" : "/beta"} className="font-bold text-sky-200 underline">
          {live ? "Sign in" : "Request beta access"}
        </Link>
        <button
          type="button"
          className={`font-bold underline ${live ? "text-emerald-100" : "text-amber-100"}`}
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
