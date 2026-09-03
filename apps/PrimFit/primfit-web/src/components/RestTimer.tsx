"use client";

import { useEffect, useRef, useState } from "react";
import { acquireAwake, cancelRestDone, hapticSuccess, releaseAwake, scheduleRestDone } from "@/lib/device";

function formatRest(seconds: number) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RestTimer({ seconds }: { seconds: number }) {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(seconds);
  const leftRef = useRef(seconds);

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
    leftRef.current = seconds;
  }, [seconds]);

  useEffect(() => {
    leftRef.current = left;
  }, [left]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      void hapticSuccess();
      return;
    }
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left]);

  useEffect(() => {
    if (!running) {
      void releaseAwake();
      void cancelRestDone();
      return;
    }
    void acquireAwake();
    void scheduleRestDone(leftRef.current);
    return () => {
      void releaseAwake();
      void cancelRestDone();
    };
  }, [running]);

  if (!seconds) return null;

  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = seconds > 0 ? Math.min(1, left / seconds) : 0;
  const done = left === 0 && !running;

  if (!running && !done) {
    return (
      <div className="pf-rest">
        <button
          type="button"
          className="pf-linkish"
          onClick={() => {
            setLeft(seconds);
            setRunning(true);
          }}
        >
          Rest {formatRest(seconds)}
        </button>
      </div>
    );
  }

  return (
    <div className="pf-rest">
      <div className={`pf-rest-panel ${done ? "pf-rest-done" : ""}`}>
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
          <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(192,192,204,0.2)" strokeWidth="4" />
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke={done ? "var(--pf-silver)" : "var(--pf-purple-bright)"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            transform="rotate(-90 22 22)"
            style={{ transition: "stroke-dashoffset 0.35s linear" }}
          />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tabular-nums leading-none">
            {done ? "Go" : formatRest(left)}
          </p>
          <p className="mt-1 text-xs text-[var(--pf-muted)]">
            {done ? "Rest done — next set. Screen can sleep again." : "Rest · screen stays awake"}
          </p>
        </div>
        {running ? (
          <div className="flex gap-1">
            <button type="button" className="pf-linkish" onClick={() => setRunning(false)}>
              Pause
            </button>
            <button
              type="button"
              className="pf-linkish"
              onClick={() => {
                setRunning(false);
                setLeft(seconds);
              }}
            >
              Skip
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="pf-linkish"
            onClick={() => {
              setLeft(seconds);
              setRunning(true);
            }}
          >
            Again
          </button>
        )}
      </div>
    </div>
  );
}
