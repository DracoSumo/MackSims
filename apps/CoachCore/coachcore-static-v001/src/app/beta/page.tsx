"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildBetaMailtoUrl, intakeModeLabel, submitBetaRequest } from "@/services/betaIntake";

const BETA_EMAIL_DISPLAY = "feedback@macksims.com";

function cloudSyncLabel(cloudSync?: "ok" | "skipped" | "error"): string {
  if (cloudSync === "ok") return "Server queue copy saved.";
  if (cloudSync === "error") return "Server queue failed — schema or policies may need setup.";
  if (cloudSync === "skipped") return "Server queue skipped (Supabase not configured).";
  return "";
}

export default function BetaPage() {
  const [intakeLabel, setIntakeLabel] = useState("Checking intake mode…");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [lane, setLane] = useState("Team sport");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "saved-remote" | "saved-local" | "error">("idle");
  const [channelLabel, setChannelLabel] = useState("");
  const [cloudNote, setCloudNote] = useState("");
  const [errorText, setErrorText] = useState("");
  const [mailtoUrl, setMailtoUrl] = useState("");

  useEffect(() => {
    setIntakeLabel(intakeModeLabel());
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorText("");
    setMailtoUrl("");
    setChannelLabel("");
    setCloudNote("");

    const payload = { name, email, organization, lane, message };
    const result = await submitBetaRequest(payload);

    if (!result.ok) {
      setStatus("error");
      setErrorText(result.error);
      if (result.mailtoUrl) setMailtoUrl(result.mailtoUrl);
      return;
    }

    setStatus(result.channel === "local" ? "saved-local" : "saved-remote");
    setChannelLabel(
      result.channel === "formspree"
        ? "Sent via Formspree."
        : result.channel === "netlify"
          ? "Sent via Netlify Forms."
          : "Saved on this device.",
    );
    setCloudNote(cloudSyncLabel(result.cloudSync));
    setMailtoUrl(buildBetaMailtoUrl(payload));
    setName("");
    setEmail("");
    setOrganization("");
    setMessage("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.22),_transparent_36%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-300">MackSims</p>
            <h1 className="mt-1 text-2xl font-black">CoachCore Beta</h1>
          </Link>

          <Link
            href="/app"
            className="inline-flex min-h-[44px] w-fit items-center rounded-full border border-white/10 px-5 py-2 text-sm font-bold hover:bg-white/10"
          >
            View Demo
          </Link>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Early access</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Bring accountability to your team before everyone else.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CoachCore is being built for coaches, teams, gyms, trainers, and athletes who need proof that the work is getting done.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30"
          >
            <h3 className="text-3xl font-black">Request beta access</h3>
            <p className="mt-2 text-sm text-slate-400">{intakeLabel}</p>

            <div className="mt-6 grid gap-4">
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={status === "submitting"}
              />
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "submitting"}
              />
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
                placeholder="Team, gym, or organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                disabled={status === "submitting"}
              />

              <select
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-400/50"
                value={lane}
                onChange={(e) => setLane(e.target.value)}
                disabled={status === "submitting"}
              >
                <option>Team sport</option>
                <option>Functional fitness / CrossFit-style gym</option>
                <option>Private performance coaching</option>
                <option>School / club athletics</option>
                <option>Other</option>
              </select>

              <textarea
                className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-sky-400/50"
                placeholder="What do you want CoachCore to help you track?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "submitting"}
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {status === "submitting" ? "Submitting…" : "Submit beta request"}
              </button>
            </div>

            {(status === "saved-remote" || status === "saved-local") && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 ${status === "saved-remote" ? "border-emerald-300/30 bg-emerald-300/10" : "border-amber-300/30 bg-amber-300/10"}`}
                role="status"
              >
                <p className={`font-bold ${status === "saved-remote" ? "text-emerald-200" : "text-amber-100"}`}>
                  {status === "saved-remote" ? "Request received" : "Saved on this device"}
                </p>
                <p className="mt-1 text-sm text-slate-200">{channelLabel}</p>
                {cloudNote ? <p className="mt-1 text-xs text-slate-400">{cloudNote}</p> : null}
                <p className="mt-2 text-xs text-slate-400">We&apos;ll follow up by email. You can also send a copy below.</p>
              </div>
            )}
            {status === "error" && <p className="mt-5 text-sm text-amber-300">{errorText}</p>}

            {mailtoUrl && (
              <a
                href={mailtoUrl}
                className="mt-4 inline-flex min-h-[44px] max-w-full items-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold text-sky-200 hover:bg-white/10 break-all sm:break-normal"
              >
                Email copy to {BETA_EMAIL_DISPLAY}
              </a>
            )}

            <p className="mt-5 text-xs leading-5 text-slate-500">
              Not medical advice. CoachCore tracks training habits — not health diagnosis. See{" "}
              <Link href="/privacy" className="text-sky-300">
                Privacy
              </Link>
              .
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
