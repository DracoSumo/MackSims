"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listNotifications, markNotificationRead, unreadCount } from "@/services/notificationStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(listNotifications());

  useEffect(() => {
    const refresh = () => {
      setCount(unreadCount());
      setRows(listNotifications());
    };
    refresh();
    const off = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "notifications") refresh();
    });
    return () => off();
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10"
        aria-label="Notifications"
      >
        Alerts{count > 0 ? ` (${count})` : ""}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-xl">
          {rows.length === 0 ? (
            <p className="text-xs text-slate-400">No demo notifications yet.</p>
          ) : (
            rows.slice(0, 5).map((row) => (
              <Link
                key={row.id}
                href={row.href}
                onClick={() => markNotificationRead(row.id)}
                className={`block rounded-xl px-3 py-2 text-xs ${
                  row.read ? "text-slate-400" : "bg-white/5 text-white"
                }`}
              >
                <p className="font-bold">{row.title}</p>
                <p className="mt-1 text-slate-400">{row.body}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
