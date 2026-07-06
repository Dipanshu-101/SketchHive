"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Users,
  Infinity as InfinityIcon,
  Bell,
  Lock,
  MonitorSmartphone,
} from "lucide-react";
import type { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";
import { SectionHeading } from "./SectionHeading";
import { FloatingBee } from "./FloatingBee";
import { fadeUp, staggerParent, revealOnce } from "../motion";

interface Feature {
  icon: ReactNode;
  tint: string;
  title: string;
  desc: string;
}

// Icon tints echo the reference's multi-colored feature glyphs, drawn from the
// semantic + note token palette (no raw literals).
const FEATURES: Feature[] = [
  {
    icon: <Users size={22} />,
    tint: cssVar.color.cursorA,
    title: "Real-time Collaboration",
    desc: "See changes instantly as your team draws and brainstorms together.",
  },
  {
    icon: <InfinityIcon size={22} />,
    tint: cssVar.color.success,
    title: "Infinite Canvas",
    desc: "Limitless space to bring your ideas to life without boundaries.",
  },
  {
    icon: <Bell size={22} />,
    tint: cssVar.color.honey500,
    title: "Smart Tools",
    desc: "Everything you need — shapes, text, sticky notes, and more.",
  },
  {
    icon: <Lock size={22} />,
    tint: cssVar.color.danger,
    title: "Secure & Private",
    desc: "Your data is encrypted and your boards are always in your control.",
  },
  {
    icon: <MonitorSmartphone size={22} />,
    tint: cssVar.color.info,
    title: "Cross Platform",
    desc: "Access your boards from anywhere, anytime, on any device.",
  },
];

export function Features() {
  const reduce = useReducedMotion();

  return (
    <section
      id="features"
      style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 7vw, 88px) 32px",
        scrollMarginTop: 88,
      }}
    >
      {/* bee near the section heading (reference). Mirrored (flip) so this
          right-side bee faces inward toward the page center. */}
      <FloatingBee
        variant="sphere"
        size={80}
        delay={0.4}
        flip
        showPath={false}
        style={{ position: "absolute", top: 24, right: 24 }}
        className="mkt-features-bee"
      />

      <SectionHeading
        eyebrow="Why SketchHive?"
        title="Everything you need to collaborate visually"
      />

      <motion.div
        className="mkt-feature-grid"
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "clamp(36px, 4vw, 56px)",
        }}
        variants={staggerParent(0.08)}
        {...revealOnce}
      >
        {FEATURES.map((f) => (
          <motion.article
            key={f.title}
            variants={fadeUp}
            whileHover={reduce ? undefined : { y: -6 }}
            transition={{ duration: 0.18 }}
            style={{
              padding: 22,
              borderRadius: cssVar.radius.lg,
              background: cssVar.color.bgElevated,
              border: `1px solid ${cssVar.color.border}`,
              boxShadow: cssVar.shadow.md,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                marginBottom: 18,
                borderRadius: cssVar.radius.md,
                color: f.tint,
                background: `color-mix(in srgb, ${f.tint} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${f.tint} 30%, transparent)`,
              }}
            >
              {f.icon}
            </span>
            <h3
              style={{
                fontSize: 15.5,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: cssVar.color.textPrimary,
                margin: "0 0 8px",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: cssVar.color.textSecondary,
                margin: 0,
              }}
            >
              {f.desc}
            </p>
          </motion.article>
        ))}
      </motion.div>

      <style>{`
        .mkt-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mkt-features-bee { display: none; }
        @media (min-width: 560px) {
          .mkt-feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1000px) {
          .mkt-feature-grid { grid-template-columns: repeat(5, 1fr); gap: 14px; }
          .mkt-features-bee { display: block; }
        }
      `}</style>
    </section>
  );
}
