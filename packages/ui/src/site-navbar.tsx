"use client";

import { ReactNode } from "react";
import { token, cssVar } from "./tokens";

/* Inline pencil glyph so the package stays dependency-free */
function PencilGlyph({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Sticky top navigation bar — floating glass surface (§5)
───────────────────────────────────────── */
export function SiteNavbar({
  links,
  actions,
}: {
  links?: { href: string; label: string }[];
  actions?: ReactNode;
}) {
  return (
    <header
      style={{
        background: `color-mix(in srgb, ${cssVar.color.bgOverlay} 85%, transparent)`,
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        border: `1px solid ${cssVar.color.borderHover}`,
        borderRadius: token.radius.xl,
        boxShadow: cssVar.shadow.md,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: token.radius.md,
              background: cssVar.color.honey500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: cssVar.shadow.sm,
            }}
          >
            <PencilGlyph size={16} color={cssVar.color.textOnBrand} />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: cssVar.color.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            SketchHive
          </span>
        </a>

        {/* Centre links */}
        {links && links.length > 0 && (
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: cssVar.color.textSecondary,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* Right actions slot */}
        {actions && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
