"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessageView } from "@repo/chat-ui";
import { getLocalUserId } from "./auth";
import { useChatHistory } from "./hooks/useChatHistory";
import { useChatSocket } from "./hooks/useChatSocket";
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

  // Authoritative, server-confirmed messages keyed by id (history + echoes).
  const [confirmed, setConfirmed] = useState<Map<string, ChatMessageDTO>>(
    new Map()
  );
  // Optimistic messages still awaiting their server echo, in send order.
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [connection, setConnection] = useState<ChatConnectionState>(
    socket ? "connected" : "connecting"
  );

  // Local user id resolved once on mount (decode-only; see auth.ts). Stored in
  // state — not a ref — so the merged message list recomputes once it resolves
  // and own-message alignment is correct from the first render onward.
  const [localId, setLocalId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLocalId(getLocalUserId());
    setReady(true);
  }, []);

  // Seed confirmed map from history whenever it (re)loads.
  useEffect(() => {
    if (status !== "ready") return;
    setConfirmed((prev) => {
      const next = new Map(prev);
      for (const dto of history) next.set(dto.id, dto);
      return next;
    });
  }, [history, status]);

  // ---- live socket ingestion --------------------------------------------
  const handleIncoming = useCallback(
    (dto: ChatMessageDTO, clientId?: string) => {
      // Record the authoritative copy (idempotent — keyed by server id).
      setConfirmed((prev) => {
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
  useEffect(() => {
    if (!socket) {
      setConnection("connecting");
      return;
    }
    const sync = () => {
      switch (socket.readyState) {
        case WebSocket.OPEN:
          setConnection("connected");
          break;
        case WebSocket.CONNECTING:
          setConnection("connecting");
          break;
        default:
          setConnection("disconnected");
      }
    };
    sync();
    const onOpen = () => setConnection("connected");
    const onClose = () => setConnection("disconnected");
    socket.addEventListener("open", onOpen);
    socket.addEventListener("close", onClose);
    socket.addEventListener("error", onClose);
    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
      socket.removeEventListener("error", onClose);
    };
  }, [socket]);

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
    const confirmedViews = Array.from(confirmed.values()).map((dto) =>
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
  }, [confirmed, pending, localId]);

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
