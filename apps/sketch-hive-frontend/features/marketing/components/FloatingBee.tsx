"use client";

import { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FlightPath } from "@repo/ui";

/**
 * FloatingBee — a static bee SVG with its dashed flight-path trail behind it,
 * wrapped in a Framer idle-float (gentle vertical bob + tiny rotation, natural
 * easing). Respects reduced-motion (holds still).
 *
 * The bee artwork is a plain static SVG served from `public/mascot/`. Each
 * `variant` maps to a `bee-<variant>.svg` file — drop new artwork in that folder
 * and reference it here. There is no dynamic bee + shape compositing; the shape
 * is baked into each SVG.
 */
export function FloatingBee({
  variant = "cube",
  size = 76,
  delay = 0,
  showPath = true,
  flip = false,
  style,
  className,
}: {
  /** Picks `public/mascot/bee-<variant>.svg`. */
  variant?: string;
  size?: number;
  delay?: number;
  showPath?: boolean;
  /**
   * Mirror the bee on the Y-axis so it faces the opposite way — use for
   * right-side bees so they fly *inward* toward the page center. Only the
   * artwork + its flight-path trail flip; the idle-float animation is applied on
   * an outer wrapper and is unaffected.
   */
  flip?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={className}
      // Decorative layer: sits behind section content (which grids sit at
      // z-index >= 1) but above the fixed HoneyAmbientBg backdrop. Never
      // intercepts pointer events, so it can't cover buttons/links/inputs.
      style={{ pointerEvents: "none", zIndex: 0, ...style }}
      aria-hidden="true"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0, -3, 0] }}
        transition={
          reduce
            ? undefined
            : {
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }
        }
        style={{ position: "relative", width: size, height: size }}
      >
        {/* Mirror the artwork + trail as one unit, so a flipped bee's flight
            path also reads as coming from the correct (inward) direction. The
            float/rotate wrapper above is untouched, preserving the animation. */}
        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            transform: flip ? "scaleX(-1)" : undefined,
            transformOrigin: "center",
          }}
        >
          {showPath && (
            <FlightPath
              width={size * 1.9}
              height={size}
              strokeWidth={2}
              style={{
                position: "absolute",
                top: -size * 0.15,
                left: -size * 1.25,
                opacity: 0.5,
              }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/mascot/bee-${variant}.svg`}
            alt=""
            width={size}
            height={size}
            style={{ display: "block", width: size, height: size }}
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
