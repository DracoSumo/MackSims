import type { MovementCategory } from "./types";

/** Local illustrated / step-list cues — always available if YouTube is blank. */
export const FORM_CUES: Record<MovementCategory, string[]> = {
  squat: [
    "Feet about shoulder-width, toes slightly out.",
    "Sit hips back and down; keep heels on the floor.",
    "Knees track over toes; chest stays proud.",
    "Stand up by pushing the floor away.",
  ],
  hinge: [
    "Soft knees — this is a hip hinge, not a squat.",
    "Push hips back; keep the weight close to your legs.",
    "Spine long; brace your midsection like someone might poke you.",
    "Stand tall by driving hips forward (don’t yank with the low back).",
  ],
  push: [
    "Hands under shoulders (push-up) or stacked over wrists (press).",
    "Body in one line — don’t let hips sag or pike.",
    "Lower with control; elbows about 45° from the torso.",
    "Press away and finish with a tight midsection.",
  ],
  pull: [
    "Start long through the arms; squeeze the armpits to start the pull.",
    "Lead with the chest / elbows, not a shrug.",
    "Pause a beat at the top, then lower slower than you pulled.",
    "If you can’t do a full pull-up yet: band, jump-and-lower, or row instead.",
  ],
  carry: [
    "Deadlift the weights up — don’t round to grab them.",
    "Stand tall: ribs down, shoulders packed, eyes ahead.",
    "Short, controlled steps; don’t let the weights swing.",
    "Set them down with a hinge, the same way you picked them up.",
  ],
  run: [
    "Easy days: you can talk in full sentences.",
    "Tall posture, quiet feet, slight forward lean from the ankles.",
    "Cadence often feels a bit quicker than a slow shuffle.",
    "Stop or walk if form falls apart — junk miles don’t count as quality.",
  ],
  mobility: [
    "Move into tightness, not sharp pain.",
    "Breathe slowly; exhale as you ease a little further.",
    "Hips, hamstrings, and upper back cover most athletes.",
    "A little most days beats a heroic once-a-week stretch session.",
  ],
  "meal-prep": [
    "Build a plate: protein + carb + produce + a little fat.",
    "Cook extra protein and carbs once, then mix through the week.",
    "Salt, lemon/vinegar, and herbs keep repeats from tasting boring.",
    "Pack water. Hard-day plates get more carbs near the session.",
  ],
  conditioning: [
    "Leave 1–2 reps or a small gear in reserve — sloppy reps don’t count.",
    "Breathe on purpose; don’t hold your breath the whole interval.",
    "Transitions (station → run) are the skill — practice them calmly.",
    "If you can’t speak a short phrase, you’re probably too hot for this block.",
  ],
  core: [
    "Ribs down, glutes lightly on, neck long.",
    "Move the limbs, not the low back (anti-rotation / plank family).",
    "If the low back complains, shorten the lever or drop to knees.",
    "Quality 20–40 seconds beats a shaking 2-minute hold.",
  ],
  power: [
    "Do these while fresh — speed dies when you’re fried.",
    "Quiet, sticky landings; don’t crash.",
    "Moderate height/load, fast intent on the way up.",
    "Full rest between reps. Power is quality, not a metcon.",
  ],
  "warm-up": [
    "5–8 minutes easy cardio until you feel warm.",
    "Open hips, ankles, and upper back with controlled swings/rotations.",
    "Two light rehearsal sets of today’s main lift.",
    "You should feel ready, not pre-fatigued.",
  ],
};
