"use client";

import React, { useState } from "react";

export type CardVariant = "glass" | "solid" | "outline";

export interface CardProps {
  variant?: CardVariant; // default: "glass"
  hover?: boolean; // default: true — enables lift + border glow on hover
  padding?: string | number; // default: "28px 24px"
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const variantBase: Record<CardVariant, React.CSSProperties> = {
  glass: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow:
      "0 2px 0 0 rgba(255,255,255,0.10) inset, 0 12px 40px rgba(0,0,0,0.5)",
  },
  solid: {
    background: "rgba(15,20,40,0.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  },
  outline: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "none",
  },
};

export function Card({
  variant = "glass",
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
          borderColor: "rgba(59,130,246,0.45)",
          boxShadow: `${base.boxShadow}, 0 0 24px rgba(59,130,246,0.15)`,
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
        borderRadius: 16,
        padding,
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
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
  color?: string; // default: "#60a5fa"
}

export function CardIcon({ children, color = "#60a5fa" }: CardIconProps) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "rgba(59,130,246,0.15)",
        border: "1px solid rgba(59,130,246,0.25)",
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
