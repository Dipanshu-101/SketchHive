/**
 * chat.service — read models for the two distinct persisted streams.
 *
 * These are SEPARATE tables kept exactly as before:
 *   - `Chat`    → serialized drawing shapes (whiteboard persistence).
 *   - `Message` → real human-to-human collaboration chat.
 *
 * Only the read logic moved here; storage semantics are untouched (writes still
 * happen in the ws-backend). The existing response shapes are preserved so the
 * frontend contract does not change.
 */
import { prisma } from "../prisma";

/** Newest-first drawing rows for a room (matches the historical GET /chats). */
export async function getDrawingChats(roomId: number) {
  return prisma.chat.findMany({
    where: { roomId },
    orderBy: { id: "desc" },
    take: 1000,
  });
}

/**
 * The most recent collaboration messages for a room, returned in chronological
 * order (oldest→newest) for top-to-bottom rendering. We fetch the newest 200 by
 * createdAt desc, then reverse to ascending.
 */
export async function getRoomMessages(roomId: number) {
  const recent = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return recent.reverse();
}
