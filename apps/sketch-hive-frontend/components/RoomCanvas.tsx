"use client"
import { useEffect, useState } from "react";
import { WS_BACKEND_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas ({roomId}: {roomId: string}) {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNGU4YWU4Zi1jMDgwLTRmYTItYTEyMS0yYjhlNmI5YTY5MmQiLCJpYXQiOjE3ODIwNzg3NTN9.lOdn4sXCz3G5oayPj3sBhRYOJlaVka--BJN4RjdqkNU`);
        
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
            type: "join_room",
            roomId
         }))
         }
         

         }  , []);


    if (!socket) { 

            return <div>waiting for socket to connect...
                 </div>

            }
    return (
        <div >
            <Canvas roomId= {roomId} socket ={socket}  />
            
        </div>
    )
}