"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { meals as fixtureMeals } from "@/data/mock";
import { formatActionTime } from "@/services/actionLogStore";
import { listMealLogs, type MealLog } from "@/services/mealLogStore";
import { onLocalDataChanged } from "@/services/localDataEvents";

export function NutritionLogsPanel() {
  const [logs, setLogs] = useState<MealLog[]>([]);

  useEffect(() => {
    const refresh = () => setLogs(listMealLogs());
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "mealLogs") refresh();
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  if (logs.length === 0 && fixtureMeals.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          title="No meal logs yet"
          body="Log breakfast, lunch, dinner, or training fueling. Entries stay on this device and show on the coach timeline."
        />
        <div className="mt-4 text-center">
          <Link href="/app/actions/log-meal" className="text-sm font-bold text-sky-300">
            Log a meal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {logs.map((meal) => (
        <Card
          key={meal.id}
          title={meal.athleteName ? `${meal.athleteName} · ${meal.mealType}` : meal.mealType}
          subtitle={formatActionTime(meal.loggedAt)}
        >
          {meal.hydration ? <p>Hydration: {meal.hydration}</p> : null}
          {meal.notes ? <p className="mt-1 text-sm text-slate-300">{meal.notes}</p> : null}
          <Link href="/app/accountability" className="mt-3 inline-block text-sm font-bold text-sky-300">
            See accountability →
          </Link>
        </Card>
      ))}
      {logs.length === 0 &&
        fixtureMeals.map((meal) => (
          <Card key={meal.athlete} title={meal.athlete} subtitle={`Hydration: ${meal.hydration}`}>
            <p>Breakfast: {meal.breakfast}</p>
            <p>Lunch: {meal.lunch}</p>
            <p>Dinner: {meal.dinner}</p>
          </Card>
        ))}
    </div>
  );
}
