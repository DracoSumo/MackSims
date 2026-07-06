import Link from "next/link";
import { SectionPage } from "@/components/SectionPage";
import { MockActionRunner } from "@/components/actions/MockActionRunner";

export function MockActionPage({
  eyebrow,
  title,
  description,
  children,
  resultTitle,
  resultBody,
  buttonLabel,
  successTitle,
  successBody,
  timelineItems,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  resultTitle: string;
  resultBody: string;
  buttonLabel?: string;
  successTitle?: string;
  successBody?: string;
  timelineItems?: string[];
  actionLabel?: string;
}) {
  return (
    <SectionPage eyebrow={eyebrow} title={title} description={description}>
      <div className="mb-6">
        <Link href="/app" className="text-sm font-bold text-sky-300">
          ← Back to dashboard
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <div className="grid gap-4">{children}</div>

          <MockActionRunner
            buttonLabel={buttonLabel}
            successTitle={successTitle ?? resultTitle}
            successBody={successBody ?? resultBody}
            actionLabel={actionLabel ?? title}
            timelineItems={
              timelineItems ?? [
                "Mock action staged in CoachCore.",
                "Demo timeline updated locally.",
                "No backend, database, notification, or external API was used.",
              ]
            }
          />
        </div>

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">
            Mock result
          </p>
          <h2 className="mt-3 text-3xl font-black">{resultTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/85">{resultBody}</p>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
            In a backend version, this would create a real action record, update assignment status,
            notify athletes, and appear in the accountability timeline.
          </div>
        </div>
      </div>
    </SectionPage>
  );
}

export function MockField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/60"
      />
    </label>
  );
}

export function MockTextarea({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <textarea
        placeholder={placeholder}
        className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/60"
      />
    </label>
  );
}

export function MockSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-300/60">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
