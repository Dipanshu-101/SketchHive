"use client";

import { cssVar } from "@repo/ui/tokens";

const STATS = [
  { value: "10K+", label: "Active teams" },
  { value: "50K+", label: "Boards created" },
  { value: "200K+", label: "Collaborators" },
  { value: "99.9%", label: "Uptime" },
];

/** StatsBar — a single elevated band of four headline metrics. */
export function StatsBar() {
  return (
    <section
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
          padding: "clamp(28px, 4vw, 40px)",
          borderRadius: cssVar.radius.xl,
          background: cssVar.color.bgElevated,
          border: `1px solid ${cssVar.color.border}`,
          boxShadow: cssVar.shadow.md,
        }}
        className="mkt-stats-grid"
      >
        {STATS.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: cssVar.color.honey500,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: cssVar.color.textSecondary,
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 760px) {
          .mkt-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
