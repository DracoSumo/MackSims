"use client";

import { useEffect, useMemo, useState } from "react";

export function ConfettiBurst({ play }: { play: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: 4 + ((i * 13) % 92),
        delay: (i % 8) * 0.04,
        dur: 0.9 + (i % 5) * 0.08,
        color: i % 3 === 0 ? "var(--pf-purple-bright)" : i % 3 === 1 ? "var(--pf-silver)" : "var(--pf-ink)",
      })),
    [],
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!play) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(t);
  }, [play]);

  if (!visible) return null;

  return (
    <div className="pf-confetti" aria-hidden>
      {bits.map((b) => (
        <i
          key={b.id}
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            background: b.color,
          }}
        />
      ))}
    </div>
  );
}
