import { useEffect, useState, type ReactNode } from "react";
import { APP_NAME, APP_LONG_DESCRIPTION, APP_FEEDBACK_SUBJECT, BETA_LABEL, FEEDBACK_EMAIL, VERSION_LABEL } from "../config";
import { getCurrentUser } from "../lib/auth";
import { isBetaAcknowledged, setBetaAcknowledged } from "../lib/storage";

interface BetaGateProps {
  children: ReactNode;
}

/**
 * One-time landing screen before the app for anonymous visitors.
 * Signed-in users skip straight into the product — no filler after login.
 */
export function BetaGate({ children }: BetaGateProps) {
  const [acknowledged, setAcknowledged] = useState(() => isBetaAcknowledged());
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setSignedIn(Boolean(user)))
      .finally(() => setChecking(false));
    const onAuth = () => {
      getCurrentUser().then((user) => setSignedIn(Boolean(user)));
    };
    window.addEventListener("fairshare:auth-changed", onAuth);
    return () => window.removeEventListener("fairshare:auth-changed", onAuth);
  }, []);

  if (checking) {
    return <>{children}</>;
  }

  if (acknowledged || signedIn) {
    return <>{children}</>;
  }

  const acceptBeta = () => {
    setBetaAcknowledged();
    setAcknowledged(true);
  };

  return (
    <div className="beta-gate">
      <div className="beta-gate-card">
        <span className="beta-gate-badge">{BETA_LABEL}</span>
        <h1>
          Welcome to {APP_NAME} <small>{VERSION_LABEL}</small>
        </h1>
        <p className="beta-gate-lead">
          {APP_LONG_DESCRIPTION} Compare fares with nightlife context and CrowdMeter pickup pressure.
        </p>

        <div className="beta-gate-disclaimer">
          <h2>Before you start</h2>
          <ul>
            <li>
              <strong>Estimates are simulated until live partners are connected.</strong> Fare ranges and crowd
              levels help you practice the decision flow.
            </li>
            <li>
              <strong>No bookings happen in this build.</strong> Save comparisons and places on this device
              (and to the cloud when signed in).
            </li>
            <li>
              <strong>Provider names are examples.</strong> Listings are for comparison UX — not partnerships.
            </li>
            <li>
              <strong>Your feedback shapes the real build.</strong> Send anything you notice to{" "}
              <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(APP_FEEDBACK_SUBJECT)}`}>{FEEDBACK_EMAIL}</a>.
            </li>
          </ul>
        </div>

        <button className="beta-gate-accept" type="button" onClick={acceptBeta}>
          Continue into {APP_NAME}
        </button>
        <small>Acknowledgement is stored on this device only. Signed-in accounts skip this screen.</small>
      </div>
    </div>
  );
}
