"use client";

export function ProgressRing({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label?: string;
}) {
  const pct = total > 0 ? Math.min(1, done / total) : 0;
  const r = 28;
  const c = 2 * Math.PI * r;
  const complete = total > 0 && done >= total;
  const pctLabel = Math.round(pct * 100);
  return (
    <div className={`space-y-3 ${complete ? "pf-complete-pulse" : ""}`}>
      <div className="flex items-center gap-4">
        <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden>
          <circle cx="38" cy="38" r={r} fill="none" stroke="var(--pf-line)" strokeWidth="7" />
          <circle
            cx="38"
            cy="38"
            r={r}
            fill="none"
            stroke={complete ? "var(--pf-silver)" : "var(--pf-purple-bright)"}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            transform="rotate(-90 38 38)"
            style={{ transition: "stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          <text x="38" y="36" textAnchor="middle" fontSize="14" fill="var(--pf-ink)" fontWeight="700">
            {done}/{total}
          </text>
          <text x="38" y="50" textAnchor="middle" fontSize="9" fill="var(--pf-silver)">
            {pctLabel}%
          </text>
        </svg>
        <div>
          <p className="text-base font-semibold">{label ?? (complete ? "Today is done" : `${done} of ${total} checked`)}</p>
          <p className="text-sm text-[var(--pf-muted)]">
            {complete ? "Nice work — recover and eat." : "Session first, then meals."}
          </p>
        </div>
      </div>
      <div
        className="pf-bar mt-0"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Today progress"
      >
        <div className="pf-bar-fill" style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}
