"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Users } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");


    const router = useRouter();

    

            const handleJoinRoom = () => {
                if (!roomCode.trim()) {
                    return;
                }

                router.push(`/canvas/${roomCode}`);
                };

const handleCreateRoom = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:3001/room",
      {
        name: roomName,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(response.data);

    router.push(`/canvas/${response.data.roomId}`);
  } catch (error: any) {
    console.log(error.response?.data);
  }
};
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            SketchHive
          </h1>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create a new room or join an existing one.
          </p>
        </div>

        {/* Join Room */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Room Code
          </label>

          <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleJoinRoom}
            >
            Join Room
            </Button>
        </div>

        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-border" />
          <span className="px-4 text-sm text-muted-foreground">
            OR
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
  <label className="text-sm font-medium text-foreground">
    Room Name
  </label>

  <input
    type="text"
    value={roomName}
    onChange={(e) => setRoomName(e.target.value)}
    placeholder="Enter room name"
    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
  />

  <Button
    variant="primary"
    size="lg"
    className="w-full"
    onClick={handleCreateRoom}
  >
    <Pencil className="h-4 w-4" />
    Create New Room
  </Button>
</div>
      </Card>
    </div>
  );
}