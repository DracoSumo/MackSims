"use client";

import { useEffect, useState } from "react";
import { Card, SectionPage } from "@/components/SectionPage";
import { CommunitySafetyMenu } from "@/components/safety/CommunitySafetyMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { channels } from "@/data/mock";
import { listBlockedUsers } from "@/services/communitySafety";

export default function ChatPage() {
  const [blocked, setBlocked] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setBlocked(listBlockedUsers());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("coachcore:safety-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("coachcore:safety-changed", refresh);
    };
  }, []);

  const visible = channels.filter((channel) => {
    const authorKey = channel.name.toLowerCase().replace(/\s+/g, "-");
    return !blocked.includes(authorKey);
  });

  return (
    <SectionPage
      eyebrow="Communication"
      title="Team and group chats"
      description="Full team messages, coach-only planning, parent announcements, position groups, and training channels."
    >
      <div className="mb-6 rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
        <p className="font-black text-sky-100">Team communication</p>
        <p className="mt-2 text-sm text-sky-50/80">
          Channels appear after your roster and messaging backend are connected. Report and block controls stay available for safety.
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No channels yet"
          body="When live team chat is connected, full-team, coach-only, parent, and position channels will list here. Nothing is fabricated for external testers."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((channel) => {
            const authorKey = channel.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Card key={channel.name} title={channel.name} subtitle={channel.description}>
                <div className="flex items-start justify-between gap-3">
                  <p>{channel.latest}</p>
                  <CommunitySafetyMenu
                    targetType="channel"
                    targetId={authorKey}
                    targetLabel={channel.name}
                    authorId={authorKey}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </SectionPage>
  );
}
