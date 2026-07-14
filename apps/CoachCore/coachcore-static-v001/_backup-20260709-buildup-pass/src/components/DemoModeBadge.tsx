"use client";

import Link from "next/link";

export function DemoModeBadge() {
  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-300/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-100"
      title="Static demo — no signed-in coach account"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
      Demo mode
    </Link>
  );
}
