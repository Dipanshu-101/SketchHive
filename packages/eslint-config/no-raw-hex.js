/**
 * no-raw-hex — a shared ESLint guard against design-token drift (§13).
 *
 * Flags raw hex color literals in string/template values so colors are added to
 * the token layer (globals.css `@theme` + tokens.ts), not scattered inline. Kept
 * as a WARNING to match the repo's `only-warn` philosophy — it nudges rather
 * than blocks, and the token source-of-truth files opt out.
 *
 * Intentionally does NOT flag rgba()/hsl() — those still appear in a few
 * bounded, documented places (canvas 2D paint, chat neutral overlays). Hex is
 * the highest-signal, lowest-false-positive thing to catch first.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const noRawHex = [
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
          message:
            "Raw hex color — reference a design token (var(--color-*) via cssVar, or token.*) instead of hardcoding. Add new colors to globals.css @theme + tokens.ts.",
        },
        {
          selector:
            "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
          message:
            "Raw hex color in template — reference a design token instead of hardcoding.",
        },
      ],
    },
  },
  {
    // The token source-of-truth files are the ONE place raw hex is allowed.
    files: ["**/tokens.ts", "**/theme.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
];
