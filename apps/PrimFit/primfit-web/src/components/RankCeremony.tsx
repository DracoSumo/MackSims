"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { FlavorEvent } from "@/lib/campaign";
import type { MilestoneHit } from "@/lib/loadLog";
import { ceremonyCopy, milestoneCopy } from "@/lib/world";

type Ceremony =
  | { kind: "rank"; event: FlavorEvent }
  | { kind: "milestone"; hit: MilestoneHit };

export function RankCeremony() {
  const { theme } = useTheme();
  const [show, setShow] = useState<Ceremony | null>(null);

  useEffect(() => {
    const onRank = (raw: Event) => {
      const detail = (raw as CustomEvent<FlavorEvent>).detail;
      if (detail?.rankedUp) setShow({ kind: "rank", event: detail });
    };
    const onMilestone = (raw: Event) => {
      const hit = (raw as CustomEvent<MilestoneHit>).detail;
      if (hit?.label) setShow({ kind: "milestone", hit });
    };
    window.addEventListener("primfit-rankup", onRank);
    window.addEventListener("primfit-milestone", onMilestone);
    return () => {
      window.removeEventListener("primfit-rankup", onRank);
      window.removeEventListener("primfit-milestone", onMilestone);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setShow(null), 4200);
    return () => window.clearTimeout(t);
  }, [show]);

  if (!show) return null;
  const copy =
    show.kind === "rank"
      ? ceremonyCopy(theme, show.event.rank.label)
      : milestoneCopy(theme, { label: show.hit.label, cleared: show.hit.cleared });

  return (
    <button
      type="button"
      className={`pf-rank-ceremony ${show.kind === "milestone" ? "is-milestone" : ""} ${show.kind === "milestone" && show.hit.cleared ? "is-clear" : ""}`}
      onClick={() => setShow(null)}
    >
      <p className="pf-rank-ceremony-kicker">{copy.kicker}</p>
      <p className="pf-display pf-rank-ceremony-title">{copy.title}</p>
      <p className="pf-rank-ceremony-body">{copy.body}</p>
      <p className="text-xs text-[var(--pf-muted)]">Tap to close</p>
    </button>
  );
}
