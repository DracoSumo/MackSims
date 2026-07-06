import { useEffect, useState } from "react";
import { fareDataAdapter } from "../adapters";
import type { LocalEvent, NightlifeVenue } from "../data/types";
import { toTitleCase } from "../lib/format";

type LoadState = "loading" | "ready" | "error";

/**
 * Nightlife and local-event context cards, loaded through the data adapter
 * so the panel exercises real loading / empty / error states even with mocks.
 */
export function NightlifePanel({ marketId }: { marketId: string }) {
  const [state, setState] = useState<LoadState>("loading");
  const [venues, setVenues] = useState<NightlifeVenue[]>([]);
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");

    Promise.all([fareDataAdapter.getNightlifeVenues(marketId), fareDataAdapter.getLocalEvents(marketId)])
      .then(([venueResult, eventResult]) => {
        if (cancelled) return;
        setVenues(venueResult.data);
        setEvents(eventResult.data);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [marketId, reloadKey]);

  return (
    <section className="panel nightlife-panel">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Tonight nearby (demo)</p>
          <h2>Nightlife and event context</h2>
          <p>Simulated venues and events that shape pickup pressure. No live venue data is connected.</p>
        </div>
        <span className="demo-chip">Simulated</span>
      </div>

      {state === "loading" && (
        <div className="loading-block" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading demo nightlife data…</p>
        </div>
      )}

      {state === "error" && (
        <div className="error-block" role="alert">
          <strong>Could not load demo nightlife data.</strong>
          <p>This is a simulated failure state. Try again to reload the bundled demo data.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </button>
        </div>
      )}

      {state === "ready" && venues.length === 0 && events.length === 0 && (
        <div className="empty-block">
          <strong>No nightlife or events in this demo market yet.</strong>
          <p>The Bermuda demo market has the fullest sample data.</p>
        </div>
      )}

      {state === "ready" && venues.length > 0 && (
        <div className="card-grid">
          {venues.map((venue) => (
            <article className={`mini-card venue-card venue-card--${venue.crowdLevel.toLowerCase()}`} key={venue.id}>
              <div className="venue-card-top">
                <span>{toTitleCase(venue.category)}</span>
                <em className="crowd-chip">{venue.crowdLevel}</em>
              </div>
              <strong>{venue.name}</strong>
              <p>{venue.vibe}</p>
              <small>Closes {venue.closingTime} · {venue.tonightNote}</small>
            </article>
          ))}
        </div>
      )}

      {state === "ready" && events.length > 0 && (
        <div className="table-list">
          {events.map((event) => (
            <div className="table-row" key={event.id}>
              <span>{event.timeLabel}</span>
              <strong>{event.name}</strong>
              <p>
                {event.venueName} · expected {event.expectedCrowd.toLowerCase()} crowd · {event.surgeRisk.toLowerCase()} surge risk
              </p>
              <small>{event.note}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
