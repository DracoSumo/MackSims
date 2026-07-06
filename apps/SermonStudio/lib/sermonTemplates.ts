import { defaultOutline, type Sermon } from "./types";

export type SermonTemplate = {
  id: string;
  label: string;
  description: string;
  build: () => Sermon;
};

export const SERMON_TEMPLATES: SermonTemplate[] = [
  {
    id: "three-point",
    label: "Three-point outline",
    description: "Classic preachable structure with application block.",
    build: () => ({
      title: "",
      theme: "faith",
      date: "",
      passages: [],
      notes: "",
      setlist: [],
      isSeriesItem: false,
      seriesId: "",
      outline: {
        keyPoints: ["Point one — anchor in Scripture", "Point two — illustrate clearly", "Point three — call to response"],
        illustrations: ["Short story or object lesson"],
        application: "One concrete habit to practice this week.",
      },
    }),
  },
  {
    id: "narrative",
    label: "Narrative sermon",
    description: "Story-driven flow with scene beats.",
    build: () => ({
      title: "",
      theme: "hope",
      date: "",
      passages: [],
      notes: "Open with scene-setting. Resolve tension before application.",
      setlist: [],
      isSeriesItem: false,
      seriesId: "",
      outline: {
        keyPoints: ["Scene 1 — tension introduced", "Scene 2 — turning point", "Scene 3 — gospel resolution"],
        illustrations: ["Character or place the congregation can picture"],
        application: "Invite listeners into the story's outcome in their own lives.",
      },
    }),
  },
  {
    id: "topical",
    label: "Topical message",
    description: "Theme-first with supporting passages list.",
    build: () => ({
      title: "",
      theme: "grace",
      date: "",
      passages: [],
      notes: "Gather 2–3 supporting texts after the main passage.",
      setlist: [],
      isSeriesItem: false,
      seriesId: "",
      outline: defaultOutline(),
    }),
  },
];
