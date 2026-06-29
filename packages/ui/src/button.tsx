//https://uiverse.io/zjssun/curly-seahorse-76
"use client";

import React, { useState } from "react";

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

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    border: "none",
    boxShadow: "0 0 28px rgba(79,70,229,0.4), 0 1px 0 rgba(255,255,255,0.15) inset",
  },
  ghost: {
    background: "rgba(255,255,255,0.07)",
    color: "rgba(210,225,255,0.85)",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "none",
  },
  outline: {
    background: "transparent",
    color: "rgba(210,225,255,0.85)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "none",
  },
  danger: {
    background: "rgba(239,68,68,0.15)",
    color: "rgba(252,165,165,0.95)",
    border: "1px solid rgba(239,68,68,0.3)",
    boxShadow: "none",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "7px 16px", fontSize: 13, borderRadius: 8 },
  md: { padding: "11px 22px", fontSize: 14, borderRadius: 10 },
  lg: { padding: "13px 28px", fontSize: 15, borderRadius: 11 },
};

/* Per-variant hover overrides applied on mouseEnter */
const variantHover: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    boxShadow: "0 0 36px rgba(79,70,229,0.6), 0 1px 0 rgba(255,255,255,0.15) inset",
    transform: "translateY(-1px)",
  },
  ghost: {
    background: "rgba(255,255,255,0.12)",
  },
  outline: {
    background: "rgba(255,255,255,0.12)",
  },
  danger: {
    background: "rgba(239,68,68,0.25)",
  },
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

  const isDisabled = disabled || loading;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "box-shadow 0.15s, background 0.15s, transform 0.15s",
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const hoverStyle =
    hovered && !isDisabled ? variantHover[variant] : undefined;

  // No glow when loading; dim + no glow when disabled.
  const loadingStyle: React.CSSProperties = loading ? { boxShadow: "none" } : {};
  const disabledStyle: React.CSSProperties =
    isDisabled && !loading ? { opacity: 0.55, boxShadow: "none" } : {};

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
        rest.onMouseLeave?.(e);
      }}
      style={{ ...base, ...hoverStyle, ...loadingStyle, ...disabledStyle, ...style }}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

export { Button };
export default Button;
