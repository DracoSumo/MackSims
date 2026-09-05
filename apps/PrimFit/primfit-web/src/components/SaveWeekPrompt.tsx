"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAccountHint, rememberEmail, skipAccountHint } from "@/lib/account";

const JUST_KEY = "primfit.justOnboarded";

export function markJustOnboarded() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(JUST_KEY, "1");
}

export function SaveWeekPrompt({ force }: { force?: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hint = getAccountHint();
    const just = typeof window !== "undefined" && sessionStorage.getItem(JUST_KEY) === "1";
    if (hint.skipped || hint.email) return;
    if (force || just) setOpen(true);
  }, [force]);

  if (!open) return null;

  function skip() {
    skipAccountHint();
    sessionStorage.removeItem(JUST_KEY);
    setOpen(false);
  }

  function save() {
    const next = email.trim();
    if (next) rememberEmail(next);
    else skipAccountHint();
    sessionStorage.removeItem(JUST_KEY);
    setOpen(false);
  }

  return (
    <section className="pf-system-card space-y-3 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-silver)]">Your week is live</p>
      <p className="text-sm text-[var(--pf-ink)]">
        Look around first. Email is optional and stays on this device for now — later it will restore your week on a
        new phone. No cloud account yet.
      </p>
      <label className="block text-sm">
        Email to remember (optional)
        <input
          className="pf-input mt-2"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <div className="flex gap-2">
        <button type="button" className="pf-btn-primary flex-1" onClick={save}>
          Save on this device
        </button>
        <button type="button" className="pf-btn-ghost flex-1" onClick={skip}>
          Skip
        </button>
      </div>
      <p className="text-xs text-[var(--pf-muted)]">
        Later you can attach trainers or nutritionists in{" "}
        <Link href="/app/pros/" className="pf-linkish">
          Pros
        </Link>
        . Not medical advice.
      </p>
    </section>
  );
}
