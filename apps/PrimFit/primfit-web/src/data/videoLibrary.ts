import type { MovementCategory } from "./types";

/**
 * Curated educational YouTube demos (embeddable).
 *
 * 0.2.3 audit (YouTube oEmbed):
 *   DEAD/404: farmer's walk p5MNNgmOpK8, mobility qULTwquQWAQ, meal KQ7vF0pY0zE,
 *             plank ASdvN_Xwm3s, box jump NRs3GqNlX4E.
 *   REPLACED with CrossFit / Calisthenic Movement / Scott Herman / GTN /
 *   Yoga With Adriene / Fitness Blender / Downshiftology — channels that
 *   return oEmbed iframes (embed allowed at YouTube's API level).
 *   WebView can still blank a player (error 101/150); VideoBlock always
 *   shows local step cues + “open in browser”.
 */

export type VideoRef = { url: string; title: string };

/** Category fallbacks — used when a block has no specific override. */
export const VIDEO_BY_CATEGORY: Record<MovementCategory, VideoRef> = {
  squat: {
    url: "https://www.youtube.com/watch?v=C_VtOYc6j5c",
    title: "Air squat form — CrossFit foundational movement",
  },
  hinge: {
    url: "https://www.youtube.com/watch?v=FQKfr1YDhEk",
    title: "Dumbbell Romanian deadlift (hip hinge) — Scott Herman",
  },
  push: {
    url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    title: "Push-up form — Calisthenic Movement",
  },
  pull: {
    url: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    title: "Pull-up form — Calisthenic Movement",
  },
  carry: {
    url: "https://www.youtube.com/watch?v=E94UNm8fD-4",
    title: "Farmer’s walk form — step-by-step",
  },
  run: {
    url: "https://www.youtube.com/watch?v=brFHyOtTwH4",
    title: "Running form basics — Global Triathlon Network",
  },
  mobility: {
    url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
    title: "Beginner mobility / yoga flow — Yoga With Adriene",
  },
  "meal-prep": {
    url: "https://www.youtube.com/watch?v=pDgEBQx7wKY",
    title: "Budget healthy meal prep — Downshiftology",
  },
  conditioning: {
    url: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    title: "Bodyweight interval cardio primer (with warm-up)",
  },
  core: {
    url: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    title: "Plank form — How To",
  },
  power: {
    url: "https://www.youtube.com/watch?v=NBY9-kTuHEk",
    title: "Box jump form — CrossFit",
  },
  "warm-up": {
    url: "https://www.youtube.com/watch?v=R0mMyV5OtcM",
    title: "Easy cardio warm-up — Fitness Blender",
  },
};

export function videoFor(category: MovementCategory, override?: Partial<VideoRef>): VideoRef {
  const base = VIDEO_BY_CATEGORY[category];
  return {
    url: override?.url ?? base.url,
    title: override?.title ?? base.title,
  };
}

export function youtubeVideoId(watchUrl: string): string | null {
  try {
    const u = new URL(watchUrl);
    const id = u.searchParams.get("v");
    if (id) return id;
    if (u.hostname.includes("youtu.be")) {
      const short = u.pathname.replace("/", "").split("/")[0];
      if (short) return short;
    }
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) return embedMatch[1];
  } catch {
    return null;
  }
  return null;
}

/** youtube-nocookie + playsinline so Android WebView / Capacitor can play demos inline. */
export function youtubeEmbedUrl(watchUrl: string): string | null {
  const id = youtubeVideoId(watchUrl);
  if (!id) return null;
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://localhost";
  const params = new URLSearchParams({
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
    origin,
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youtubeWatchUrl(watchUrl: string): string {
  const id = youtubeVideoId(watchUrl);
  return id ? `https://www.youtube.com/watch?v=${id}` : watchUrl;
}
