"use client";

import { Spinner } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";

/**
 * CanvasStatus — a full-viewport, on-brand status screen for the canvas gate
 * (loading, redirecting, room-not-found, connection errors). Replaces the bare
 * "waiting for socket…" text with something that matches the SketchHive dark
 * theme and, where relevant, offers a way forward.
 */
export interface CanvasStatusProps {
  title: string;
  message: string;
  /** Optional primary action (e.g. "Back to rooms"). */
  actionLabel?: string;
  onAction?: () => void;
  /** Show a loading spinner instead of nothing above the text. */
  spinner?: boolean;
}

export function CanvasStatus({
  title,
  message,
  actionLabel,
  onAction,
  spinner = false,
}: CanvasStatusProps) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: cssVar.color.bgBase,
        color: cssVar.color.textPrimary,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          background: cssVar.color.bgElevated,
          border: `1px solid ${cssVar.color.border}`,
          borderRadius: 16,
          boxShadow: cssVar.shadow.lg,
          padding: "32px 28px",
        }}
      >
        {spinner && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Spinner size={28} />
          </div>
        )}

        <h1
          style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 10px",
            color: cssVar.color.textPrimary,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.6,
            color: cssVar.color.textMuted,
            margin: actionLabel ? "0 0 22px" : 0,
          }}
        >
          {message}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            style={{
              height: 42,
              padding: "0 22px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: cssVar.color.honey500,
              color: cssVar.color.textOnBrand,
              fontSize: 14,
              fontWeight: 700,
              transition: `filter ${cssVar.duration.base}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
