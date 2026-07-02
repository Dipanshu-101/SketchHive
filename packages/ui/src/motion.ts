/**
 * Motion primitives — shared animation constants + variant definitions (§4).
 *
 * Phase 1 defines these but wires NO page animations yet. The variant objects
 * are shaped to drop straight into Framer Motion (`<motion.div variants={...}>`)
 * once it's added, but this module has zero runtime dependencies so importing it
 * costs nothing. Durations/easings mirror the CSS `@theme` motion tokens so
 * JS-driven and CSS-driven motion stay visually identical.
 *
 * Principle (§4): every animation either confirms an action just happened or
 * guides attention to something new. Nothing animates just because it can.
 */

/** Canonical durations in seconds (Framer uses seconds; CSS uses ms). */
export const duration = {
  fast: 0.08, // press / tactile feedback
  base: 0.15, // hover, micro-states
  medium: 0.25, // panels sliding
  slow: 0.3, // content entering
} as const;

/** Canonical easings — match the CSS `--ease-*` tokens. */
export const easing = {
  out: [0.16, 1, 0.3, 1] as const, // cubic-bezier(0.16,1,0.3,1)
  inOut: [0.65, 0, 0.35, 1] as const,
} as const;

/** Spring preset for pop-in surfaces (modals, dropdowns). */
export const spring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
} as const;

/* ── Framer-compatible variants ────────────────────────────────────────── */

/** Cards entering viewport, modal content. 300ms ease-out. */
export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.out },
  },
} as const;

/** Simple opacity fade — tooltips, overlays. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base } },
} as const;

/** Modals, dropdowns, popovers. 200ms spring. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring },
} as const;

/** Drawer, chat panel, participant rail. 250ms ease-out. */
export const slideInPanel = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: duration.medium, ease: easing.out },
  },
} as const;

/** Button / card active state. Use as a `whileTap`. */
export const pressScale = {
  scale: 0.98,
  transition: { duration: duration.fast },
} as const;

/** Feature-card grids, room lists — orchestrates children entrance. */
export const staggerChildren = {
  visible: { transition: { staggerChildren: 0.05 } }, // 50ms
} as const;

/**
 * Idle bee illustrations — gentle Y bob + slight rotate, 3–4s infinite loop.
 * Illustration-only zones (empty/auth screens) — NEVER inside the canvas (§4,
 * §13: ambient motion near the drawing surface reads as a bug).
 */
export const beeFloat = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: easing.inOut },
  },
} as const;

export type MotionVariant =
  | typeof fadeInUp
  | typeof fadeIn
  | typeof scaleIn
  | typeof slideInPanel;
