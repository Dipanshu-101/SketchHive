"use client";

import { cssVar } from "./tokens";

export interface SpinnerProps {
  size?: number; // px, default 20
  /** Stroke color — defaults to the honey accent. */
  color?: string;
  /** Track (unfilled ring) color. */
  trackColor?: string;
}

/**
 * Minimal, dependency-free loading spinner (P0). For fast, button-level loading.
 * Slow/meaningful actions (canvas load, account creation) should prefer a
 * mascot loading state later (§12) — not this.
 *
 * Relies on the `spin` keyframe defined in the app's globals.css.
 */
export function Spinner({
  size = 20,
  color = cssVar.color.honey500,
  trackColor = cssVar.color.border,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid ${trackColor}`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
