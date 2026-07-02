/**
 * rooms.service — the only layer that knows the room endpoint shapes (§9).
 *
 * Extracted verbatim from the inline axios call previously in rooms/page.tsx.
 * The backend contract is unchanged: POST /room { name } (auth header attached
 * by the api-client interceptor) returning { roomId }.
 */

import { api } from "@/lib/api-client";

export interface CreateRoomInput {
  name: string;
}

export interface CreateRoomResponse {
  roomId: string;
}

/** Create a new room and return its id. */
export async function createRoom(
  input: CreateRoomInput,
): Promise<CreateRoomResponse> {
  const res = await api.post<CreateRoomResponse>("/room", input);
  return res.data;
}
