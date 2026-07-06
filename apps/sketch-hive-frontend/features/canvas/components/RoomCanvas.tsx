"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cssVar } from "@repo/ui/tokens";
import { createRoomSocket } from "@/lib/socket-client";
import { Canvas } from "./Canvas";
import { CanvasStatus } from "./CanvasStatus";
import { ShareRoomModal } from "./ShareRoomModal";
import { ChatPanel } from "@/features/chat/components/ChatPanel";
import { isAuthenticated } from "@/lib/auth";
import { redirectToSignin } from "@/lib/auth-guard";
import { getRoomById } from "@/features/rooms/services/rooms.service";
import { buildShareUrl } from "@/features/rooms/share-link";

/** The gate's lifecycle: checking auth/room → ready, redirecting, or not-found. */
type GateState = "checking" | "ready" | "redirecting" | "not-found" | "error";

/**
 * RoomCanvas — the authenticated gateway to a room's collaborative canvas.
 *
 * Before opening any socket or rendering the canvas it enforces the invite-link
 * flow (§4):
 *   1. If the user is signed in, validate the room exists, then open it — no
 *      code re-entry needed (Case 1).
 *   2. If not signed in, remember this room and redirect to /signin; after login
 *      they're returned here automatically (Case 2).
 *   3. If the room doesn't exist, show a graceful "room not found" (§5) — never
 *      crash, never open a socket.
 */
export function RoomCanvas({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [state, setState] = useState<GateState>("checking");
  // The room's slug (its human "room code"), captured when we validate the room
  // so the Share dialog can show it without a second request.
  const [roomCode, setRoomCode] = useState<string>(roomId);

  useEffect(() => {
    let cancelled = false;

    // Not authenticated → stash the intended room and bounce to sign-in.
    if (!isAuthenticated()) {
      setState("redirecting");
      redirectToSignin(`/canvas/${roomId}`, (href) => router.replace(href));
      return;
    }

    // Authenticated → confirm the room exists before opening it.
    getRoomById(roomId)
      .then((room) => {
        if (cancelled) return;
        setRoomCode(room.slug);
        setState("ready");
      })
      .catch((err: any) => {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 404) {
          setState("not-found");
        } else if (status === 401) {
          // Session expired between the check and now — the api-client
          // interceptor already redirects; reflect that here.
          setState("redirecting");
        } else {
          setState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [roomId, router]);

  if (state === "ready") {
    return <RoomCanvasInner roomId={roomId} roomCode={roomCode} />;
  }

  if (state === "not-found") {
    return (
      <CanvasStatus
        title="Room not found"
        message="This room doesn't exist or may have been removed. Check the link or room code and try again."
        actionLabel="Back to rooms"
        onAction={() => router.push("/rooms")}
      />
    );
  }

  if (state === "error") {
    return (
      <CanvasStatus
        title="Couldn't open this room"
        message="Something went wrong while loading the room. Please try again."
        actionLabel="Back to rooms"
        onAction={() => router.push("/rooms")}
      />
    );
  }

  // "checking" | "redirecting"
  return (
    <CanvasStatus
      title={state === "redirecting" ? "Redirecting…" : "Opening room…"}
      message={
        state === "redirecting"
          ? "Please sign in to join this room."
          : "Verifying access and loading the canvas."
      }
      spinner
    />
  );
}

/**
 * RoomCanvasInner — the actual canvas, mounted only once access is confirmed.
 * Owns the single shared socket for drawing (Canvas/Game) and chat (ChatPanel),
 * and the Share dialog.
 *
 * The Share modal lives HERE (a sibling of Canvas/ChatPanel), NOT inside Canvas:
 * the canvas wrapper sets `isolation: isolate` + a low z-index, which would cap
 * any modal rendered inside it below the chat panel (z-index 40). Rendering it
 * at this level lets its high z-index actually win.
 */
function RoomCanvasInner({
  roomId,
  roomCode,
}: {
  roomId: string;
  roomCode: string;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [failed, setFailed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();
  const closedByUs = useRef(false);

  useEffect(() => {
    closedByUs.current = false;
    const ws = createRoomSocket();

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    // If the server rejects the handshake (e.g. auth), it closes with code 1008.
    // Surface a graceful failure instead of hanging on "connecting…".
    ws.onclose = (event) => {
      if (closedByUs.current) return;
      if (event.code === 1008) setFailed(true);
    };

    return () => {
      closedByUs.current = true;
      ws.close();
    };
  }, [roomId]);

  if (failed) {
    return (
      <CanvasStatus
        title="Connection refused"
        message="We couldn't connect you to this room. Your session may have expired."
        actionLabel="Sign in"
        onAction={() => router.push(`/signin?returnTo=/canvas/${roomId}`)}
      />
    );
  }

  if (!socket) {
    return (
      <CanvasStatus
        title="Connecting…"
        message="Establishing a live connection to the room."
        spinner
      />
    );
  }

  return (
    <div style={{ background: cssVar.color.bgBase }}>
      <Canvas
        roomId={roomId}
        socket={socket}
        onShare={() => setShareOpen(true)}
      />
      <ChatPanel roomId={roomId} socket={socket} />
      <ShareRoomModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={buildShareUrl(roomId)}
        roomCode={roomCode}
      />
    </div>
  );
}
