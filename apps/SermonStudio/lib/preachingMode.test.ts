import { describe, expect, it } from "vitest";
import { buildPreachSlides, canEnterPreachMode, formatElapsed } from "./preachingMode";
import { defaultOutline } from "./types";

describe("preachingMode", () => {
  it("builds ordered slides from outline and passages", () => {
    const slides = buildPreachSlides({
      title: "Renewed Minds",
      theme: "transformation",
      date: "2026-07-29",
      passages: ["Romans 12:2"],
      notes: "Benediction reminder",
      setlist: [],
      isSeriesItem: false,
      seriesId: "",
      outline: {
        keyPoints: ["God initiates", "Renew daily"],
        illustrations: ["Lighthouse"],
        application: "Practice one habit",
      },
    });
    expect(slides.map((s) => s.kind)).toEqual([
      "title",
      "passage",
      "keyPoint",
      "keyPoint",
      "illustration",
      "application",
      "notes",
    ]);
  });

  it("gates empty sermons", () => {
    expect(
      canEnterPreachMode({
        title: "",
        theme: "faith",
        date: "",
        passages: [],
        notes: "",
        setlist: [],
        isSeriesItem: false,
        seriesId: "",
        outline: defaultOutline(),
      }),
    ).toBe(false);
    expect(
      canEnterPreachMode({
        title: "Hello",
        theme: "faith",
        date: "",
        passages: [],
        notes: "",
        setlist: [],
        isSeriesItem: false,
        seriesId: "",
        outline: defaultOutline(),
      }),
    ).toBe(true);
  });

  it("formats elapsed timer", () => {
    expect(formatElapsed(65_000)).toBe("1:05");
    expect(formatElapsed(3_661_000)).toBe("1:01:01");
  });
});
