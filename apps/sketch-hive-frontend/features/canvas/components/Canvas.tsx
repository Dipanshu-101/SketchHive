"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Circle,
  Diamond,
  Eraser,
  Hand,
  Minus,
  MousePointer2,
  MoveUpRight,
  Pencil,
  Redo2,
  Square,
  Triangle,
  Type,
  Undo2,
} from "lucide-react";
import { IconButton } from "./IconButton";
import { Game } from "@/draw/Game";
import { Tool } from "@/draw/types";

/**
 * Toolbar configuration. The toolbar is data-driven: adding a tool here adds a
 * button — there is NO tool-specific branching in this component. Each entry
 * maps a Tool enum value to its icon + label.
 */
const TOOLS: Array<{ tool: Tool; icon: ReactNode; label: string }> = [
  { tool: Tool.Select, icon: <MousePointer2 size={18} />, label: "Select" },
  { tool: Tool.Rectangle, icon: <Square size={18} />, label: "Rectangle" },
  { tool: Tool.Circle, icon: <Circle size={18} />, label: "Circle" },
  { tool: Tool.Line, icon: <Minus size={18} />, label: "Line" },
  { tool: Tool.Arrow, icon: <MoveUpRight size={18} />, label: "Arrow" },
  { tool: Tool.Triangle, icon: <Triangle size={18} />, label: "Triangle" },
  { tool: Tool.Diamond, icon: <Diamond size={18} />, label: "Diamond" },
  { tool: Tool.Pencil, icon: <Pencil size={18} />, label: "Pencil" },
  { tool: Tool.Text, icon: <Type size={18} />, label: "Text" },
  { tool: Tool.Eraser, icon: <Eraser size={18} />, label: "Eraser" },
];

export function Canvas({ roomId, socket }: { socket: WebSocket; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Rectangle);

  // Create exactly one Game per canvas mount; tear it down on unmount.
  useEffect(() => {
    if (!canvasRef.current) return;
    const g = new Game(canvasRef.current, roomId, socket);
    setGame(g);
    return () => g.destroy();
  }, [roomId, socket]);

  // Push tool changes into the engine.
  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1280}
        height={typeof window !== "undefined" ? window.innerHeight : 720}
        style={{ position: "fixed", inset: 0, zIndex: 20, display: "block" }}
      />
      <Toolbar
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        onUndo={() => game?.undo()}
        onRedo={() => game?.redo()}
      />
    </div>
  );
}

function Toolbar({
  selectedTool,
  onSelectTool,
  onUndo,
  onRedo,
}: {
  selectedTool: Tool;
  onSelectTool: (t: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        gap: 4,
        padding: 6,
        borderRadius: 12,
        background: "rgba(20,20,28,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      {TOOLS.map((t) => (
        <IconButton
          key={t.tool}
          icon={t.icon}
          title={t.label}
          activated={selectedTool === t.tool}
          onClick={() => onSelectTool(t.tool)}
        />
      ))}
      <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
      <PanToolButton
        active={selectedTool === Tool.Pan}
        onClick={() =>
          onSelectTool(selectedTool === Tool.Pan ? Tool.Select : Tool.Pan)
        }
      />
      <div style={{ width: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
      <IconButton icon={<Undo2 size={18} />} title="Undo" activated={false} onClick={onUndo} />
      <IconButton icon={<Redo2 size={18} />} title="Redo" activated={false} onClick={onRedo} />
    </div>
  );
}

/**
 * The infinite-pan ("Hand") tool button. Unlike the plain icon buttons this one
 * is deliberately eye-catching: a vivid gradient + glow + gentle pulse while
 * active, signalling that the canvas is in free-roam mode. Toggling it off
 * returns to the Select tool so normal drawing resumes.
 *
 * All animation is injected via a one-time <style> tag (no CSS-file plumbing).
 */
function PanToolButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <>
      <style>{PAN_BUTTON_KEYFRAMES}</style>
      <button
        type="button"
        title="Infinite Pan — drag to roam the canvas"
        aria-label="Infinite Pan"
        aria-pressed={active}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "none",
          cursor: "grab",
          color: "#ffffff",
          // Use longhand background properties only — mixing the `background`
          // shorthand with `backgroundSize` triggers a React style conflict.
          // Vivid animated gradient when active; a calmer tinted state otherwise.
          backgroundColor: "rgba(124,58,237,0.18)",
          backgroundImage: active
            ? "linear-gradient(135deg,#7c3aed,#4f8cff,#22d3ee)"
            : hover
              ? "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,140,255,0.35))"
              : "none",
          backgroundSize: active ? "200% 200%" : "100% 100%",
          boxShadow: active
            ? "0 0 0 1px rgba(124,58,237,0.6), 0 0 14px 2px rgba(79,140,255,0.55)"
            : "0 0 0 1px rgba(124,58,237,0.35)",
          transform: active || hover ? "scale(1.06)" : "scale(1)",
          transition:
            "transform 140ms ease, box-shadow 200ms ease, background-color 200ms ease, background-image 200ms ease",
          // Slide the gradient + a soft glow pulse while the tool is engaged.
          animation: active ? "panGradient 4s ease infinite, panPulse 1.8s ease-in-out infinite" : "none",
        }}
      >
        <Hand size={18} style={{ animation: active ? "panWave 1.6s ease-in-out infinite" : "none" }} />
      </button>
    </>
  );
}

const PAN_BUTTON_KEYFRAMES = `
@keyframes panGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes panPulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(124,58,237,0.6), 0 0 10px 1px rgba(79,140,255,0.45); }
  50% { box-shadow: 0 0 0 1px rgba(124,58,237,0.8), 0 0 18px 4px rgba(34,211,238,0.65); }
}
@keyframes panWave {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
`;
