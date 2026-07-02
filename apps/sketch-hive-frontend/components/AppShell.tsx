"use client";

import { ReactNode } from "react";
import { cssVar } from "@repo/ui/tokens";

/**
 * AppShell — the sidebar + topbar chrome that wraps the authenticated app
 * (Rooms, Settings, Profile). §0 identifies the Rooms/Starred/Recent/Templates/
 * Settings nav as an app-shell concern that should exist ONCE, not be redrawn
 * per page.
 *
 * Phase 1 provides this as reusable infrastructure but does NOT auto-apply it —
 * the (app) route-group layout stays a pass-through so the full-bleed canvas and
 * the existing centered rooms page are untouched. Later phases opt individual
 * pages into <AppShell> as they're redesigned.
 */

export interface SidebarNavItemData {
  href: string;
  label: string;
  icon?: ReactNode;
}

export function SidebarNavItem({
  item,
  active = false,
}: {
  item: SidebarNavItemData;
  active?: boolean;
}) {
  return (
    <a
      href={item.href}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: cssVar.radius.md,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        color: active ? cssVar.color.textPrimary : cssVar.color.textSecondary,
        background: active ? cssVar.color.bgElevated : "transparent",
      }}
    >
      {item.icon}
      {item.label}
    </a>
  );
}

export function Sidebar({
  items,
  activeHref,
  footer,
}: {
  items: SidebarNavItemData[];
  activeHref?: string;
  footer?: ReactNode;
}) {
  return (
    <nav
      style={{
        width: 240,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: 12,
        // Flat surface — sidebar sits in static layout (§5).
        background: cssVar.color.bgBase,
        borderRight: `1px solid ${cssVar.color.border}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={activeHref === item.href}
          />
        ))}
      </div>
      {footer && <div>{footer}</div>}
    </nav>
  );
}

export function Topbar({ children }: { children?: ReactNode }) {
  return (
    <header
      style={{
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        // Flat surface with a hairline — part of the static app frame.
        background: cssVar.color.bgBase,
        borderBottom: `1px solid ${cssVar.color.border}`,
      }}
    >
      {children}
    </header>
  );
}

export function AppShell({
  children,
  sidebar,
  topbar,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
  topbar?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebar}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {topbar}
        <main style={{ flex: 1, minHeight: 0 }}>{children}</main>
      </div>
    </div>
  );
}
