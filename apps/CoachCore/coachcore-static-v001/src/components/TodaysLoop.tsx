import Link from "next/link";

export type LoopStep = "film" | "workout" | "meal" | "message";

const steps: { key: LoopStep; label: string; href: string }[] = [
  { key: "film", label: "Film", href: "/app/video" },
  { key: "workout", label: "Train", href: "/app/training" },
  { key: "meal", label: "Fuel", href: "/app/nutrition" },
  { key: "message", label: "Chat", href: "/app/chat" },
];

export function TodaysLoop({ current }: { current: LoopStep }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Today&apos;s loop</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => {
          const active = step.key === current;
          const done = index < currentIndex;
          return (
            <div key={step.key} className="flex items-center gap-2">
              <Link
                href={step.href}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  active
                    ? "border-sky-300/40 bg-sky-300/15 text-sky-100 ring-1 ring-sky-300/30"
                    : done
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {done ? "✓ " : ""}
                {step.label}
              </Link>
              {index < steps.length - 1 && <span className="text-slate-600">→</span>}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Film, training, fueling, and team chat are one daily loop — coaches see completion in accountability.
      </p>
    </div>
  );
}
