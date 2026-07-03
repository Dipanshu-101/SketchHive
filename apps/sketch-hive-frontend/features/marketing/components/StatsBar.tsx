"use client";

import { motion } from "framer-motion";
import { cssVar } from "@repo/ui/tokens";
import { fadeUp, staggerParent, revealOnce } from "../motion";

const STATS = [
  { value: "10K+", label: "Active Teams" },
  { value: "50K+", label: "Boards Created" },
  { value: "200K+", label: "Collaborators" },
  { value: "99.9%", label: "Uptime" },
];

/**
 * StatsBar — a bordered, rounded band of four headline metrics with vertical
 * separators between them, matching the reference. Honey numbers, muted labels.
 */
export function StatsBar() {
  return (
    <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
      <motion.div
        variants={staggerParent(0.08)}
        {...revealOnce}
        className="mkt-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          padding: "clamp(28px, 4vw, 40px) clamp(16px, 3vw, 32px)",
          borderRadius: cssVar.radius.lg,
          background: cssVar.color.bgElevated,
          border: `1px solid ${cssVar.color.border}`,
          boxShadow: cssVar.shadow.md,
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            style={{
              textAlign: "center",
              padding: "8px 12px",
              // vertical separators between columns (not before the first)
              borderLeft:
                i % 2 !== 0
                  ? `1px solid ${cssVar.color.border}`
                  : "none",
            }}
            className={`mkt-stat mkt-stat-${i}`}
          >
            <div
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: cssVar.color.honey500,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: cssVar.color.textSecondary,
                marginTop: 6,
              }}
            >
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (min-width: 760px) {
          .mkt-stats { grid-template-columns: repeat(4, 1fr) !important; }
          /* On 4-up, every column except the first gets a separator. */
          .mkt-stat { border-left: 1px solid ${cssVar.color.border} !important; }
          .mkt-stat-0 { border-left: none !important; }
        }
      `}</style>
    </section>
  );
}
