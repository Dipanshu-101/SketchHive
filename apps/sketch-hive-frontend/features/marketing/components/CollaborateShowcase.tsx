"use client";

import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { Button, AvatarGroup } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { WhiteboardMockup } from "./WhiteboardMockup";

const POINTS = [
  "Invite your whole team with a single link",
  "Work together live — cursors show who's where",
  "Never lose an idea; every board autosaves",
  "Chat alongside the canvas without switching apps",
];

const TEAM = [
  { name: "Maya Chen" },
  { name: "Arjun Rao" },
  { name: "Lena Ford" },
  { name: "Tom Ire" },
  { name: "Sara Kim" },
];

/**
 * CollaborateShowcase — reversed asymmetric section (mockup left, copy right)
 * that tells the "built for teams" story. Reuses <WhiteboardMockup> and the
 * design-system <AvatarGroup> (§6 reuse).
 */
export function CollaborateShowcase() {
  return (
    <section
      id="collaborate"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(56px, 8vw, 96px) 24px",
        scrollMarginTop: 88,
      }}
    >
      <div className="mkt-showcase-grid">
        <div
          className="mkt-showcase-visual"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <WhiteboardMockup title="Project Roadmap" variant="roadmap" />
        </div>

        <div>
          <span
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
            Collaborate better
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 3.6vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: cssVar.color.textPrimary,
              margin: "0 0 16px",
            }}
          >
            Built for teams that
            <br />
            create together
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: cssVar.color.textSecondary,
              margin: "0 0 24px",
              maxWidth: 460,
            }}
          >
            From the first sticky note to the final handoff, SketchHive keeps
            everyone aligned and moving in the same direction.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 28px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {POINTS.map((p) => (
              <li
                key={p}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 15,
                  color: cssVar.color.textPrimary,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    marginTop: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: cssVar.color.honeyGlow,
                    color: cssVar.color.honey500,
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div
            style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
          >
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button variant="primary" rightIcon={<ArrowUpRight size={16} />}>
                Create your team board
              </Button>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AvatarGroup users={TEAM} size="sm" max={4} />
              <span style={{ fontSize: 13, color: cssVar.color.textMuted }}>
                joined this week
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mkt-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        @media (min-width: 940px) {
          .mkt-showcase-grid { grid-template-columns: 1fr 1fr; gap: 56px; }
        }
      `}</style>
    </section>
  );
}
