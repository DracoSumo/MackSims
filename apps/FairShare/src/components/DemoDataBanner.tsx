import { APP_FEEDBACK_SUBJECT, FEEDBACK_EMAIL } from "../config";
import { fareDataAdapter } from "../adapters";

/**
 * Persistent strip under the top bar reminding testers that everything is
 * simulated, with a direct feedback link. Reads the active adapter so the
 * banner disappears automatically if a live adapter is ever swapped in.
 */
export function DemoDataBanner() {
  if (!fareDataAdapter.isSimulated) {
    return null;
  }

  return (
    <details className="demo-banner">
      <summary>
        <span className="demo-banner-pill">Demo</span>
        Estimates are simulated
      </summary>
      <div className="demo-banner-detail" role="note">
        <p>
          Fares, crowd levels, venues, and events are simulated—not live Uber, Lyft, or taxi quotes.
          No official partnerships are implied.
        </p>
        <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(APP_FEEDBACK_SUBJECT)}`}>Send feedback</a>
      </div>
    </details>
  );
}
