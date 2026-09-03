"use client";

import { useEffect, useMemo, useState } from "react";
import { RequirePlan } from "@/components/RequirePlan";
import { useTheme } from "@/components/ThemeProvider";
import { ChoiceChip } from "@/components/ChoiceButton";
import { CheckOff } from "@/components/CheckOff";
import type { BudgetId, GroceryItem, GroceryKind, UserProfile } from "@/data/types";
import { BUDGETS } from "@/data/options";
import { buildGroceryList, groceryScienceBlurb, mealsFromInventory } from "@/lib/grocery";
import { buildWeekPlan } from "@/lib/planEngine";
import { getGroceryChecked, getProfile, getWeekPlan, saveProfile, saveWeekPlan, setGroceryChecked } from "@/lib/storage";

const CATEGORY_LABEL: Record<GroceryItem["category"], string> = {
  produce: "Produce",
  protein: "Protein",
  dairy: "Dairy",
  pantry: "Pantry",
  other: "Other",
};

const KIND_CHIPS: { id: GroceryKind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "need", label: "Buy" },
  { id: "have", label: "In pantry" },
  { id: "swap", label: "Swaps" },
  { id: "extra", label: "Extra" },
];

function kindOf(item: GroceryItem): GroceryKind {
  return item.kind ?? "need";
}

function GroceryContent() {
  const { copy } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [kindFilter, setKindFilter] = useState<GroceryKind | "all">("all");
  const [query, setQuery] = useState("");
  const [showMeals, setShowMeals] = useState(false);

  function hydrate(nextProfile: UserProfile) {
    const plan = getWeekPlan();
    const grocery = plan?.grocery?.length ? plan.grocery : buildGroceryList(nextProfile, plan?.days ?? []);
    setProfile(nextProfile);
    setItems(grocery);
    setChecked(getGroceryChecked());
  }

  useEffect(() => {
    const p = getProfile();
    if (p) hydrate(p);
  }, []);

  function toggle(id: string) {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
    setGroceryChecked(next);
  }

  function applyBudget(nextBudget: BudgetId) {
    if (!profile) return;
    const nextProfile = { ...profile, budget: nextBudget };
    saveProfile(nextProfile);
    const plan = getWeekPlan();
    if (plan) {
      const rebuilt = buildWeekPlan(nextProfile);
      saveWeekPlan({ ...rebuilt, id: plan.id });
      setItems(rebuilt.grocery);
    } else {
      setItems(buildGroceryList(nextProfile, []));
    }
    setProfile(nextProfile);
  }

  const buyCount = items.filter((i) => kindOf(i) !== "have").length;
  const haveCount = items.filter((i) => kindOf(i) === "have").length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (kindFilter !== "all" && kindOf(i) !== kindFilter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        (i.note ?? "").toLowerCase().includes(q) ||
        (i.swapFor ?? "").toLowerCase().includes(q) ||
        CATEGORY_LABEL[i.category].toLowerCase().includes(q)
      );
    });
  }, [items, kindFilter, query]);

  const byCategory = visible.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, GroceryItem[]>,
  );

  const meals = profile ? mealsFromInventory(profile) : [];
  const plan = typeof window !== "undefined" ? getWeekPlan() : null;

  if (!profile) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="pf-display text-2xl font-bold">{copy.nav.grocery}</h1>
        <p className="text-sm text-[var(--pf-muted)]">Your grocery list appears after you choose a lane.</p>
        <a href="/app/onboarding/" className="pf-btn-primary inline-flex">
          Choose my lane
        </a>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="space-y-4 py-8 text-center">
        <h1 className="pf-display text-2xl font-bold">{copy.nav.grocery}</h1>
        <p className="text-sm text-[var(--pf-muted)]">
          No items yet. Rebuild the week from You, or check pantry defaults after onboarding.
        </p>
        <a href="/app/profile/" className="pf-btn-primary inline-flex">
          Open You
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="pf-display text-3xl font-bold">{copy.nav.grocery}</h1>
        <p className="mt-1 text-sm text-[var(--pf-muted)]">
          {buyCount} to buy · {haveCount} in pantry · {checked.size} checked
        </p>
      </div>

      <input
        className="pf-input"
        placeholder="Search the list…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search grocery list"
      />

      {profile ? (
        <section className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">Budget</p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <ChoiceChip key={b.id} selected={profile.budget === b.id} onClick={() => applyBudget(b.id)}>
                {b.label}
              </ChoiceChip>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {KIND_CHIPS.map((k) => (
          <ChoiceChip key={k.id} selected={kindFilter === k.id} onClick={() => setKindFilter(k.id)}>
            {k.label}
          </ChoiceChip>
        ))}
      </div>

      {plan && profile ? (
        <p className="text-xs text-[var(--pf-muted)]">{groceryScienceBlurb(profile, plan.days)}</p>
      ) : null}

      <button type="button" className="pf-linkish px-0" onClick={() => setShowMeals((v) => !v)}>
        {showMeals ? "Hide meal ideas" : "Cook from what’s in the kitchen"}
      </button>
      {showMeals ? (
        <div className="space-y-3">
          {meals.map((m) => (
            <article key={m.name} className="pf-board-card">
              <p className="font-semibold">{m.name}</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--pf-silver)]">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--pf-muted)]">{m.note}</p>
            </article>
          ))}
        </div>
      ) : null}

      {(Object.keys(byCategory) as GroceryItem["category"][]).map((cat) => (
        <section key={cat}>
          <h2 className="pf-sticky-cat">{CATEGORY_LABEL[cat]}</h2>
          <ul className="space-y-2">
            {byCategory[cat].map((item) => {
              const pantry = kindOf(item) === "have";
              return (
                <li key={item.id} className={`pf-board-card ${checked.has(item.id) ? "is-done" : ""}`}>
                  <div className="flex items-start gap-3">
                    <CheckOff
                      checked={checked.has(item.id)}
                      onToggle={() => toggle(item.id)}
                      label={`${checked.has(item.id) ? "Uncheck" : "Check"} ${item.name}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="block font-semibold">{item.name}</span>
                        <span className="rounded-full border border-[var(--pf-line)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--pf-muted)]">
                          {pantry ? "In pantry" : "Buy"}
                        </span>
                      </span>
                      {item.quantity ? (
                        <span className="mt-1 block text-xs text-[var(--pf-silver)]">{item.quantity}</span>
                      ) : null}
                      {item.swapFor ? (
                        <span className="mt-1 block text-xs text-[var(--pf-muted)]">Cheaper swap for {item.swapFor}</span>
                      ) : null}
                      {item.note ? <span className="mt-1 block text-xs text-[var(--pf-muted)]">{item.note}</span> : null}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {visible.length === 0 && items.length > 0 ? (
        <p className="text-sm text-[var(--pf-muted)]">Nothing matches that search.</p>
      ) : null}

      {items.length === 0 && (
        <p className="text-sm text-[var(--pf-muted)]">Finish setup to generate your list.</p>
      )}
    </div>
  );
}

export default function GroceryPage() {
  return (
    <RequirePlan>
      <GroceryContent />
    </RequirePlan>
  );
}
