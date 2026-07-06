import { Router } from "express";
import { handle } from "../controllers/handle";
import { authMiddleware } from "../middleware/auth";
import * as roomController from "../controllers/room.controller";
import * as chatController from "../controllers/chat.controller";

/**
 * Room routes.
 *
 * Route ORDER matters with Express path matching: the more specific
 * `/rooms/code/:code` and `/rooms/:roomId/messages` are declared BEFORE the
 * catch-all `/rooms/:roomId`, otherwise "code" (or "messages") would be
 * captured as a `:roomId`.
 *
 * Auth boundary:
 *   - Creating and resolving rooms REQUIRE a valid JWT (`authMiddleware`) —
 *     these gate access to a room, so the backend must verify identity.
 *   - Message/shape reads stay public to preserve existing canvas behavior
 *     (the whiteboard loads its history without a separate gate today).
 */
export const roomRoutes: Router = Router();

// ── Create ────────────────────────────────────────────────────────────────
roomRoutes.post("/room", authMiddleware, handle(roomController.create));

// ── Resolve (protected) ─────────────────────────────────────────────────────
// Code (slug) → room. Must precede "/rooms/:roomId".
roomRoutes.get(
  "/rooms/code/:code",
  authMiddleware,
  handle(roomController.getByCode),
);

// ── Reads (public, preserve existing behavior) ──────────────────────────────
roomRoutes.get("/chats/:roomId", handle(chatController.listDrawingChats));
roomRoutes.get(
  "/rooms/:roomId/messages",
  handle(chatController.listRoomMessages),
);

// Id → room (protected; used to validate a share link before joining). Declared
// after the more specific "/rooms/..." paths above.
roomRoutes.get(
  "/rooms/:roomId",
  authMiddleware,
  handle(roomController.getById),
);

// ── Backward compatibility ──────────────────────────────────────────────────
// Legacy public slug lookup kept so any existing caller of GET /room/:slug
// keeps working unchanged.
roomRoutes.get("/room/:slug", handle(roomController.getByCode));
