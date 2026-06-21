"use client"
import {useEffect , useRef, useState} from "react";
import initDraw from "@/draw";
import { WS_BACKEND_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas ({roomId}: {roomId: string}) {
    
    const [socket, setSocket] = useState<WebSocket | null>(null);
//@ts-ignore
    useEffect(() => {
        const ws = new WebSocket(`WS_BACKEND_URL?token=`);
        
        ws.onopen = () => {
            setSocket(ws);
         }
         ws.send(JSON.stringify({
            type: "join_room",
            roomId
         }))

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