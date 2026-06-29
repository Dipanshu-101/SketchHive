"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Circle,
  Diamond,
  Eraser,
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
import { IconButton } from "./IconsButton";
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
      <IconButton icon={<Undo2 size={18} />} title="Undo" activated={false} onClick={onUndo} />
      <IconButton icon={<Redo2 size={18} />} title="Redo" activated={false} onClick={onRedo} />
    </div>
  );
}
