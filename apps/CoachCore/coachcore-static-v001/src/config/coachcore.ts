export const coachCoreConfig = {
  appName: "CoachCore",
  parentCompany: "MackSims",
  hook: "No more guessing who is locked in.",
  accountabilityDefinition:
    "Locked in means an athlete is completing assigned film, workouts, fueling logs, and playbook work — visible to coaches in one place.",
  athleteTodayPrompt:
    "Check assigned film, today's workout or WOD, meal log, and team messages — then update your status.",
  /** Canonical staging host until custom DNS is fully live. */
  demoUrl: "https://coachcore7.netlify.app",
  productionUrl: "https://coachcore.macksims.com",
  status: "Live beta — local roster + cloud sync",
  version: "v0.7.4",
  safetyNote:
    "Live beta. Add athletes on Team. Sign in to sync roster, assignments, meals, notes, and check-ins to Supabase (apply v0.7.4 migration). No fabricated athletes. No payments. Hudl/wearables need real partner access — request from Integrations.",
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
