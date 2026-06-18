"use client"
import {useEffect , useRef } from "react";
import initDraw from "@/draw";

export function Canvas ({roomId}: {roomId: string}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId);
        }
        }, [canvasRef]);
    return (
        <div >
            <canvas ref={canvasRef} width={2800} height={1080} ></canvas>
        </div>
    )
}