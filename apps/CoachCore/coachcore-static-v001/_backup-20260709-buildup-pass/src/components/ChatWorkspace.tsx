"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { channels } from "@/data/mock";
import { SectionPage } from "@/components/SectionPage";
import { TodaysLoop } from "@/components/TodaysLoop";
import { formatMessageTime, listMessages, sendMessage } from "@/services/messageStore";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { onLocalDataChanged } from "@/services/localDataEvents";

export function ChatWorkspace() {
  const [activeChannel, setActiveChannel] = useState(channels[0]?.name ?? "Full Team");
  const [messages, setMessages] = useState<ReturnType<typeof listMessages>>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const refresh = () => setMessages(listMessages(activeChannel));
    refresh();
    const off = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "messages") refresh();
    });
    return () => off();
  }, [activeChannel]);

  return (
    <SectionPage
      eyebrow="Communication"
      title="Team and group chats"
      description="Demo messaging saves locally on this device. Real push notifications ship in v0.7+."
    >
      <div className="mb-6">
        <TodaysLoop current="message" />
      </div>

      <div className="mb-6 rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
        <p className="font-black text-sky-100">Pinned coach announcement</p>
        <p className="mt-2 text-sm text-sky-50/80">
          Film, playbook, and hydration checks are due before tomorrow&apos;s session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.name}
              type="button"
              onClick={() => setActiveChannel(channel.name)}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                activeChannel === channel.name
                  ? "border-sky-300/40 bg-sky-300/15 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <p className="font-bold">{channel.name}</p>
              <p className="mt-1 text-xs text-slate-400">{channel.latest}</p>
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">{activeChannel}</h2>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-400">No messages yet in this channel on this device.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-xs text-slate-500">
                    {msg.author} • {formatMessageTime(msg.sentAt)}
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{msg.body}</p>
                </div>
              ))
            )}
          </div>

          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) return;
              sendMessage({ channel: activeChannel, author: "Coach (demo)", body: draft });
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Send a demo team message…"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-300/50"
            />
            <button
              type="submit"
              className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950 hover:bg-sky-300"
            >
              Send
            </button>
          </form>

          <div className="mt-4">
            <MarkCompleteButton
              itemType="message"
              itemId={`channel:${activeChannel}`}
              label={`Checked messages in ${activeChannel}`}
            />
          </div>

          <Link href="/app/accountability" className="mt-4 inline-block text-sm font-bold text-sky-300">
            See accountability impact →
          </Link>
        </div>
      </div>
    </SectionPage>
  );
}
