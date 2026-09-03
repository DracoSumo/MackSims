"use client";

import type { ReactNode } from "react";

export function ChoiceButton({
  selected,
  onClick,
  title,
  description,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`pf-choice pf-press ${selected ? "is-on" : ""} ${className}`}
    >
      <span className="pf-choice-mark" aria-hidden>
        {selected ? "✓" : ""}
      </span>
      <span className="pf-choice-body">
        {title ? <span className="pf-choice-title">{title}</span> : null}
        {description ? <span className="pf-choice-desc">{description}</span> : null}
        {children}
      </span>
    </button>
  );
}

export function ChoiceChip({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`pf-chip ${selected ? "pf-chip-active" : ""} ${className}`}
    >
      {selected ? (
        <span className="pf-chip-check" aria-hidden>
          ✓
        </span>
      ) : null}
      {children}
    </button>
  );
}
