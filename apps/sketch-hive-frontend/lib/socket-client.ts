/**
 * socket-client — the single place the WebSocket URL/handshake is constructed
 * (§9). This is a thin factory that reproduces EXACTLY the connection the app
 * already makes (`${WS_BACKEND_URL}?token=<jwt>`); it deliberately does not
 * change reconnect/lifecycle behavior — the websocket implementation is
 * untouched in Phase 1. Callers still own `onopen`/`onclose`/`onmessage`.
 */

import { WS_BACKEND_URL } from "@/config";
import { getAuthToken } from "./auth";

/**
 * Opens a room WebSocket with the current auth token, identical to the existing
 * inline construction in RoomCanvas. Returns the raw socket so callers keep full
 * control over its lifecycle.
 */
export function createRoomSocket(): WebSocket {
  return new WebSocket(`${WS_BACKEND_URL}?token=${getAuthToken()}`);
}
