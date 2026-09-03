/**
 * PrimFit coach influences — paraphrased published principles only.
 * Not affiliated with or endorsed by these coaches unless separately stated.
 */

export type CoachInfluence = {
  id: string;
  name: string;
  domain: string;
  keyPrinciples: string[];
  howPrimFitUses: string;
  cardInsight: string;
};

export const COACH_DISCLAIMER =
  "Coach insights are inspired by publicly discussed coaching principles. PrimFit is not affiliated with, endorsed by, or partnered with these coaches or organizations unless we explicitly say so.";

export const COACH_INFLUENCES: CoachInfluence[] = [
  {
    id: "gambetta",
    name: "Vern Gambetta",
    domain: "Athletic development / functional path",
    keyPrinciples: [
      "The weight room supports sport movement — it is not the whole sport.",
      "Train across a spectrum (isometric → controlled → ballistic) rather than one tempo forever.",
      "Keep programs simple, rhythmic, and transferable to the field or court.",
    ],
    howPrimFitUses:
      "Field-sport and HYROX (run + station race) days prioritize movement quality and transfer, not bodybuilding isolation.",
    cardInsight: "Gambetta lens: lift to move better in sport — quality over junk volume.",
  },
  {
    id: "boyle",
    name: "Mike Boyle",
    domain: "Strength & conditioning / joint-by-joint",
    keyPrinciples: [
      "Train movements (push, pull, hinge, squat, carry), not random body-part splits.",
      "Alternate mobility and stability needs up the chain (e.g., mobile ankles/hips, stable knees/lumbar).",
      "Unilateral work and posterior-chain strength reduce common athlete breakdowns.",
    ],
    howPrimFitUses:
      "Warm-ups and accessories bias hips/ankles mobility + knee/core stability; templates use movement patterns.",
    cardInsight: "Boyle lens: fix the joint that needs mobility or stability before piling load.",
  },
  {
    id: "pfaff",
    name: "Dan Pfaff",
    domain: "Track & field / elite S&C thinking",
    keyPrinciples: [
      "Individualize: the same session lands differently on different athletes.",
      "Protect sprint and power quality — do them fresh when the day calls for speed.",
      "Technical detail and recovery matter as much as workload.",
    ],
    howPrimFitUses:
      "Power and speed blocks sit early; effort ratings and progression notes keep intensity honest.",
    cardInsight: "Pfaff lens: speed and power while fresh — technique first.",
  },
  {
    id: "daniels",
    name: "Jack Daniels",
    domain: "Distance running",
    keyPrinciples: [
      "Get the best result with the least necessary work — avoid chronic overtraining.",
      "Easy, threshold, interval, and repetition sessions each have a job.",
      "Most volume stays easy; hard days are purposeful, not accidentally medium-hard.",
    ],
    howPrimFitUses:
      "Running weeks follow easy/hard roles (about 80% easy, 20% truly hard).",
    cardInsight: "Daniels lens: easy stays easy; hard sessions earn their place.",
  },
  {
    id: "sims",
    name: "Stacy Sims",
    domain: "Female physiology & performance nutrition",
    keyPrinciples: [
      "Women are not small men — fueling and recovery can need different emphasis.",
      "Undereating around hard training undermines adaptation and health.",
      "Protein + carbs around training support output and repair.",
    ],
    howPrimFitUses:
      "Fueling tips discourage underfueling hard days; protein distribution stays front-and-center.",
    cardInsight: "Sims lens: fuel the work — underfueling is not a strategy.",
  },
  {
    id: "jeukendrup",
    name: "Asker Jeukendrup",
    domain: "Sports nutrition science",
    keyPrinciples: [
      "Practice race/session fueling in training — do not invent it on game day.",
      "Carbohydrate needs rise with duration and intensity; gut tolerance can be trained.",
      "Hydration and GI comfort are part of the plan, not afterthoughts.",
    ],
    howPrimFitUses:
      "Hard and long days get explicit carb-around-session tips; easy days stay simpler.",
    cardInsight: "Jeukendrup lens: train the gut and fuel hard sessions on purpose.",
  },
  {
    id: "pn-style",
    name: "Precision Nutrition–style coaching",
    domain: "Habit-based nutrition coaching",
    keyPrinciples: [
      "Habits beat perfection: consistent protein, produce, and meal rhythm matter most.",
      "Build skills (prep, plate balance) before chasing micronutrient obsession.",
      "Environment and inventory shape adherence — cook with what you have.",
    ],
    howPrimFitUses:
      "Meal templates respect declared food inventory and dietary constraints; grocery fills gaps.",
    cardInsight: "PN-style lens: simple habits and pantry reality beat perfect macros.",
  },
  {
    id: "olympic-sc",
    name: "Olympic / elite S&C practice (composite)",
    domain: "High-performance strength & conditioning",
    keyPrinciples: [
      "Periodize stress: base → build → peak, with recovery baked in.",
      "Specificity: prepare the qualities the event actually demands.",
      "Monitor readiness — progression notes (e.g., 2-for-2) beat ego loading.",
    ],
    howPrimFitUses:
      "Phase labels, sports-medicine–informed prescriptions, and sport-specific day roles.",
    cardInsight: "Elite S&C lens: phase the stress; progress when the last sets get easy.",
  },
];

export function coachForSport(sport: string): CoachInfluence {
  if (sport === "running" || sport === "triathlon")
    return COACH_INFLUENCES.find((c) => c.id === "daniels")!;
  if (sport === "cycling" || sport === "swimming")
    return COACH_INFLUENCES.find((c) => c.id === "jeukendrup")!;
  if (sport === "hyrox" || sport === "crossfit" || sport === "strongman")
    return COACH_INFLUENCES.find((c) => c.id === "gambetta")!;
  if (["football", "basketball", "soccer", "baseball", "volleyball", "wrestling", "combat"].includes(sport))
    return COACH_INFLUENCES.find((c) => c.id === "pfaff")!;
  if (["tennis", "badminton", "golf"].includes(sport))
    return COACH_INFLUENCES.find((c) => c.id === "boyle")!;
  if (sport === "yoga" || sport === "pilates")
    return COACH_INFLUENCES.find((c) => c.id === "boyle")!;
  if (sport === "bodybuilding") return COACH_INFLUENCES.find((c) => c.id === "olympic-sc")!;
  if (sport === "powerlifting") return COACH_INFLUENCES.find((c) => c.id === "olympic-sc")!;
  return COACH_INFLUENCES.find((c) => c.id === "olympic-sc")!;
}

export function nutritionCoachInsight(hardDay: boolean): string {
  if (hardDay) return COACH_INFLUENCES.find((c) => c.id === "jeukendrup")!.cardInsight;
  return COACH_INFLUENCES.find((c) => c.id === "pn-style")!.cardInsight;
}
