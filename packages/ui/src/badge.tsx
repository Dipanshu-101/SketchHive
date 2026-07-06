"use client";

import { ReactNode } from "react";
import { token, cssVar } from "./tokens";

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "danger"
  | "info"
  | "warning";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant; // default: "neutral"
  /** Small dot before the label — useful for status indicators. */
  dot?: boolean;
}

const variantColor: Record<BadgeVariant, string> = {
  neutral: cssVar.color.textSecondary,
  brand: cssVar.color.honey500,
  success: cssVar.color.success,
  danger: cssVar.color.danger,
  info: cssVar.color.info,
  warning: cssVar.color.warning,
};

/** Small status/label pill (P0). Tinted from a single accent per variant. */
export function Badge({ children, variant = "neutral", dot = false }: BadgeProps) {
  const color = variantColor[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: cssVar.font.sans,
        letterSpacing: "0.01em",
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        borderRadius: token.radius.sm,
        padding: "3px 10px",
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
          }}
        />
      )}
      {children}
    </span>
  );
}
