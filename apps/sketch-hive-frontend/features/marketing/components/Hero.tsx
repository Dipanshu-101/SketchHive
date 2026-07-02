"use client";

import Link from "next/link";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { Button, BeeMascot, FlightPath } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { WhiteboardMockup } from "./WhiteboardMockup";

const TRUST = [
  "Real-time collaboration",
  "Infinite canvas",
  "Secure & private",
  "Cross-platform",
];

/**
 * Hero — asymmetric split: headline + dual CTA on the left, a live whiteboard
 * mockup on the right, with the bee mascot and dashed flight-paths as ambient
 * brand decoration in the margins (never competing with content, §0). All CTAs
 * route to the existing pages.
 */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(64px, 10vw, 120px) 24px clamp(48px, 7vw, 88px)",
      }}
    >
      {/* ambient decoration */}
      <FlightPath
        animate
        width={220}
        height={120}
        style={{
          position: "absolute",
          top: 40,
          left: -40,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <BeeMascot
        pose="flying"
        float
        size={72}
        style={{
          position: "absolute",
          top: 24,
          right: "6%",
          pointerEvents: "none",
        }}
        className="mkt-hero-bee"
      />

      <div className="mkt-hero-grid">
        {/* ── Left column ── */}
        <div>
          <span
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: cssVar.color.honey400,
              background: cssVar.color.honeyGlow,
              border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 30%, transparent)`,
              padding: "6px 14px",
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            <Sparkles size={13} />
            Collaborate. Creatively. In real-time.
          </span>

          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(40px, 6.4vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: "-0.035em",
              color: cssVar.color.textPrimary,
              margin: "0 0 20px",
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": "60ms",
            }}
          >
            Where teams think
            <br />
            out loud, on{" "}
            <span
              style={{
                color: cssVar.color.honey500,
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              one canvas
            </span>
            .
          </h1>

          <p
            className="animate-fade-in-up"
            style={{
              fontSize: "clamp(15px, 1.4vw, 17px)",
              lineHeight: 1.65,
              color: cssVar.color.textSecondary,
              maxWidth: 480,
              margin: "0 0 32px",
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": "120ms",
            }}
          >
            SketchHive is the real-time whiteboard where teams brainstorm, map
            ideas, and build together — every stroke synced the instant it
            happens.
          </p>

          <div
            className="animate-fade-in-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 36,
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": "180ms",
            }}
          >
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowUpRight size={16} />}
              >
                Start a whiteboard
              </Button>
            </Link>
            <Link href="/rooms" style={{ textDecoration: "none" }}>
              <Button variant="outline" size="lg" leftIcon={<Play size={15} />}>
                Explore rooms
              </Button>
            </Link>
          </div>

          <ul
            className="animate-fade-in-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 20px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": "240ms",
            }}
          >
            {TRUST.map((t) => (
              <li
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  color: cssVar.color.textMuted,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: cssVar.color.honey500,
                    display: "inline-block",
                  }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right column: mockup ── */}
        <div
          className="animate-scale-in"
          style={{
            display: "flex",
            justifyContent: "center",
            // @ts-expect-error CSS custom property for staggered entrance
            "--delay": "220ms",
          }}
        >
          <WhiteboardMockup variant="ideas" />
        </div>
      </div>

      <style>{`
        .mkt-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        .mkt-hero-bee { display: none; }
        @media (min-width: 940px) {
          .mkt-hero-grid {
            grid-template-columns: 1.05fr 1fr;
            gap: 40px;
          }
          .mkt-hero-bee { display: block; }
        }
      `}</style>
    </section>
  );
}
