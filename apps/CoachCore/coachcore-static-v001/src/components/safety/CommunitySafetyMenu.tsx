"use client";

import { useId, useState } from "react";
import {
  REPORT_CATEGORIES,
  blockUser,
  isBlocked,
  submitReport,
  type ReportCategory,
} from "@/services/communitySafety";

export function CommunitySafetyMenu({
  targetType,
  targetId,
  targetLabel,
  authorId,
}: {
  targetType: "channel" | "message" | "user";
  targetId: string;
  targetLabel: string;
  authorId?: string;
}) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "report">("menu");
  const [category, setCategory] = useState<ReportCategory>("spam");
  const [details, setDetails] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [blockedNow, setBlockedNow] = useState(false);
  const blocked = blockedNow || (authorId ? isBlocked(authorId) : false);

  function handleBlock() {
    if (!authorId) return;
    blockUser(authorId);
    setBlockedNow(true);
    setNote("Profile blocked on this device. Their channels stay hidden for you.");
    window.dispatchEvent(new Event("coachcore:safety-changed"));
    setOpen(false);
  }

  function handleReport() {
    const result = submitReport({
      targetType,
      targetId,
      targetLabel,
      category,
      details,
    });
    setNote(
      result.deduped
        ? "Already reported recently — thank you."
        : "Report queued for operator review. Reporter identity stays private.",
    );
    setDetails("");
    setMode("menu");
    setOpen(false);
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="rounded-lg border border-white/15 px-2 py-1 text-xs font-bold text-slate-200 hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((v) => !v);
          setMode("menu");
        }}
      >
        Safety
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-white/15 bg-slate-950/95 p-3 shadow-xl"
        >
          {mode === "menu" ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Keep team spaces respectful.</p>
              <button
                type="button"
                role="menuitem"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => setMode("report")}
              >
                Report
              </button>
              {authorId ? (
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                  onClick={handleBlock}
                  disabled={blocked}
                >
                  {blocked ? "Blocked" : "Block author"}
                </button>
              ) : null}
              <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs text-slate-300">
                Category
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-2 py-1.5 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                >
                  {REPORT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-slate-300">
                Details
                <textarea
                  className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-2 py-1.5 text-sm"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  maxLength={1000}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-sky-500/90 px-3 py-1.5 text-xs font-bold text-white"
                  onClick={handleReport}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400"
                  onClick={() => setMode("menu")}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {note ? <p className="mt-2 text-xs text-emerald-300">{note}</p> : null}
    </div>
  );
}
