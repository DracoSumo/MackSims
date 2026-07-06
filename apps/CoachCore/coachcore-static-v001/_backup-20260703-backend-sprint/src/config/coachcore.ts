export const coachCoreConfig = {
  appName: "CoachCore",
  parentCompany: "MackSims",
  hook: "No more guessing who is locked in.",
  accountabilityDefinition:
    "Locked in means an athlete is completing assigned film, workouts, fueling logs, and playbook work — visible to coaches in one place.",
  athleteTodayPrompt:
    "Check assigned film, today's workout or WOD, meal log, and team messages — then update your status.",
  demoUrl: "https://coachcore7.netlify.app",
  status: "Static mobile demo with mock state simulation",
  version: "v0.5",
  safetyNote:
    "Static demo only. No real auth, payments, Hudl, wearable APIs, database writes, external credentials, or production user data are connected.",
  coachingSupportDisclaimer:
    "Coaching support only — not medical advice, diagnosis, or treatment. Nutrition and readiness signals help coaches guide training; they are not clinical assessments.",
};

export const connectedSurfaceLinks = [
  { label: "Training", href: "/app/training" },
  { label: "Nutrition", href: "/app/nutrition" },
  { label: "Chat", href: "/app/chat" },
  { label: "Accountability", href: "/app/accountability" },
  { label: "Video", href: "/app/video" },
] as const;
