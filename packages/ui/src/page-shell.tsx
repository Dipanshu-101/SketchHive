"use client";

import { ReactNode } from "react";
import { WaterRippleBg } from "./water-ripple-bg";

/* ─────────────────────────────────────────
   Page layout wrapper: ripple bg + content
───────────────────────────────────────── */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        cursor: "none",
        position: "relative",
      }}
    >
      <WaterRippleBg />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
