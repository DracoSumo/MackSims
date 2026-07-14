export type ChatMessage = {
  id: string;
  channel: string;
  author: string;
  body: string;
  sentAt: string;
};

const STORAGE_KEY = "coachcore.chatMessages";

export function listMessages(channel?: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const rows = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as ChatMessage[];
    return channel ? rows.filter((row) => row.channel === channel) : rows;
  } catch {
    return [];
  }
}

export function sendMessage(input: { channel: string; author: string; body: string }): ChatMessage {
  const record: ChatMessage = {
    id: crypto.randomUUID(),
    channel: input.channel,
    author: input.author,
    body: input.body.trim(),
    sentAt: new Date().toISOString(),
  };
  const existing = listMessages();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 100)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("messages"),
  );
  void import("./notificationStore").then(({ queueNotification }) =>
    queueNotification({
      title: `New message in ${input.channel}`,
      body: input.body.slice(0, 120),
      href: "/app/chat",
    }),
  );
  return record;
}

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
