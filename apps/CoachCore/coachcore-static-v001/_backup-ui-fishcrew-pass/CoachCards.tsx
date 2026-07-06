import Link from "next/link";
import { coachCoreConfig, connectedSurfaceLinks } from "@/config/coachcore";

export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{note}</p>
    </div>
  );
}

export function StatusPill({
  children,
  tone = "sky",
}: {
  children: React.ReactNode;
  tone?: "sky" | "green" | "amber" | "red" | "slate";
}) {
  const tones = {
    sky: "border-sky-300/25 bg-sky-300/10 text-sky-100",
    green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    red: "border-red-300/25 bg-red-300/10 text-red-100",
    slate: "border-white/10 bg-white/10 text-slate-200",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function CommandCard({
  title,
  body,
  href,
  tag,
}: {
  title: string;
  body: string;
  href: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/[0.08]"
    >
      <StatusPill>{tag}</StatusPill>
      <h3 className="mt-5 text-2xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
      <p className="mt-5 text-sm font-bold text-sky-300 group-hover:text-sky-200">
        Open module →
      </p>
    </Link>
  );
}

export function CrossLinkStrip({ current }: { current?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {connectedSurfaceLinks
        .filter((link) => link.label !== current)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-white/10"
          >
            {link.label} →
          </Link>
        ))}
    </div>
  );
}

export function DemoDisclaimerStrip() {
  return (
    <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50/90">
      <span className="font-bold">Static demo.</span> {coachCoreConfig.safetyNote}
    </p>
  );
}

export function FoundationNote() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-6 text-slate-400">
      <span className="font-bold text-slate-200">{coachCoreConfig.version} static demo:</span>{" "}
      {coachCoreConfig.safetyNote}
    </div>
  );
}
