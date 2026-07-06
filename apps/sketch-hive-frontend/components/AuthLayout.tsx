"use client";

import { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";

/**
 * AuthLayout — the shared shell for every auth surface (sign-in, sign-up, and
 * future forgot-password / verify-email / invite-accept). §0/§6.
 *
 * A single premium auth card centered on an almost-black page. The page around
 * the card stays intentionally empty — all visual richness lives inside the card
 * (see AuthPage), and the only decoration outside it are the two bees the card
 * anchors to its own corners. `bgBase` (#0a0a0f) is the landing page's base
 * surface, so the auth page reads as the same near-black world.
 *
 * The optional `illustration` slot is retained for API compatibility but is no
 * longer used by the (auth) layout; when omitted the layout is a plain centered
 * column.
 */
export function AuthLayout({
  children,
  illustration,
}: {
  children: ReactNode;
  /** Optional side panel; unused by the current centered-card design. */
  illustration?: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        color: cssVar.color.textPrimary,
        background: cssVar.color.bgBase,
        // Clip the decorative bees that hover just outside the card's corners so
        // their overflow can never introduce a scrollbar.
        overflow: "hidden",
      }}
    >
      {illustration && (
        <aside
          className="auth-illustration"
          style={{
            flex: "1 1 48%",
            display: "none",
            position: "relative",
            overflow: "hidden",
            borderRight: `1px solid ${cssVar.color.border}`,
          }}
        >
          {illustration}
        </aside>
      )}
      <main
        style={{
          flex: illustration ? "1 1 52%" : "1 1 100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(16px, 3vh, 40px) 20px",
          position: "relative",
        }}
      >
        {children}
      </main>
      <style>{`
        @media (min-width: 900px) {
          .auth-illustration { display: block !important; }
        }
      `}</style>
    </div>
  );
}
