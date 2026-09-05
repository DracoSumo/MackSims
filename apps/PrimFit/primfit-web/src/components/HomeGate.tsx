"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LegalFooter } from "@/components/LegalFooter";
import { useTheme } from "@/components/ThemeProvider";
import { primfitConfig } from "@/config/primfit";
import { getAccountHint, memberEmail, rememberEmail } from "@/lib/account";
import { todayDayIndex } from "@/lib/planEngine";
import { getProfile, getWeekPlan } from "@/lib/storage";
import { returningCopy } from "@/lib/world";
import type { UserProfile, WeekDay } from "@/data/types";

function NewUserHome() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-lg flex-col overflow-hidden px-4 pb-10 pt-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% -10%, var(--pf-purple-dim), transparent), radial-gradient(ellipse 60% 40% at 90% 20%, var(--pf-silver-dim), transparent)",
        }}
      />

      <div className="flex-1 space-y-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--pf-silver)]">{primfitConfig.company}</p>
          <h1 className="pf-display mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-[var(--pf-purple-bright)]">Prim</span>
            <span className="text-[var(--pf-silver)]">Fit</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--pf-silver)]">{primfitConfig.hook}</p>
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-[var(--pf-muted)]">{primfitConfig.tagline}</p>

        <p className="text-xs leading-relaxed text-[var(--pf-muted)]">{primfitConfig.shortDisclaimer}</p>
        <p className="text-xs text-[var(--pf-muted)]">
          Ages {primfitConfig.ageRating} · v{primfitConfig.version}
        </p>
      </div>

      <div className="space-y-3 pt-10">
        <Link href="/app/onboarding/" className="pf-btn-primary w-full text-center">
          Choose my lane
        </Link>
        <Link href="/app/today/" className="pf-btn-ghost block w-full text-center">
          I already have a plan
        </Link>
        <p className="text-center text-[11px] text-[var(--pf-muted)]">
          New here? Choose a lane. Returning on this device? We&apos;ll send you to your week.
        </p>
        <LegalFooter />
      </div>
    </div>
  );
}

function ReturningHome({
  profile,
  today,
  email,
}: {
  profile: UserProfile;
  today: WeekDay | null;
  email: string | null;
}) {
  const { copy, theme } = useTheme();
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(email);
  const words = returningCopy(theme, profile.displayName || "Athlete", Boolean(saved));

  function saveEmail() {
    const next = draft.trim();
    if (!next) return;
    rememberEmail(next);
    setSaved(next);
    setDraft("");
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-lg flex-col overflow-hidden px-4 pb-10 pt-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% -10%, var(--pf-purple-dim), transparent), radial-gradient(ellipse 60% 40% at 90% 20%, var(--pf-silver-dim), transparent)",
        }}
      />

      <div className="flex-1 space-y-6">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--pf-silver)]">{primfitConfig.company}</p>
          <h1 className="pf-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-[var(--pf-purple-bright)]">Prim</span>
            <span className="text-[var(--pf-silver)]">Fit</span>
          </h1>
        </div>

        <section className="pf-system-card space-y-3 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">{words.kicker}</p>
          <h2 className="pf-display text-2xl font-semibold">{words.title}</h2>
          <p className="text-sm text-[var(--pf-muted)]">{words.body}</p>
          {saved ? (
            <p className="text-sm text-[var(--pf-silver)]">On this device · {saved}</p>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm">
                Email to remember you (optional)
                <input
                  className="pf-input mt-2"
                  type="email"
                  placeholder="you@email.com"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <button type="button" className="pf-btn-ghost w-full text-sm" onClick={saveEmail} disabled={!draft.trim()}>
                Save on this device
              </button>
            </div>
          )}
          <p className="text-[11px] text-[var(--pf-muted)]">
            {copy.packShortName}
            {today ? ` · ${today.dayName} · ${today.workout.focus}` : ""}
          </p>
        </section>
      </div>

      <div className="space-y-3 pt-8">
        <Link href="/app/today/" className="pf-btn-primary w-full text-center">
          {words.cta}
        </Link>
        <Link href="/app/week/" className="pf-btn-ghost block w-full text-center">
          Open the week
        </Link>
        <Link href="/app/onboarding/" className="block w-full text-center text-sm text-[var(--pf-muted)]">
          Not you? Choose a new lane
        </Link>
        <p className="text-center text-[11px] text-[var(--pf-muted)]">
          Ages {primfitConfig.ageRating} · v{primfitConfig.version} · Not medical advice.
        </p>
        <LegalFooter />
      </div>
    </div>
  );
}

export function HomeGate() {
  const { ready } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [today, setToday] = useState<WeekDay | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const next = getProfile();
    setProfile(next);
    setEmail(memberEmail(getAccountHint()));
    const plan = getWeekPlan();
    setToday(plan ? (plan.days[todayDayIndex()] ?? plan.days[0] ?? null) : null);
  }, [ready]);

  if (!ready || profile === undefined) {
    return <div className="min-h-screen" />;
  }

  if (profile?.onboardedAt) {
    return <ReturningHome profile={profile} today={today} email={email} />;
  }

  return <NewUserHome />;
}
