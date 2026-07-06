export const coachCoreStats = [
  { label: "Team readiness", value: "82%", note: "Up 9% this week" },
  { label: "Film completion", value: "12 / 18", note: "Athletes watched assigned clips" },
  { label: "Workout completion", value: "76%", note: "5 athletes still due" },
  { label: "Meal logs", value: "13 / 18", note: "Fueling check pending" },
];

export const athletes = [
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    role: "WR / Speed Group",
    status: "Locked in",
    lastActive: "Today, 7:42 AM",
    film: "94%",
    workouts: "100%",
    meals: "92%",
    readiness: "91%",
    note: "Explosive week. Keep him fresh before game day.",
  },
  {
    id: "jalen-brooks",
    name: "Jalen Brooks",
    role: "RB / Strength Group",
    status: "Needs nudge",
    lastActive: "Yesterday, 9:11 PM",
    film: "61%",
    workouts: "75%",
    meals: "58%",
    readiness: "69%",
    note: "Strong training output, but meal logging and film habits need work.",
  },
  {
    id: "andre-mills",
    name: "Andre Mills",
    role: "LB / Recovery",
    status: "At risk",
    lastActive: "3 days ago",
    film: "28%",
    workouts: "40%",
    meals: "20%",
    readiness: "44%",
    note: "Needs coach check-in. Missed film, missed fueling, low activity.",
  },
  {
    id: "cam-ortiz",
    name: "Cam Ortiz",
    role: "Functional Fitness / WOD Group",
    status: "Locked in",
    lastActive: "Today, 6:15 AM",
    film: "88%",
    workouts: "95%",
    meals: "84%",
    readiness: "87%",
    note: "Great class consistency. Review clean pull video before adding load.",
  },
];

export const channels = [
  {
    name: "Full Team",
    description: "General team chat, updates, and daily communication.",
    latest: "Coach Davis: Film is due before tomorrow's lift.",
  },
  {
    name: "Coaches",
    description: "Private coach-only planning and notes.",
    latest: "Install review moved to 5:30 PM.",
  },
  {
    name: "Position Group",
    description: "Position-specific discussion and reminders.",
    latest: "Receivers: footwork ladder clips are pinned.",
  },
  {
    name: "Training Group",
    description: "Strength, conditioning, and recovery messages.",
    latest: "Hydration check after today's WOD.",
  },
  {
    name: "Parents",
    description: "Parent announcements and schedule updates.",
    latest: "Saturday travel details posted.",
  },
  {
    name: "Announcements",
    description: "Coach-pinned updates only.",
    latest: "Game week checklist is live.",
  },
];

export const playbookItems = [
  {
    id: "red-zone-install",
    title: "Red Zone Install",
    type: "Game Plan",
    assigned: "Varsity Offense",
    status: "Active",
    note: "Review before Thursday walkthrough.",
  },
  {
    id: "footwork-ladder",
    title: "Footwork Ladder Progression",
    type: "Drill",
    assigned: "Skill Players",
    status: "Due Today",
    note: "Emphasize clean cuts and body control.",
  },
  {
    id: "clean-pull-standard",
    title: "Movement Standard: Clean Pull",
    type: "Functional Fitness",
    assigned: "WOD Group",
    status: "Review",
    note: "Coach must approve technique before loading heavy.",
  },
  {
    id: "press-break-package",
    title: "Press Break Package",
    type: "Play",
    assigned: "Basketball Guards",
    status: "Install",
    note: "Add video examples after next practice.",
  },
];

export const workouts = [
  {
    id: "speed-block",
    title: "Acceleration + Top Speed",
    type: "Speed Block",
    duration: "48 min",
    group: "Skill Players",
    status: "Assigned",
  },
  {
    id: "lower-strength",
    title: "Lower Body Strength",
    type: "Strength",
    duration: "55 min",
    group: "Varsity",
    status: "In Progress",
  },
  {
    id: "engine-builder",
    title: "Engine Builder WOD",
    type: "Functional Fitness",
    duration: "22 min",
    group: "6 AM Class",
    status: "Posted",
  },
  {
    id: "recovery-mobility",
    title: "Recovery Mobility",
    type: "Recovery",
    duration: "18 min",
    group: "High Load Athletes",
    status: "Due Tonight",
  },
];

export const meals = [
  {
    athlete: "Marcus Reed",
    breakfast: "Logged",
    lunch: "Logged",
    dinner: "Pending",
    hydration: "72 oz",
  },
  {
    athlete: "Jalen Brooks",
    breakfast: "Missing",
    lunch: "Logged",
    dinner: "Pending",
    hydration: "44 oz",
  },
  {
    athlete: "Cam Ortiz",
    breakfast: "Logged",
    lunch: "Logged",
    dinner: "Logged",
    hydration: "96 oz",
  },
];

export const videoMoments = [
  {
    id: "route-stem-correction",
    title: "Route stem correction",
    tag: "Correction",
    assigned: "WR Group",
    watched: "71%",
    opened: "13 / 18",
    rewatched: "5 athletes",
    note: "Watch before individual period.",
  },
  {
    id: "clean-pull-path",
    title: "Clean pull bar path",
    tag: "Technique",
    assigned: "WOD Group",
    watched: "88%",
    opened: "16 / 18",
    rewatched: "9 athletes",
    note: "Movement standard for Friday.",
  },
  {
    id: "goal-line-effort",
    title: "Goal line effort clip",
    tag: "Great effort",
    assigned: "Full Team",
    watched: "94%",
    opened: "17 / 18",
    rewatched: "11 athletes",
    note: "Culture clip pinned by coach.",
  },
  {
    id: "missed-rotation",
    title: "Missed rotation",
    tag: "Missed assignment",
    assigned: "Defense",
    watched: "46%",
    opened: "8 / 18",
    rewatched: "2 athletes",
    note: "Needs review before film room.",
  },
];

export const integrations = [
  { name: "Hudl", status: "Requires API access" },
  { name: "Apple Health", status: "Planned" },
  { name: "Google Health Connect", status: "Planned" },
  { name: "Garmin", status: "Plugin-ready" },
  { name: "Fitbit", status: "Plugin-ready" },
  { name: "WHOOP", status: "Plugin-ready" },
  { name: "Oura", status: "Plugin-ready" },
  { name: "Strava", status: "Planned" },
  { name: "TeamSnap", status: "Coming soon" },
  { name: "MaxPreps", status: "Coming soon" },
  { name: "Google Calendar", status: "Planned" },
];

export const adminCards = [
  { label: "Organizations", value: "3", note: "School, gym, private trainer" },
  { label: "Teams", value: "9", note: "Across all demo orgs" },
  { label: "Coaches", value: "14", note: "2 pending invites" },
  { label: "Athletes", value: "186", note: "Demo roster only" },
];

export const actionCards = [
  {
    title: "Send athlete nudge",
    description: "Remind athletes who missed film, meal logs, workouts, or playbook installs.",
    href: "/app/actions/send-nudge",
    tag: "Coach action",
  },
  {
    title: "Assign video",
    description: "Send a film clip, drill correction, or movement standard to a group.",
    href: "/app/actions/assign-video",
    tag: "Film room",
  },
  {
    title: "Assign workout",
    description: "Push a team workout, WOD, recovery block, or position-specific session.",
    href: "/app/actions/assign-workout",
    tag: "Training",
  },
  {
    title: "Log meal",
    description: "Demo athlete fueling log for meals, hydration, and recovery habits.",
    href: "/app/actions/log-meal",
    tag: "Fueling",
  },
  {
    title: "AI workout draft",
    description: "Generate a coach-reviewed workout plan without connecting a real AI API.",
    href: "/app/actions/ai-workout",
    tag: "AI mock",
  },
  {
    title: "Save coach note",
    description: "Add a private coach note to an athlete or team group.",
    href: "/app/actions/save-note",
    tag: "Notes",
  },
];

export const mockNudgeTargets = [
  "Athletes who missed assigned film",
  "Athletes who missed meal logs",
  "Athletes inactive for 48+ hours",
  "Functional fitness members who missed WOD review",
  "Position group needing playbook review",
];

export const mockGroups = [
  "Full Team",
  "Varsity Offense",
  "WR Group",
  "Defense",
  "WOD Group",
  "6 AM Class",
  "Skill Players",
  "Parents",
];

export const activityTimeline = [
  {
    time: "Today, 8:14 AM",
    title: "Film assignment opened",
    body: "Marcus Reed opened Route stem correction and watched 94% of the clip.",
    type: "Film",
  },
  {
    time: "Today, 7:42 AM",
    title: "Athlete checked in",
    body: "Marcus Reed logged into CoachCore before morning lift.",
    type: "Login",
  },
  {
    time: "Today, 6:15 AM",
    title: "WOD group active",
    body: "Cam Ortiz completed Engine Builder WOD and logged hydration.",
    type: "Training",
  },
  {
    time: "Yesterday, 9:11 PM",
    title: "Fueling gap detected",
    body: "Jalen Brooks missed dinner log and needs a coach nudge.",
    type: "Fueling",
  },
  {
    time: "3 days ago",
    title: "Inactive athlete flagged",
    body: "Andre Mills has missed multiple film and workout assignments.",
    type: "Alert",
  },
];
