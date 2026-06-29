import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { getPrismaClient } from "@repo/db/client";

const prisma = getPrismaClient();

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: number[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}

/**
 * Persists a drawing operation carried inside a `chat` message string.
 *
 * Message format (draw/net.ts):
 *   - add/update : { v, op, shape: { id, ... } }
 *   - delete     : { v, op:"delete", id }
 *   - clear      : { v, op:"clear" }
 *   - legacy add : { shape: { ... } }  (no op)
 *
 * Storage model is unchanged from the original engine: every persisted shape is
 * one Chat row whose `message` is `JSON.stringify({ shape })`. This keeps the
 * HTTP loader (GET /chats) untouched.
 */
async function persistChatOp(
  roomId: number,
  userId: string,
  message: string
): Promise<void> {
  let payload: any;
  try {
    payload = JSON.parse(message);
  } catch {
    return;
  }

  const op: string = payload.op ?? (payload.shape ? "add" : "");

  if (op === "add") {
    // Store one row containing the shape (legacy-compatible format).
    await prisma.chat.create({
      data: { roomId, userId, message: JSON.stringify({ shape: payload.shape }) },
    });
    return;
  }

  if (op === "update" || op === "delete") {
    const targetId: string | undefined =
      op === "update" ? payload.shape?.id : payload.id;
    if (!targetId) return;

    // Find the row(s) holding this shape id and update or remove them.
    const rows = await prisma.chat.findMany({ where: { roomId } });
    for (const row of rows) {
      let shapeId: string | undefined;
      try {
        shapeId = JSON.parse(row.message)?.shape?.id;
      } catch {
        continue;
      }
      if (shapeId !== targetId) continue;

      if (op === "delete") {
        await prisma.chat.delete({ where: { id: row.id } });
      } else {
        await prisma.chat.update({
          where: { id: row.id },
          data: { message: JSON.stringify({ shape: payload.shape }) },
        });
      }
    }
    return;
  }

  if (op === "clear") {
    await prisma.chat.deleteMany({ where: { roomId } });
    return;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }

  const query = url.split("?")[1] || "";
  const queryParams = new URLSearchParams(query);
  const token = queryParams.get("token") || "";

  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    try {
      let parsedData;
      if(typeof data !== "string"){
        parsedData = JSON.parse(data.toString());
      }else{
        parsedData = JSON.parse(data);
      }
      

      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);

        if (!user) {
          return;
        }

        const roomId = Number(parsedData.roomId);

        if (isNaN(roomId)) {
          return;
        }

        if (!user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
        }
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);

        if (!user) {
          return;
        }

        const roomId = Number(parsedData.roomId);

        if (isNaN(roomId)) {
          return;
        }

        user.rooms = user.rooms.filter(
          (room) => room !== roomId
        );
      }

      if (parsedData.type === "chat") {
        const roomId = Number(parsedData.roomId);
        const message: string = parsedData.message;

        if (isNaN(roomId)) {
          return;
        }

        // Persist the change. The drawing engine sends a versioned operation
        // inside `message` (see draw/net.ts). We keep the historical storage
        // format — each "add" remains one chat row holding `{ shape }` — so the
        // existing GET /chats loader keeps working, while update/delete/clear
        // mutate those rows to keep reloads consistent with live state.
        await persistChatOp(roomId, userId, message);

        // Broadcast to everyone in the room (including the sender so their
        // optimistic state and the server agree).
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                roomId,
                message,
                userId,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error processing websocket message:", error);
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((x) => x.ws === ws);

    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
