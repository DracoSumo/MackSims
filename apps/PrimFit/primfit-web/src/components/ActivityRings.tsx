"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { RingScores } from "@/lib/wearables";

function Ring({
  pct,
  r,
  color,
  size,
  stroke,
}: {
  pct: number;
  r: number;
  color: string;
  size: number;
  stroke: number;
}) {
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <circle
      cx={mid}
      cy={mid}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeDasharray={c}
      strokeDashoffset={c * (1 - Math.max(0.02, Math.min(1, pct)))}
      transform={`rotate(-90 ${mid} ${mid})`}
      style={{ transition: "stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1)" }}
    />
  );
}

export function ActivityRings({
  scores,
  compact,
}: {
  scores: RingScores;
  compact?: boolean;
}) {
  const { copy } = useTheme();
  const size = compact ? 72 : 128;
  const stroke = compact ? 6 : 8;
  const gap = compact ? 8 : 11;
  const outer = size / 2 - stroke;
  const mid = outer - gap;
  const inner = mid - gap;
  const items = [
    { key: "train", label: copy.rings.train, pct: scores.train, color: "var(--pf-ring-train)" },
    { key: "move", label: copy.rings.move, pct: scores.move, color: "var(--pf-ring-move)" },
    { key: "recover", label: copy.rings.recover, pct: scores.recover, color: "var(--pf-ring-recover)" },
  ];

  return (
    <div className={`flex items-center ${compact ? "gap-3" : "gap-5"}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {items.map((item, i) => {
          const r = i === 0 ? outer : i === 1 ? mid : inner;
          return (
            <g key={item.key}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="var(--pf-line)"
                strokeWidth={stroke}
                opacity={0.45}
              />
              <Ring pct={item.pct} r={r} color={item.color} size={size} stroke={stroke} />
            </g>
          );
        })}
      </svg>
      <ul className={compact ? "space-y-1" : "space-y-2"}>
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            <span className="font-semibold">{item.label}</span>
            <span className="text-[var(--pf-muted)]">{Math.round(item.pct * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
