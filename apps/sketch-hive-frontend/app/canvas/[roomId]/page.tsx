import { Canvas } from "@/components/canvas";


export default async function Canvaspage( {params}: {
    params: {
        roomId: string
    }}) {

    const roomId = (await params).roomId; 
    console.log("Room ID:", roomId);   
    
return <Canvas roomId={roomId} />


}