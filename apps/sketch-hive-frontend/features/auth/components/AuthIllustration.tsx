"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";
import { BeeMark } from "@repo/icons";
import { cssVar } from "@repo/ui/tokens";
import { FloatingBee } from "@/features/marketing/components";
import { fadeUp, staggerParent } from "@/features/marketing/motion";

/**
 * AuthIllustration — the premium branded left panel for the auth split-screen.
 *
 * Built entirely from the landing page's own visual vocabulary so the auth
 * surface reads as one continuous design system:
 *   • the same near-black bg + faint hex-dot grid + soft honey glows as
 *     HoneyAmbientBg (§background),
 *   • scattered outlined hexagons + tiny honey dots,
 *   • the same FloatingBee mascots with dashed flight-path trails and idle
 *     float used across the landing sections,
 *   • the same BeeMark brand tile used in the nav/footer,
 *   • a couple of "floating canvas snippet" cards + a collaboration line, so the
 *     panel feels alive without competing with the form.
 *
 * Every value is a design token; all looping/idle motion is gated on
 * useReducedMotion. Purely decorative — no logic, no links that affect auth.
 */

/* Local outlined hexagon — identical path/treatment to HoneyAmbientBg. */
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

const HEXES = [
  { top: "10%", left: "8%", size: 52, rot: 10 },
  { top: "62%", left: "10%", size: 40, rot: -14 },
  { top: "78%", right: "14%", size: 58, rot: -6 },
];

const DOTS = [
  { top: "22%", right: "18%" },
  { top: "48%", left: "20%" },
  { top: "70%", right: "26%" },
];

/* A tiny "canvas snippet" card — echoes the landing's whiteboard/sticky-note
   language (pastel note fill, mono label) but at brand scale. Bobs gently. */
function CanvasSnippet({
  note,
  label,
  rot,
  delay,
  style,
  reduce,
}: {
  note: string;
  label: string;
  rot: number;
  delay: number;
  style?: React.CSSProperties;
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={
        reduce
          ? undefined
          : { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
      }
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: cssVar.radius.md,
        background: `color-mix(in srgb, ${cssVar.color.bgOverlay} 88%, transparent)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${cssVar.color.borderHover}`,
        boxShadow: cssVar.shadow.md,
        transform: `rotate(${rot}deg)`,
        ...style,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: note,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontFamily: cssVar.font.mono,
          color: cssVar.color.textSecondary,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function AuthIllustration() {
  const reduce = useReducedMotion();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: cssVar.color.bgBase,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(40px, 5vw, 72px)",
      }}
    >
      {/* ── Ambient backdrop (mirrors HoneyAmbientBg) ── */}
      {/* faint hex-dot grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          backgroundImage: `radial-gradient(${cssVar.color.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(120% 100% at 30% 20%, black 25%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(120% 100% at 30% 20%, black 25%, transparent 82%)",
        }}
      />
      {/* soft honey glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -160,
          left: -120,
          width: 560,
          height: 440,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -180,
          right: -140,
          width: 520,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${cssVar.color.honeyGlow} 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />
      {/* scattered outlined hexagons */}
      {HEXES.map((h, i) => (
        <div
          key={i}
          aria-hidden
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
          aria-hidden
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

      {/* ── Bees with dashed flight paths (same as landing) ── */}
      <FloatingBee
        variant="cube"
        size={96}
        style={{ position: "absolute", top: "12%", right: "16%" }}
      />
      <FloatingBee
        variant="notes"
        size={78}
        delay={0.9}
        flip
        showPath={false}
        style={{ position: "absolute", bottom: "16%", left: "12%" }}
      />

      {/* ── Floating canvas snippets ── */}
      <CanvasSnippet
        note={cssVar.color.noteHoney}
        label="Team Brainstorm"
        rot={-3}
        delay={0}
        reduce={reduce ?? false}
        style={{ top: "30%", right: "12%" }}
      />
      <CanvasSnippet
        note={cssVar.color.noteSky}
        label="Product Roadmap"
        rot={2.5}
        delay={1.2}
        reduce={reduce ?? false}
        style={{ bottom: "30%", right: "22%" }}
      />

      {/* ── Foreground brand copy (staggered entrance, mirrors landing) ── */}
      <motion.div
        variants={staggerParent(0.12)}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 1, maxWidth: 400 }}
      >
        {/* Brand lockup — same honey tile + BeeMark as the nav/footer */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: cssVar.radius.md,
              background: cssVar.color.honey500,
              color: cssVar.color.textOnBrand,
              boxShadow: cssVar.shadow.sm,
            }}
          >
            <BeeMark size={24} />
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: cssVar.color.textPrimary,
            }}
          >
            SketchHive
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.span
          variants={fadeUp}
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cssVar.color.honey500,
            marginBottom: 16,
          }}
        >
          Collaborate in real-time
        </motion.span>

        {/* Headline — same weight/tracking language as landing headings */}
        <motion.h2
          variants={fadeUp}
          style={{
            fontSize: "clamp(28px, 3vw, 38px)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: cssVar.color.textPrimary,
            margin: "0 0 18px",
          }}
        >
          Where great ideas
          <br />
          take <span style={{ color: cssVar.color.honey500 }}>flight.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: cssVar.color.textSecondary,
            margin: "0 0 28px",
          }}
        >
          Sketch, plan, and build together on an infinite canvas. Your whole team,
          one shared space — always in sync.
        </motion.p>

        {/* Small collaboration illustration line */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 20px",
          }}
        >
          {[
            { icon: Users, label: "Live cursors & presence" },
            { icon: Sparkles, label: "Infinite honeycomb canvas" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: cssVar.color.textMuted,
              }}
            >
              <Icon size={15} color={cssVar.color.honey500} />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
