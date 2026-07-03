"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { BeeMark } from "@repo/icons";
import { cssVar } from "@repo/ui/tokens";

/**
 * MarketingNav — a sticky, inset "liquid-glass" panel: rounded (card radius),
 * semi-transparent dark, backdrop-blurred, with a subtle border, floating
 * slightly in from the viewport edge so it reads as a floating bar.
 *
 * On scroll past a threshold it smoothly SHRINKS — reduced height/padding and
 * the center nav links fade/collapse out — leaving only the logo and the
 * Log in / Sign up free actions. Scrolling back to the top restores the full
 * bar. Height/padding are animated (not just opacity) so it visibly compacts.
 *
 * Auth routes are preserved (/signin, /signup); marketing links anchor to
 * in-page sections (with "#" placeholders where a page doesn't exist yet).
 */
const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#collaborate", label: "Use Cases" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
];

const SCROLL_THRESHOLD = 60; // px scrolled before shrinking

export function MarketingNav() {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // sync initial state (e.g. on reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 12,
        zIndex: 60,
        // inset from the viewport edges so the panel floats
        padding: "0 16px",
      }}
    >
      <header
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          // liquid-glass panel
          borderRadius: cssVar.radius.lg,
          background: `color-mix(in srgb, ${cssVar.color.bgBase} 68%, transparent)`,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          border: `1px solid ${cssVar.color.border}`,
          boxShadow: cssVar.shadow.md,
          // animate the compaction (height driven by inner padding)
          transition: `padding ${cssVar.duration.medium} ${cssVar.ease.out}`,
          padding: shrunk ? "0 20px" : "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // height compaction lives here so it animates smoothly
            height: shrunk ? 56 : 72,
            transition: `height ${cssVar.duration.medium} ${cssVar.ease.out}`,
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
                width: shrunk ? 32 : 38,
                height: shrunk ? 32 : 38,
                borderRadius: cssVar.radius.md,
                background: cssVar.color.honey500,
                color: cssVar.color.textOnBrand,
                boxShadow: cssVar.shadow.sm,
                transition: `width ${cssVar.duration.medium} ${cssVar.ease.out}, height ${cssVar.duration.medium} ${cssVar.ease.out}`,
              }}
            >
              <BeeMark size={shrunk ? 19 : 22} />
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

          {/* Center links — hidden entirely in the shrunk state, and only
              shown at all on wider viewports (see media query below). */}
          <nav
            className="mkt-nav-links"
            data-shrunk={shrunk}
            style={{
              display: "none",
              gap: 34,
              alignItems: "center",
              // collapse smoothly when shrinking
              maxWidth: shrunk ? 0 : 640,
              opacity: shrunk ? 0 : 1,
              overflow: "hidden",
              pointerEvents: shrunk ? "none" : "auto",
              transition: `opacity ${cssVar.duration.base} ${cssVar.ease.out}, max-width ${cssVar.duration.medium} ${cssVar.ease.out}`,
            }}
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
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
      </header>

      <style>{`
        @media (min-width: 900px) {
          /* Show links only when NOT shrunk (data-shrunk="false"). */
          .mkt-nav-links[data-shrunk="false"] { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
