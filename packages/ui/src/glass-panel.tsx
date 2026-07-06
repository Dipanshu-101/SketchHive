"use client";

import { CSSProperties, ReactNode } from "react";
import { token, cssVar } from "./tokens";

/* ─────────────────────────────────────────
   Floating glass surface (§5, surface type 3)

   Reserved for things that hover OVER dynamic content — modals, auth panels,
   toolbars. Do not use for cards sitting in static layout (use <Card /> — the
   elevated surface — for those).
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
    background: `color-mix(in srgb, ${cssVar.color.bgOverlay} 85%, transparent)`,
    backdropFilter: "blur(24px) saturate(140%)",
    WebkitBackdropFilter: "blur(24px) saturate(140%)",
    borderRadius: token.radius.xl,
    border: `1px solid ${cssVar.color.borderHover}`,
    boxShadow: cssVar.shadow.lg,
  };

  return (
    <div className={className} style={{ ...base, ...style }}>
      {children}
    </div>
  );
}
