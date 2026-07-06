import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { loadSavedComparisons } from "../lib/storage";
import { isSupabaseConfigured } from "../config";

export function SavedComparisonsHomeBadge({ onOpenCompare }: { onOpenCompare?: () => void }) {
  const [saved, setSaved] = useState(() => loadSavedComparisons());
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => setSignedIn(Boolean(user)));
  }, []);

  if (saved.length === 0) return null;

  const latest = saved[0];
  const lastLabel = latest
    ? `${latest.label} · ${new Date(latest.savedAt).toLocaleDateString()}`
    : "";

  return (
    <section className="panel saved-home-badge" aria-label="Saved comparisons">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Your trips</p>
          <h2>
            {saved.length} saved comparison{saved.length === 1 ? "" : "s"}
          </h2>
          <p className="muted">
            {lastLabel}
            {signedIn && isSupabaseConfigured
              ? " · signed in — new saves can sync to cloud from Compare."
              : isSupabaseConfigured
                ? " · sign in on Settings to sync saved trips."
                : " · stored on this device only."}
          </p>
        </div>
        {onOpenCompare ? (
          <button type="button" className="text-button" onClick={onOpenCompare}>
            Open compare
          </button>
        ) : null}
      </div>
    </section>
  );
}
