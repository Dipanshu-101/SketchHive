"use client";

import WaterRippleBg from "@/components/WaterRippleBg";
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
        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            cursor: "none",
            position: "relative",
          }}
        >
          <WaterRippleBg />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 440,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04),
                0 2px 0 0 rgba(255,255,255,0.18) inset,
                0 -1px 0 0 rgba(255,255,255,0.06) inset,
                0 32px 80px rgba(0,0,0,0.8),
                0 4px 20px rgba(0,0,0,0.5)
              `,
              padding: "44px 40px 40px",
            }}
          >
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

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "rgba(180,210,255,0.5)",
                  marginBottom: 8,
                }}
              >
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 11,
                  fontSize: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  outline: "none",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 11,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 32px rgba(79,70,229,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
                transition: "box-shadow 0.15s, background 0.15s",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Join Room
            </button>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                marginBottom: 20,
              }}
            />

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "rgba(180,210,255,0.5)",
                  marginBottom: 8,
                }}
              >
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 11,
                  fontSize: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  outline: "none",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 11,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                background: roomName.trim()
                  ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                  : "rgba(79,70,229,0.4)",
                color: "#fff",
                border: "none",
                cursor: roomName.trim() ? "pointer" : "not-allowed",
                boxShadow: roomName.trim()
                  ? "0 0 32px rgba(79,70,229,0.45), 0 1px 0 rgba(255,255,255,0.15) inset"
                  : "none",
                transition: "box-shadow 0.15s, background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Pencil size={16} />
              Create New Room
            </button>
          </div>
    </div>
  );
}