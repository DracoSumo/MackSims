import { FEEDBACK_EMAIL } from "../config";

/**
 * Standing call-to-action for beta testers. Uses a plain mailto link —
 * no telemetry or form backend exists in this build.
 */
export function FeedbackPrompt() {
  const subject = encodeURIComponent("FairShare Beta Feedback");
  const body = encodeURIComponent(
    "What I was doing:\n\nWhat I expected:\n\nWhat happened instead:\n\nDevice / browser:\n"
  );

  return (
    <section className="panel feedback-panel">
      <div className="section-heading">
        <p className="eyebrow">Beta tester feedback</p>
        <h2>Spotted something odd? Tell us.</h2>
        <p>
          Confusing screens, broken layouts, wrong-feeling numbers, or ideas — everything helps. This build
          collects no analytics, so email is the only channel.
        </p>
      </div>
      <a className="feedback-button" href={`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`}>
        Email {FEEDBACK_EMAIL}
      </a>
    </section>
  );
}
