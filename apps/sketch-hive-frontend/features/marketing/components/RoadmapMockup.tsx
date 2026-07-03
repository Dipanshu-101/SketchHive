"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HelpCircle, Minus, Plus, Share2 } from "lucide-react";
import { Avatar } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";

/**
 * RoadmapMockup — the showcase-section board: a kanban roadmap on the white
 * canvas (To Do → In Progress → Review → Done) with colored task cards and
 * hand-drawn "Next" arrows, matching the reference's second mockup. Same window
 * chrome (title · Share · avatars · Live) and zoom controls as the hero board so
 * the two read as the same product.
 */

const COLUMNS: { title: string; cards: { label: string; tone: string }[] }[] = [
  {
    title: "To Do",
    cards: [
      { label: "User Research", tone: cssVar.color.noteMint },
      { label: "Competitor\nAnalysis", tone: cssVar.color.noteHoney },
      { label: "Feature\nIdeation", tone: cssVar.color.noteHoney },
    ],
  },
  {
    title: "In Progress",
    cards: [
      { label: "Wireframing", tone: cssVar.color.noteMint },
      { label: "User Flow", tone: cssVar.color.noteHoney },
      { label: "Prototype", tone: cssVar.color.noteMint },
    ],
  },
  {
    title: "Review",
    cards: [
      { label: "UI Design", tone: cssVar.color.noteMint },
      { label: "Feedback\nRound", tone: cssVar.color.noteHoney },
    ],
  },
  {
    title: "Done",
    cards: [
      { label: "Usability\nTesting", tone: cssVar.color.noteMint },
      { label: "Final Design", tone: cssVar.color.noteMint },
    ],
  },
];

export function RoadmapMockup({ title = "Project Roadmap" }: { title?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? undefined : { scale: [1, 1.01, 1] }}
      transition={
        reduce ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 540,
        borderRadius: cssVar.radius.lg,
        overflow: "hidden",
        background: cssVar.color.boardPaper,
        border: `1px solid ${cssVar.color.borderStrong}`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: cssVar.color.boardPanel,
          borderBottom: `1px solid ${cssVar.color.boardLine}`,
        }}
      >
        <span
          style={{ fontSize: 13, fontWeight: 600, color: cssVar.color.boardInk }}
        >
          {title} ▾
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex" }}>
            {["Sara Kim", "Tom Ire"].map((n, i) => (
              <span
                key={n}
                style={{
                  marginLeft: i === 0 ? 0 : -8,
                  borderRadius: "50%",
                  boxShadow: `0 0 0 2px ${cssVar.color.boardPanel}`,
                }}
              >
                <Avatar name={n} size="xs" />
              </span>
            ))}
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: cssVar.color.boardInkSoft,
              background: cssVar.color.honey500,
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            <Share2 size={11} /> Share
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              color: cssVar.color.cursorB,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: cssVar.color.cursorB,
                display: "inline-block",
                animation: "honeyPulse 1.8s ease-in-out infinite",
              }}
            />
            Live
          </span>
        </div>
      </div>

      {/* board */}
      <div
        style={{
          position: "relative",
          height: 300,
          padding: "14px 12px",
          background: cssVar.color.boardPaper,
          backgroundImage: `radial-gradient(${cssVar.color.boardDot} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {COLUMNS.map((col, ci) => (
          <div key={col.title}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cssVar.color.boardInk,
                marginBottom: 8,
                paddingBottom: 4,
                borderBottom: `1.5px solid ${cssVar.color.boardLine}`,
              }}
            >
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {col.cards.map((card, i) => (
                <motion.div
                  key={i}
                  animate={reduce ? undefined : { y: [0, -3, 0] }}
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: ci * 0.2 + i * 0.15,
                        }
                  }
                  style={{
                    padding: "7px 8px",
                    borderRadius: 5,
                    background: card.tone,
                    color: cssVar.color.boardInk,
                    fontFamily: cssVar.font.mono,
                    fontSize: 9.5,
                    fontWeight: 600,
                    lineHeight: 1.25,
                    whiteSpace: "pre-line",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {card.label}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* zoom controls */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
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
              background: cssVar.color.boardInk,
              color: cssVar.color.boardPaper,
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
              background: cssVar.color.boardInk,
              color: cssVar.color.boardPaper,
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <HelpCircle size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
