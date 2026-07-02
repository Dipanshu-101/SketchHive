"use client";

import React, { useState } from "react";
import { token, cssVar } from "./tokens";

export type ButtonVariant = "primary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // default: "primary"
  size?: ButtonSize; // default: "md"
  loading?: boolean; // shows spinner + disables interaction
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/* Variants source every value from design tokens — no raw hex here (§2, §13).
   `primary` is the single honey CTA; everything else is grayscale surface. */
const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: cssVar.color.honey500,
    color: cssVar.color.textOnBrand,
    border: "none",
    boxShadow: cssVar.shadow.sm,
  },
  ghost: {
    background: cssVar.color.bgElevated,
    color: cssVar.color.textSecondary,
    border: `1px solid ${cssVar.color.border}`,
    boxShadow: "none",
  },
  outline: {
    background: "transparent",
    color: cssVar.color.textSecondary,
    border: `1px solid ${cssVar.color.borderStrong}`,
    boxShadow: "none",
  },
  danger: {
    background: "transparent",
    color: cssVar.color.danger,
    border: `1px solid ${cssVar.color.danger}`,
    boxShadow: "none",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "7px 16px", fontSize: 13, borderRadius: token.radius.md },
  md: { padding: "11px 22px", fontSize: 14, borderRadius: token.radius.md },
  lg: { padding: "13px 28px", fontSize: 15, borderRadius: token.radius.md },
};

/* Per-variant hover overrides — background lightens one step, no movement (§2). */
const variantHover: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: cssVar.color.honey400 },
  ghost: { background: cssVar.color.bgOverlay, borderColor: cssVar.color.borderHover },
  outline: { background: cssVar.color.bgElevated },
  danger: { background: cssVar.color.bgElevated },
};

/* Per-variant active/pressed background — pairs with pressScale (§2). */
const variantActive: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: cssVar.color.honey600 },
  ghost: { background: cssVar.color.bgElevated },
  outline: { background: cssVar.color.bgElevated },
  danger: { background: cssVar.color.bgElevated },
};

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const isDisabled = disabled || loading;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontFamily: cssVar.font.sans,
    letterSpacing: "-0.01em",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: `box-shadow ${cssVar.duration.base}, background ${cssVar.duration.base}, transform ${cssVar.duration.fast}`,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  // default → hover → active/pressed → focus-visible → disabled (§2)
  const hoverStyle = hovered && !isDisabled ? variantHover[variant] : undefined;
  const pressStyle =
    pressed && !isDisabled
      ? { ...variantActive[variant], transform: "scale(0.98)" }
      : undefined;
  const focusStyle =
    focused && !isDisabled ? { boxShadow: cssVar.shadow.glowHoney } : undefined;
  const loadingStyle: React.CSSProperties = loading ? { boxShadow: "none" } : {};
  const disabledStyle: React.CSSProperties =
    isDisabled && !loading ? { opacity: 0.4, boxShadow: "none" } : {};

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        setHovered(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setPressed(false);
        rest.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setPressed(true);
        rest.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        rest.onMouseUp?.(e);
      }}
      onFocus={(e) => {
        setFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        rest.onBlur?.(e);
      }}
      style={{
        ...base,
        ...hoverStyle,
        ...pressStyle,
        ...focusStyle,
        ...loadingStyle,
        ...disabledStyle,
        ...style,
      }}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: `2px solid ${cssVar.color.honeyGlow}`,
            borderTopColor: cssVar.color.textOnBrand,
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

export { Button };
export default Button;
