"use client";

import type { EquipmentId, FoodStapleId, TrainingLocationMode } from "@/data/types";
import {
  EQUIPMENT_OPTIONS,
  FOOD_STAPLES,
  LOCATION_MODES,
} from "@/data/options";
import { ChoiceButton, ChoiceChip } from "@/components/ChoiceButton";

export function ChecklistToggle<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { id: T; label: string; group?: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  function toggle(id: T) {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  }

  const groups = Array.from(new Set(options.map((o) => o.group ?? "")));

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group || "all"}>
          {group ? (
            <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--pf-muted)]">{group}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {options
              .filter((o) => (o.group ?? "") === group)
              .map((o) => (
                <ChoiceChip key={o.id} selected={selected.includes(o.id)} onClick={() => toggle(o.id)}>
                  {o.label}
                </ChoiceChip>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EquipmentEditor({
  value,
  onChange,
}: {
  value: EquipmentId[];
  onChange: (v: EquipmentId[]) => void;
}) {
  function guarded(next: EquipmentId[]) {
    onChange(next.length ? next : ["bodyweight"]);
  }
  return (
    <ChecklistToggle options={EQUIPMENT_OPTIONS} selected={value} onChange={guarded} />
  );
}

export function FoodInventoryEditor({
  value,
  onChange,
}: {
  value: FoodStapleId[];
  onChange: (v: FoodStapleId[]) => void;
}) {
  return <ChecklistToggle options={FOOD_STAPLES} selected={value} onChange={onChange} />;
}

export function LocationModeEditor({
  mode,
  onModeChange,
  placeLabel,
  onPlaceLabelChange,
  onRequestGeo,
  geoStatus,
}: {
  mode: TrainingLocationMode;
  onModeChange: (m: TrainingLocationMode) => void;
  placeLabel: string;
  onPlaceLabelChange: (s: string) => void;
  onRequestGeo?: () => void;
  geoStatus?: string;
}) {
  return (
    <div className="space-y-3">
      {LOCATION_MODES.map((m) => (
        <ChoiceButton
          key={m.id}
          selected={mode === m.id}
          onClick={() => onModeChange(m.id)}
          title={m.label}
          description={m.description}
        />
      ))}
      {mode === "commercial-gym" ? (
        <p className="text-xs text-[var(--pf-silver)]">
          Gym adds the full floor to your gear list.
        </p>
      ) : null}
      {mode === "travel-hotel" || mode === "outdoor" ? (
        <p className="text-xs text-[var(--pf-silver)]">
          {mode === "outdoor" ? "Outdoor" : "Travel"} keeps bodyweight in the plan so sessions stay doable.
        </p>
      ) : null}
      <label className="block text-sm">
        Optional place name
        <input
          className="pf-input mt-2"
          placeholder="Home garage, LA Fitness, hotel gym…"
          value={placeLabel}
          onChange={(e) => onPlaceLabelChange(e.target.value)}
        />
      </label>
      {onRequestGeo ? (
        <button type="button" className="pf-btn-ghost w-full text-sm" onClick={onRequestGeo}>
        Use this device location
      </button>
      ) : null}
      {geoStatus ? <p className="text-xs text-[var(--pf-muted)]">{geoStatus}</p> : null}
    </div>
  );
}
