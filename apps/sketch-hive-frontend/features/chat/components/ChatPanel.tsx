"use client";

import { useState, type CSSProperties } from "react";
import { MessagesSquare, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { GlassPanel } from "@repo/ui";
import { ChatInput, ConnectionBadge, chatTheme } from "@repo/chat-ui";
import { ChatProvider, useChatContext } from "./ChatProvider";
import { ChatMessages } from "./ChatMessages";

/**
 * ChatPanel — the room's collaboration chat surface.
 *
 * Layout: a full-height, ~22%-wide frosted panel pinned to the LEFT of the
 * canvas. It collapses to a slim launcher button with a smooth width animation;
 * expanded, it shows header → transcript → composer.
 *
 * It owns ONLY presentation + open/close state. All chat data flows from
 * <ChatProvider> (one engine instance), so collapsing the panel never tears
 * down the socket subscription or loses history — messages keep arriving in the
 * background and are there when you reopen.
 *
 * The whole panel is wrapped so it floats above the canvas (which sits at
 * z-index 20) without participating in the canvas's drawing/pointer handling.
 */
export function ChatPanel({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket | null;
}) {
  const [open, setOpen] = useState(true);

  return (
    <ChatProvider roomId={roomId} socket={socket}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 40,
          display: "flex",
          alignItems: "stretch",
          padding: 12,
          pointerEvents: "none", // children re-enable; canvas stays interactive in the gaps
        }}
      >
        <PanelShell open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
    </ChatProvider>
  );
}

/** The animated width container: a launcher when closed, the full panel when open. */
function PanelShell({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  // Width is clamped to a share of the viewport (20–25% range) with sensible
  // min/max so it stays usable on small and ultra-wide screens.
  const expandedWidth = "clamp(300px, 23vw, 420px)";

  const shellStyle: CSSProperties = {
    pointerEvents: "auto",
    height: "100%",
    width: open ? expandedWidth : 52,
    transition: "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
    overflow: "hidden",
  };

  if (!open) {
    return (
      <div style={shellStyle}>
        <LauncherButton onClick={onToggle} />
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <GlassPanel
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          // Slightly darker than the default GlassPanel so the transcript reads
          // cleanly over a busy canvas while still feeling like frosted glass.
          background: "rgba(10,14,24,0.55)",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <ChatHeader onCollapse={onToggle} />
        <ChatMessages />
        <Composer />
      </GlassPanel>
    </div>
  );
}

function LauncherButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Open chat"
      aria-label="Open chat"
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background: hover
          ? "rgba(20,28,48,0.85)"
          : "rgba(12,18,32,0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        color: chatTheme.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hover
          ? `0 8px 28px rgba(0,0,0,0.6), 0 0 18px ${chatTheme.accentGlow}`
          : "0 8px 24px rgba(0,0,0,0.5)",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "transform 160ms ease, box-shadow 200ms ease, background 200ms ease",
      }}
    >
      <MessagesSquare size={22} />
    </button>
  );
}

function ChatHeader({ onCollapse }: { onCollapse: () => void }) {
  const { connection } = useChatContext();
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 14px 12px",
        borderBottom: `1px solid ${chatTheme.hairline}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${chatTheme.accentDeep}, ${chatTheme.accent})`,
          boxShadow: `0 0 18px ${chatTheme.accentGlow}`,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <MessagesSquare size={17} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: chatTheme.text,
            letterSpacing: "-0.01em",
          }}
        >
          Room Chat
        </div>
        <ConnectionBadge state={connection} />
      </div>

      <button
        type="button"
        onClick={onCollapse}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title="Collapse chat"
        aria-label="Collapse chat"
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          border: "1px solid rgba(255,255,255,0.10)",
          background: hover ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
          color: chatTheme.textMuted,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
          flexShrink: 0,
        }}
      >
        {hover ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
      </button>
    </div>
  );
}

function Composer() {
  const { sendMessage, connection, status } = useChatContext();
  const disabled = connection !== "connected" || status === "error";
  return (
    <div style={{ padding: 12, borderTop: `1px solid ${chatTheme.hairline}` }}>
      <ChatInput onSend={sendMessage} disabled={disabled} />
    </div>
  );
}
