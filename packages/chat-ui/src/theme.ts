/**
 * Design tokens for the chat UI.
 *
 * These reference the SketchHive design system via CSS variables (defined in the
 * host app's globals.css `@theme` block) so chat stays in lockstep with the
 * palette without importing @repo/ui — this package must remain transport- and
 * app-agnostic. The one hard requirement: message text must stay perfectly
 * readable on top of a glassmorphic, blurred panel, so bubbles use darker, more
 * opaque fills than the panel itself.
 *
 * Fallbacks (the second value in each var()) keep these usable even if a
 * consumer forgets to ship the token layer.
 */

export const chatTheme = {
  /** Brand accent used for own-message bubbles + focus rings (honey). */
  accent: "var(--color-honey-500, #f5a623)",
  accentDeep: "var(--color-honey-600, #d68c10)",
  accentGlow: "var(--color-honey-glow, rgba(245,166,35,0.2))",

  /** Text colors — high contrast against the dark, blurred backdrop. */
  text: "var(--color-text-primary, #f5f5f7)",
  textMuted: "var(--color-text-secondary, #a1a1aa)",
  textFaint: "var(--color-text-muted, #6b6b76)",

  /**
   * Bubble surfaces. Deliberately darker / more opaque than the GlassPanel so
   * the message text never washes out against whatever shows through the blur.
   * Own-message bubble is a low honey tint; others sit on the elevated surface.
   */
  bubbleOwn:
    "color-mix(in srgb, var(--color-honey-500, #f5a623) 22%, var(--color-bg-overlay, #1b1b22))",
  bubbleOwnBorder:
    "color-mix(in srgb, var(--color-honey-500, #f5a623) 45%, transparent)",
  bubbleOther: "var(--color-bg-elevated, #131318)",
  bubbleOtherBorder: "var(--color-border, #26262e)",

  /** Hairlines + soft separators. */
  hairline: "var(--color-border, #26262e)",

  /** Radii + spacing rhythm shared by bubbles, inputs and the panel. */
  radius: 16,
  radiusSm: 10,
  gap: 8,
} as const;

export type ChatTheme = typeof chatTheme;
