"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { primfitConfig } from "@/config/primfit";
import { buildWeekPlan } from "@/lib/planEngine";
import { getProfile, getWeekPlan, saveWeekPlan } from "@/lib/storage";

export function RequirePlan({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile?.onboardedAt) {
      setNeedsOnboarding(true);
      router.replace("/app/onboarding/");
      return;
    }
    const plan = getWeekPlan();
    if (!plan || plan.engineVersion !== primfitConfig.version) {
      saveWeekPlan(buildWeekPlan(profile));
    }
    setReady(true);
  }, [router]);

  if (needsOnboarding) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-sm text-[var(--pf-muted)]">No plan on this device yet.</p>
        <p className="text-sm text-[var(--pf-silver)]">
          Choose your lane once — about a minute — then Today unlocks.
        </p>
        <Link href="/app/onboarding/" className="pf-btn-primary inline-flex">
          Choose my lane
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="py-12 text-center text-sm text-[var(--pf-muted)]">Loading your plan…</div>
    );
  }

  return <>{children}</>;
}
