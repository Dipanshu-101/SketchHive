"use client";

import { chatTheme } from "./theme";

/**
 * TypingIndicator — the animated "● ● ●" bubble shown while one or more peers
 * are composing. Version 1 does not wire up typing events over the socket, but
 * the component exists now so the future feature is a pure data change (feed it
 * a list of names) with zero new UI work. Render nothing when no one is typing.
 */
export interface TypingIndicatorProps {
  /** Display names of peers currently typing. */
  names?: string[];
}

function phrase(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return `${names[0]} is typing`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
  return `${names[0]} and ${names.length - 1} others are typing`;
}

export function TypingIndicator({ names = [] }: TypingIndicatorProps) {
  if (names.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        color: chatTheme.textMuted,
        fontSize: 11.5,
      }}
    >
      <span style={{ display: "inline-flex", gap: 3 }} aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: chatTheme.textMuted,
              animation: `chatTypingBounce 1.2s ${i * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </span>
      <span>{phrase(names)}</span>
      <style>{`
        @keyframes chatTypingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
