"use client";

import { useEffect, useId, useRef, useState } from "react";
import { youtubeEmbedUrl, youtubeVideoId, youtubeWatchUrl } from "@/data/videoLibrary";

type YTPlayer = {
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: string | HTMLElement,
        opts: {
          videoId: string;
          host?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onError?: () => void;
          };
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector("script[data-pf-yt]")) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.dataset.pfYt = "1";
      document.body.appendChild(s);
    }
    const t = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(t);
        resolve();
      }
    }, 120);
  });
}

export function VideoBlock({
  url,
  title,
  compact,
  cueSteps,
  forceOpen,
}: {
  url: string;
  title?: string;
  compact?: boolean;
  cueSteps?: string[];
  forceOpen?: boolean;
}) {
  const hostId = `pfyt-${useId().replace(/:/g, "")}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const [open, setOpen] = useState(Boolean(forceOpen));
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const embed = youtubeEmbedUrl(url);
  const watch = youtubeWatchUrl(url);
  const videoId = youtubeVideoId(url);
  const steps = cueSteps?.length ? cueSteps : [];

  useEffect(() => {
    if (!open || failed || !videoId || typeof window === "undefined") return;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setSlow(true);
    }, 10000);

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;
      const el = document.getElementById(hostId);
      if (!el) return;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = new window.YT.Player(el, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            window.clearTimeout(timeout);
            setSlow(false);
          },
          onError: () => {
            window.clearTimeout(timeout);
            setFailed(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [open, failed, videoId, hostId]);

  const showPlayer = open && embed && !failed;

  return (
    <div className="mt-2 space-y-2">
      {forceOpen ? (
        <div className="flex flex-wrap items-center gap-2">
          {steps.length ? (
            <button type="button" className="pf-linkish" onClick={() => setShowSteps((v) => !v)}>
              {showSteps ? "Hide steps" : "Form steps"}
            </button>
          ) : null}
          <a href={watch} target="_blank" rel="noopener noreferrer" className="pf-linkish">
            Open in browser
          </a>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="pf-linkish"
            onClick={() => {
              setOpen((v) => !v);
              if (failed) setFailed(false);
            }}
          >
            {open ? "Hide video" : "Watch"}
          </button>
          {steps.length ? (
            <button type="button" className="pf-linkish" onClick={() => setShowSteps((v) => !v)}>
              {showSteps ? "Hide steps" : "Form steps"}
            </button>
          ) : null}
          <a href={watch} target="_blank" rel="noopener noreferrer" className="pf-linkish">
            Open in browser
          </a>
        </div>
      )}
      {title ? <p className="text-[11px] text-[var(--pf-muted)]">{title}</p> : null}

      {showPlayer ? (
        <div className={compact ? "pf-video-frame pf-video-frame-compact" : "pf-video-frame"}>
          <div id={hostId} className="h-full w-full" />
        </div>
      ) : null}

      {showPlayer && slow ? (
        <button type="button" className="pf-linkish" onClick={() => setFailed(true)}>
          Player blank? Show steps instead
        </button>
      ) : null}

      {open && (failed || !embed) ? (
        <div className="rounded-xl border border-[var(--pf-line)] bg-black/40 p-3">
          <p className="text-xs font-medium text-[var(--pf-silver)]">Demo player unavailable</p>
          <p className="mt-1 text-[11px] text-[var(--pf-muted)]">
            This video is blocked, region-locked, or won&apos;t embed here. Use the steps below or open it in your
            browser.
          </p>
          {steps.length ? (
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-[var(--pf-ink)]">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-xs text-[var(--pf-muted)]">Open in browser for the full demo.</p>
          )}
        </div>
      ) : null}

      {showSteps && steps.length && !(open && failed) ? (
        <ol className="list-inside list-decimal space-y-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-[var(--pf-silver)]">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
