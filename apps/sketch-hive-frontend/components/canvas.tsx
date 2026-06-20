"use client"
import {useEffect , useRef, useState} from "react";
import initDraw from "@/draw";
import { WS_BACKEND_URL } from "@/config";

export function Canvas ({roomId}: {roomId: string}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
//@ts-ignore
    useEffect(() => {
        const ws = new WebSocket(WS_BACKEND_URL);
        
        ws.onopen = () => {
            setSocket(ws);
         }
        
         }  , []);


    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId);
        }
        }, [canvasRef]);

    if (!socket) { 

            return <div>waiting for socket to connect...
                 </div>

            }
    return (
        <div >
            <canvas ref={canvasRef} width={2800} height={1080} ></canvas>
        </div>
    )
}