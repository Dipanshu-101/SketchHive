"use client";

import { chatTheme } from "./theme";

/**
 * UnreadDivider — the "New messages" marker drawn just above the first message
 * the local user has not yet seen. The room layer decides where to place it
 * (e.g. the count captured when the panel was last closed); this component is
 * purely presentational.
 */
export interface UnreadDividerProps {
  label?: string;
}

export function UnreadDivider({ label = "New messages" }: UnreadDividerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "14px 4px 4px",
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${chatTheme.accentGlow})`,
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: chatTheme.accent,
          textShadow: `0 0 12px ${chatTheme.accentGlow}`,
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${chatTheme.accentGlow}, transparent)`,
        }}
      />
    </div>
  );
}
