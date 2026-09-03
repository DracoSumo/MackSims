/**
 * PrimFit science layer — original templates informed by published frameworks.
 * We do NOT copy copyrighted manuals. Principles are paraphrased for education.
 */

export type ScienceSource = {
  id: string;
  org: string;
  title: string;
  year: string;
  use: string;
};

export const SCIENCE_SOURCES: ScienceSource[] = [
  {
    id: "acsm-rt-2026",
    org: "American College of Sports Medicine (ACSM)",
    title: "Resistance Training Position Stand (healthy adults)",
    year: "2026",
    use: "Train each major muscle group at least twice a week. Strength work is hard but not a max single; muscle-building often lands near ~10 hard sets per muscle per week. Power uses a moderate load moved fast. Progress by adjusting how often, how hard, how long, and what you do (the FITT-VP checklist).",
  },
  {
    id: "acsm-fitt",
    org: "American College of Sports Medicine (ACSM)",
    title: "FITT-VP exercise prescription framework",
    year: "ongoing",
    use: "Frequency, Intensity, Time, Type, Volume, Progression — individualized to your goal. In plain language: how often, how hard, how long, what kind of work, how much, and when to add a little.",
  },
  {
    id: "nsca-foundations",
    org: "National Strength and Conditioning Association (NSCA)",
    title: "Foundations of Fitness Programming",
    year: "2015+",
    use: "Add a little over time (overload). Beginners usually go: general fitness → muscle → strength → power. 2-for-2 load rule: if the last set is easy by 2+ reps two sessions in a row, add weight next time.",
  },
  {
    id: "nsca-periodization",
    org: "National Strength and Conditioning Association (NSCA)",
    title: "Periodization models (linear / undulating / block)",
    year: "ongoing",
    use: "Manage fatigue by changing stress across weeks. Beginners do better with simple, linear progress than fancy block charts.",
  },
  {
    id: "issn-protein",
    org: "International Society of Sports Nutrition (ISSN)",
    title: "Position Stand: Protein and Exercise",
    year: "2017+",
    use: "Most trainees do well around 1.4–2.0 g of protein per kilogram of body weight per day; 20–40 g per meal; every 3–4 hours. A bit more protein when eating less helps keep muscle.",
  },
  {
    id: "issn-timing",
    org: "International Society of Sports Nutrition (ISSN)",
    title: "Position Stand: Nutrient Timing",
    year: "2017+",
    use: "Hit the daily totals first. Carbs refill fuel for hard sessions. Protein around workouts is useful, not magic — there is no tiny 30-minute “anabolic window” you must panic about.",
  },
  {
    id: "daniels-vdot",
    org: "Jack Daniels (running coach / VDOT paces)",
    title: "Running Formula (pace roles — concepts)",
    year: "2021 ed.",
    use: "Easy / comfortably-hard / short-repeat / very-fast-repeat each have a job. Most volume stays easy; hard sessions are planned. VDOT is a pace system from a recent race — PrimFit uses the roles, not a calculator.",
  },
  {
    id: "seiler-8020",
    org: "Seiler et al.",
    title: "Polarized (~80/20) intensity distribution",
    year: "2010+",
    use: "About 80% of endurance time should feel easy, about 20% truly hard. Avoid living in the medium-hard “gray zone” every day.",
  },
  {
    id: "hyrox-hybrid",
    org: "Hybrid event coaching practice",
    title: "HYROX-style race prep (run + stations)",
    year: "2024+",
    use: "HYROX is a fitness race: 8 runs + 8 workout stations. Running dominates the clock; strength covers stations; practice running after a station (“tired legs”). Grip and the backside of the body (hamstrings/glutes) matter. Base → build → peak, not a race simulation every week.",
  },
  {
    id: "field-sc",
    org: "Strength & conditioning practice (NSCA tradition)",
    title: "Field & court athlete physical preparation",
    year: "ongoing",
    use: "Jumps and sprints while fresh → strength → single-leg / injury-reduction work. Speed and agility stay high-quality — not a sloppy fatigue circuit.",
  },
];

export const CORE_PRINCIPLES = [
  {
    name: "Consistency over complexity",
    detail:
      "The biggest jump is from no training to regular training (sports-medicine guidelines). Stick to the plan before chasing advanced methods.",
  },
  {
    name: "Progressive overload",
    detail:
      "When the last set feels easy by 2+ reps for two sessions in a row, add a little load or a couple of reps next time (the 2-for-2 rule).",
  },
  {
    name: "Specificity",
    detail:
      "Train the qualities your sport needs — strength, speed, easy engine, mobility — not random hard workouts.",
  },
  {
    name: "Recovery is training",
    detail:
      "Easy days stay easy. Sleep, protein through the day, and rest days drive adaptation as much as hard sessions.",
  },
  {
    name: "Nutrition supports the work",
    detail:
      "Hit daily protein first, space meals, and fuel harder sessions with carbs — templates, not medical diets.",
  },
] as const;
