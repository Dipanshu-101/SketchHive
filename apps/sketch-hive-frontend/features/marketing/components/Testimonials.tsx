"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { SectionHeading } from "./SectionHeading";
import { FloatingBee } from "./FloatingBee";
import { fadeUp, staggerParent, revealOnce } from "../motion";

const TESTIMONIALS = [
  {
    quote:
      "SketchHive has completely changed the way our team brainstorms. It's fast, beautiful, and super easy to use!",
    name: "Sarah Johnson",
    role: "Product Manager at TechNova",
    tint: cssVar.color.cursorA,
  },
  {
    quote:
      "The real-time collaboration is seamless. It feels like we're all in the same room, even when we're not.",
    name: "Rohit Sharma",
    role: "Design Lead at Creatify",
    tint: cssVar.color.success,
  },
  {
    quote:
      "Finally, a whiteboard tool that's simple yet powerful. Our go-to for every project!",
    name: "Emily Davis",
    role: "CTO at BuildSphere",
    tint: cssVar.color.danger,
  },
];

/**
 * Testimonials — three premium quote cards flanked by circular ‹ › nav arrows,
 * matching the reference. Colored quote icons per card. The arrows are
 * functional on narrow screens (they shift a scroll offset); on wide screens
 * all three cards show at once, as in the reference.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const prev = () =>
    setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  return (
    <section
      style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 7vw, 88px) 32px",
      }}
    >
      {/* left-side bee near the heading — already faces inward, no mirror needed */}
      <FloatingBee
        variant="notes"
        size={72}
        delay={0.4}
        showPath={false}
        style={{ position: "absolute", top: 34, left: 16, zIndex: 2 }}
        className="mkt-testimonials-bee"
      />

      <SectionHeading eyebrow="Loved by Teams" title="What our users say" />

      <div
        style={{
          position: "relative",
          marginTop: "clamp(36px, 4vw, 56px)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ArrowButton dir="left" onClick={prev} />

        <motion.div
          className="mkt-testimonial-track"
          variants={staggerParent(0.08)}
          {...revealOnce}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="mkt-testimonial-card"
              data-active={i === active}
              style={{
                margin: 0,
                padding: 24,
                borderRadius: cssVar.radius.lg,
                background: cssVar.color.bgElevated,
                border: `1px solid ${cssVar.color.border}`,
                boxShadow: cssVar.shadow.md,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Quote size={24} color={t.tint} />
              <blockquote
                style={{
                  margin: 0,
                  fontSize: 14.5,
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
            </motion.figure>
          ))}
        </motion.div>

        <ArrowButton dir="right" onClick={next} />
      </div>

      <style>{`
        .mkt-testimonials-bee { display: none; }
        .mkt-testimonial-track {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        /* Narrow: show only the active card (carousel). */
        @media (max-width: 759px) {
          .mkt-testimonial-card { display: none; }
          .mkt-testimonial-card[data-active="true"] { display: flex; }
        }
        @media (min-width: 760px) {
          .mkt-testimonial-track { grid-template-columns: repeat(3, 1fr); }
          .mkt-testimonials-bee { display: block; }
        }
      `}</style>
    </section>
  );
}

function ArrowButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Previous testimonial" : "Next testimonial"}
      onClick={onClick}
      className="mkt-testimonial-arrow"
      style={{
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: "50%",
        cursor: "pointer",
        color: cssVar.color.textSecondary,
        background: cssVar.color.bgElevated,
        border: `1px solid ${cssVar.color.border}`,
        transition: `all ${cssVar.duration.base}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = cssVar.color.textPrimary;
        e.currentTarget.style.borderColor = cssVar.color.honey500;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = cssVar.color.textSecondary;
        e.currentTarget.style.borderColor = cssVar.color.border;
      }}
    >
      {dir === "left" ? (
        <ChevronLeft size={20} />
      ) : (
        <ChevronRight size={20} />
      )}
    </button>
  );
}
