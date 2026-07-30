import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AthleteAccountabilityPanel } from "@/components/AthleteAccountabilityPanel";
import { RecentActionLogPanel } from "@/components/RecentActionLogPanel";
import { RecentCheckInsPanel } from "@/components/RecentCheckInsPanel";
import { DashboardSyncStrip } from "@/components/DashboardSyncStrip";
import { actionCards, activityTimeline, coachCoreStats, playbookItems } from "@/data/mock";
import { DashboardIntegrationsStrip } from "@/components/integrations/DashboardIntegrationsStrip";
import { DemoWalkthroughBanner } from "@/components/DemoWalkthroughBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CommandCard, FoundationNote, MetricCard, StatusPill } from "@/components/ui/CoachCards";
import { athletes } from "@/data/mock";

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

export default function CoachDashboard() {
  const exceptions = athletes.filter((athlete) => athlete.status !== "Locked in");
  const nextActions = actionCards.filter((card) =>
    [
      "/app/actions/send-nudge",
      "/app/actions/assign-workout",
      "/app/actions/assign-video",
    ].includes(card.href),
  );

  return (
    <AppShell showStatusBanner={false}>
      <div className="px-5 py-5 lg:px-10 lg:py-8">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300">Coach dashboard</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight lg:text-4xl">Today&apos;s priorities</h1>
          </div>
          <Link href="/app/accountability" className="text-sm font-bold text-sky-200 hover:text-white">
            Full accountability →
          </Link>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[18px] border border-amber-300/20 bg-amber-300/[0.08] p-4 lg:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Athlete exceptions</p>
                <h2 className="mt-1 text-2xl font-black">
                  {exceptions.length ? `${exceptions.length} need attention` : "Team is on track"}
                </h2>
              </div>
              <StatusPill tone={exceptions.some((athlete) => athlete.status === "At risk") ? "red" : "green"}>
                {exceptions.some((athlete) => athlete.status === "At risk") ? "At risk present" : "No urgent flags"}
              </StatusPill>
            </div>

            <div className="mt-4 grid gap-2">
              {exceptions.length ? (
                exceptions.slice(0, 3).map((athlete) => (
                  <Link
                    key={athlete.id}
                    href={`/app/athletes/${athlete.id}`}
                    className="group grid min-h-[72px] gap-2 rounded-[12px] border border-white/10 bg-slate-950/45 px-4 py-3 transition hover:border-sky-300/35 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black">{athlete.name}</p>
                        <StatusPill tone={athlete.status === "At risk" ? "red" : "amber"}>{athlete.status}</StatusPill>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-300">{athlete.note}</p>
                    </div>
                    <p className="text-sm font-bold text-sky-200 group-hover:text-white">
                      {athlete.status === "At risk" ? "Check in now" : "Review gaps"} →
                    </p>
                  </Link>
                ))
              ) : (
                <EmptyState
                  title="No athlete exceptions"
                  body="Once your roster is connected, missed work and readiness flags will surface here first."
                />
              )}
            </div>
          </div>

          <div className="rounded-[18px] border border-sky-300/20 bg-sky-300/[0.07] p-4 lg:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200">Next coach actions</p>
            <div className="mt-3 grid gap-2">
              {nextActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex min-h-[52px] items-center justify-between gap-3 rounded-[12px] px-4 py-3 text-sm font-bold transition ${
                    index === 0
                      ? "bg-sky-300 text-slate-950 hover:bg-sky-200"
                      : "border border-white/10 bg-slate-950/35 text-sky-100 hover:border-sky-300/35"
                  }`}
                >
                  <span>{action.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          <DemoWalkthroughBanner embedded />
          <DashboardSyncStrip compact />
        </div>

        <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {coachCoreStats.length ? (
            coachCoreStats.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-4">
              <EmptyState
                title="No live team metrics yet"
                body="Readiness, film completion, workouts, and meal logs appear after your roster and assignments are connected."
              />
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandModules.map((module) => (
            <CommandCard key={module.title} {...module} />
          ))}
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black">All coach actions</h2>
          <p className="mt-2 text-sm text-slate-400">
            Open action sheets to prepare film, training, fueling, and nudges. Live delivery stays off until backends are connected.
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AthleteAccountabilityPanel />

          <div className="space-y-6">
            <RecentCheckInsPanel />
            <RecentActionLogPanel />

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-2xl font-black">Playbook install</h2>

              <div className="mt-5 space-y-3">
                {playbookItems.length ? (
                  playbookItems.slice(0, 3).map((item) => (
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
                  ))
                ) : (
                  <EmptyState
                    title="No playbook installs yet"
                    body="Assigned plays and drills will list here once your team content is imported."
                  />
                )}
              </div>
            </div>

            <DashboardIntegrationsStrip />

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-2xl font-black">Activity timeline</h2>
              <p className="mt-2 text-sm text-slate-400">
                Live athlete events appear here after film, training, and check-ins are connected.
              </p>

              <div className="mt-5 space-y-3">
                {activityTimeline.length ? (
                  activityTimeline.slice(0, 4).map((item) => (
                    <div key={`${item.time}-${item.title}`} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{item.time} • {item.type}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No activity yet"
                    body="When athletes check in, watch film, or complete workouts, those events will land here."
                  />
                )}
              </div>
            </div>

            <FoundationNote />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
