"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { RoadmapMockup } from "./RoadmapMockup";
import { FloatingBee } from "./FloatingBee";
import { fadeUp, staggerParent, revealOnce } from "../motion";

const POINTS = [
  "Invite your team with a simple link",
  "Work together in real-time",
  "Never lose your ideas",
  "Export and share with ease",
];

/**
 * CollaborateShowcase — reference showcase: roadmap canvas on the LEFT, copy on
 * the RIGHT ("COLLABORATE BETTER" → "Built for teams that create together" →
 * honey-check bullets → CTA). A bee carrying a shape sits at the lower-left, as
 * in the reference.
 */
export function CollaborateShowcase() {
  return (
    <section
      id="collaborate"
      style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 7vw, 88px) 32px",
        scrollMarginTop: 88,
      }}
    >
      <FloatingBee
        carry="sphere"
        size={70}
        delay={0.5}
        style={{ position: "absolute", bottom: 40, left: 8 }}
        className="mkt-showcase-bee"
      />

      <div className="mkt-showcase-grid">
        <motion.div
          variants={fadeUp}
          {...revealOnce}
          className="mkt-showcase-visual"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <RoadmapMockup />
        </motion.div>

        <motion.div variants={staggerParent(0.1)} {...revealOnce}>
          <motion.span
            variants={fadeUp}
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: cssVar.color.honey500,
              marginBottom: 14,
            }}
          >
            Collaborate Better
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{
              fontSize: "clamp(26px, 3.6vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: cssVar.color.textPrimary,
              margin: "0 0 16px",
            }}
          >
            Built for teams
            <br />
            that create together
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: cssVar.color.textSecondary,
              margin: "0 0 24px",
              maxWidth: 460,
            }}
          >
            From brainstorming sessions to project planning, SketchHive helps
            teams stay aligned and productive with real-time collaboration.
          </motion.p>

          <motion.ul
            variants={staggerParent(0.06)}
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}
          >
            {POINTS.map((p) => (
              <motion.li
                key={p}
                variants={fadeUp}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  fontSize: 15,
                  color: cssVar.color.textPrimary,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: cssVar.color.honey500,
                    color: cssVar.color.textOnBrand,
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                {p}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp}>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button variant="primary" rightIcon={<ArrowUpRight size={16} />}>
                Create your team board
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .mkt-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        .mkt-showcase-bee { display: none; }
        @media (min-width: 940px) {
          .mkt-showcase-grid { grid-template-columns: 1.1fr 0.9fr; gap: 56px; }
          .mkt-showcase-bee { display: block; }
        }
      `}</style>
    </section>
  );
}
