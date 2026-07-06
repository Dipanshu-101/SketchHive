"use client";

import { ReactNode } from "react";
import { cssVar } from "./tokens";

/* ─────────────────────────────────────────
   Page layout wrapper: base surface + content
───────────────────────────────────────── */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: cssVar.color.bgBase,
        position: "relative",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
