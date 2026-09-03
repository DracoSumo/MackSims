"use client";

import { hapticTap } from "@/lib/device";

export function CheckOff({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`pf-check pf-press ${checked ? "is-on" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        void hapticTap();
        onToggle();
      }}
    >
      {checked ? (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M2.5 7.2 5.6 10.2 11.5 3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}
