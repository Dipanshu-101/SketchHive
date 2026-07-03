"use client";

import { cssVar } from "@repo/ui/tokens";

/**
 * HoneyAmbientBg — the reference's calm decorative backdrop: near-black with a
 * faint hex-dot texture, a couple of soft honey glows, and scattered outlined
 * hexagons + tiny dots. Static (no animation loop) so it never distracts from
 * content — the page's motion comes from content entrances, not the background.
 */

const HEXES = [
  { top: "14%", left: "3%", size: 46, rot: 8 },
  { top: "40%", right: "5%", size: 64, rot: -12 },
  { top: "66%", left: "6%", size: 38, rot: 20 },
  { top: "82%", right: "8%", size: 54, rot: -6 },
];

const DOTS = [
  { top: "20%", left: "10%" },
  { top: "30%", right: "12%" },
  { top: "55%", left: "16%" },
  { top: "72%", right: "18%" },
  { top: "90%", left: "12%" },
];

function Hexagon({ size, rot }: { size: number; rot: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rot}deg)` }}
      aria-hidden
    >
      <path
        d="M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z"
        fill="none"
        stroke={cssVar.color.border}
        strokeWidth="2"
      />
    </svg>
  );
}

export function HoneyAmbientBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: cssVar.color.bgBase,
      }}
    >
      {/* faint hex-dot grid, fading toward the bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          backgroundImage: `radial-gradient(${cssVar.color.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(130% 100% at 50% 0%, black 25%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(130% 100% at 50% 0%, black 25%, transparent 85%)",
        }}
      />

      {/* soft honey glows */}
      <div
        style={{
          position: "absolute",
          top: -180,
          left: -140,
          width: 640,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 180,
          right: -180,
          width: 540,
          height: 440,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      {/* scattered outlined hexagons */}
      {HEXES.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: h.top,
            left: h.left,
            right: h.right,
            opacity: 0.5,
          }}
        >
          <Hexagon size={h.size} rot={h.rot} />
        </div>
      ))}

      {/* tiny honey dots */}
      {DOTS.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            right: d.right,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: cssVar.color.honey500,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}
