export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = "coachcore.notifications";

export function listNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as AppNotification[];
  } catch {
    return [];
  }
}

export function queueNotification(input: {
  title: string;
  body: string;
  href: string;
}): AppNotification {
  const record: AppNotification = {
    id: crypto.randomUUID(),
    title: input.title,
    body: input.body,
    href: input.href,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const existing = listNotifications();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing].slice(0, 40)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("notifications"),
  );
  return record;
}

export function markNotificationRead(id: string): void {
  const rows = listNotifications().map((row) =>
    row.id === id ? { ...row, read: true } : row,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("notifications"),
  );
}

export function unreadCount(): number {
  return listNotifications().filter((row) => !row.read).length;
}
