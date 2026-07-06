import type { Sermon } from "./types";

function formatIcsDate(date: string, time = "10:00"): string {
  const [year, month, day] = date.split("-").map((part) => Number(part));
  const [hour, minute] = time.split(":").map((part) => Number(part));
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return utc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildSermonIcs(sermon: Sermon): string {
  const title = sermon.title || "Untitled Sermon";
  const uid = `${sermon.id ?? title.replace(/\s+/g, "-").toLowerCase()}@sermon-studio.local`;
  const dtstart = sermon.date ? formatIcsDate(sermon.date, "10:00") : formatIcsDate(new Date().toISOString().slice(0, 10));
  const dtend = sermon.date ? formatIcsDate(sermon.date, "11:30") : dtstart;
  const description = [
    `Theme: ${sermon.theme}`,
    sermon.passages.length ? `Passages: ${sermon.passages.join(", ")}` : "",
    "Exported from Pastor's Sermon Studio (local beta — not synced).",
  ]
    .filter(Boolean)
    .join("\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MackSims//Sermon Studio//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString().slice(0, 10), "09:00")}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadSermonIcs(sermon: Sermon) {
  const ics = buildSermonIcs(sermon);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(sermon.title || "sermon").replace(/\s+/g, "-").toLowerCase()}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadLibraryIcs(sermons: Sermon[]) {
  const dated = sermons.filter((item) => item.date);
  if (dated.length === 0) {
    throw new Error("No dated sermons in library");
  }
  const events = dated
    .map((sermon) => {
      const block = buildSermonIcs(sermon).split("\r\n");
      return block.filter((line) => !line.startsWith("BEGIN:VCALENDAR") && !line.startsWith("END:VCALENDAR") && line !== "VERSION:2.0" && !line.startsWith("PRODID") && line !== "CALSCALE:GREGORIAN" && line !== "METHOD:PUBLISH");
    })
    .flat()
    .join("\r\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MackSims//Sermon Studio//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sermon-studio-schedule.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}
