"use client"
import initDraw from "@/draw";
import { useRef, useEffect } from "react"

export default  function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current);
        }
        }, [canvasRef]);
    return (
        <div >
            <canvas ref={canvasRef} width={2800} height={1080} ></canvas>
        </div>
    )
}