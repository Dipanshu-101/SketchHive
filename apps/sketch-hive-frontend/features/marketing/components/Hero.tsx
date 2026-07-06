"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Zap,
  Infinity as InfinityIcon,
  ShieldCheck,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { WhiteboardMockup } from "./WhiteboardMockup";
import { FloatingBee } from "./FloatingBee";
import { fadeUp, scaleIn, staggerParent } from "../motion";

const INDICATORS = [
  { icon: Zap, label: "Real-time Collaboration" },
  { icon: InfinityIcon, label: "Infinite Canvas" },
  { icon: ShieldCheck, label: "Secure & Private" },
  { icon: MonitorSmartphone, label: "Cross Platform" },
];

/**
 * Hero — reference-accurate split: left copy column, right canvas mockup that
 * dominates the fold. Badge → 3-line heading (honey accent on the last line) →
 * paragraph → dual CTA → 4 feature indicators. Bees carrying shapes flank the
 * hero exactly like the reference. Entrance animations stagger in on load.
 */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(40px, 6vw, 72px) 32px clamp(48px, 6vw, 80px)",
      }}
    >
      {/* Bees flanking the hero (reference placement). The right bee is mirrored
          (flip) so it faces inward toward the page center. */}
      {/* Left bee (cube): sits behind the badge/heading — nudged up-and-left so
          more of it clears the text and reads clearly. Stays behind content
          (z-index 0). */}
      <FloatingBee
        variant="cube"
        size={100}
        style={{ position: "absolute", top: 10, left: -37 }}
        className="mkt-hero-bee-l"
      />
      {/* Right bee (triangle): foreground decoration that paints above the grid
          (z-index 1) — and thus above the WhiteboardMockup canvas — via z-index 2. */}
      <FloatingBee
        variant="triangle"
        size={100}
        delay={0.8}
        flip
        showPath={false}
        style={{ position: "absolute", top: 300, right: -20, zIndex: 2 }}
        className="mkt-hero-bee-r"
      />

      <div className="mkt-hero-grid">
        {/* ── Left column ── */}
        <motion.div
          variants={staggerParent(0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: cssVar.color.textSecondary,
              background: cssVar.color.bgElevated,
              border: `1px solid ${cssVar.color.border}`,
              padding: "7px 15px",
              borderRadius: 999,
              marginBottom: 26,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: `2px solid ${cssVar.color.honey500}`,
                display: "inline-block",
              }}
            />
            Collaborate. Creatively. In Real-time.
          </motion.span>

          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: "clamp(38px, 5.6vw, 62px)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: cssVar.color.textPrimary,
              margin: "0 0 22px",
            }}
          >
            Collaboration
            <br />
            made as simple as
            <br />
            <span style={{ color: cssVar.color.honey500 }}>a sketch.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: "clamp(15px, 1.3vw, 16px)",
              lineHeight: 1.7,
              color: cssVar.color.textSecondary,
              maxWidth: 440,
              margin: "0 0 32px",
            }}
          >
            SketchHive is a real-time collaborative whiteboard for teams to
            brainstorm, plan, and create together. Draw, share ideas, and build
            amazing things — together.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 34,
            }}
          >
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowUpRight size={16} />}
              >
                Start a Whiteboard
              </Button>
            </Link>
            <Link href="/rooms" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="lg" leftIcon={<Play size={15} />}>
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px 22px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {INDICATORS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 12.5,
                  color: cssVar.color.textMuted,
                }}
              >
                <Icon size={14} color={cssVar.color.honey500} />
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── Right column: dominating canvas ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <WhiteboardMockup title="Team Brainstorm" />
        </motion.div>
      </div>

      <style>{`
        .mkt-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        .mkt-hero-bee-l, .mkt-hero-bee-r { display: none; }
        @media (min-width: 960px) {
          .mkt-hero-grid {
            grid-template-columns: 0.92fr 1.08fr;
            gap: 40px;
          }
          .mkt-hero-bee-l, .mkt-hero-bee-r { display: block; }
        }
      `}</style>
    </section>
  );
}
