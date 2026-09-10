import { useEffect, useState } from "react";
import { APP_FEEDBACK_SUBJECT, FEEDBACK_EMAIL } from "../config";
import { fareDataAdapter } from "../adapters";
import { getCurrentUser } from "../lib/auth";

/**
 * Pre-auth reminder that estimates are simulated.
 * Hidden after sign-in — signed-in riders get the product, not tourist chrome.
 */
export function DemoDataBanner() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => setSignedIn(Boolean(user)));
    const onAuth = () => {
      getCurrentUser().then((user) => setSignedIn(Boolean(user)));
    };
    window.addEventListener("fairshare:auth-changed", onAuth);
    return () => window.removeEventListener("fairshare:auth-changed", onAuth);
  }, []);

  if (!fareDataAdapter.isSimulated || signedIn) {
    return null;
  }

  return (
    <div className="demo-banner" role="note">
      <span className="demo-banner-pill">Demo data</span>
      <p>
        External beta — all fares, crowd levels, venues, and events are <strong>simulated estimates</strong>.
        Not live Uber, Lyft, or taxi quotes. No official partnerships implied.
      </p>
      <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(APP_FEEDBACK_SUBJECT)}`}>Send feedback</a>
    </div>
  );
}
