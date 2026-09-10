"use client";

import { useEffect, useState } from "react";
import {
  listRosterAthletes,
  resolveAthletes,
  type RosterAthlete,
} from "@/services/athleteRosterStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

/** Client roster + optional demo fixtures; refreshes on local roster changes. */
export function useResolvedAthletes(): {
  athletes: RosterAthlete[];
  rosterCount: number;
  ready: boolean;
} {
  const [athletes, setAthletes] = useState<RosterAthlete[]>([]);
  const [rosterCount, setRosterCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setAthletes(resolveAthletes());
      setRosterCount(listRosterAthletes().length);
      setReady(true);
    };
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "roster") refresh();
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  return { athletes, rosterCount, ready };
}
