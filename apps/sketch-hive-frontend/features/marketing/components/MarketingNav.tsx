"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { BeeMark } from "@repo/icons";
import { cssVar } from "@repo/ui/tokens";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why SketchHive" },
  { href: "#collaborate", label: "Collaborate" },
];

/**
 * MarketingNav — sticky landing navbar (logo + centered links + dual CTA).
 * Preserves all existing navigation: /signin and /signup routes are unchanged.
 * Turns from transparent to a glass surface once the user scrolls, so the hero
 * reads clean at the top.
 */
export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: `background ${cssVar.duration.base}, border-color ${cssVar.duration.base}, backdrop-filter ${cssVar.duration.base}`,
        background: scrolled
          ? `color-mix(in srgb, ${cssVar.color.bgBase} 72%, transparent)`
          : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: `1px solid ${scrolled ? cssVar.color.border : "transparent"}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
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
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: cssVar.color.textPrimary,
            }}
          >
            SketchHive
          </span>
        </Link>

        {/* Centre links — hidden on narrow screens */}
        <nav className="mkt-nav-links" style={{ display: "none", gap: 32 }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 14,
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/signin" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
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
        @media (min-width: 860px) {
          .mkt-nav-links { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
