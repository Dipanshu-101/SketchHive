"use client";

import { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BeeMascot, FlightPath, type BeeCarry } from "@repo/ui";

/**
 * FloatingBee — a bee mascot with its dashed flight-path trail behind it,
 * wrapped in a Framer idle-float (gentle vertical bob + tiny rotation, natural
 * easing). This is the reference's bee motif: the bee ferries a colored shape
 * and trails a curved dotted path. Respects reduced-motion (holds still).
 */
export function FloatingBee({
  carry = "cube",
  size = 76,
  delay = 0,
  showPath = true,
  style,
  className,
}: {
  carry?: BeeCarry;
  size?: number;
  delay?: number;
  showPath?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={className}
      style={{ pointerEvents: "none", ...style }}
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
        <BeeMascot pose="flying" carry={carry} size={size} />
      </motion.div>
    </div>
  );
}
