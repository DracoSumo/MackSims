import { useState } from "react";
import type { RecentSearch, SavedPlace } from "../data/types";
import {
  clearRecentSearches,
  loadRecentSearches,
  loadSavedPlaces,
  removeSavedPlace
} from "../lib/storage";

interface SavedPlacesPanelProps {
  onSelectSearch: (search: RecentSearch) => void;
  onSelectPlace: (place: SavedPlace) => void;
}

/**
 * Saved places and recent searches, persisted in localStorage on the
 * tester's device. Empty states explain how the lists fill up.
 */
export function SavedPlacesPanel({ onSelectPlace, onSelectSearch }: SavedPlacesPanelProps) {
  const [places, setPlaces] = useState<SavedPlace[]>(() => loadSavedPlaces());
  const [searches, setSearches] = useState<RecentSearch[]>(() => loadRecentSearches());

  return (
    <section className="panel saved-places-panel">
      <div className="section-heading">
        <p className="eyebrow">Your shortcuts</p>
        <h2>Saved places and recent searches</h2>
        <p>Stored only in this browser via localStorage — no account or server involved.</p>
      </div>

      <div className="saved-places-columns">
        <div>
          <h3>Saved places</h3>
          {places.length === 0 ? (
            <p className="muted empty-hint">
              No saved places yet. Save a drop-off from the Compare screen and it appears here.
            </p>
          ) : (
            <div className="table-list">
              {places.map((place) => (
                <div className="table-row table-row--compact saved-place-row" key={place.id}>
                  <button className="linklike" type="button" onClick={() => onSelectPlace(place)}>
                    <strong>{place.label}</strong>
                    <small>{place.address}</small>
                  </button>
                  <button
                    aria-label={`Remove ${place.label}`}
                    className="remove-button"
                    type="button"
                    onClick={() => setPlaces(removeSavedPlace(place.id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="saved-places-subheading">
            <h3>Recent searches</h3>
            {searches.length > 0 && (
              <button className="remove-button" type="button" onClick={() => setSearches(clearRecentSearches())}>
                Clear all
              </button>
            )}
          </div>
          {searches.length === 0 ? (
            <p className="muted empty-hint">
              No recent searches yet. Run a comparison and your last trips show up here.
            </p>
          ) : (
            <div className="table-list">
              {searches.map((search) => (
                <div className="table-row table-row--compact" key={search.id}>
                  <button className="linklike" type="button" onClick={() => onSelectSearch(search)}>
                    <strong>
                      {search.pickup} → {search.dropoff}
                    </strong>
                    <small>Tap to compare this trip again</small>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
