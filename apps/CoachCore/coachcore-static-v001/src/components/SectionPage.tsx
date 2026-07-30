import { AppShell } from "@/components/AppShell";

export function SectionPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="ms-page">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-[var(--ms-card-pad)] sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">{description}</p>
        </div>

        <div className="mt-[var(--ms-section-gap)]">{children}</div>
      </div>
    </AppShell>
  );
}

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-[var(--ms-card-pad)]">
      <h2 className="text-xl font-black">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
      {children ? <div className="mt-4 text-sm leading-6 text-slate-300">{children}</div> : null}
    </div>
  );
}
