/**
 * @repo/chat-ui — reusable, transport-agnostic chat presentation primitives.
 *
 * Nothing in this package knows about WebSockets, HTTP, Prisma, or SketchHive's
 * rooms. Components take view models (see ./types) and render them. That
 * boundary is deliberate: it lets these same primitives back future surfaces
 * (DMs, an AI assistant thread, notifications) without dragging room logic
 * along. Room-specific orchestration lives in the app, not here.
 */

export { Avatar } from "./avatar";
export type { AvatarProps } from "./avatar";

export { Timestamp } from "./timestamp";
export type { TimestampProps } from "./timestamp";

export { MessageBubble } from "./message-bubble";
export type { MessageBubbleProps } from "./message-bubble";

export { MessageGroup } from "./message-group";
export type { MessageGroupProps } from "./message-group";

export { ChatInput } from "./chat-input";
export type { ChatInputProps } from "./chat-input";

export { DayDivider } from "./day-divider";
export type { DayDividerProps } from "./day-divider";

export { UnreadDivider } from "./unread-divider";
export type { UnreadDividerProps } from "./unread-divider";

export { TypingIndicator } from "./typing-indicator";
export type { TypingIndicatorProps } from "./typing-indicator";

export { ScrollArea } from "./scroll-area";
export type { ScrollAreaProps } from "./scroll-area";

export { ConnectionBadge } from "./connection-badge";
export type { ConnectionBadgeProps, ConnectionState } from "./connection-badge";

export {
  ChatLoadingState,
  ChatEmptyState,
  ChatErrorState,
} from "./chat-states";

export { chatTheme } from "./theme";
export type { ChatTheme } from "./theme";

export type { ChatMessageView, MessageStatus } from "./types";
