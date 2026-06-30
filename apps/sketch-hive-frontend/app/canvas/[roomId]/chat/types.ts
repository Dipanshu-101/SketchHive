/**
 * Room-chat domain + wire types.
 *
 * This file is the contract between the SketchHive room and the chat transport.
 * It is intentionally separate from @repo/chat-ui's view types: the package
 * knows how to RENDER a message, this app knows what a message IS on our wire
 * and in our database.
 */

/** A persisted chat message as returned by the HTTP history endpoint and the
 *  WS broadcast (the server serializes the `Message` row identically in both). */
export interface ChatMessageDTO {
  id: string;
  roomId: number;
  senderId: string;
  senderName: string;
  message: string;
  /** ISO-8601 string from the server. */
  createdAt: string;
}

/** Outgoing socket frame: a chat send. Mirrors the ws-backend `chat_message`
 *  handler. `clientId` round-trips so we can reconcile the optimistic copy. */
export interface OutgoingChatFrame {
  type: "chat_message";
  roomId: string;
  message: string;
  clientId: string;
}

/** Incoming socket frame: the authoritative saved message, echoing `clientId`
 *  back to the original sender (absent for other clients). */
export interface IncomingChatFrame {
  type: "chat_message";
  clientId?: string;
  message: ChatMessageDTO;
}

/** Live connection state surfaced in the panel header. */
export type ChatConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";
