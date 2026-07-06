"use client";

import { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";

/**
 * SectionHeading — the shared eyebrow + title block used by every marketing
 * section, so the vertical rhythm and type scale stay identical across the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth: align === "center" ? 640 : undefined,
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: cssVar.color.honey500,
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: cssVar.color.textPrimary,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.65,
            color: cssVar.color.textSecondary,
            margin: "16px auto 0",
            maxWidth: 560,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
