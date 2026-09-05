"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getCampaign, missedDays } from "@/lib/campaign";
import {
  dailyEvent,
  dateKey,
  formatWindowClock,
  missedLine,
  msUntilMidnight,
  rivalLine,
  streakLine,
  windowLabel,
} from "@/lib/world";

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function WorldPulse() {
  const { theme } = useTheme();
  const [ms, setMs] = useState(msUntilMidnight);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [gone, setGone] = useState(0);
  const [lastOpen, setLastOpen] = useState<string | null>(null);

  function hydrate() {
    const c = getCampaign();
    setStreak(c.streak);
    setBest(c.bestStreak);
    setLastOpen(c.lastOpen);
    setGone(missedDays());
  }

  useEffect(() => {
    hydrate();
    const onAward = () => hydrate();
    window.addEventListener("primfit-campaign", onAward);
    const t = window.setInterval(() => setMs(msUntilMidnight()), 1000);
    return () => {
      window.removeEventListener("primfit-campaign", onAward);
      window.clearInterval(t);
    };
  }, [theme]);

  const event = dailyEvent(theme);
  const urgent = ms < 3 * 60 * 60 * 1000;
  const claimedToday = lastOpen === dateKey();
  const yesterday = dailyEvent(theme, yesterdayKey());
  const missed = gone > 0 ? missedLine(theme, gone, yesterday) : null;

  return (
    <section className={`pf-world-pulse ${urgent ? "is-urgent" : ""}`}>
      <p className="pf-world-kicker">{claimedToday ? "LIVE EVENT" : "UNCLAIMED"}</p>
      <h2 className="pf-display text-base font-semibold leading-snug">{event.title}</h2>
      <p className="mt-1 text-sm text-[var(--pf-silver)]">{event.body}</p>
      <div className="pf-world-meta">
        <span>{streakLine(theme, streak, best)}</span>
        <span className={`pf-world-clock ${urgent ? "is-urgent" : ""}`}>
          {windowLabel(theme, urgent)} {formatWindowClock(ms)}
        </span>
      </div>
      {missed ? <p className="pf-world-missed">{missed}</p> : null}
      <p className="pf-world-rival">{rivalLine(theme)}</p>
    </section>
  );
}
