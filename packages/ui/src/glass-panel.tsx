"use client";

import { CSSProperties, ReactNode } from "react";

/* ─────────────────────────────────────────
   Frosted-glass container
───────────────────────────────────────── */
export function GlassPanel({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const base: CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(32px) saturate(160%)",
    WebkitBackdropFilter: "blur(32px) saturate(160%)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.04),
      0 2px 0 0 rgba(255,255,255,0.18) inset,
      0 -1px 0 0 rgba(255,255,255,0.06) inset,
      0 32px 80px rgba(0,0,0,0.8),
      0 4px 20px rgba(0,0,0,0.5)
    `,
  };

  return (
    <div className={className} style={{ ...base, ...style }}>
      {children}
    </div>
  );
}
