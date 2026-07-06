import { ReactNode } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthIllustration } from "@/features/auth/components/AuthIllustration";

/**
 * (auth) route-group layout — the shared <AuthLayout> shell (§0/§6: sign-in,
 * sign-up, and future forgot-password / verify-email / invite-accept all share
 * one shell).
 *
 * Provides the split-screen chrome: the branded honey illustration panel on
 * wide screens beside the centered form column. The auth pages themselves render
 * only the form card — the surrounding shell + background live here so every
 * auth surface is visually consistent and matches the landing page.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout illustration={<AuthIllustration />}>{children}</AuthLayout>;
}
