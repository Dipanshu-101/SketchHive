"use client";

import { cssVar } from "@repo/ui/tokens";

interface StickyNote {
  x: number;
  y: number;
  w: number;
  label: string;
  tone: "honey" | "mint" | "sky" | "rose";
}

const TONES: Record<StickyNote["tone"], string> = {
  honey: "var(--color-honey-500)",
  mint: "var(--color-success)",
  sky: "var(--color-info)",
  rose: "var(--color-danger)",
};

/**
 * WhiteboardMockup — an ORIGINAL stylized board rendered with SketchHive's own
 * shape vocabulary (sticky notes, a central idea node, dashed connectors, and
 * live collaborator cursors). Not a clone of the reference mockup — it uses the
 * app's honey/near-black language and the mono "canvas" font for on-board text
 * (§4). Presentational only; no engine involved.
 */
export function WhiteboardMockup({
  title = "Team Brainstorm",
  variant = "ideas",
}: {
  title?: string;
  variant?: "ideas" | "roadmap";
}) {
  const notes: StickyNote[] =
    variant === "ideas"
      ? [
          { x: 40, y: 60, w: 96, label: "User\nResearch", tone: "honey" },
          { x: 300, y: 54, w: 92, label: "Ideas", tone: "mint" },
          { x: 330, y: 150, w: 96, label: "Wireframes", tone: "sky" },
          { x: 60, y: 176, w: 84, label: "Testing", tone: "sky" },
          { x: 176, y: 210, w: 84, label: "Design", tone: "rose" },
        ]
      : [
          { x: 36, y: 56, w: 92, label: "To Do", tone: "honey" },
          { x: 148, y: 56, w: 96, label: "In\nProgress", tone: "mint" },
          { x: 268, y: 56, w: 88, label: "Review", tone: "sky" },
          { x: 36, y: 150, w: 92, label: "Prototype", tone: "honey" },
          { x: 268, y: 150, w: 88, label: "Shipped", tone: "rose" },
        ];

  return (
    <div
      className="hover-lift"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        borderRadius: cssVar.radius.xl,
        overflow: "hidden",
        border: `1px solid ${cssVar.color.borderHover}`,
        background: `color-mix(in srgb, ${cssVar.color.bgOverlay} 88%, transparent)`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: cssVar.shadow.lg,
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${cssVar.color.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: cssVar.color.honey500,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: cssVar.color.textPrimary,
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 600,
            color: cssVar.color.success,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: cssVar.color.success,
              display: "inline-block",
              animation: "honeyPulse 1.8s ease-in-out infinite",
            }}
          />
          Live
        </span>
      </div>

      {/* Board surface */}
      <div
        style={{
          position: "relative",
          height: 300,
          background: cssVar.color.bgBase,
          backgroundImage: `radial-gradient(${cssVar.color.border} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        {/* dashed connectors */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
          aria-hidden="true"
        >
          <path
            d="M136 100 C 200 90, 240 90, 300 92"
            stroke={cssVar.color.textMuted}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            fill="none"
          />
          <path
            d="M150 200 C 210 180, 260 170, 330 168"
            stroke={cssVar.color.textMuted}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            fill="none"
          />
        </svg>

        {notes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: n.w,
              padding: "10px 12px",
              borderRadius: cssVar.radius.sm,
              background: `color-mix(in srgb, ${TONES[n.tone]} 18%, ${cssVar.color.bgElevated})`,
              border: `1px solid color-mix(in srgb, ${TONES[n.tone]} 45%, transparent)`,
              fontFamily: cssVar.font.mono,
              fontSize: 12,
              lineHeight: 1.35,
              color: cssVar.color.textPrimary,
              whiteSpace: "pre-line",
              boxShadow: cssVar.shadow.sm,
            }}
          >
            {n.label}
          </div>
        ))}

        {/* collaborator cursors — distinct, colored, name-labeled (§4) */}
        <Cursor x={210} y={120} color={cssVar.color.info} name="Maya" />
        <Cursor x={96} y={236} color={cssVar.color.success} name="Arjun" />
      </div>
    </div>
  );
}

function Cursor({
  x,
  y,
  color,
  name,
}: {
  x: number;
  y: number;
  color: string;
  name: string;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={color} aria-hidden>
        <path d="M4 2 l6 16 2-6 6-2 z" />
      </svg>
      <span
        style={{
          marginLeft: 12,
          fontSize: 10,
          fontWeight: 600,
          color: cssVar.color.textOnBrand,
          background: color,
          padding: "1px 6px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
}
