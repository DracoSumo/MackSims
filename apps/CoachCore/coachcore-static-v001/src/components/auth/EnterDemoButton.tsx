"use client";

import { DEMO_CONTINUE_KEY } from "@/hooks/useWorkspaceSession";
import { localSet } from "@/lib/safeStorage";

export function EnterDemoButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        localSet(DEMO_CONTINUE_KEY, "1");
        window.location.href = "/app/";
      }}
    >
      Enter coach workspace
    </button>
  );
}
