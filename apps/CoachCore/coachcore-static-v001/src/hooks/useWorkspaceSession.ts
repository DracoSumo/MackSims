"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { localGet } from "@/lib/safeStorage";

export const DEMO_CONTINUE_KEY = "coachcore.continueDemoMode";

export type WorkspaceSession = {
  /** Signed in via Supabase, or explicitly entered the coach workspace (demo continue). */
  ready: boolean;
  signedIn: boolean;
  demoContinue: boolean;
  /** True once the coach is past the gate — hide tourist/filler chrome. */
  inWorkspace: boolean;
};

/**
 * After login (or Enter Demo Dashboard), the coach workspace should feel like a
 * product — not a walkthrough. Use `inWorkspace` to suppress filler banners.
 */
export function useWorkspaceSession(): WorkspaceSession {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [demoContinue, setDemoContinue] = useState(false);

  useEffect(() => {
    const demo = localGet(DEMO_CONTINUE_KEY) === "1";
    setDemoContinue(demo);

    void getCurrentUser()
      .then((user) => setSignedIn(Boolean(user)))
      .catch(() => setSignedIn(false))
      .finally(() => setReady(true));
  }, []);

  return {
    ready,
    signedIn,
    demoContinue,
    inWorkspace: signedIn || demoContinue,
  };
}
