"use client";

import type { ReactNode } from "react";
import { chatTheme } from "./theme";

/**
 * The non-message states of the transcript area: loading, empty, and error.
 * Bundled together because they share one centered layout and are mutually
 * exclusive — exactly one renders in place of the message list at a time.
 */

function CenteredState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
        padding: 24,
        color: chatTheme.textMuted,
      }}
    >
      <div style={{ opacity: 0.7 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: chatTheme.text }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12.5, lineHeight: 1.5, maxWidth: 220 }}>
          {subtitle}
        </div>
      )}
      {action}
    </div>
  );
}

/** Skeleton shimmer shown while history is loading. */
export function ChatLoadingState() {
  const rows = [70, 55, 80, 45, 65];
  return (
    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      {rows.map((w, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 8,
            flexDirection: i % 2 === 0 ? "row" : "row-reverse",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              animation: "chatPulse 1.4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: `${w}%`,
              height: 38,
              borderRadius: chatTheme.radius,
              background: "rgba(255,255,255,0.06)",
              animation: "chatPulse 1.4s ease-in-out infinite",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes chatPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

/** Shown when a room has no messages yet. */
export function ChatEmptyState() {
  return (
    <CenteredState
      icon={
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z"
            stroke={chatTheme.accent}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      }
      title="No messages yet"
      subtitle="Say hello to your collaborators — messages appear here in real time."
    />
  );
}

/** Shown when history failed to load. */
export function ChatErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <CenteredState
      icon={
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="rgba(252,165,165,0.9)" strokeWidth="1.5" />
          <path d="M12 7v6M12 16.5v.5" stroke="rgba(252,165,165,0.9)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      }
      title="Couldn’t load messages"
      subtitle="Something went wrong fetching the chat history."
      action={
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: 4,
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.07)",
              color: chatTheme.text,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        )
      }
    />
  );
}
