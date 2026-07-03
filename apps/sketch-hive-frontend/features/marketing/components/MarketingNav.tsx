"use client";

import Link from "next/link";
import { Button } from "@repo/ui";
import { BeeMark } from "@repo/icons";
import { cssVar } from "@repo/ui/tokens";

/**
 * MarketingNav — matches the reference: bee-hexagon logo + wordmark, five
 * centered nav links, and a "Log in" + "Sign up free" pair on the right.
 * Static (not scroll-reactive) to match the reference's calm framed header.
 * Auth routes are preserved (/signin, /signup); marketing-only links (How It
 * Works / Use Cases / Pricing / Docs) anchor to in-page sections that exist,
 * falling back to "#" placeholders where a page doesn't exist yet.
 */
const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#collaborate", label: "Use Cases" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
];

export function MarketingNav() {
  return (
    <header
      style={{
        position: "relative",
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: cssVar.radius.md,
              background: cssVar.color.honey500,
              color: cssVar.color.textOnBrand,
              boxShadow: cssVar.shadow.sm,
            }}
          >
            <BeeMark size={22} />
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: cssVar.color.textPrimary,
            }}
          >
            SketchHive
          </span>
        </Link>

        {/* Center links */}
        <nav
          className="mkt-nav-links"
          style={{ display: "none", gap: 34, alignItems: "center" }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: cssVar.color.textSecondary,
                textDecoration: "none",
                transition: `color ${cssVar.duration.base}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = cssVar.color.textPrimary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = cssVar.color.textSecondary)
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/signin" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">
              Sign up free
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .mkt-nav-links { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
