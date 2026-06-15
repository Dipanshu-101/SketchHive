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
      const parsedData = JSON.parse(data.toString());

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
        const message = parsedData.message;

        if (isNaN(roomId)) {
          return;
        }

        const result = await prisma.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });

        console.log("Message stored:", result);

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
