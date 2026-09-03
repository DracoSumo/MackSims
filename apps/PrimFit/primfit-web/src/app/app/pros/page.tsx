"use client";

import { useEffect, useState } from "react";
import { ChoiceChip } from "@/components/ChoiceButton";
import { RequirePlan } from "@/components/RequirePlan";
import { SAMPLE_PROS } from "@/data/pros";
import type { IntroRequest, ProListing, ProType } from "@/data/types";
import { addIntroRequest, getProfile, listIntroRequests } from "@/lib/storage";

function ProsContent() {
  const [filter, setFilter] = useState<ProType | "all">("all");
  const [selected, setSelected] = useState<ProListing | null>(null);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<IntroRequest[]>([]);

  useEffect(() => {
    setHistory(listIntroRequests());
    const profile = getProfile();
    if (profile?.displayName) setNote(`Hi — I'm ${profile.displayName} and interested in working together.`);
  }, []);

  const filtered = SAMPLE_PROS.filter((p) => filter === "all" || p.type === filter);

  function submitIntro() {
    if (!selected || !email.trim()) return;
    const profile = getProfile();
    const req: IntroRequest = {
      id: `intro-${Date.now()}`,
      proId: selected.id,
      proName: selected.name,
      proType: selected.type,
      athleteName: profile?.displayName ?? "Athlete",
      athleteEmail: email.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    addIntroRequest(req);
    setHistory(listIntroRequests());
    setSent(true);
    setSelected(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Connect with a pro</h1>
        <p className="text-sm text-[var(--pf-muted)]">
          Request an intro — no payments or bookings in this version. Saved on this device.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "trainer", "nutritionist"] as const).map((f) => (
          <ChoiceChip key={f} selected={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f}
          </ChoiceChip>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="pf-card p-4 text-center text-sm text-[var(--pf-muted)]">
            No pros in this filter. Sample intros stay local — no payments.
          </li>
        ) : null}
        {filtered.map((pro) => (
          <li key={pro.id} className="pf-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{pro.name}</p>
                <p className="text-xs text-[var(--pf-silver)] capitalize">{pro.type} · {pro.location}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-[var(--pf-muted)]">{pro.bio}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {pro.specialties.map((s) => (
                <span key={s} className="pf-chip text-[10px]">
                  {s}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="pf-btn-primary mt-3 w-full text-sm"
              onClick={() => {
                setSelected(pro);
                setSent(false);
              }}
            >
              Request intro
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="pf-card w-full max-w-md space-y-4 p-5">
            <h2 className="text-lg font-semibold">Intro to {selected.name}</h2>
            <label className="block text-sm">
              Your email
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </label>
            <label className="block text-sm">
              Note
              <textarea
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <div className="flex gap-2">
              <button type="button" className="pf-btn-ghost flex-1" onClick={() => setSelected(null)}>
                Cancel
              </button>
              <button type="button" className="pf-btn-primary flex-1" onClick={submitIntro}>
                Save request
              </button>
            </div>
          </div>
        </div>
      )}

      {sent && (
        <p className="text-sm text-[var(--pf-silver)]">
          Request saved locally. A future version may email the pro when backend is connected.
        </p>
      )}

      {history.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-[var(--pf-muted)]">Your requests</h2>
          <ul className="space-y-2 text-sm">
            {history.slice(0, 5).map((h) => (
              <li key={h.id} className="pf-card p-3">
                {h.proName} · {new Date(h.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function ProsPage() {
  return (
    <RequirePlan>
      <ProsContent />
    </RequirePlan>
  );
}
