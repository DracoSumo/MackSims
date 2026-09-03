import type { ProListing } from "./types";

/** Sample pros for intro requests — not verified; v1 is request-only, no payments. */
export const SAMPLE_PROS: ProListing[] = [
  {
    id: "pro-1",
    name: "Jordan Ellis, Certified Personal Trainer (CPT)",
    type: "trainer",
    location: "Remote · US",
    specialties: ["Strength", "HYROX (run + station race)", "Athletic performance"],
    bio: "Former D1 strength coach. Builds periodized plans for hybrid athletes.",
  },
  {
    id: "pro-2",
    name: "Maya Chen, RD",
    type: "nutritionist",
    location: "Remote · US & Canada",
    specialties: ["Sports nutrition", "Body recomposition", "Meal planning"],
    bio: "Registered dietitian focused on fueling without fad diets.",
  },
  {
    id: "pro-3",
    name: "Marcus Webb, Certified Strength Coach (CSCS)",
    type: "trainer",
    location: "Tampa, FL · Remote",
    specialties: ["Football", "Speed", "In-season conditioning"],
    bio: "Speed and power specialist for field-sport athletes.",
  },
  {
    id: "pro-4",
    name: "Priya Nair, MS Nutrition",
    type: "nutritionist",
    location: "Remote · worldwide",
    specialties: ["Vegetarian athletes", "Gut health", "Race fueling"],
    bio: "Helps plant-forward athletes hit protein and race-day targets.",
  },
  {
    id: "pro-5",
    name: "Alex Rivera, Certified Personal Trainer (CPT)",
    type: "trainer",
    location: "Remote · US",
    specialties: ["Beginners", "Running", "Mobility"],
    bio: "Patient coaching for people returning to fitness or starting a running block.",
  },
  {
    id: "pro-6",
    name: "Sam Okonkwo, RD",
    type: "nutritionist",
    location: "Remote · US",
    specialties: ["High protein", "Gluten-free", "Busy professionals"],
    bio: "Practical meal templates that fit real schedules.",
  },
];
