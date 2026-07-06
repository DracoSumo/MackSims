import type { Series, Sermon, SermonOutline, Song, Verse } from "./types";
import { defaultOutline } from "./types";

export function buildSermonNotes(
  sermon: Sermon,
  songs: Song[],
  seriesList: Series[],
  verses: Verse[],
  translation = "KJV",
): string {
  const outline = sermon.outline ?? defaultOutline();
  const seriesName =
    sermon.isSeriesItem && sermon.seriesId
      ? seriesList.find((s) => s.id === sermon.seriesId)?.name || sermon.seriesId
      : "";
  const setlistLines = sermon.setlist
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is Song => Boolean(s))
    .map((s) => `- ${s.title} — ${s.artist}`);
  const lines: string[] = [];
  lines.push(sermon.title || "Untitled Sermon");
  lines.push("=".repeat((sermon.title || "Untitled Sermon").length));
  if (sermon.date) lines.push(`Date: ${sermon.date}`);
  lines.push(`Theme: ${sermon.theme}`);
  if (seriesName) lines.push(`Series: ${seriesName}`);
  if (sermon.passages.length) {
    lines.push("", "Passages:");
    sermon.passages.forEach((p) => {
      lines.push(`- ${p}`);
      const verse = verses.find((v) => v.ref === p);
      const text = verse?.text?.[translation] || verse?.text?.KJV;
      if (text) lines.push(`  ${text}`);
    });
  }
  if (outline.keyPoints.length) {
    lines.push("", "Key Points:");
    outline.keyPoints.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  }
  if (outline.illustrations.length) {
    lines.push("", "Illustrations:");
    outline.illustrations.forEach((p) => lines.push(`- ${p}`));
  }
  if (outline.application.trim()) {
    lines.push("", "Application:", outline.application.trim());
  }
  if (sermon.notes.trim()) {
    lines.push("", "Notes:", sermon.notes.trim());
  }
  if (setlistLines.length) {
    lines.push("", "Worship Setlist:");
    lines.push(...setlistLines);
  }
  lines.push("", "— Prepared with Pastor's Sermon Studio (beta)");
  return lines.join("\n");
}

export function buildPrintHtml(sermon: Sermon, notesText: string): string {
  const title = sermon.title || "Untitled Sermon";
  const escaped = notesText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title} — Sermon Outline</title>
  <style>
    @page { margin: 0.85in; }
    body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; line-height: 1.55; font-size: 11.5pt; }
    h1 { font-size: 1.55rem; margin-bottom: 0.2rem; page-break-after: avoid; }
    .meta { color: #444; font-size: 0.92rem; margin-bottom: 1.25rem; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 1rem; margin: 0; }
    pre section { page-break-inside: avoid; margin-bottom: 1rem; }
    footer { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid #ddd; font-size: 0.78rem; color: #666; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Sermon outline export — KJV/WEB public-domain scripture where included</p>
  <pre>${escaped}</pre>
  <footer>Pastor's Sermon Studio — local beta export. Not for licensed translation distribution without rights.</footer>
</body>
</html>`;
}

export function openPrintableOutline(sermon: Sermon, notesText: string) {
  const html = buildPrintHtml(sermon, notesText);
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!win) {
    throw new Error("Popup blocked");
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
