"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { FloatingBee } from "./FloatingBee";
import { scaleIn, revealOnce } from "../motion";

/**
 * FinalCTA — the reference's closing block: a large rounded container with a
 * honey-glowing border on dark elevated background, heading on the left and the
 * "Get Started for Free" honey button on the right, "No credit card required"
 * beneath. A bee sits at the lower-left, bookending the page's mascot presence.
 */
export function FinalCTA() {
  return (
    <section
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "clamp(24px, 4vw, 40px) 32px clamp(56px, 8vw, 96px)",
      }}
    >
      <motion.div
        variants={scaleIn}
        {...revealOnce}
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(36px, 5vw, 56px) clamp(28px, 4vw, 56px)",
          borderRadius: cssVar.radius.lg,
          background: `radial-gradient(120% 160% at 50% -20%, ${cssVar.color.honeyGlow} 0%, transparent 55%), ${cssVar.color.bgElevated}`,
          border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 55%, ${cssVar.color.border})`,
          boxShadow: `${cssVar.shadow.lg}, 0 0 60px color-mix(in srgb, ${cssVar.color.honey500} 12%, transparent)`,
        }}
      >
        <FloatingBee
          carry="cube"
          size={66}
          style={{ position: "absolute", bottom: 12, left: 16 }}
          className="mkt-cta-bee"
        />

        <div className="mkt-cta-inner">
          <div>
            <h2
              style={{
                fontSize: "clamp(24px, 3.4vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                color: cssVar.color.textPrimary,
                margin: "0 0 8px",
              }}
            >
              Ready to bring your ideas to life?
            </h2>
            <p
              style={{
                fontSize: 15.5,
                color: cssVar.color.textSecondary,
                margin: 0,
              }}
            >
              Join thousands of teams already collaborating on SketchHive.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowUpRight size={16} />}
              >
                Get Started for Free
              </Button>
            </Link>
            <p
              style={{
                fontSize: 12.5,
                color: cssVar.color.textMuted,
                margin: "12px 0 0",
              }}
            >
              No credit card required
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        .mkt-cta-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }
        .mkt-cta-bee { display: none; }
        @media (min-width: 820px) {
          .mkt-cta-inner {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
          .mkt-cta-bee { display: block; }
        }
      `}</style>
    </section>
  );
}
