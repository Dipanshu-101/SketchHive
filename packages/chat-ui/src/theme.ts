/**
 * Design tokens for the chat UI.
 *
 * These mirror the SketchHive design system (see app/globals.css and
 * packages/ui) but are tuned for ONE hard requirement: message text must stay
 * perfectly readable on top of a glassmorphic, blurred panel. That is why
 * bubbles use darker, more opaque translucent fills than the panel itself —
 * the panel is frosted glass, the bubbles are legible cards floating on it.
 */

export const chatTheme = {
  /** Brand accent used for own-message bubbles + focus rings. */
  accent: "#4f8cff",
  accentDeep: "#2563eb",
  accentGlow: "rgba(79,140,255,0.45)",

  /** Text colors — high contrast against the dark, blurred backdrop. */
  text: "#eef3fb",
  textMuted: "rgba(190,205,230,0.62)",
  textFaint: "rgba(180,200,240,0.4)",

  /**
   * Bubble surfaces. Deliberately darker / more opaque than the GlassPanel so
   * the message text never washes out against whatever shows through the blur.
   */
  bubbleOwn: "rgba(43,86,168,0.55)",
  bubbleOwnBorder: "rgba(120,170,255,0.45)",
  bubbleOther: "rgba(15,20,34,0.62)",
  bubbleOtherBorder: "rgba(255,255,255,0.10)",

  /** Hairlines + soft separators. */
  hairline: "rgba(255,255,255,0.08)",

  /** Radii + spacing rhythm shared by bubbles, inputs and the panel. */
  radius: 16,
  radiusSm: 10,
  gap: 8,
} as const;

export type ChatTheme = typeof chatTheme;
