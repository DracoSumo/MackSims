"use client";

import { useEffect, useState } from "react";
import { getCampaign } from "@/lib/campaign";

export function StreakPill() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const read = () => setStreak(getCampaign().streak);
    read();
    window.addEventListener("primfit-campaign", read);
    return () => window.removeEventListener("primfit-campaign", read);
  }, []);

  if (streak < 2) return null;
  return (
    <span className="pf-streak-pill" title={`${streak}-day chain`}>
      {streak}
    </span>
  );
}
