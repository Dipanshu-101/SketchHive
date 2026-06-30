"use client"
import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "@/config";
import { Canvas } from "./Canvas";
import { ChatPanel } from "@/app/canvas/[roomId]/chat/ChatPanel";
import { getAuthToken } from "@/app/canvas/[roomId]/chat/auth";

export function RoomCanvas ({roomId}: {roomId: string}) {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // ONE socket per room, shared by drawing (Canvas/Game) and chat
        // (ChatPanel). The token is centralized in chat/auth so identity is
        // consistent between the connection and own-message detection.
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=${getAuthToken()}`);

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
            type: "join_room",
            roomId
         }))
         }

        return () => {
            // Tear the socket down on unmount so we don't leak connections when
            // navigating between rooms.
            ws.close();
        };

         }  , [roomId]);


    if (!socket) {

            return <div>waiting for socket to connect...
                 </div>

            }
    return (
        <div >
            <Canvas roomId= {roomId} socket ={socket}  />
            <ChatPanel roomId={roomId} socket={socket} />
        </div>
    )
}
