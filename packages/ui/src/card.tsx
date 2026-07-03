"use client";

import React, { useState } from "react";
import { token, cssVar } from "./tokens";

export type CardVariant = "glass" | "solid" | "outline";

export interface CardProps {
  variant?: CardVariant; // default: "solid" (elevated card — §5)
  hover?: boolean; // default: true — enables lift + border glow on hover
  padding?: string | number; // default: "28px 24px"
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/* Three surface variants mapped to the strategy's surface system (§5):
   • solid   → elevated card (bg-elevated + shadow-md + border). The default.
   • glass   → floating glass, ONLY for things hovering over dynamic content.
   • outline → flat/ghost, no fill. */
const variantBase: Record<CardVariant, React.CSSProperties> = {
  solid: {
    background: cssVar.color.bgElevated,
    border: `1px solid ${cssVar.color.border}`,
    boxShadow: cssVar.shadow.md,
  },
  glass: {
    background: `color-mix(in srgb, ${cssVar.color.bgOverlay} 85%, transparent)`,
    backdropFilter: "blur(24px) saturate(140%)",
    WebkitBackdropFilter: "blur(24px) saturate(140%)",
    border: `1px solid ${cssVar.color.borderHover}`,
    boxShadow: cssVar.shadow.lg,
  },
  outline: {
    background: "transparent",
    border: `1px solid ${cssVar.color.border}`,
    boxShadow: "none",
  },
};

export function Card({
  variant = "solid",
  hover = true,
  padding = "28px 24px",
  children,
  style,
  className,
  onClick,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const base = variantBase[variant];

  const hoverStyle: React.CSSProperties =
    hover && hovered
      ? {
          // Use the `border` shorthand to match `variantBase` — mixing it with
          // `borderColor` across rerenders triggers a React styling warning.
          border: `1px solid ${cssVar.color.honey500}`,
          boxShadow: `${base.boxShadow}, ${cssVar.shadow.glowHoney}`,
          transform: "translateY(-2px)",
        }
      : {};

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={hover ? () => setHovered(true) : undefined}
      onMouseLeave={hover ? () => setHovered(false) : undefined}
      style={{
        borderRadius: token.radius.lg,
        padding,
        transition: `border-color ${cssVar.duration.medium}, box-shadow ${cssVar.duration.medium}, transform ${cssVar.duration.medium}`,
        ...base,
        ...hoverStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardIconProps {
  children: React.ReactNode;
  color?: string; // default: honey accent
}

export function CardIcon({ children, color = cssVar.color.honey500 }: CardIconProps) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: token.radius.md,
        background: cssVar.color.honeyGlow,
        border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 30%, transparent)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
      }}
    >
      {children}
    </div>
  );
}
