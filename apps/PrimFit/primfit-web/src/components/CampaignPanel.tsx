"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getCampaign, getPlayClass, rankFor, setPlayClass } from "@/lib/campaign";
import { dailyMission, playClasses } from "@/lib/flavor";
import { classPerkLine } from "@/lib/world";

export function CampaignPanel({
  focus,
  isRest,
}: {
  focus: string;
  isRest: boolean;
}) {
  const { theme, copy } = useTheme();
  const [xp, setXp] = useState(0);
  const [classId, setClassId] = useState<string | null>(null);

  function hydrate() {
    const c = getCampaign();
    setXp(c.xp);
    setClassId(c.classByTheme[theme] ?? null);
  }

  useEffect(() => {
    hydrate();
    const onAward = () => hydrate();
    window.addEventListener("primfit-campaign", onAward);
    return () => window.removeEventListener("primfit-campaign", onAward);
  }, [theme]);

  const rank = rankFor(theme, xp);
  const classes = playClasses(theme);
  const current = getPlayClass(theme);
  const showClasses = theme !== "sleek";

  return (
    <section className="pf-system-card space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">
            {copy.worldTag}
          </p>
          <h2 className="pf-display text-lg font-semibold">{rank.label}</h2>
          {current ? (
            <p className="text-xs text-[var(--pf-muted)]">{current.label}</p>
          ) : showClasses ? (
            <p className="text-xs text-[var(--pf-muted)]">Pick a class — flavor only.</p>
          ) : (
            <p className="text-xs text-[var(--pf-muted)]">{xp} XP</p>
          )}
        </div>
        <p className="shrink-0 text-right text-xs tabular-nums text-[var(--pf-silver)]">
          {xp} XP
          {rank.nextLabel ? (
            <>
              <br />
              {rank.xpNeed - rank.xpInto} to {rank.nextLabel}
            </>
          ) : null}
        </p>
      </div>
      <div className="pf-bar" role="progressbar" aria-valuenow={Math.round(rank.progress * 100)} aria-label="Rank progress">
        <div className="pf-bar-fill" style={{ width: `${rank.progress * 100}%` }} />
      </div>
      <p className="text-sm text-[var(--pf-silver)]">{dailyMission(theme, focus, isRest)}</p>
      {showClasses ? (
        <div className="flex flex-wrap gap-2">
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pf-chip ${classId === c.id ? "pf-chip-active" : ""}`}
              onClick={() => {
                setPlayClass(theme, c.id);
                setClassId(c.id);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}
      {showClasses && classId ? (
        <p className="text-xs text-[var(--pf-muted)]">
          {classes.find((c) => c.id === classId)?.blurb}
          {classPerkLine(theme, classId) ? ` ${classPerkLine(theme, classId)}` : ""}
        </p>
      ) : null}
    </section>
  );
}
