"use client";

import { Quote } from "lucide-react";
import { Avatar } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { SectionHeading } from "./SectionHeading";

const TESTIMONIALS = [
  {
    quote:
      "SketchHive completely changed how our team brainstorms. It's fast, beautiful, and everyone actually enjoys using it.",
    name: "Sarah Johnson",
    role: "Product Manager, TechNova",
  },
  {
    quote:
      "The real-time collaboration is seamless. It genuinely feels like we're all in the same room, even when we're not.",
    name: "Rohit Sharma",
    role: "Design Lead, Creatify",
  },
  {
    quote:
      "Finally, a whiteboard that's simple yet powerful. It's become our go-to for every new project kickoff.",
    name: "Emily Davis",
    role: "CTO, BuildSphere",
  },
];

/** Testimonials — three quote cards in a responsive grid (design-system Avatar). */
export function Testimonials() {
  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(56px, 8vw, 96px) 24px",
      }}
    >
      <SectionHeading eyebrow="Loved by teams" title="What our users say" />

      <div
        className="mkt-testimonial-grid"
        style={{ marginTop: "clamp(40px, 5vw, 64px)" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            className="hover-lift animate-fade-in-up"
            style={{
              margin: 0,
              padding: 24,
              borderRadius: cssVar.radius.lg,
              background: cssVar.color.bgElevated,
              border: `1px solid ${cssVar.color.border}`,
              boxShadow: cssVar.shadow.md,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              // @ts-expect-error CSS custom property for staggered entrance
              "--delay": `${i * 70}ms`,
            }}
          >
            <Quote size={22} color={cssVar.color.honey500} />
            <blockquote
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.6,
                color: cssVar.color.textPrimary,
                flex: 1,
              }}
            >
              {t.quote}
            </blockquote>
            <figcaption
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <Avatar name={t.name} size="md" />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: cssVar.color.textPrimary,
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: cssVar.color.textMuted }}>
                  {t.role}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <style>{`
        .mkt-testimonial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 760px) {
          .mkt-testimonial-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
}
