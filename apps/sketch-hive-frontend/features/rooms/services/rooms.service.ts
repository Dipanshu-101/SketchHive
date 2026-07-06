/**
 * rooms.service — the only layer that knows the room endpoint shapes (§9).
 *
 * The backend contract:
 *   - POST /room                { name }        → { roomId, slug, room }  (auth)
 *   - GET  /rooms/code/:code                     → { room }               (auth)
 *   - GET  /rooms/:roomId                        → { room }               (auth)
 * The auth header is attached by the api-client interceptor.
 *
 * A room has a numeric `id` (what the canvas + websocket consume) and a string
 * `slug` (the human "room code"). Joining by code resolves the slug → id first.
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
 * Resolve a room code (slug) to the room, including its numeric id. Throws if
 * the request fails; a 404 means "no such room" and should be surfaced to the
 * user as a clear error.
 */
export async function getRoomByCode(code: string): Promise<Room> {
  const res = await api.get<{ room: Room }>(
    `/rooms/code/${encodeURIComponent(code)}`,
  );
  return res.data.room;
}

/**
 * Resolve a room by numeric id — used to confirm a room exists before opening
 * its canvas (e.g. from a share link). Throws on 404 so the caller can show a
 * graceful "room not found" state.
 */
export async function getRoomById(roomId: number | string): Promise<Room> {
  const res = await api.get<{ room: Room }>(
    `/rooms/${encodeURIComponent(String(roomId))}`,
  );
  return res.data.room;
}
