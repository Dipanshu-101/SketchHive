"use client";
import { useEffect, useState } from "react";
import { createRoomSocket } from "@/lib/socket-client";
import { Canvas } from "./Canvas";
import { ChatPanel } from "@/features/chat/components/ChatPanel";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // ONE socket per room, shared by drawing (Canvas/Game) and chat
    // (ChatPanel). The connection is built by lib/socket-client, which uses the
    // centralized auth token so identity is consistent between the connection
    // and own-message detection. Behavior is identical to the previous inline
    // construction — only the URL/handshake wiring moved to lib.
    const ws = createRoomSocket();

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };

    return () => {
      // Tear the socket down on unmount so we don't leak connections when
      // navigating between rooms.
      ws.close();
    };
  }, [roomId]);

  if (!socket) {
    return <div>waiting for socket to connect...</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
      <ChatPanel roomId={roomId} socket={socket} />
    </div>
  );
}
