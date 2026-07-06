"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Pencil } from "lucide-react";
import { Button, Card, FlightPath, Input } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { FloatingBee } from "@/features/marketing/components";
import { createRoom } from "@/features/rooms/services/rooms.service";

export default function RoomsPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = () => {
    const code = roomCode.trim();
    if (!code) {
      setError("Enter a room code first.");
      return;
    }

    setError("");
    setLoadingJoin(true);
    router.push(`/canvas/${code}`);
  };

  const handleCreateRoom = async () => {
    const name = roomName.trim();
    if (!name) {
      setError("Enter a room name first.");
      return;
    }

    setError("");
    setLoadingCreate(true);
    try {
      const { roomId } = await createRoom({ name });
      router.push(`/canvas/${roomId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not create the room.");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 3vh, 40px) 20px",
        background: cssVar.color.bgBase,
        color: cssVar.color.textPrimary,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        style={{ position: "relative", width: "100%", maxWidth: 440 }}
      >
        <FlankBee
          variant="lens"
          size={78}
          corner="bottom-right"
          delay={1.1}
          loopDuration={16}
          flip
          liftBy={12}
          reduce={reduce ?? false}
        />

        <Card
          variant="solid"
          hover={false}
          padding="32px 36px 26px"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: cssVar.color.honeyGlow,
                border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 35%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: cssVar.shadow.glowHoney,
              }}
            >
              <Users size={28} color={cssVar.color.honey500} />
            </div>
          </div>

          <h1
            style={{
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              textAlign: "center",
              color: cssVar.color.textPrimary,
              margin: "0 0 10px",
            }}
          >
            SketchHive Rooms
          </h1>

          <p
            style={{
              textAlign: "center",
              fontSize: 13.5,
              lineHeight: 1.6,
              color: cssVar.color.textMuted,
              margin: "0 0 22px",
            }}
          >
            Create a new room or join an existing one.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: 18,
                padding: "10px 14px",
                borderRadius: cssVar.radius.md,
                background: `color-mix(in srgb, ${cssVar.color.danger} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${cssVar.color.danger} 30%, transparent)`,
                fontSize: 13,
                color: cssVar.color.danger,
              }}
            >
              {error}
            </div>
          )}

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
            loading={loadingJoin}
            style={{ width: "100%", marginBottom: 24 }}
          >
            Join Room
          </Button>

          <div
            style={{
              borderTop: `1px solid ${cssVar.color.border}`,
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
            disabled={!roomName.trim() || loadingCreate}
            onClick={handleCreateRoom}
            leftIcon={<Pencil size={16} />}
            loading={loadingCreate}
            style={{ width: "100%" }}
          >
            Create New Room
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FlankBee — a landing FloatingBee anchored to the card's bottom-right corner,
   with an extra slow orbit loop so it drifts gently around that corner. Matches
   the (auth) sign-in/sign-up bee: a lens-carrying bee, flipped to face inward
   toward the card, with its own dashed flight-path trail behind the card.
   Purely decorative; pointer-events are off via FloatingBee itself.
───────────────────────────────────────── */
function FlankBee({
  variant,
  size,
  corner,
  delay,
  loopDuration,
  flip,
  liftBy = 0,
  reduce,
}: {
  variant: string;
  size: number;
  corner: "bottom-right";
  delay: number;
  loopDuration: number;
  flip?: boolean;
  liftBy?: number;
  reduce: boolean;
}) {
  // Anchor the wrapper just outside the card's bottom-right corner; `liftBy`
  // nudges it inward from the bottom edge to keep it in frame.
  const vEdge = -size * 0.55 + liftBy;
  // Push the trail down toward the bee's foot, ~55% of the bee height inward.
  const pathVOffset = vEdge + size * 0.55;

  return (
    <>
      {/* Flight path — behind the card, above the background, at the bee's foot.
          Mirror it with the bee when flipped. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: pathVOffset,
          right: -size * 0.5,
          zIndex: 0,
          pointerEvents: "none",
          transform: flip ? "scaleX(-1)" : undefined,
          transformOrigin: "center",
          opacity: 0.5,
        }}
      >
        <FlightPath width={size * 1.7} height={size * 0.6} strokeWidth={2} />
      </div>

      {/* Bee — on top of the card; no built-in trail (we render our own above) */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: vEdge,
          right: -size * 0.5,
          zIndex: 50,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, 10, 4, -6, 0], y: [0, -6, 4, -2, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: loopDuration, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        <FloatingBee
          variant={variant}
          size={size}
          delay={delay}
          flip={flip}
          showPath={false}
        />
      </motion.div>
    </>
  );
}