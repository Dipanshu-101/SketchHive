"use client";

/**
 * Marketing motion presets — Framer Motion variants tuned to feel premium and
 * subtle (§ animations). Durations/easings mirror the design-system motion
 * tokens. Framer automatically respects `prefers-reduced-motion` when variants
 * animate transform/opacity; we also gate looping/idle motion on the
 * useReducedMotion hook at the component level.
 */

import type { Variants, Transition } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Parent that staggers its children's entrance. */
export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Standard whileInView props for section reveals. */
export const revealOnce = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, amount: 0.25 },
};

/** Card hover lift. */
export const hoverLift: Transition = { duration: 0.15, ease: EASE_OUT };

/** Button press. */
export const pressScale = { scale: 0.97 };
