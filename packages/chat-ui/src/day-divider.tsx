"use client";

import { chatTheme } from "./theme";

/**
 * DayDivider — a centered "Today / Yesterday / Mar 14" separator inserted
 * between messages that fall on different calendar days. Gives a long
 * transcript temporal structure at a glance.
 */
export interface DayDividerProps {
  /** Any timestamp (epoch ms) that falls on the day being introduced. */
  value: number;
}

function labelFor(value: number): string {
  const d = new Date(value);
  const now = new Date();
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayMs = 86_400_000;
  const diffDays = Math.round((startOf(now) - startOf(d)) / dayMs);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

export function DayDivider({ value }: DayDividerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "18px 4px 6px",
      }}
    >
      <span style={{ flex: 1, height: 1, background: chatTheme.hairline }} />
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: chatTheme.textFaint,
        }}
      >
        {labelFor(value)}
      </span>
      <span style={{ flex: 1, height: 1, background: chatTheme.hairline }} />
    </div>
  );
}
