import type { SVGProps } from "react";

/**
 * BeeMark — the brand mark (a simple bee-in-hexagon glyph). Custom because
 * lucide has no bee-in-hexagon. Inherits color via `currentColor` and size via
 * width/height props (default 24) so callers style it like any other icon.
 *
 * This is the seed of `@repo/icons`: one SVG per file, PascalCase, tree-shakeable
 * (§3). Add further custom brand glyphs alongside and re-export from index.ts.
 */
export function BeeMark({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* hexagon */}
      <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" />
      {/* bee body */}
      <ellipse cx="12" cy="12.5" rx="2.6" ry="3.4" />
      <path d="M9.4 12.5h5.2M9.6 14.4h4.8" />
      {/* wings */}
      <path d="M12 10c-1.6-1.8-3.8-1.8-4.4-.4-.5 1.2 1 2.4 2.6 2.2" />
      <path d="M12 10c1.6-1.8 3.8-1.8 4.4-.4.5 1.2-1 2.4-2.6 2.2" />
    </svg>
  );
}
