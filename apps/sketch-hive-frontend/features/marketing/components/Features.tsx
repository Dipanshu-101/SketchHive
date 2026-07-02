"use client";

import {
  Users,
  Infinity as InfinityIcon,
  PenTool,
  ShieldCheck,
  MonitorSmartphone,
} from "lucide-react";
import type { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";
import { SectionHeading } from "./SectionHeading";

interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Users size={20} />,
    title: "Real-time collaboration",
    desc: "See every teammate's strokes the instant they happen — no refresh, no lag, no lost work.",
  },
  {
    icon: <InfinityIcon size={20} />,
    title: "Infinite canvas",
    desc: "Pan and zoom forever. Your ideas never run out of room to grow.",
  },
  {
    icon: <PenTool size={20} />,
    title: "Smart tools",
    desc: "Shapes, arrows, sticky notes, freehand and text — everything a session needs.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Secure & private",
    desc: "Your boards stay yours. Access is scoped to your room and your team.",
  },
  {
    icon: <MonitorSmartphone size={20} />,
    title: "Works everywhere",
    desc: "Jump in from any device and pick up exactly where the hive left off.",
  },
];

/** Hexagon-framed icon — the hive motif, reused across feature tiles. */
function HexIcon({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        color: cssVar.color.honey500,
        background: cssVar.color.honeyGlow,
        border: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 28%, transparent)`,
        // hexagon clip
        clipPath:
          "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
    >
      {children}
    </span>
  );
}

export function Features() {
  return (
    <section
      id="features"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(56px, 8vw, 96px) 24px",
        scrollMarginTop: 88,
      }}
    >
      <SectionHeading
        eyebrow="Why SketchHive"
        title="Everything you need to think together"
        subtitle="A focused toolkit that gets out of the way, so the ideas — not the software — take center stage."
      />

      <div
        className="mkt-feature-grid"
        style={{ marginTop: "clamp(40px, 5vw, 64px)" }}
      >
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            className="hover-lift animate-fade-in-up"
            style={{
              padding: 24,
              borderRadius: cssVar.radius.lg,
              background: cssVar.color.bgElevated,
              border: `1px solid ${cssVar.color.border}`,
              boxShadow: cssVar.shadow.md,
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": `${i * 60}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cssVar.color.honey500;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = cssVar.color.border;
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <HexIcon>{f.icon}</HexIcon>
            </div>
            <h3
              style={{
                fontSize: 16,
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
                fontSize: 14,
                lineHeight: 1.6,
                color: cssVar.color.textSecondary,
                margin: 0,
              }}
            >
              {f.desc}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .mkt-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .mkt-feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1000px) {
          .mkt-feature-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
}
