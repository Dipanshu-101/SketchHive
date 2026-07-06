import type { Request, Response } from "express";
import { getDrawingChats, getRoomMessages } from "../services/chat.service";

/**
 * GET /chats/:roomId — serialized drawing shapes for a room (whiteboard
 * persistence). Never throws to the client: on any failure it returns an empty
 * list so the canvas still loads, matching the previous forgiving behavior.
 */
export async function listDrawingChats(
  req: Request,
  res: Response,
): Promise<void> {
  const roomId = Number(req.params.roomId);
  if (Number.isNaN(roomId)) {
    res.json({ messages: [] });
    return;
  }

  try {
    const messages = await getDrawingChats(roomId);
    res.json({ messages });
  } catch (error) {
    console.error("[http-backend] GET /chats failed:", error);
    res.json({ messages: [] });
  }
}

/**
 * GET /rooms/:roomId/messages — real collaboration chat history, chronological.
 * Also forgiving: returns an empty list on error rather than failing the panel.
 */
export async function listRoomMessages(
  req: Request,
  res: Response,
): Promise<void> {
  const roomId = Number(req.params.roomId);
  if (Number.isNaN(roomId)) {
    res.status(400).json({ error: "Invalid roomId", messages: [] });
    return;
  }

  try {
    const messages = await getRoomMessages(roomId);
    res.json({ messages });
  } catch (error) {
    console.error("[http-backend] GET /rooms/:roomId/messages failed:", error);
    res.status(500).json({ error: "Internal server error", messages: [] });
  }
}
