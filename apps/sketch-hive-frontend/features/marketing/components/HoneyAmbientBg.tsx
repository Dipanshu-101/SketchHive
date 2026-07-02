"use client";

import { cssVar } from "@repo/ui/tokens";

/**
 * HoneyAmbientBg — a calm, static ambient backdrop for the landing page: a few
 * soft honey glows and a faint hex-dot texture on near-black. No mouse effects,
 * no animation loop — the motion on the landing comes from content entrances,
 * not the background (§4: nothing animates just because it can).
 */
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
      {/* faint hex-dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage: `radial-gradient(${cssVar.color.border} 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 80%)",
        }}
      />
      {/* top-left honey glow */}
      <div
        style={{
          position: "absolute",
          top: -160,
          left: -120,
          width: 620,
          height: 460,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(90px)",
        }}
      />
      {/* right honey glow */}
      <div
        style={{
          position: "absolute",
          top: 200,
          right: -160,
          width: 520,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
