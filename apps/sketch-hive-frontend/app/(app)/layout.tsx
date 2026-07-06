import { ReactNode } from "react";

/**
 * (app) route-group layout — the seam for the shared <AppShell> chrome (sidebar
 * + topbar) that should wrap Rooms / Settings / Profile exactly once (§0/§6).
 *
 * Phase 1 keeps this a pass-through ON PURPOSE:
 *  - the Canvas route is full-bleed and must NOT get a sidebar/topbar;
 *  - the current Rooms page centers its own panel and isn't being redesigned yet.
 *
 * When Rooms/Settings/Profile are redesigned (later phase), opt them into the
 * shell — either here (if canvas moves to its own group) or per-page via:
 *
 *   import { AppShell, Sidebar, Topbar } from "@/components/AppShell";
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
