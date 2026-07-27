"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { coachCoreConfig } from "@/config/coachcore";
import { useWorkspaceSession } from "@/hooks/useWorkspaceSession";
import { sessionGet, sessionSet } from "@/lib/safeStorage";

const DISMISS_KEY = "coachcore.demoWalkthroughDismissed";

/**
 * Tourist banner for visitors who land on /app without a workspace session.
 * Hidden after sign-in or Enter Demo Dashboard — no filler after login.
 */
export function DemoWalkthroughBanner() {
  const { ready, inWorkspace } = useWorkspaceSession();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionGet(DISMISS_KEY) === "1");
  }, []);

  if (!ready || inWorkspace || dismissed) return null;

  return (
    <div
      className="mx-5 mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50 lg:mx-10"
      role="note"
    >
      <p className="font-bold text-amber-100">Coach workspace preview</p>
      <p className="mt-1 leading-6 text-amber-50/90">
        {coachCoreConfig.hook} Sign in or continue from the login screen to work without this banner.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href="/login" className="font-bold text-sky-200 underline">
          Sign in
        </Link>
        <Link href="/beta" className="font-bold text-sky-200 underline">
          Request beta access
        </Link>
        <button
          type="button"
          className="font-bold text-amber-100 underline"
          onClick={() => {
            sessionSet(DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          Dismiss for this session
        </button>
      </div>
    </div>
  );
}
