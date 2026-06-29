"use client";

import { PageShell, GlassPanel, Input, Button } from "@repo/ui";
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
        <PageShell>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
          <GlassPanel style={{ width: "100%", maxWidth: 440, padding: "44px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 28px rgba(79,70,229,0.55), 0 1px 0 rgba(255,255,255,0.2) inset",
                }}
              >
                <Users size={22} color="#fff" />
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                SketchHive Rooms
              </h1>
              <p style={{ fontSize: 13, color: "rgba(180,200,240,0.5)", lineHeight: 1.6 }}>
                Create a new room or join an existing one.
              </p>
            </div>

            <Input
              label="Room Code"
              type="text"
              value={roomCode}
              onChange={setRoomCode}
              placeholder="Enter room code"
            />

            <Button
              variant="primary"
              size="lg"
              onClick={handleJoinRoom}
              style={{ width: "100%", marginBottom: 24 }}
            >
              Join Room
            </Button>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                marginBottom: 20,
              }}
            />

            <Input
              label="Room Name"
              type="text"
              value={roomName}
              onChange={setRoomName}
              placeholder="Enter room name"
            />

            <Button
              variant="primary"
              size="lg"
              disabled={!roomName.trim()}
              onClick={handleCreateRoom}
              leftIcon={<Pencil size={16} />}
              style={{ width: "100%" }}
            >
              Create New Room
            </Button>
          </GlassPanel>
          </div>
        </PageShell>
  );
}