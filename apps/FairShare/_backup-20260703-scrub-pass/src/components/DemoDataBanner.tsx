import { FEEDBACK_EMAIL } from "../config";
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
    <div className="demo-banner" role="note">
      <span className="demo-banner-pill">Demo data</span>
      <p>
        External beta — all fares, crowd levels, venues, and events are simulated. Nothing is a live quote.
      </p>
      <a href={`mailto:${FEEDBACK_EMAIL}?subject=FairShare%20Beta%20Feedback`}>Send feedback</a>
    </div>
  );
}
