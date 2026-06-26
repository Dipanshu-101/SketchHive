"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "outline";
  size?: "lg" | "sm";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function Button({
  variant,
  size = "sm",
  className = "",
  onClick,
  disabled = false,
  children,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:opacity-90 shadow-md",

    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",

    outline:
      "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    lg: "h-11 px-6 text-sm",
    sm: "h-9 px-4 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}