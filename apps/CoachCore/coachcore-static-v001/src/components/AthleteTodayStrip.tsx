import Link from "next/link";
import { coachCoreConfig } from "@/config/coachcore";

const todayTasks = [
  { label: "Watch assigned film", href: "/app/video", step: "film" as const },
  { label: "Complete today's workout", href: "/app/training", step: "workout" as const },
  { label: "Log fueling / hydration", href: "/app/nutrition", step: "meal" as const },
  { label: "Check team messages", href: "/app/chat", step: "message" as const },
];

export function AthleteTodayStrip() {
  return (
    <div className="mt-6 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Athlete today</p>
      <p className="mt-2 text-sm leading-6 text-emerald-50/90">{coachCoreConfig.athleteTodayPrompt}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {todayTasks.map((task) => (
          <Link
            key={task.step}
            href={task.href}
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/35 hover:bg-white/5"
          >
            {task.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
