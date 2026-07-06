"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRoomMessages } from "../services/chat.service";
import type { ChatMessageDTO } from "../types";

export type HistoryStatus = "loading" | "ready" | "error";

interface UseChatHistoryResult {
  messages: ChatMessageDTO[];
  status: HistoryStatus;
  /** Re-run the fetch (used by the error-state retry button + reconnect). */
  reload: () => void;
}

/**
 * Loads the persisted chat transcript for a room over HTTP.
 *
 * This is step 1 of the room-open sequence: fetch history, THEN connect the
 * socket for live appends (the socket wiring lives in useChat). Returning the
 * raw DTOs (chronological, oldest-first from the API) keeps this hook a pure
 * data source — merging/optimistic logic is the caller's job.
 *
 * The fetch lives entirely inside the effect with an effect-local `cancelled`
 * flag (not a ref), which is the canonical pattern: a late response from a
 * previous room/attempt can never overwrite the current one, and there is no
 * setState during render. `reload()` simply bumps a key to re-run the effect.
 */
export function useChatHistory(roomId: string): UseChatHistoryResult {
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [status, setStatus] = useState<HistoryStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // We intentionally do NOT setStatus("loading") here: the initial state is
    // already "loading", and on a manual reload we keep the previous transcript
    // (or error) on screen until the refetch resolves — avoiding a synchronous
    // setState in the effect body and a flash of the loading skeleton.
    fetchRoomMessages(roomId)
      .then((msgs) => {
        if (cancelled) return;
        setMessages(msgs);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [roomId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { messages, status, reload };
}
