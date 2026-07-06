"use client";

import { CSSProperties } from "react";
import { cssVar } from "./tokens";

/**
 * BeeMascot — an original, geometric vector bee (NOT a 3D-render clone). It is
 * the narrative brand character used in hero margins, empty states, loading and
 * 404 (§12 of the strategy). Pure SVG so it themes with tokens, costs no binary
 * assets, and stays crisp at any size.
 *
 * `pose` nudges the character's attitude for different product moments:
 *   • flying   — default, wings up, slight forward lean (hero / decorative)
 *   • waving   — one arm raised (onboarding / greetings)
 *   • thinking — antennae curled, looking up (loading)
 *   • lost     — droop, question mark (404 / error / empty)
 */
export type BeePose = "flying" | "waving" | "thinking" | "lost";

/** A shape the bee carries below its body (reference: bees ferry colored
 *  cubes/triangles/spheres across the page). */
export type BeeCarry = "cube" | "triangle" | "sphere" | null;

const CARRY_COLOR: Record<Exclude<BeeCarry, null>, string> = {
  cube: "var(--color-note-lilac)",
  triangle: "var(--color-note-mint)",
  sphere: "var(--color-note-sky)",
};

export interface BeeMascotProps {
  size?: number; // px, default 96
  pose?: BeePose; // default "flying"
  /** Optional shape the bee ferries below itself (reference motif). */
  carry?: BeeCarry;
  /** Gentle idle bob — for illustration-only zones, never near the canvas. */
  float?: boolean;
  style?: CSSProperties;
  className?: string;
  title?: string;
}

export function BeeMascot({
  size = 96,
  pose = "flying",
  carry = null,
  float = false,
  style,
  className,
  title = "SketchHive bee",
}: BeeMascotProps) {
  const stripe = cssVar.color.textOnBrand; // near-black stripes on honey body

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
      className={className}
      style={{
        overflow: "visible",
        animation: float ? "beeFloat 3.6s ease-in-out infinite" : undefined,
        ...style,
      }}
    >
      <title>{title}</title>

      {/* ── Wings (behind body) ── */}
      <g
        style={{
          transformOrigin: "60px 42px",
          animation: "beeWing 0.9s ease-in-out infinite",
        }}
      >
        <ellipse
          cx="44"
          cy="40"
          rx="16"
          ry="22"
          transform="rotate(-24 44 40)"
          fill="var(--color-text-primary)"
          opacity="0.22"
          stroke="var(--color-text-primary)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <ellipse
          cx="76"
          cy="40"
          rx="16"
          ry="22"
          transform="rotate(24 76 40)"
          fill="var(--color-text-primary)"
          opacity="0.22"
          stroke="var(--color-text-primary)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </g>

      {/* ── Body ── */}
      <g>
        <ellipse
          cx="60"
          cy="66"
          rx="30"
          ry="26"
          fill="var(--color-honey-500)"
          stroke="var(--color-text-on-brand)"
          strokeWidth="2.5"
        />
        {/* stripes */}
        <path
          d="M52 44 Q60 42 68 44 L72 52 Q60 50 48 52 Z"
          fill={stripe}
          opacity="0.9"
        />
        <path
          d="M42 62 h36 M46 74 h28"
          stroke={stripe}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* face */}
        <circle cx="52" cy="60" r="3.2" fill={stripe} />
        <circle cx="68" cy="60" r="3.2" fill={stripe} />
        <circle cx="53" cy="59" r="1" fill="var(--color-text-primary)" />
        <circle cx="69" cy="59" r="1" fill="var(--color-text-primary)" />
        {pose === "lost" ? (
          <path
            d="M54 70 Q60 66 66 70"
            stroke={stripe}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M54 68 Q60 73 66 68"
            stroke={stripe}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* ── Antennae ── */}
      <g
        stroke="var(--color-text-on-brand)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M50 44 Q44 32 40 30" />
        <path d="M70 44 Q76 32 80 30" />
        <circle cx="40" cy="30" r="3" fill="var(--color-honey-400)" />
        <circle cx="80" cy="30" r="3" fill="var(--color-honey-400)" />
      </g>

      {/* ── Pose-specific accents ── */}
      {pose === "waving" && (
        <path
          d="M88 62 q10 -8 8 -18"
          stroke="var(--color-honey-500)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {pose === "lost" && (
        <text
          x="92"
          y="40"
          fontSize="22"
          fontWeight="800"
          fill="var(--color-honey-500)"
          fontFamily="var(--font-sans)"
        >
          ?
        </text>
      )}

      {/* ── Carried shape (reference: bees ferry colored shapes) ── */}
      {carry && (
        <g>
          {/* thread from body to shape */}
          <path
            d="M60 90 v10"
            stroke="var(--color-text-on-brand)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {carry === "cube" && (
            <rect
              x="48"
              y="100"
              width="24"
              height="24"
              rx="5"
              fill={CARRY_COLOR.cube}
              stroke="var(--color-text-on-brand)"
              strokeWidth="2"
              transform="rotate(8 60 112)"
            />
          )}
          {carry === "triangle" && (
            <path
              d="M60 100 L74 124 L46 124 Z"
              fill={CARRY_COLOR.triangle}
              stroke="var(--color-text-on-brand)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}
          {carry === "sphere" && (
            <circle
              cx="60"
              cy="112"
              r="13"
              fill={CARRY_COLOR.sphere}
              stroke="var(--color-text-on-brand)"
              strokeWidth="2"
            />
          )}
        </g>
      )}
    </svg>
  );
}
