"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Sermon } from "@/lib/types";
import { buildPreachSlides, formatElapsed } from "@/lib/preachingMode";

type Props = {
  sermon: Sermon;
  onClose: () => void;
};

export default function PreachingMode({ sermon, onClose }: Props) {
  const slides = useMemo(() => buildPreachSlides(sermon), [sermon]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);

  const slide = slides[Math.min(index, slides.length - 1)];
  const progress = slides.length <= 1 ? 100 : Math.round((index / (slides.length - 1)) * 100);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsedMs((ms) => ms + 1000), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, slides.length]);

  return (
    <div
      className="preach-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Preaching mode"
    >
      <div className="preach-shell">
        <header className="preach-toolbar">
          <div>
            <p className="preach-kicker">{slide.label}</p>
            <p className="preach-timer" aria-live="polite">
              {formatElapsed(elapsedMs)}
              {running ? "" : " (paused)"}
            </p>
          </div>
          <div className="preach-actions">
            <Button type="button" variant="outline" onClick={() => setRunning((v) => !v)}>
              {running ? "Pause" : "Resume"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setElapsedMs(0)}>
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Exit
            </Button>
          </div>
        </header>

        <div className="preach-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <main className="preach-stage">
          <p className="preach-count">
            {index + 1} / {slides.length}
          </p>
          <h1>{slide.title}</h1>
          {slide.body ? <pre className="preach-body">{slide.body}</pre> : null}
        </main>

        <footer className="preach-nav">
          <Button
            type="button"
            variant="outline"
            disabled={index <= 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            disabled={index >= slides.length - 1}
            onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
          >
            Next
          </Button>
        </footer>
        <p className="preach-hint">Keyboard: ← → Space · Esc exits · Timer is local only</p>
      </div>
    </div>
  );
}
