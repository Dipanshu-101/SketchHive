/**
 * rooms.service — the only layer that knows the room endpoint shapes (§9).
 *
 * The backend contract:
 *   - POST /room        { name }  → { roomId, slug, room }  (auth)
 *   - GET  /rooms/:roomId         → { room }                (auth)
 * The auth header is attached by the api-client interceptor.
 *
 * The room's numeric `id` is the single identifier used throughout: the canvas
 * route (`/canvas/:id`), the websocket, the share link, and the "room code" the
 * Share dialog shows all use it. Joining by code = resolving that id.
 * (The backend also exposes GET /rooms/code/:slug for slug lookups, but the app
 * consistently keys on the id, so it isn't used here.)
 */

import { api } from "@/lib/api-client";

/** Public room shape returned by the backend. */
export interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
}

export interface CreateRoomInput {
  name: string;
}

export interface CreateRoomResponse {
  roomId: number;
  slug: string;
  room: Room;
}

/** Create a new room and return its id + slug. */
export async function createRoom(
  input: CreateRoomInput,
): Promise<CreateRoomResponse> {
  const res = await api.post<CreateRoomResponse>("/room", input);
  return res.data;
}

/**
 * Resolve a room by numeric id. Used both to confirm a room exists before
 * opening its canvas (e.g. from a share link) and to join by room code (the code
 * IS the id). Throws on 404 so the caller can show a graceful "room not found".
 */
export async function getRoomById(roomId: number | string): Promise<Room> {
  const res = await api.get<{ room: Room }>(
    `/rooms/${encodeURIComponent(String(roomId))}`,
  );
  return res.data.room;
}
