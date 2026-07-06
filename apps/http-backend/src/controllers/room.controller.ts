import type { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/zod-validation/types";
import type { AuthenticatedRequest } from "../middleware/auth";
import {
  createRoom,
  getRoomById,
  getRoomBySlug,
} from "../services/room.service";
import { badRequest } from "../services/http-error";

/**
 * POST /room (protected) — create a room owned by the authenticated user.
 * `userId` is guaranteed present because this route is mounted behind
 * `authMiddleware`.
 */
export async function create(req: Request, res: Response): Promise<void> {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    throw badRequest("Room name must be at least 3 characters long");
  }

  const { userId } = req as AuthenticatedRequest;
  const room = await createRoom(parsed.data.name, userId);

  res.status(201).json({
    message: "Room created successfully",
    roomId: room.id,
    slug: room.slug,
    room,
  });
}

/**
 * GET /rooms/:roomId (protected) — resolve a room by numeric id. Used when
 * opening a share link to confirm the room exists before joining. Returns 404
 * if it doesn't, so the client can show a graceful "room not found" message.
 */
export async function getById(req: Request, res: Response): Promise<void> {
  const roomId = Number(req.params.roomId);
  const room = await getRoomById(roomId);
  res.json({ room });
}

/**
 * Resolve a room code (slug) to a room, including its numeric id. This is how
 * "Join by room code" turns the human-friendly code into the id the canvas/ws
 * actually use.
 *
 * Reads the code from either the `:code` param (GET /rooms/code/:code) or the
 * `:slug` param (legacy GET /room/:slug), so one handler serves both routes.
 */
export async function getByCode(req: Request, res: Response): Promise<void> {
  const raw = req.params.code ?? req.params.slug ?? "";
  const code = Array.isArray(raw) ? (raw[0] ?? "") : raw;
  const room = await getRoomBySlug(code);
  res.json({ room });
}
