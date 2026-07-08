import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { getPrismaClient } from "@repo/db/client";

const prisma = getPrismaClient();

// Railway injects the port to bind via PORT; fall back to 8080 locally. The ws
// server binds 0.0.0.0 by default, so the container is externally reachable. TLS
// (wss://) is terminated at Railway's edge, so the process speaks plain ws.
const PORT = Number(process.env.PORT) || 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket backend listening on port ${PORT}`);

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
    // The roomId arrives from the client URL and is not guaranteed to map to an
    // existing Room row (stale id, deleted room, or a slug mistaken for an id),
    // which would otherwise blow up on the Chat_roomId_fkey constraint.
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      console.warn(`[ws] dropping chat for non-existent room ${roomId}`);
      return;
    }

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

/**
 * Per-connection cap on chat message length. Anything longer is rejected before
 * it ever touches the database. Mirrors a sensible UI limit and protects the row.
 */
const MAX_CHAT_LENGTH = 4000;

/**
 * Cache of userId -> display name. The sender's identity is taken from the JWT
 * (server-authoritative — we never trust a client-supplied senderId/senderName),
 * and the display name is looked up once and reused. Names rarely change inside
 * a session, so this avoids a User read on every single message.
 */
const senderNameCache = new Map<string, string>();

async function resolveSenderName(userId: string): Promise<string | null> {
  const cached = senderNameCache.get(userId);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  if (!user) return null;

  senderNameCache.set(userId, user.name);
  return user.name;
}

/**
 * Handles an incoming `chat_message`.
 *
 * Payload from the client:
 *   { type:"chat_message", roomId, message, clientId? }
 *
 * Flow:
 *   1. Validate roomId + non-empty message (length-capped).
 *   2. Confirm the room exists (avoids FK violations on stale ids).
 *   3. Resolve the sender's display name from the JWT-derived userId.
 *   4. Persist one `Message` row.
 *   5. Broadcast the saved row to EVERY socket joined to that room — and ONLY
 *      that room — including the sender, echoing back `clientId` so the sender
 *      can swap its optimistic placeholder for the authoritative server copy.
 */
async function handleChatMessage(
  senderWs: WebSocket,
  userId: string,
  parsedData: any
): Promise<void> {
  const roomId = Number(parsedData.roomId);
  if (isNaN(roomId)) return;

  // Authorization: only members of the room may post to it. Mirrors the drawing
  // ("chat") guard so no authenticated socket can inject messages into a room
  // channel it hasn't joined.
  const sender = users.find((x) => x.ws === senderWs);
  if (!sender || !sender.rooms.includes(roomId)) return;

  const raw = typeof parsedData.message === "string" ? parsedData.message : "";
  const message = raw.trim();
  if (!message) return;
  if (message.length > MAX_CHAT_LENGTH) return;

  // `clientId` is an opaque round-trip token for optimistic reconciliation.
  const clientId: string | undefined =
    typeof parsedData.clientId === "string" ? parsedData.clientId : undefined;

  // Guard against stale/deleted rooms before hitting the FK constraint.
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    console.warn(`[ws] dropping chat_message for non-existent room ${roomId}`);
    return;
  }

  const senderName = await resolveSenderName(userId);
  if (!senderName) {
    console.warn(`[ws] dropping chat_message for unknown user ${userId}`);
    return;
  }

  const saved = await prisma.message.create({
    data: { roomId, senderId: userId, senderName, message },
  });

  const frame = JSON.stringify({
    type: "chat_message",
    clientId,
    message: {
      id: saved.id,
      roomId: saved.roomId,
      senderId: saved.senderId,
      senderName: saved.senderName,
      message: saved.message,
      createdAt: saved.createdAt.toISOString(),
    },
  });

  // Broadcast ONLY to sockets joined to this room (never globally).
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      user.ws.send(frame);
    }
  });
}

/**
 * WebSocket close codes we use to signal WHY a connection was rejected, so the
 * client can react (e.g. redirect to sign-in on an auth failure vs. retry on a
 * transient issue). 1008 = "policy violation" per the WebSocket spec.
 */
const WS_CLOSE_UNAUTHORIZED = 1008;

wss.on("connection", (ws, request) => {
  const url = request.url;

  if (!url) {
    ws.close(WS_CLOSE_UNAUTHORIZED, "Missing connection URL");
    return;
  }

  const query = url.split("?")[1] || "";
  const queryParams = new URLSearchParams(query);
  const token = queryParams.get("token") || "";

  // Authentication gate: the handshake token MUST verify to a real userId.
  // Unauthenticated sockets are rejected here and never join any room channel.
  const userId = checkUser(token);

  if (!userId) {
    ws.close(WS_CLOSE_UNAUTHORIZED, "Invalid or missing authentication token");
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

        // Authorization: a socket may only draw into a room it has actually
        // joined (via "join_room"). This prevents an authenticated user from
        // persisting/broadcasting into arbitrary room channels they never
        // entered. The client always joins before drawing, so legitimate flow
        // is unaffected.
        const sender = users.find((x) => x.ws === ws);
        if (!sender || !sender.rooms.includes(roomId)) {
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

      // ----------------------------------------------------------------- //
      // Real collaboration chat (Version 1).                              //
      //                                                                   //
      // This is intentionally a SEPARATE message type from "chat" (which  //
      // carries drawing operations). It persists to the dedicated         //
      // `Message` table and never touches drawing sync.                   //
      // ----------------------------------------------------------------- //
      if (parsedData.type === "chat_message") {
        await handleChatMessage(ws, userId, parsedData);
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
