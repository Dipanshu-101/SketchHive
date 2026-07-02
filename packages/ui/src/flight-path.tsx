"use client";

import { CSSProperties } from "react";

/**
 * FlightPath — the dashed, curved "flight path" the bee trails (§3). One
 * reusable motif: decorative section connector, onboarding-tour line, or a
 * literal path for CSS offset-path animations later. Pure SVG, themeable via
 * `color`, and optionally self-draws on mount.
 */
export interface FlightPathProps {
  /** SVG path `d`. Defaults to a gentle S-curve. */
  d?: string;
  width?: number; // viewBox width, default 240
  height?: number; // viewBox height, default 120
  color?: string; // stroke color, default honey
  strokeWidth?: number; // default 2
  /** Animate the dashes drawing themselves in on mount. */
  animate?: boolean;
  style?: CSSProperties;
  className?: string;
}

const DEFAULT_D = "M4 96 C 60 20, 120 140, 236 40";

export function FlightPath({
  d = DEFAULT_D,
  width = 240,
  height = 120,
  color = "var(--color-honey-500)",
  strokeWidth = 2,
  animate = false,
  style,
  className,
}: FlightPathProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ overflow: "visible", ...style }}
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="2 10"
        opacity="0.6"
        style={
          animate
            ? {
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: "flightDraw 2s var(--ease-out) forwards",
              }
            : undefined
        }
      />
    </svg>
  );
}
