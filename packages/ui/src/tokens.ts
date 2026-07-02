/**
 * Design tokens — the JS mirror of the CSS `@theme` block in the app's
 * globals.css. These are the ONLY color/radius/shadow/motion constants a
 * reusable component is allowed to reference; no raw hex/rgba should appear in
 * component files (enforced by the no-raw-hex ESLint rule).
 *
 * Two forms are exported:
 *   • `cssVar.*`  → `var(--token)` strings. Prefer these — they let a component
 *      track theme changes at runtime and stay in sync with Tailwind utilities.
 *   • `token.*`   → raw literal values. Use only where a CSS variable can't be
 *      resolved (e.g. canvas 2D context fills, computed gradients).
 *
 * Keep this file in lockstep with globals.css `@theme`. It is the single source
 * of truth for the design system's presentational layer (§2 of the strategy).
 */

/** `var(--token)` references — the preferred form for component styles. */
export const cssVar = {
  color: {
    bgBase: "var(--color-bg-base)",
    bgElevated: "var(--color-bg-elevated)",
    bgOverlay: "var(--color-bg-overlay)",

    border: "var(--color-border)",
    borderHover: "var(--color-border-hover)",
    borderStrong: "var(--color-border-strong)",

    honey400: "var(--color-honey-400)",
    honey500: "var(--color-honey-500)",
    honey600: "var(--color-honey-600)",
    honeyGlow: "var(--color-honey-glow)",

    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",
    textMuted: "var(--color-text-muted)",
    textOnBrand: "var(--color-text-on-brand)",

    success: "var(--color-success)",
    danger: "var(--color-danger)",
    info: "var(--color-info)",
    warning: "var(--color-warning)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },
  shadow: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    glowHoney: "var(--shadow-glow-honey)",
  },
  duration: {
    fast: "var(--duration-fast)",
    base: "var(--duration-base)",
    medium: "var(--duration-medium)",
    slow: "var(--duration-slow)",
  },
  ease: {
    out: "var(--ease-out)",
    inOut: "var(--ease-in-out)",
  },
  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
} as const;

/**
 * Raw literal values — kept in sync with globals.css `@theme`. Reach for these
 * ONLY where CSS variables can't resolve (canvas 2D fills, JS-computed colors).
 * In normal component styling, prefer `cssVar.*`.
 */
export const token = {
  color: {
    bgBase: "#0a0a0f",
    bgElevated: "#131318",
    bgOverlay: "#1b1b22",

    border: "#26262e",
    borderHover: "#35353f",
    borderStrong: "#43434f",

    honey400: "#ffb84d",
    honey500: "#f5a623",
    honey600: "#d68c10",
    honeyGlow: "#f5a62333",

    textPrimary: "#f5f5f7",
    textSecondary: "#a1a1aa",
    textMuted: "#6b6b76",
    textOnBrand: "#1a1204",

    success: "#34d399",
    danger: "#f87171",
    info: "#60a5fa",
    warning: "#fbbf24",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  duration: { fast: 80, base: 150, medium: 250, slow: 300 },
} as const;

export type CssVarTokens = typeof cssVar;
export type RawTokens = typeof token;
