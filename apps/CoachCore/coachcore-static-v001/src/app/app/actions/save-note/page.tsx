"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionPage } from "@/components/SectionPage";
import { mockGroups } from "@/data/mock";
import { useResolvedAthletes } from "@/hooks/useResolvedAthletes";
import { saveCoachNote } from "@/services/coachNoteStore";

const NOTE_TYPES = ["Check-in", "Film", "Workout", "Fueling", "Recovery", "Behavior", "Leadership"];

export default function SaveNotePage() {
  const { athletes, ready } = useResolvedAthletes();
  const attachOptions = useMemo(
    () => [...athletes.map((athlete) => athlete.name), ...mockGroups, "Full staff"],
    [athletes],
  );
  const [attachedTo, setAttachedTo] = useState("");
  const [noteType, setNoteType] = useState(NOTE_TYPES[0]);
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const timestamp = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    [saved],
  );

  useEffect(() => {
    if (!attachedTo && attachOptions[0]) {
      setAttachedTo(attachOptions[0]);
    }
  }, [attachOptions, attachedTo]);

  function handleSubmit() {
    if (!attachedTo) return;
    saveCoachNote({ attachedTo, noteType, body });
    setSaved(true);
  }

  if (!ready) {
    return (
      <SectionPage eyebrow="Coach notes" title="Save private coach note" description="Loading…">
        <p className="text-sm text-slate-400">Loading roster…</p>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      eyebrow="Coach notes"
      title="Save private coach note"
      description="Private note flow for athlete check-ins, team observations, and staff planning."
    >
      {athletes.length === 0 && (
        <div className="mb-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm text-slate-400">
          No roster yet — you can still save a staff note, or{" "}
          <Link href="/app/team/add" className="font-bold text-sky-300">
            add athletes
          </Link>{" "}
          to attach notes to names.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Attach note to</span>
              <select
                value={attachedTo}
                onChange={(e) => setAttachedTo(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300/60"
              >
                {attachOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Note type</span>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300/60"
              >
                {NOTE_TYPES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-200">Private note</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Needs check-in before next session. Missed film and low fueling completion."
                className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/60"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!attachedTo}
            className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-60"
          >
            {saved ? "Saved on this device" : "Save note"}
          </button>

          {saved ? (
            <div className="mt-5 rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Saved</p>
              <h3 className="mt-3 text-2xl font-black text-white">Coach note saved</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                {timestamp} · {noteType} note for {attachedTo} is on your coach timeline.
              </p>
              <button
                type="button"
                onClick={() => setSaved(false)}
                className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
              >
                Write another
              </button>
            </div>
          ) : (
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Saves privately on this device and your coach activity log.
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">On this device</p>
          <h2 className="mt-3 text-3xl font-black">Coach note saved locally</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/85">
            Notes appear on your live timeline. Cloud sync for notes ships after roster sync is wired.
          </p>
        </div>
      </div>
    </SectionPage>
  );
}
