"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessageView } from "@repo/chat-ui";
import { getLocalUserId } from "@/lib/auth";
import { useChatHistory } from "./hooks/useChatHistory";
import { useChatSocket } from "./hooks/useChatSocket";
import { useConnectionState } from "./hooks/useConnectionState";
import type { ChatConnectionState, ChatMessageDTO } from "./types";

/** A pending optimistic message: rendered immediately, awaiting server echo. */
interface PendingMessage {
  clientId: string;
  text: string;
  createdAt: number;
  status: "sending" | "failed";
}

export interface UseChatValue {
  messages: ChatMessageView[];
  status: "loading" | "ready" | "error";
  connection: ChatConnectionState;
  /** True until the local user id is resolved (own-message alignment). */
  ready: boolean;
  sendMessage: (text: string) => void;
  retry: (message: ChatMessageView) => void;
  reload: () => void;
}

/** Monotonic-ish client id for optimistic messages. Uses crypto.randomUUID
 *  where available; falls back to a counter+time string otherwise. */
let clientSeq = 0;
function nextClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `c_${crypto.randomUUID()}`;
  }
  return `c_${Date.now()}_${clientSeq++}`;
}

function toView(dto: ChatMessageDTO, localId: string | null): ChatMessageView {
  return {
    id: dto.id,
    senderId: dto.senderId,
    senderName: dto.senderName,
    message: dto.message,
    createdAt: new Date(dto.createdAt).getTime(),
    isOwn: localId !== null && dto.senderId === localId,
    status: "sent",
  };
}

/**
 * useChat — the single source of truth for a room's chat.
 *
 * Responsibilities:
 *   1. Load history (HTTP) and expose its loading/error status.
 *   2. Append live messages from the socket WITHOUT refetching.
 *   3. Optimistic send: show the message instantly as "sending", then swap it
 *      for the authoritative server copy when the echo (matched by clientId)
 *      arrives. Mark it "failed" if the socket is down.
 *   4. Track connection state derived from the shared socket.
 *   5. De-duplicate by server id so a message is never shown twice.
 *
 * The component tree only ever sees a flat, ordered ChatMessageView[]; all the
 * merging/optimistic bookkeeping is contained here.
 */
export function useChat(
  roomId: string,
  socket: WebSocket | null
): UseChatValue {
  const { messages: history, status, reload } = useChatHistory(roomId);

  // Live messages that arrived over the socket AFTER load, keyed by server id.
  // History is kept separate (it owns the HTTP fetch) and the two are merged in
  // the view memo below — so there is no "seed history into state" effect and
  // therefore no setState-in-effect cascade.
  const [live, setLive] = useState<Map<string, ChatMessageDTO>>(new Map());
  // Optimistic messages still awaiting their server echo, in send order.
  const [pending, setPending] = useState<PendingMessage[]>([]);

  // Local user id resolved once, lazily (decode-only; see auth.ts). A lazy
  // initializer runs during the first render only and reads localStorage, which
  // is safe here because the whole chat tree is client-only ("use client").
  const [localId] = useState<string | null>(() => getLocalUserId());
  const ready = true;

  // ---- live socket ingestion --------------------------------------------
  const handleIncoming = useCallback(
    (dto: ChatMessageDTO, clientId?: string) => {
      // Record the authoritative copy (idempotent — keyed by server id).
      setLive((prev) => {
        const next = new Map(prev);
        next.set(dto.id, dto);
        return next;
      });
      // If this echoes one of OUR optimistic sends, drop the placeholder.
      if (clientId) {
        setPending((prev) => prev.filter((p) => p.clientId !== clientId));
      }
    },
    []
  );

  const { send } = useChatSocket({ socket, roomId, onMessage: handleIncoming });

  // ---- connection state tracking ----------------------------------------
  // The socket is an external store; useConnectionState reads it via
  // useSyncExternalStore (no state mirroring, no effect cascade).
  const connection = useConnectionState(socket);

  // When the socket reopens after a drop, refetch history so we recover any
  // messages that were broadcast while we were offline (the socket only
  // delivers messages sent AFTER (re)subscription).
  const prevConn = useRef<ChatConnectionState>(connection);
  useEffect(() => {
    if (prevConn.current === "disconnected" && connection === "connected") {
      reload();
    }
    prevConn.current = connection;
  }, [connection, reload]);

  // ---- sending ----------------------------------------------------------
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const clientId = nextClientId();
      const ok = send(trimmed, clientId);
      setPending((prev) => [
        ...prev,
        {
          clientId,
          text: trimmed,
          createdAt: Date.now(),
          status: ok ? "sending" : "failed",
        },
      ]);
    },
    [send]
  );

  const retry = useCallback(
    (message: ChatMessageView) => {
      // Optimistic messages carry the clientId as their view id.
      setPending((prev) => {
        const target = prev.find((p) => p.clientId === message.id);
        if (!target) return prev;
        const newId = nextClientId();
        const ok = send(target.text, newId);
        return prev.map((p) =>
          p.clientId === message.id
            ? { ...p, clientId: newId, status: ok ? "sending" : "failed" }
            : p
        );
      });
    },
    [send]
  );

  // ---- merged, ordered view list ----------------------------------------
  const messages = useMemo<ChatMessageView[]>(() => {
    // Merge history (HTTP) with live echoes (socket), de-duplicated by server
    // id — live wins, since it's the freshest copy of the same row.
    const byId = new Map<string, ChatMessageDTO>();
    for (const dto of history) byId.set(dto.id, dto);
    for (const [id, dto] of live) byId.set(id, dto);

    const confirmedViews = Array.from(byId.values()).map((dto) =>
      toView(dto, localId)
    );
    confirmedViews.sort((a, b) => a.createdAt - b.createdAt);

    const pendingViews: ChatMessageView[] = pending.map((p) => ({
      id: p.clientId,
      senderId: localId ?? "__me__",
      senderName: "You",
      message: p.text,
      createdAt: p.createdAt,
      isOwn: true,
      status: p.status,
    }));

    // Pending always sorts after confirmed (they're the newest, unsent).
    return [...confirmedViews, ...pendingViews];
  }, [history, live, pending, localId]);

  return {
    messages,
    status,
    connection,
    ready,
    sendMessage,
    retry,
    reload,
  };
}
