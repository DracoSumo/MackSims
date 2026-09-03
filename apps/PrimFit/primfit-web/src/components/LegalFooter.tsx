"use client";

import Link from "next/link";
import { primfitConfig } from "@/config/primfit";

export function LegalFooter() {
  return (
    <footer className="space-y-2 pt-6 text-center text-xs text-[var(--pf-muted)]">
      <p>
        {primfitConfig.company} · Ages {primfitConfig.ageRating}
      </p>
      <p>
        <Link href="/privacy/" className="pf-linkish">
          Privacy
        </Link>
        <span className="mx-2">·</span>
        <Link href="/terms/" className="pf-linkish">
          Terms
        </Link>
        <span className="mx-2">·</span>
        <a href={`mailto:${primfitConfig.supportEmail}`} className="pf-linkish">
          Support
        </a>
      </p>
      <p>
        <a href={primfitConfig.supportUrl} className="pf-linkish">
          macksims.com/support
        </a>
      </p>
    </footer>
  );
}
