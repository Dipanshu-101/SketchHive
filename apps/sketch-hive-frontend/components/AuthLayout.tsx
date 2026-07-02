"use client";

import { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";

/**
 * AuthLayout — reusable split-screen shell for every auth surface (sign-in,
 * sign-up, and future forgot-password / verify-email / invite-accept). §0/§6.
 *
 * Phase 1 establishes the SHELL only; it does not redesign the auth pages. The
 * `illustration` side is optional and, when omitted, the layout collapses to a
 * simple centered column — which is exactly how the current pages render (they
 * already center their own GlassPanel). So dropping this around the existing
 * pages is a no-op visually until an illustration is supplied.
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
      }}
    >
      {illustration && (
        <aside
          style={{
            flex: "1 1 50%",
            display: "none",
            position: "relative",
            overflow: "hidden",
            borderRight: `1px solid ${cssVar.color.border}`,
          }}
          // Illustration side is hidden on narrow viewports (form-first).
          className="auth-illustration"
        >
          {illustration}
        </aside>
      )}
      <main
        style={{
          flex: "1 1 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
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
