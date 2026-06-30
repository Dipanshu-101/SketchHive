"use client";

import type { CSSProperties } from "react";
import { chatTheme } from "./theme";

/**
 * Timestamp — renders an epoch-ms time as a short, locale-aware clock label
 * (e.g. "14:32") with the full date/time exposed on hover via `title`.
 *
 * Kept as its own primitive so every surface formats time identically and so a
 * future "relative time" mode (just now / 5m / yesterday) can land in one place.
 */
export interface TimestampProps {
  value: number;
  style?: CSSProperties;
}

function formatClock(value: number): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFull(value: number): string {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Timestamp({ value, style }: TimestampProps) {
  return (
    <time
      dateTime={new Date(value).toISOString()}
      title={formatFull(value)}
      style={{
        fontSize: 10.5,
        color: chatTheme.textFaint,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {formatClock(value)}
    </time>
  );
}
