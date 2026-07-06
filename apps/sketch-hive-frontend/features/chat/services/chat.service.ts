/**
 * chat.service — the only layer that knows the chat HTTP endpoint shapes (§9).
 *
 * Extracted from the inline axios call previously in useChatHistory. Backend
 * contract unchanged: GET /rooms/:roomId/messages returning { messages }.
 * (Live message send/receive stays on the WebSocket, owned by useChatSocket.)
 */

import { api } from "@/lib/api-client";
import type { ChatMessageDTO } from "../types";

interface MessagesResponse {
  messages: ChatMessageDTO[];
}

/** Fetch the persisted transcript for a room (chronological, oldest-first). */
export async function fetchRoomMessages(
  roomId: string,
): Promise<ChatMessageDTO[]> {
  const res = await api.get<MessagesResponse>(`/rooms/${roomId}/messages`);
  return res.data.messages ?? [];
}
