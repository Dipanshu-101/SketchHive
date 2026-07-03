"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MousePointer2,
  Pen,
  Square,
  Image as ImageIcon,
  Type,
  MessageSquare,
  Shapes,
  Plus,
  Minus,
  HelpCircle,
  Share2,
} from "lucide-react";
import { Avatar } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";

/**
 * WhiteboardMockup — the hero centerpiece. Recreates the reference's LIGHT
 * canvas: a white board with a left vertical toolbar, colored sticky notes,
 * hand-drawn arrows converging on a "PRODUCT VISION" thought-cloud, a top bar
 * (title · Share · participants · Live) and bottom zoom/help controls.
 *
 * It reads as alive, not a screenshot: the board breathes with a subtle zoom,
 * sticky notes drift gently, and a collaborator cursor moves. Presentational
 * only — no drawing engine involved. All motion respects reduced-motion.
 */

const TOOLS = [
  { icon: MousePointer2, active: true },
  { icon: Pen, active: false },
  { icon: Square, active: false },
  { icon: ImageIcon, active: false },
  { icon: Type, active: false },
  { icon: MessageSquare, active: false },
  { icon: Shapes, active: false },
];

interface Note {
  x: number;
  y: number;
  label: string;
  bg: string;
  drift: number; // per-note float delay
}

// Sticky-note tones — soft pastels on the WHITE board (tokenized paper palette).
const NOTES: Note[] = [
  { x: 44, y: 60, label: "User\nResearch", bg: cssVar.color.noteHoney, drift: 0 },
  { x: 300, y: 52, label: "Ideas", bg: cssVar.color.noteMint, drift: 0.6 },
  { x: 322, y: 150, label: "Wireframes", bg: cssVar.color.noteLilac, drift: 1.2 },
  { x: 40, y: 168, label: "Testing", bg: cssVar.color.noteSky, drift: 0.9 },
  { x: 150, y: 210, label: "Design", bg: cssVar.color.noteRose, drift: 0.3 },
];

const BOARD_INK = cssVar.color.boardInk; // ink for on-white text/arrows

export function WhiteboardMockup({
  title = "Team Brainstorm",
}: {
  title?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      // Subtle "breathing" zoom to feel alive.
      animate={reduce ? undefined : { scale: [1, 1.012, 1] }}
      transition={
        reduce
          ? undefined
          : { duration: 7, repeat: Infinity, ease: "easeInOut" }
      }
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 560,
        borderRadius: cssVar.radius.lg,
        overflow: "hidden",
        background: "var(--color-board-paper)",
        border: `1px solid ${cssVar.color.borderStrong}`,
        boxShadow:
          "0 24px 70px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "var(--color-board-panel)",
          borderBottom: "1px solid var(--color-board-line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DotsGrid />
          <span
            style={{ fontSize: 13, fontWeight: 600, color: BOARD_INK }}
          >
            {title} ▾
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-board-ink-soft)",
              background: "var(--color-board-paper)",
              border: "1px solid var(--color-board-line)",
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            <Share2 size={11} /> Share
          </span>
          <div style={{ display: "flex" }}>
            {["Maya Chen", "Arjun Rao", "Lena Ford"].map((n, i) => (
              <span
                key={n}
                style={{
                  marginLeft: i === 0 ? 0 : -8,
                  borderRadius: "50%",
                  boxShadow: "0 0 0 2px var(--color-board-panel)",
                }}
              >
                <Avatar name={n} size="xs" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Board area (toolbar + surface) ── */}
      <div style={{ display: "flex", position: "relative" }}>
        {/* left vertical toolbar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "10px 6px",
            background: "var(--color-board-panel)",
            borderRight: "1px solid var(--color-board-line)",
          }}
        >
          {TOOLS.map((t, i) => (
            <ToolButton key={i} Icon={t.icon} active={t.active} />
          ))}
          <div style={{ height: 1, background: "var(--color-board-line)", margin: "4px 2px" }} />
          <ToolButton Icon={Plus} active={false} />
        </div>

        {/* white board surface */}
        <div
          style={{
            position: "relative",
            flex: 1,
            height: 296,
            background: "var(--color-board-paper)",
            backgroundImage:
              "radial-gradient(var(--color-board-dot) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            overflow: "hidden",
          }}
        >
          {/* hand-drawn arrows + center cloud */}
          <MindMap />

          {/* sticky notes */}
          {NOTES.map((n, i) => (
            <StickyNote key={i} note={n} reduce={!!reduce} />
          ))}

          {/* live collaborator cursor */}
          {!reduce && <LiveCursor />}

          {/* Live badge */}
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-cursor-b)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-cursor-b)",
                display: "inline-block",
                animation: "honeyPulse 1.8s ease-in-out infinite",
              }}
            />
            Live
          </span>

          {/* zoom + help controls */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--color-board-ink)",
                color: "var(--color-board-paper)",
                borderRadius: 999,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            >
              <Minus size={13} />
              <span>100%</span>
              <Plus size={13} />
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--color-board-ink)",
                color: "var(--color-board-paper)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            >
              <HelpCircle size={14} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Sub-pieces ─────────────────────────────────────────────────────────── */

function DotsGrid() {
  return (
    <span
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(2, 3px)",
        gap: 2,
      }}
      aria-hidden
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 3,
            borderRadius: 1,
            background: "var(--color-board-ink-soft)",
          }}
        />
      ))}
    </span>
  );
}

function ToolButton({
  Icon,
  active,
}: {
  Icon: typeof MousePointer2;
  active: boolean;
}) {
  return (
    <motion.span
      whileHover={{ scale: 1.12 }}
      transition={{ duration: 0.12 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        cursor: "pointer",
        color: active ? cssVar.color.textOnBrand : "var(--color-board-ink-soft)",
        background: active ? cssVar.color.honey500 : "transparent",
      }}
    >
      <Icon size={15} />
    </motion.span>
  );
}

function StickyNote({ note, reduce }: { note: Note; reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -4, 0] }}
      transition={
        reduce
          ? undefined
          : {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: note.drift,
            }
      }
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        padding: "9px 12px",
        minWidth: 74,
        borderRadius: 6,
        background: note.bg,
        color: BOARD_INK,
        fontFamily: cssVar.font.mono,
        fontSize: 11.5,
        fontWeight: 600,
        lineHeight: 1.3,
        whiteSpace: "pre-line",
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
        transform: "rotate(-1.5deg)",
      }}
    >
      {note.label}
    </motion.div>
  );
}

function MindMap() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 440 296"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {/* lightbulb */}
      <g stroke={BOARD_INK} strokeWidth="1.6" fill="none">
        <circle cx="210" cy="70" r="9" />
        <path d="M206 82 h8 M207 86 h6" />
        <path d="M210 55 v-6 M225 62 l5-3 M195 62 l-5-3" strokeLinecap="round" />
      </g>

      {/* hand-drawn arrows to cloud */}
      <g
        stroke={BOARD_INK}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      >
        <path d="M120 96 C 150 108, 168 120, 186 128" />
        <path d="M330 92 C 300 108, 280 120, 262 128" />
        <path d="M96 190 C 140 176, 168 158, 190 150" />
        <path d="M330 176 C 300 168, 282 160, 262 150" />
        <path d="M186 232 C 196 200, 208 176, 214 160" />
        {/* arrowheads */}
        <path d="M186 128 l-8 -2 M186 128 l-2 -7" />
        <path d="M262 128 l8 -2 M262 128 l2 -7" />
      </g>

      {/* PRODUCT VISION thought-cloud */}
      <g>
        <path
          d="M200 116
             q-24 0 -24 16
             q-16 2 -12 16
             q-6 12 10 14
             q6 12 24 8
             q14 12 34 2
             q22 6 28 -10
             q16 -4 8 -18
             q8 -14 -12 -18
             q-4 -14 -24 -12
             q-16 -10 -40 -0 Z"
          fill="var(--color-board-paper)"
          stroke={BOARD_INK}
          strokeWidth="1.8"
        />
        <text
          x="220"
          y="146"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill={BOARD_INK}
          fontFamily="var(--font-sans)"
        >
          PRODUCT
        </text>
        <text
          x="220"
          y="160"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill={BOARD_INK}
          fontFamily="var(--font-sans)"
        >
          VISION
        </text>
      </g>
    </svg>
  );
}

function LiveCursor() {
  return (
    <motion.div
      initial={{ x: 150, y: 200 }}
      animate={{ x: [150, 220, 190, 150], y: [200, 150, 210, 200] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-cursor-a)" aria-hidden>
        <path d="M4 2 l6 16 2-6 6-2 z" />
      </svg>
      <span
        style={{
          marginLeft: 10,
          fontSize: 9,
          fontWeight: 600,
          color: "var(--color-board-paper)",
          background: "var(--color-cursor-a)",
          padding: "1px 5px",
          borderRadius: 5,
          whiteSpace: "nowrap",
        }}
      >
        Maya
      </span>
    </motion.div>
  );
}
