"use client";

import { useEffect, useMemo, useState } from "react";

export function ConfettiBurst({ play }: { play: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 17) % 84),
        delay: (i % 6) * 0.05,
        color: i % 2 === 0 ? "#a78bfa" : "#c0c0cc",
      })),
    [],
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!play) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1400);
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
            background: b.color,
          }}
        />
      ))}
    </div>
  );
}
