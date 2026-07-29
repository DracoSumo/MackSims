import type { Sermon, SermonOutline } from "./types";
import { defaultOutline } from "./types";

export type PreachSlideKind =
  | "title"
  | "passage"
  | "keyPoint"
  | "illustration"
  | "application"
  | "notes";

export type PreachSlide = {
  id: string;
  kind: PreachSlideKind;
  label: string;
  title: string;
  body: string;
};

export function buildPreachSlides(sermon: Sermon): PreachSlide[] {
  const outline: SermonOutline = sermon.outline ?? defaultOutline();
  const slides: PreachSlide[] = [];
  const title = sermon.title.trim() || "Untitled Sermon";

  slides.push({
    id: "title",
    kind: "title",
    label: "Title",
    title,
    body: [sermon.theme ? `Theme: ${sermon.theme}` : "", sermon.date ? `Date: ${sermon.date}` : ""]
      .filter(Boolean)
      .join("\n"),
  });

  sermon.passages.forEach((passage, index) => {
    const ref = passage.trim();
    if (!ref) return;
    slides.push({
      id: `passage-${index}`,
      kind: "passage",
      label: "Passage",
      title: ref,
      body: "",
    });
  });

  outline.keyPoints.forEach((point, index) => {
    const text = point.trim();
    if (!text) return;
    slides.push({
      id: `point-${index}`,
      kind: "keyPoint",
      label: `Point ${index + 1}`,
      title: text,
      body: "",
    });
  });

  outline.illustrations.forEach((item, index) => {
    const text = item.trim();
    if (!text) return;
    slides.push({
      id: `illustration-${index}`,
      kind: "illustration",
      label: "Illustration",
      title: text,
      body: "",
    });
  });

  if (outline.application.trim()) {
    slides.push({
      id: "application",
      kind: "application",
      label: "Application",
      title: outline.application.trim(),
      body: "",
    });
  }

  if (sermon.notes.trim()) {
    slides.push({
      id: "notes",
      kind: "notes",
      label: "Notes",
      title: "Speaking notes",
      body: sermon.notes.trim(),
    });
  }

  return slides.length > 0
    ? slides
    : [
        {
          id: "empty",
          kind: "title",
          label: "Empty",
          title: title,
          body: "Add key points, passages, or notes before preaching.",
        },
      ];
}

export function canEnterPreachMode(sermon: Sermon): boolean {
  const outline = sermon.outline ?? defaultOutline();
  return Boolean(
    sermon.title.trim() ||
      sermon.passages.some((p) => p.trim()) ||
      outline.keyPoints.some((p) => p.trim()) ||
      outline.illustrations.some((p) => p.trim()) ||
      outline.application.trim() ||
      sermon.notes.trim(),
  );
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
