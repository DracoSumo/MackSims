/**
 * Plain-language glossary. Keep science accuracy; never show a bare acronym
 * in athlete-facing copy without a meaning line.
 */
export type GlossaryTerm = {
  id: string;
  /** What we show in the plan instead of the raw acronym. */
  plain: string;
  /** Full expansion. */
  expand: string;
  /** One-line “what this means”. */
  meaning: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "rpe",
    plain: "Effort (1–10)",
    expand: "Rate of Perceived Exertion (RPE)",
    meaning:
      "How hard a set feels. 7/10 means you could still do about 2–3 good reps. 10/10 is a true max — we almost never prescribe that.",
  },
  {
    id: "1rm",
    plain: "Heaviest single lift",
    expand: "One-rep max (1RM)",
    meaning: "The most weight you could lift once with solid form. PrimFit uses effort ratings instead of asking you to test a max.",
  },
  {
    id: "z2",
    plain: "Easy conversational pace",
    expand: "Zone 2 (Z2)",
    meaning: "Easy cardio where you can talk in full sentences. Most weekly endurance work should live here.",
  },
  {
    id: "hyrox",
    plain: "HYROX (run + station race)",
    expand: "HYROX",
    meaning:
      "A fitness race: 8 × 1 km runs mixed with 8 workout stations (sleds, wall balls, lunges, rowing, and more). Running is most of the clock.",
  },
  {
    id: "issn",
    plain: "Sports nutrition researchers",
    expand: "International Society of Sports Nutrition (ISSN)",
    meaning: "A research group that publishes position stands on protein, carbs, and fueling. Templates, not a diet prescription.",
  },
  {
    id: "acsm",
    plain: "Sports-medicine exercise guidelines",
    expand: "American College of Sports Medicine (ACSM)",
    meaning: "Widely used guidelines for how often, how hard, and how long healthy adults should train.",
  },
  {
    id: "nsca",
    plain: "Strength-coaching guidelines",
    expand: "National Strength and Conditioning Association (NSCA)",
    meaning: "Coach-education group. The “2-for-2” rule (add load when last sets get easy) comes from this tradition.",
  },
  {
    id: "amrap",
    plain: "As many quality reps as you can in the time",
    expand: "AMRAP (as many rounds/reps as possible)",
    meaning: "A timed block. Stop if form collapses — “as many as possible” still means good reps.",
  },
  {
    id: "rdl",
    plain: "Romanian deadlift (hip hinge)",
    expand: "Romanian deadlift (RDL)",
    meaning:
      "A hip-hinge lift: soft knees, hips travel back, weight stays close to the legs. Trains hamstrings and glutes more than a squat does.",
  },
  {
    id: "cpt",
    plain: "Certified personal trainer",
    expand: "Certified Personal Trainer (CPT)",
    meaning: "An entry-to-mid coaching credential. Sample Pros listings are not verified bookings.",
  },
  {
    id: "cscs",
    plain: "Certified strength coach",
    expand: "Certified Strength and Conditioning Specialist (CSCS)",
    meaning: "An NSCA credential focused on athlete training. Sample Pros listings are not verified bookings.",
  },
  {
    id: "vdot",
    plain: "Running pace system",
    expand: "VDOT (Daniels running formula)",
    meaning:
      "A way to set easy / comfortably-hard / repeat paces from a recent race. PrimFit uses the idea (easy vs hard roles), not a calculator.",
  },
  {
    id: "css",
    plain: "Sustainable swim pace",
    expand: "Critical swim speed (CSS)",
    meaning: "A swim pace you could hold for a hard but controlled set — not a sprint.",
  },
  {
    id: "cod",
    plain: "Change of direction",
    expand: "COD (change of direction)",
    meaning: "Cuts, plants, and re-accelerations. Quality over sloppy fatigue.",
  },
  {
    id: "rfess",
    plain: "Rear-foot elevated split squat",
    expand: "RFESS / Bulgarian split squat",
    meaning: "A split squat with the back foot on a bench. Builds single-leg strength and balance.",
  },
  {
    id: "fitt",
    plain: "How often, how hard, how long, what type",
    expand: "FITT-VP",
    meaning: "Frequency, Intensity, Time, Type, Volume, Progression — a simple checklist for building a week.",
  },
];

export function glossaryById(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.id === id);
}
