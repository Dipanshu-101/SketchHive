"use client";

import { useEffect, useRef } from "react";
import type { ChatMessageDTO, OutgoingChatFrame } from "../types";

interface UseChatSocketArgs {
  socket: WebSocket | null;
  roomId: string;
  /** Called for every authoritative `chat_message` the server broadcasts. */
  onMessage: (dto: ChatMessageDTO, clientId?: string) => void;
}

interface UseChatSocketResult {
  /** Sends a chat message. Returns false if the socket isn't open. */
  send: (text: string, clientId: string) => boolean;
}

/**
 * Bridges the chat layer to the EXISTING shared room WebSocket.
 *
 * Critical coexistence detail: the drawing engine (draw/Game.ts) owns
 * `socket.onmessage` (it assigns the property directly). We must not clobber it,
 * so we subscribe with `addEventListener("message", …)` instead — both the
 * property handler and any number of listeners fire for each frame. We then
 * filter to ONLY `type: "chat_message"`, while the drawing handler filters to
 * `type: "chat"`. Neither sees the other's traffic, and drawing sync is
 * completely untouched.
 *
 * We do NOT send `join_room` here — RoomCanvas already joined the room for
 * drawing, and the server keys broadcasts off that single membership for both
 * drawing and chat. One join, two features.
 */
export function useChatSocket({
  socket,
  roomId,
  onMessage,
}: UseChatSocketArgs): UseChatSocketResult {
  // Keep the latest callback in a ref so the subscribe effect doesn't
  // re-subscribe on every render (onMessage is recreated by the parent on each
  // state change). The ref is updated in its own effect — never during render —
  // so React's concurrent rendering can't observe a torn value.
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!socket) return;

    const handler = (event: MessageEvent) => {
      let frame: unknown;
      try {
        frame = JSON.parse(event.data as string);
      } catch {
        return;
      }
      if (
        !frame ||
        typeof frame !== "object" ||
        (frame as { type?: string }).type !== "chat_message"
      ) {
        return; // not ours — likely a drawing "chat" frame
      }

      const { message, clientId } = frame as {
        message?: ChatMessageDTO;
        clientId?: string;
      };
      if (!message || typeof message.id !== "string") return;
      onMessageRef.current(message, clientId);
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket]);

  const send = (text: string, clientId: string): boolean => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    const frame: OutgoingChatFrame = {
      type: "chat_message",
      roomId,
      message: text,
      clientId,
    };
    socket.send(JSON.stringify(frame));
    return true;
  };

  return { send };
}
