"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export function ToolsStrip() {
  const { copy } = useTheme();
  return (
    <nav className="flex gap-2" aria-label="PrimFit tools">
      <Link href="/app/shop/" className="pf-chip flex-1 text-center">
        {copy.shop}
      </Link>
      <Link href="/app/wearables/" className="pf-chip flex-1 text-center">
        {copy.wearables}
      </Link>
      <Link href="/app/methods/" className="pf-chip flex-1 text-center">
        {copy.methods}
      </Link>
    </nav>
  );
}
