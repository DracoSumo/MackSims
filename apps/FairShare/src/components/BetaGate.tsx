import { useState } from "react";
import type { ReactNode } from "react";
import { APP_NAME, APP_LONG_DESCRIPTION, APP_FEEDBACK_SUBJECT, BETA_LABEL, FEEDBACK_EMAIL, VERSION_LABEL } from "../config";
import { isBetaAcknowledged, setBetaAcknowledged } from "../lib/storage";

interface BetaGateProps {
  children: ReactNode;
}

/**
 * One-time landing screen shown before the app. Explains that this is an
 * external beta running entirely on simulated data. Acknowledgement is
 * stored in localStorage so testers only see it once per device.
 */
export function BetaGate({ children }: BetaGateProps) {
  const [acknowledged, setAcknowledged] = useState(() => isBetaAcknowledged());

  if (acknowledged) {
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
          {APP_LONG_DESCRIPTION} This beta uses simulated fares, crowd levels, venues, and events — with nightlife
          context and CrowdMeter pickup pressure.
        </p>

        <div className="beta-gate-disclaimer">
          <h2>Before you start</h2>
          <ul>
            <li>
              <strong>All data is simulated.</strong> Every fare, wait time, crowd level, venue, and event in
              this build is demo data. Nothing here is a live quote or real demand reading.
            </li>
            <li>
              <strong>No bookings happen.</strong> Buttons that look like booking or saving actions are
              placeholders for testing the flow only.
            </li>
            <li>
              <strong>Provider names are examples.</strong> Services shown are generic or example listings,
              not partnerships or live integrations.
            </li>
            <li>
              <strong>Your feedback shapes the real build.</strong> Send anything you notice to{" "}
              <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(APP_FEEDBACK_SUBJECT)}`}>{FEEDBACK_EMAIL}</a>.
            </li>
          </ul>
        </div>

        <button className="beta-gate-accept" type="button" onClick={acceptBeta}>
          I understand — explore the demo
        </button>
        <small>Acknowledgement is stored on this device only.</small>
      </div>
    </div>
  );
}
