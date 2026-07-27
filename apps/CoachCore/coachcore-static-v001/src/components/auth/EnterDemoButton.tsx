"use client";

import { localSet } from "@/lib/safeStorage";

const DEMO_KEY = "coachcore.continueDemoMode";

export function EnterDemoButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        localSet(DEMO_KEY, "1");
        window.location.href = "/app/";
      }}
    >
      Enter Demo Dashboard
    </button>
  );
}
