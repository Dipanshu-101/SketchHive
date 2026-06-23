import { RoomCanvas } from "@/components/RoomCanvas";

export default async function Canvaspage( {params}: {
    params: {
        roomId: string
    }}) {

    const roomId = (await params).roomId; 
         
return <RoomCanvas roomId={roomId} />


}