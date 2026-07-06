import type { DriverProfile } from "../data/types";
import { toTitleCase } from "../lib/format";

interface DriverStatusCardProps {
  driver: DriverProfile;
}

export function DriverStatusCard({ driver }: DriverStatusCardProps) {
  return (
    <article className="card driver-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Driver profile</p>
          <h3>{driver.name}</h3>
        </div>
        <span className={`status-pill status-pill--${driver.licenseStatus.status}`}>
          {toTitleCase(driver.licenseStatus.status)}
        </span>
      </div>

      <p>{driver.vehicle}</p>
      <div className="metric-grid">
        <div>
          <span>Permit</span>
          <strong>{driver.permitId}</strong>
        </div>
        <div>
          <span>Training</span>
          <strong>{toTitleCase(driver.trainingStatus)}</strong>
        </div>
        <div>
          <span>Queue</span>
          <strong>{driver.queuePosition ? `#${driver.queuePosition}` : "None"}</strong>
        </div>
      </div>

      {driver.licenseStatus.complianceFlags.length > 0 && (
        <p className="warning-copy">{driver.licenseStatus.complianceFlags.join(", ")}</p>
      )}
    </article>
  );
}
