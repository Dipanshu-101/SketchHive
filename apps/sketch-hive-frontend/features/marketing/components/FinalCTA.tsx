"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, BeeMascot, FlightPath } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";

/**
 * FinalCTA — full-width honey-bordered band, the last strong nudge before the
 * footer. The bee sits inside the band so the mascot bookends the page (it
 * opened the hero, it closes the CTA — "part of the experience").
 */
export function FinalCTA() {
  return (
    <section
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "clamp(24px, 4vw, 40px) 24px clamp(56px, 8vw, 88px)",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          padding: "clamp(40px, 6vw, 72px) 24px",
          borderRadius: cssVar.radius.xl,
          background: `radial-gradient(120% 140% at 50% 0%, ${cssVar.color.honeyGlow} 0%, transparent 60%), ${cssVar.color.bgElevated}`,
          border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 40%, ${cssVar.color.border})`,
          boxShadow: cssVar.shadow.lg,
        }}
      >
        <FlightPath
          width={200}
          height={90}
          style={{
            position: "absolute",
            top: 16,
            left: -30,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <BeeMascot
          pose="waving"
          float
          size={64}
          style={{
            position: "absolute",
            top: 18,
            right: "8%",
            pointerEvents: "none",
          }}
          className="mkt-cta-bee"
        />

        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: cssVar.color.textPrimary,
            margin: "0 0 12px",
          }}
        >
          Ready to bring your ideas to life?
        </h2>
        <p
          style={{
            fontSize: 16,
            color: cssVar.color.textSecondary,
            margin: "0 0 28px",
          }}
        >
          Join thousands of teams already collaborating on SketchHive.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowUpRight size={16} />}
            >
              Get started for free
            </Button>
          </Link>
        </div>
        <p style={{ fontSize: 13, color: cssVar.color.textMuted, marginTop: 16 }}>
          No credit card required.
        </p>
      </div>

      <style>{`
        .mkt-cta-bee { display: none; }
        @media (min-width: 720px) { .mkt-cta-bee { display: block; } }
      `}</style>
    </section>
  );
}
