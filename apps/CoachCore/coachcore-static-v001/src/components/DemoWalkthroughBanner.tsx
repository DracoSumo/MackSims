"use client";

import Link from "next/link";
import { useState } from "react";
import { isSupabaseConfigured } from "@/config/backend";
import { enableDemoFixtures } from "@/config/demoFixtures";
import { coachCoreConfig } from "@/config/coachcore";

const DISMISS_KEY = "coachcore.demoWalkthroughDismissed";

export function DemoWalkthroughBanner({ embedded = false }: { embedded?: boolean }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  if (dismissed) return null;

  const live = isSupabaseConfigured;

  return (
    <details
      className={`${embedded ? "h-full" : "mx-4 mt-4 sm:mx-5 lg:mx-10"} group rounded-[12px] border text-sm ${
        live
          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-50"
          : "border-amber-300/25 bg-amber-300/10 text-amber-50"
      }`}
    >
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-200 [&::-webkit-details-marker]:hidden">
        <span className={`min-w-0 font-bold ${live ? "text-emerald-100" : "text-amber-100"}`}>
          {live ? "Live beta" : "Setup needed"}
          <span className="ml-2 font-normal text-white/75">
            {enableDemoFixtures ? "Example roster" : live ? "Roster not connected" : "Local-only mode"}
          </span>
          <span className="block text-xs font-normal leading-5 text-white/75">
            No real youth or health records in this build
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold text-sky-200 group-open:hidden">Details +</span>
        <span className="hidden shrink-0 text-xs font-bold text-sky-200 group-open:inline">Close −</span>
      </summary>

      <div className="border-t border-white/10 px-4 pb-3 pt-2">
        <p className={`leading-5 ${live ? "text-emerald-50/90" : "text-amber-50/90"}`}>
          {coachCoreConfig.hook}{" "}
          {enableDemoFixtures
            ? "Example roster fixtures are enabled for this build only."
            : live
              ? "Sign in from Profile to sync check-ins and coach actions. Empty states mean your team data is not imported yet — not fake athletes."
              : "Set Supabase env vars to enable sign-in. Roster screens stay empty until real team data is connected."}
        </p>
        <p className="mt-2 rounded-xl border border-white/15 bg-slate-950/35 px-3 py-2 text-xs leading-5 text-white/95">
          <span className="font-bold">Youth / health scope:</span>{" "}
          <span className="font-normal">{coachCoreConfig.privacyScope}</span>
        </p>
        <p className="mt-2 text-xs leading-5 text-white/80">
          {coachCoreConfig.coachingSupportDisclaimer}{" "}
          <Link href="/privacy" className="font-bold text-sky-200 underline">
            Privacy details
          </Link>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <Link
            href={live ? "/login" : "/beta"}
            className="inline-flex min-h-11 items-center font-bold text-sky-200 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            {live ? "Sign in" : "Request beta access"}
          </Link>
          <button
            type="button"
            className={`min-h-11 font-bold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
              live ? "text-emerald-100" : "text-amber-100"
            }`}
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, "1");
              setDismissed(true);
            }}
          >
            Dismiss for this session
          </button>
        </div>
      </div>
    </details>
  );
}
