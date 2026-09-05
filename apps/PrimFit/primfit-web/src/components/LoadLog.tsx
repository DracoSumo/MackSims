"use client";

import { useState } from "react";
import type { MovementCategory, WeightUnit } from "@/data/types";
import { ChoiceChip } from "@/components/ChoiceButton";
import {
  applyLoadToGoals,
  fireMilestone,
  formatLoad,
  getLoadLog,
  loadLogKey,
  loadTakesWeight,
  saveLoadLog,
  type LoadKind,
} from "@/lib/loadLog";

const KINDS: { id: LoadKind; label: string }[] = [
  { id: "weight", label: "Weight" },
  { id: "band", label: "Band" },
  { id: "bodyweight", label: "Bodyweight" },
  { id: "other", label: "Other" },
];

function lastLine(updatedAt: string): string {
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function LoadLog({
  category,
  name,
  place,
}: {
  category: MovementCategory;
  name: string;
  place?: string;
}) {
  const key = loadLogKey(category, name);
  const last = getLoadLog(key);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<LoadKind>(last?.kind ?? "weight");
  const [load, setLoad] = useState(last?.load != null ? String(last.load) : "");
  const [unit, setUnit] = useState<WeightUnit>(last?.unit ?? "lb");
  const [band, setBand] = useState(last?.band ?? "");
  const [note, setNote] = useState(last?.note ?? "");
  const [saved, setSaved] = useState(false);

  if (!loadTakesWeight(category)) return null;

  function persist() {
    const parsed = Number.parseFloat(load);
    const entry = saveLoadLog({
      key,
      kind,
      load: kind === "weight" && Number.isFinite(parsed) ? parsed : undefined,
      unit,
      band: kind === "band" ? band.trim() || undefined : undefined,
      note: note.trim() || undefined,
      place: place?.trim() || last?.place,
      updatedAt: new Date().toISOString(),
    });
    const hit = applyLoadToGoals(entry, name, category);
    if (hit) fireMilestone(hit);
    setSaved(true);
    setOpen(false);
    window.setTimeout(() => setSaved(false), 1600);
  }

  const current = getLoadLog(key) ?? last;

  return (
    <div className="pf-load-log">
      {current ? (
        <p className="text-[11px] text-[var(--pf-silver)]">
          Last time: {formatLoad(current)}
          {current.place ? ` · ${current.place}` : ""}
          {current.updatedAt ? ` · ${lastLine(current.updatedAt)}` : ""}
        </p>
      ) : (
        <p className="text-[11px] text-[var(--pf-muted)]">Log what you used — weight, band, or machine — so next time you remember.</p>
      )}
      {open ? (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <ChoiceChip key={k.id} selected={kind === k.id} onClick={() => setKind(k.id)}>
                {k.label}
              </ChoiceChip>
            ))}
          </div>
          {kind === "weight" ? (
            <div className="flex gap-2">
              <input
                className="pf-input min-w-0 flex-1"
                inputMode="decimal"
                placeholder="135"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                aria-label="Load"
              />
              <ChoiceChip selected={unit === "lb"} onClick={() => setUnit("lb")}>
                lb
              </ChoiceChip>
              <ChoiceChip selected={unit === "kg"} onClick={() => setUnit("kg")}>
                kg
              </ChoiceChip>
            </div>
          ) : null}
          {kind === "band" ? (
            <input
              className="pf-input w-full"
              placeholder="Red band, green loop…"
              value={band}
              onChange={(e) => setBand(e.target.value)}
            />
          ) : null}
          {kind === "other" || kind === "weight" ? (
            <input
              className="pf-input w-full"
              placeholder="Machine, kettlebell, note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          ) : null}
          <button type="button" className="pf-btn-primary w-full text-sm" onClick={persist}>
            Save for next time
          </button>
        </div>
      ) : (
        <button type="button" className="pf-linkish px-0 text-xs" onClick={() => setOpen(true)}>
          {current ? "Update load" : "Log load"}
        </button>
      )}
      {saved ? <p className="text-[11px] text-[var(--pf-purple-bright)]">Saved on this device.</p> : null}
    </div>
  );
}
