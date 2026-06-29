import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

/**
 * Loads the persisted shapes for a room. The server stores each shape as a JSON
 * string inside a chat row; we parse and return the raw shape objects. They are
 * deliberately typed as `unknown[]` — the drawing engine's factory is
 * responsible for validating/normalizing them (including legacy formats).
 *
 * Chats come back newest-first from the API, so we reverse to restore draw
 * order (oldest shape drawn first / at the bottom).
 */
export async function getExistingShapes(roomId: string): Promise<unknown[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
    const messages: Array<{ message: string }> = res.data.messages ?? [];

    const shapes = messages
      .map((x) => {
        try {
          const data = JSON.parse(x.message);
          // New op-format adds carry `{ op, shape }`; legacy carries `{ shape }`.
          return data.shape ?? null;
        } catch {
          return null;
        }
      })
      .filter((s) => s !== null);

    return shapes.reverse();
  } catch {
    return [];
  }
}
