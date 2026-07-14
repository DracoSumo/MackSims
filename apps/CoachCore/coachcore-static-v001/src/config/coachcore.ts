export const coachCoreConfig = {
  appName: "CoachCore",
  parentCompany: "MackSims",
  hook: "No more guessing who is locked in.",
  accountabilityDefinition:
    "Locked in means an athlete is completing assigned film, workouts, fueling logs, and playbook work — visible to coaches in one place.",
  athleteTodayPrompt:
    "Check assigned film, today's workout or WOD, meal log, and team messages — then update your status.",
  demoUrl: "https://coachcore7.netlify.app",
  status: "Static mobile demo with local state + optional Supabase sync",
  version: "v0.7.1",
  safetyNote:
    "Static demo only. No real auth, payments, Hudl, wearable APIs, database writes, external credentials, or production user data are connected.",
  coachingSupportDisclaimer:
    "Coaching support only — not medical advice, diagnosis, or treatment. Nutrition and readiness signals help coaches guide training; they are not clinical assessments.",
  privacyEmail: "privacy@macksims.com",
  supportEmail: "feedback@macksims.com",
  privacySummary:
    "CoachCore is built for all sports. We use your data only to run the app. We do not sell your data. You can request account deletion at any time.",
  targetAudience: "All sports — school, club, gym, team, and individual coaching programs.",
};

export const connectedSurfaceLinks = [
  { label: "Training", href: "/app/training" },
  { label: "Nutrition", href: "/app/nutrition" },
  { label: "Chat", href: "/app/chat" },
  { label: "Accountability", href: "/app/accountability" },
  { label: "Video", href: "/app/video" },
] as const;
