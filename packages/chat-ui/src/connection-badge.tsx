"use client";

import { chatTheme } from "./theme";

/**
 * ConnectionBadge — a tiny colored status dot + label reflecting the live
 * socket state. Surfaces "Reconnecting…" so a user never silently loses sync.
 */
export type ConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

export interface ConnectionBadgeProps {
  state: ConnectionState;
}

// Colors reference the design-system semantic tokens (with fallbacks) so status
// hues stay consistent with the rest of the app.
const WARNING = "var(--color-warning, #fbbf24)";
const SUCCESS = "var(--color-success, #34d399)";
const DANGER = "var(--color-danger, #f87171)";

const META: Record<ConnectionState, { color: string; label: string; pulse: boolean }> = {
  connecting: { color: WARNING, label: "Connecting", pulse: true },
  connected: { color: SUCCESS, label: "Connected", pulse: false },
  reconnecting: { color: WARNING, label: "Reconnecting", pulse: true },
  disconnected: { color: DANGER, label: "Offline", pulse: true },
};

export function ConnectionBadge({ state }: ConnectionBadgeProps) {
  const { color, label, pulse } = META[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10.5,
        color: chatTheme.textMuted,
        whiteSpace: "nowrap",
      }}
      title={label}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: pulse ? "chatBadgePulse 1.4s infinite ease-in-out" : "none",
        }}
      />
      {label}
      <style>{`
        @keyframes chatBadgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </span>
  );
}
