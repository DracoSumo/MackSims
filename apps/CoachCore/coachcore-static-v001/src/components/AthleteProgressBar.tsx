import { athletePillars, overallProgress, parsePercent } from "@/lib/athleteProgress";

export function AthleteProgressBar({
  film,
  workouts,
  meals,
  readiness,
  messagesComplete,
}: {
  film: string;
  workouts: string;
  meals: string;
  readiness: string;
  messagesComplete?: boolean;
}) {
  const pillars = athletePillars({ film, workouts, meals, readiness, messagesComplete });
  const total = overallProgress(pillars);
  const readinessNum = parsePercent(readiness);

  return (
    <div className="mt-4 space-y-3">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Overall locked-in score</span>
          <span className="font-bold text-white">{total}%</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
            style={{ width: `${total}%` }}
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        {pillars.map((pillar) => (
          <div key={pillar.key}>
            <div className="flex justify-between text-xs">
              <span className={pillar.complete ? "text-emerald-200" : "text-slate-400"}>{pillar.label}</span>
              <span className="font-bold text-white">{pillar.percent}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${pillar.complete ? "bg-emerald-400" : "bg-amber-400"}`}
                style={{ width: `${pillar.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">Readiness signal: {readinessNum}% (coaching support — not medical advice)</p>
    </div>
  );
}
