import { ReactNode } from "react";

/**
 * (auth) route-group layout — the seam for the shared <AuthLayout> shell (§0/§6:
 * sign-in, sign-up, and future forgot-password / verify-email / invite-accept
 * all share one shell).
 *
 * Phase 1 keeps this a pass-through: the existing auth pages render their own
 * centered PageShell + GlassPanel, so wrapping them in AuthLayout here would
 * double up the centering. When the auth pages are redesigned (later phase),
 * move the split-screen chrome into this layout via:
 *
 *   import { AuthLayout } from "@/components/AuthLayout";
 *   return <AuthLayout illustration={<AuthIllustration />}>{children}</AuthLayout>;
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
