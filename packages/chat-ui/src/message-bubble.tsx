"use client";

import { type CSSProperties } from "react";
import { chatTheme } from "./theme";
import { Timestamp } from "./timestamp";
import type { ChatMessageView } from "./types";

/**
 * MessageBubble — a single readable message card.
 *
 * Readability is the contract: even though the panel behind it is frosted
 * glass, the bubble uses a darker, more opaque fill (see chatTheme.bubble*) so
 * the text never washes out. Own messages align right with the brand accent;
 * others align left on a neutral dark card.
 *
 * Grouping affordances:
 *   - `grouped` (this message follows another from the same sender) tightens the
 *     vertical gap and squares off the "tail" corner so a run reads as one unit.
 *   - the timestamp only needs to render on the last message of a run — the
 *     parent decides via `showTimestamp`.
 */
export interface MessageBubbleProps {
  message: ChatMessageView;
  /** True if the previous message is from the same sender (tighten + square tail). */
  grouped?: boolean;
  /** Whether to show the inline timestamp (usually only the last in a run). */
  showTimestamp?: boolean;
  /** Retry handler shown when status === "failed". */
  onRetry?: (message: ChatMessageView) => void;
}

export function MessageBubble({
  message,
  grouped = false,
  showTimestamp = true,
  onRetry,
}: MessageBubbleProps) {
  const isOwn = message.isOwn;
  const status = message.status ?? "sent";
  const failed = status === "failed";

  const rowStyle: CSSProperties = {
    display: "flex",
    justifyContent: isOwn ? "flex-end" : "flex-start",
    paddingLeft: isOwn ? 24 : 0,
    paddingRight: isOwn ? 0 : 24,
    marginTop: grouped ? 2 : 8,
  };

  // Square off the corner nearest the avatar/origin on the FIRST bubble of a
  // run; subsequent bubbles square the same side for a continuous column.
  const tail = 5;
  const r = chatTheme.radius;
  const bubbleStyle: CSSProperties = {
    position: "relative",
    maxWidth: "82%",
    padding: "8px 12px",
    borderRadius: isOwn
      ? `${r}px ${grouped ? tail : r}px ${tail}px ${r}px`
      : `${grouped ? tail : r}px ${r}px ${r}px ${tail}px`,
    background: isOwn ? chatTheme.bubbleOwn : chatTheme.bubbleOther,
    border: `1px solid ${isOwn ? chatTheme.bubbleOwnBorder : chatTheme.bubbleOtherBorder}`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
    color: chatTheme.text,
    opacity: status === "sending" ? 0.7 : 1,
    transition: "opacity 0.18s ease",
  };

  return (
    <div style={rowStyle}>
      <div style={bubbleStyle}>
        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            // Slight text shadow buys extra contrast over busy backdrops.
            textShadow: "0 1px 2px rgba(0,0,0,0.35)",
          }}
        >
          {message.message}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            marginTop: 3,
            minHeight: showTimestamp || status !== "sent" ? 14 : 0,
          }}
        >
          {failed ? (
            <button
              type="button"
              onClick={() => onRetry?.(message)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: 10.5,
                color: "rgba(252,165,165,0.95)",
                textDecoration: "underline",
              }}
            >
              Failed — retry
            </button>
          ) : status === "sending" ? (
            <span style={{ fontSize: 10.5, color: chatTheme.textFaint }}>
              Sending…
            </span>
          ) : (
            showTimestamp && <Timestamp value={message.createdAt} />
          )}
        </div>
      </div>
    </div>
  );
}
