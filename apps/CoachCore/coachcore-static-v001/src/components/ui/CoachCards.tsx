import Link from "next/link";
import { isSupabaseConfigured } from "@/config/backend";
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
    <div className="relative overflow-hidden rounded-[14px] border border-[var(--ms-line-warm)] bg-[var(--ms-card)] p-5 shadow-[var(--ms-shadow)] ms-glass-panel">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_36%)]" />
      <p className="relative text-sm text-slate-400">{label}</p>
      <p className="relative mt-3 text-4xl font-black tracking-tight">{value}</p>
      <p className="relative mt-2 text-sm text-slate-300">{note}</p>
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
  const cues = { sky: "◆", green: "✓", amber: "!", red: "×", slate: "•" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      <span aria-hidden="true">{cues[tone]}</span>
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
      className="group relative block overflow-hidden rounded-[14px] border border-[var(--ms-line-warm)] bg-[var(--ms-card)] p-6 shadow-[var(--ms-shadow)] transition hover:-translate-y-0.5 hover:border-emerald-400/35 ms-glass-panel"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_36%)]" />
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
  const live = isSupabaseConfigured;
  return (
    <div
      role="note"
      className={`rounded-[12px] border px-4 py-3 text-sm leading-6 backdrop-blur-sm ${
        live
          ? "border-emerald-300/25 bg-[rgba(16,185,129,0.12)] text-emerald-50/95"
          : "border-amber-300/25 bg-[rgba(249,115,22,0.12)] text-amber-50/95"
      }`}
    >
      <p>
        <span className="font-bold">{live ? "Live beta." : "Setup needed."}</span>{" "}
        {coachCoreConfig.privacyScope}
      </p>
      <p className="mt-2 text-xs leading-5 opacity-90">{coachCoreConfig.coachingSupportDisclaimer}</p>
    </div>
  );
}

export function FoundationNote() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-6 text-slate-400">
      <span className="font-bold text-slate-200">{coachCoreConfig.version} live beta:</span>{" "}
      {coachCoreConfig.safetyNote}
    </div>
  );
}
