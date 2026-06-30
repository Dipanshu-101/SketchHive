/**
 * Shared, transport-agnostic chat types used by every presentational primitive
 * in this package.
 *
 * These describe the SHAPE the UI renders, not the wire format and not the DB
 * row. The room feature (app/canvas/[roomId]/chat) is responsible for adapting
 * its domain model into these view types. Keeping the package free of any
 * backend/transport knowledge is what makes these components reusable in future
 * surfaces (a DM panel, an AI assistant thread, a notification feed, etc.).
 */

/** Delivery state of a single message, used to drive subtle UI affordances. */
export type MessageStatus = "sending" | "sent" | "failed";

/**
 * The minimal message a bubble needs to render. Intentionally small: future
 * features (reactions, replies, attachments, mentions) will extend this view
 * type rather than change the existing fields.
 */
export interface ChatMessageView {
  /** Stable identifier. For optimistic messages this is a temporary client id. */
  id: string;
  /** Author's stable id — used to decide own-vs-other and to group messages. */
  senderId: string;
  /** Author's display name. */
  senderName: string;
  /** The text body. */
  message: string;
  /** Creation time as epoch milliseconds. */
  createdAt: number;
  /** True when this message belongs to the local user (aligns right). */
  isOwn: boolean;
  /** Optimistic delivery state. Defaults to "sent" for history. */
  status?: MessageStatus;
}
