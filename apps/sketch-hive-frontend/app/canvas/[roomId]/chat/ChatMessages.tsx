"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChatEmptyState,
  ChatErrorState,
  ChatLoadingState,
  DayDivider,
  MessageGroup,
  ScrollArea,
  chatTheme,
  type ChatMessageView,
} from "@repo/chat-ui";
import { useChatContext } from "./ChatProvider";

/**
 * ChatMessages — owns the transcript: grouping policy, day dividers, auto-scroll
 * and the "jump to latest" affordance.
 *
 * Grouping policy lives HERE (not in the package) because it's a product
 * decision: consecutive messages from the same sender within 5 minutes collapse
 * into one MessageGroup; a calendar-day change inserts a DayDivider. The package
 * stays dumb and reusable; the room decides how to bucket.
 */

const GROUP_WINDOW_MS = 5 * 60 * 1000;

type Segment =
  | { kind: "day"; key: string; at: number }
  | { kind: "group"; key: string; messages: ChatMessageView[] };

function sameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/** Partition the flat, ordered message list into day dividers and sender runs. */
function segment(messages: ChatMessageView[]): Segment[] {
  const out: Segment[] = [];
  let current: ChatMessageView[] | null = null;
  let prev: ChatMessageView | null = null;

  for (const m of messages) {
    const dayBreak = !prev || !sameDay(prev.createdAt, m.createdAt);
    if (dayBreak) {
      out.push({ kind: "day", key: `day-${m.id}`, at: m.createdAt });
      current = null;
    }

    const continues =
      current &&
      prev &&
      prev.senderId === m.senderId &&
      m.createdAt - prev.createdAt <= GROUP_WINDOW_MS &&
      !dayBreak;

    if (continues && current) {
      current.push(m);
    } else {
      current = [m];
      out.push({ kind: "group", key: `grp-${m.id}`, messages: current });
    }
    prev = m;
  }
  return out;
}

export function ChatMessages() {
  const { messages, status, retry, reload } = useChatContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const [showJump, setShowJump] = useState(false);

  const segments = useMemo(() => segment(messages), [messages]);

  // Track whether the user is near the bottom; only then do we auto-stick.
  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distance < 80;
    setPinnedToBottom(near);
    setShowJump(!near);
  }

  // Auto-scroll on new messages — but ONLY if the user was already at the
  // bottom, so reading history isn't interrupted. useLayoutEffect avoids a
  // visible jump between paint and scroll.
  useLayoutEffect(() => {
    if (!pinnedToBottom) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pinnedToBottom]);

  // On first successful load, jump straight to the latest message.
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (status === "ready" && !didInitialScroll.current) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      didInitialScroll.current = true;
    }
  }, [status]);

  function jumpToLatest() {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowJump(false);
    setPinnedToBottom(true);
  }

  // Non-message states replace the list entirely.
  if (status === "loading") return <ChatLoadingState />;
  if (status === "error") return <ChatErrorState onRetry={reload} />;
  if (messages.length === 0) return <ChatEmptyState />;

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
      <ScrollArea
        ref={scrollRef}
        onScroll={onScroll}
        style={{ height: "100%", padding: "8px 10px 12px" }}
      >
        {segments.map((seg) =>
          seg.kind === "day" ? (
            <DayDivider key={seg.key} value={seg.at} />
          ) : (
            <MessageGroup key={seg.key} messages={seg.messages} onRetry={retry} />
          )
        )}
      </ScrollArea>

      {showJump && (
        <button
          type="button"
          onClick={jumpToLatest}
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 14px",
            borderRadius: 999,
            border: `1px solid ${chatTheme.bubbleOwnBorder}`,
            background: chatTheme.bubbleOwn,
            backdropFilter: "blur(8px)",
            color: chatTheme.text,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: `0 4px 16px rgba(0,0,0,0.45), 0 0 16px ${chatTheme.accentGlow}`,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ↓ Latest
        </button>
      )}
    </div>
  );
}
