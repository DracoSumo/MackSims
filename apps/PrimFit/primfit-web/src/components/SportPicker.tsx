"use client";

import { useMemo, useState } from "react";
import type { SportId } from "@/data/types";
import { SPORT_GROUPS, SPORTS, filterSports } from "@/data/options";
import { ChoiceButton, ChoiceChip } from "@/components/ChoiceButton";

export function SportPicker({
  value,
  onChange,
}: {
  value: SportId;
  onChange: (id: SportId) => void;
}) {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const list = useMemo(() => {
    let sports = filterSports(query);
    if (groupFilter !== "all") {
      sports = sports.filter((s) => s.group === groupFilter);
    }
    return sports;
  }, [query, groupFilter]);

  return (
    <div className="space-y-3">
      <input
        className="pf-input"
        placeholder="Search sports (e.g. badminton, strongman)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search sports"
      />
      <div className="flex flex-wrap gap-2">
        <ChoiceChip selected={groupFilter === "all"} onClick={() => setGroupFilter("all")}>
          All
        </ChoiceChip>
        {SPORT_GROUPS.map((g) => (
          <ChoiceChip
            key={g.id}
            selected={groupFilter === g.id}
            onClick={() => setGroupFilter(g.id)}
          >
            {g.label}
          </ChoiceChip>
        ))}
      </div>
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {SPORT_GROUPS.filter((g) => groupFilter === "all" || groupFilter === g.id).map((g) => {
          const items = list.filter((s) => s.group === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-silver)]">
                {g.label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {items.map((s) => (
                  <ChoiceButton
                    key={s.id}
                    selected={value === s.id}
                    onClick={() => onChange(s.id)}
                    title={`${s.emoji} ${s.label}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-[var(--pf-muted)]">No sports match that search.</p>
        )}
      </div>
      <p className="text-xs text-[var(--pf-muted)]">
        {SPORTS.length} sports · selected:{" "}
        <span className="text-[var(--pf-purple-bright)]">
          {SPORTS.find((s) => s.id === value)?.label}
        </span>
      </p>
    </div>
  );
}
