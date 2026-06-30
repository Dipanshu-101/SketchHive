"use client";

import type { CSSProperties } from "react";
import { Avatar } from "./avatar";
import { MessageBubble } from "./message-bubble";
import { chatTheme } from "./theme";
import type { ChatMessageView } from "./types";

/**
 * MessageGroup — a run of consecutive messages from the SAME sender, rendered
 * as a single visual unit: one avatar + one name header, then a tight column of
 * bubbles. This is the Figma/Slack/Miro convention and is what makes a busy
 * transcript readable instead of a wall of repeated names.
 *
 * The parent (ChatMessages) is responsible for partitioning the flat message
 * list into groups (same sender, close in time). This component only renders a
 * group it is handed — keeping the grouping policy in one place and the
 * rendering dumb and reusable.
 */
export interface MessageGroupProps {
  messages: ChatMessageView[];
  onRetry?: (message: ChatMessageView) => void;
}

export function MessageGroup({ messages, onRetry }: MessageGroupProps) {
  const first = messages[0];
  if (!first) return null;

  const isOwn = first.isOwn;

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginTop: 14,
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: isOwn ? "row-reverse" : "row",
    marginBottom: 2,
    padding: isOwn ? "0 2px 0 24px" : "0 24px 0 2px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <Avatar name={first.senderName} seed={first.senderId} size={26} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: chatTheme.textMuted,
            letterSpacing: "-0.01em",
          }}
        >
          {isOwn ? "You" : first.senderName}
        </span>
      </div>

      {messages.map((message, idx) => (
        <MessageBubble
          key={message.id}
          message={message}
          grouped={idx > 0}
          showTimestamp={idx === messages.length - 1}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}
