import { ReactNode } from "react";
import { AuthLayout } from "@/components/AuthLayout";

/**
 * (auth) route-group layout — the shared <AuthLayout> shell (§0/§6: sign-in,
 * sign-up, and future forgot-password / verify-email / invite-accept all share
 * one shell).
 *
 * Centers a single premium auth card on an almost-black page. All richness lives
 * inside the card; the page around it stays empty apart from the two bees the
 * card anchors to its corners.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
