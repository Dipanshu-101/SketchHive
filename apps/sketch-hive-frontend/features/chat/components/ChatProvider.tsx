"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useChat, type UseChatValue } from "../useChat";

/**
 * ChatProvider — runs the chat engine (useChat) exactly ONCE per room and shares
 * it through context.
 *
 * Why a provider instead of prop-drilling: the panel header (connection badge),
 * the message list, and the composer all need slices of the same chat state. A
 * single provider guarantees one history fetch and one socket subscription no
 * matter how the UI is composed, and keeps each consumer free to re-render on
 * just the slice it reads.
 */
const ChatContext = createContext<UseChatValue | null>(null);

export function ChatProvider({
  roomId,
  socket,
  children,
}: {
  roomId: string;
  socket: WebSocket | null;
  children: ReactNode;
}) {
  const value = useChat(roomId, socket);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): UseChatValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a <ChatProvider>");
  }
  return ctx;
}
