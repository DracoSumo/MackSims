import type { AdminMetric } from "../data/types";

interface AdminMetricCardProps {
  metric: AdminMetric;
}

export function AdminMetricCard({ metric }: AdminMetricCardProps) {
  return (
    <article className={`card admin-metric admin-metric--${metric.tone}`}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <p>{metric.trend}</p>
      <small>{metric.description}</small>
    </article>
  );
}
