"use client";

import { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";

/**
 * AuthLayout — reusable split-screen shell for every auth surface (sign-in,
 * sign-up, and future forgot-password / verify-email / invite-accept). §0/§6.
 *
 * Wide screens: branded illustration panel (~48%) beside the form column
 * (~52%), both full-height and vertically centered. Narrow screens: the
 * illustration collapses out (form-first) and the form column keeps the same
 * near-black honey background so the page never reads as bare. The proportions,
 * breakpoint, and dark surface mirror the landing page's split layouts so the
 * transition from Landing → Sign Up → Sign In feels seamless.
 */
export function AuthLayout({
  children,
  illustration,
}: {
  children: ReactNode;
  /** Optional brand/illustration panel shown beside the form on wide screens. */
  illustration?: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        color: cssVar.color.textPrimary,
        background: cssVar.color.bgBase,
      }}
    >
      {illustration && (
        <aside
          // Illustration side is hidden on narrow viewports (form-first).
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
          padding: "clamp(24px, 5vw, 56px) 20px",
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
