"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import type { ChatMessageDTO } from "../types";

export type HistoryStatus = "loading" | "ready" | "error";

interface UseChatHistoryResult {
  messages: ChatMessageDTO[];
  status: HistoryStatus;
  /** Re-run the fetch (used by the error-state retry button). */
  reload: () => void;
}

/**
 * Loads the persisted chat transcript for a room over HTTP.
 *
 * This is step 1 of the room-open sequence: fetch history, THEN connect the
 * socket for live appends (the socket wiring lives in useChat). Returning the
 * raw DTOs (chronological, oldest-first from the API) keeps this hook a pure
 * data source — merging/optimistic logic is the caller's job.
 */
export function useChatHistory(roomId: string): UseChatHistoryResult {
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [status, setStatus] = useState<HistoryStatus>("loading");
  // Guards against a late response from a previous room overwriting a new one.
  const reqIdRef = useRef(0);

  const load = useCallback(() => {
    const reqId = ++reqIdRef.current;
    setStatus("loading");

    axios
      .get<{ messages: ChatMessageDTO[] }>(
        `${HTTP_BACKEND_URL}/rooms/${roomId}/messages`
      )
      .then((res) => {
        if (reqId !== reqIdRef.current) return; // stale response
        setMessages(res.data.messages ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (reqId !== reqIdRef.current) return;
        setStatus("error");
      });
  }, [roomId]);

  useEffect(() => {
    load();
    // Invalidate any in-flight request when the room changes/unmounts.
    return () => {
      reqIdRef.current++;
    };
  }, [load]);

  return { messages, status, reload: load };
}
