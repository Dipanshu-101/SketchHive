"use client";

import { ReactNode } from "react";
import { cssVar } from "./tokens";

export interface EmptyStateProps {
  /** Illustration or icon slot — the natural home for a bee mascot pose (§12). */
  illustration?: ReactNode;
  title: string;
  description?: string;
  /** Optional call-to-action(s) — e.g. a "Create room" button. */
  action?: ReactNode;
}

/**
 * Empty / no-results / 404 state (P0). Deliberately illustration-first: the doc
 * routes every empty-room, no-search-result, and 404 moment through this one
 * component with a swappable mascot pose + copy (§6, §12). Ships without a
 * mascot in Phase 1 — the `illustration` slot is where poses drop in later.
 */
export function EmptyState({
  illustration,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {illustration && (
        <div style={{ marginBottom: 24 }}>{illustration}</div>
      )}
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          fontFamily: cssVar.font.sans,
          color: cssVar.color.textPrimary,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: cssVar.font.sans,
            color: cssVar.color.textSecondary,
            margin: "10px 0 0",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}
