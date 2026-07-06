import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { actionCards, activityTimeline, athletes, coachCoreStats, integrations, playbookItems } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { CommandCard, CrossLinkStrip, DemoDisclaimerStrip, FoundationNote, MetricCard, StatusPill } from "@/components/ui/CoachCards";

const commandModules = [
  {
    title: "Film room",
    body: "Assign clips, tag teachable moments, and track in-app watch completion.",
    href: "/app/video",
    tag: "Watch time",
  },
  {
    title: "Training floor",
    body: "Manage team workouts, WODs, recovery blocks, and AI-assisted drafts.",
    href: "/app/training",
    tag: "Workouts",
  },
  {
    title: "Fueling checks",
    body: "Track hydration, meals, and performance nutrition habits.",
    href: "/app/nutrition",
    tag: "Nutrition",
  },
  {
    title: "Playbook install",
    body: "Keep plays, drills, practice plans, and movement standards organized.",
    href: "/app/playbook",
    tag: "Install",
  },
];

function athleteTone(status: string) {
  if (status === "Locked in") return "green";
  if (status === "Needs nudge") return "amber";
  return "red";
}

export default function CoachDashboard() {
  return (
    <AppShell>
      <div className="px-5 py-6 lg:px-10 lg:py-10">
        <DemoDisclaimerStrip />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_36%),rgba(255,255,255,0.04)] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">
              Coach dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-6xl">
              Who is locked in?
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Track film, workouts, fueling, playbook views, login time, and readiness from one command center.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {coachCoreConfig.accountabilityDefinition}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusPill tone="green">{coachCoreConfig.version}</StatusPill>
              <StatusPill tone="sky">All sports</StatusPill>
              <StatusPill tone="slate">Functional fitness</StatusPill>
            </div>
            <div className="mt-5">
              <CrossLinkStrip />
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
              Coach alert
            </p>
            <h2 className="mt-3 text-3xl font-black">Work is visible now.</h2>
            <p className="mt-3 text-sm leading-6 text-amber-50/90">
              12 of 18 athletes watched assigned film. 5 missed meal logs. 3 have not opened this week&apos;s playbook.
            </p>
            <p className="mt-4 text-xs leading-5 text-amber-100/70">
              Athlete view: {coachCoreConfig.athleteTodayPrompt}
            </p>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {coachCoreStats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandModules.map((module) => (
            <CommandCard key={module.title} {...module} />
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">Quick coach actions</h2>
          <p className="mt-2 text-sm text-slate-400">
            Mock flows only — connect film, training, fueling, and nudges without leaving the demo.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {actionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 transition hover:border-sky-300/30"
              >
                <StatusPill tone="sky">{card.tag}</StatusPill>
                <h3 className="mt-4 text-xl font-black">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
            <h2 className="text-2xl font-black">Athlete accountability</h2>
            <p className="mt-2 text-sm text-slate-400">
              Film, workouts, fueling, and readiness in one view — tap an athlete for detail.
            </p>

            <div className="mt-5 space-y-3">
              {athletes.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/app/athletes/${athlete.id}`}
                  className="block rounded-3xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-sky-300/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black">{athlete.name}</p>
                      <p className="text-sm text-slate-400">
                        {athlete.role} • Last active: {athlete.lastActive}
                      </p>
                    </div>

                    <StatusPill tone={athleteTone(athlete.status)}>
                      {athlete.status}
                    </StatusPill>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-slate-400">Film</p>
                      <p className="font-black">{athlete.film}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-slate-400">Workouts</p>
                      <p className="font-black">{athlete.workouts}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-slate-400">Fueling</p>
                      <p className="font-black">{athlete.meals}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-slate-400">Readiness</p>
                      <p className="font-black">{athlete.readiness}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-2xl font-black">Playbook install</h2>

              <div className="mt-5 space-y-3">
                {playbookItems.slice(0, 3).map((item) => (
                  <div key={item.title} className="rounded-3xl bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.type} • {item.assigned}
                        </p>
                      </div>
                      <StatusPill tone="sky">{item.status}</StatusPill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-2xl font-black">Integration center</h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {integrations.slice(0, 8).map((item) => (
                  <span key={item.name} className="rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
                    {item.name}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                Plugin-ready placeholders only. No real external APIs, credentials, or deployments connected.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-2xl font-black">Activity timeline</h2>
              <p className="mt-2 text-sm text-slate-400">
                Static demo timeline showing what future backend events will look like.
              </p>

              <div className="mt-5 space-y-3">
                {activityTimeline.slice(0, 4).map((item) => (
                  <div key={`${item.time}-${item.title}`} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.time} • {item.type}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <FoundationNote />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
