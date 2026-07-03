"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { BeeMark } from "@repo/icons";
import { cssVar } from "@repo/ui/tokens";

/**
 * MarketingNav — a sticky, inset "liquid-glass" panel: rounded (card radius),
 * semi-transparent dark, backdrop-blurred, subtle border, floating in from the
 * viewport edges and horizontally centered.
 *
 * FULL STATE (top of page): full width, showing logo (left), the center anchor
 * links, and Log in / Sign up free (right).
 *
 * SHRUNK STATE (scrolled past threshold): the bar contracts to a compact,
 * horizontally-centered PILL — width shrinks to just fit logo + actions; the
 * center links are removed from the layout so the bar visibly narrows (not just
 * a shorter full-width strip). Width is the primary animated change; height and
 * padding also ease down slightly.
 *
 * The links cross-fade out (fast) while the width animates (medium), so content
 * never looks abruptly cut off; scrolling back to top reverses it — width
 * expands first, then links fade back in.
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
        // center the pill; inset from the viewport edges so the panel floats
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <header
        data-shrunk={shrunk}
        className="mkt-nav"
        style={{
          // The bar sizes to its content and is centered by the wrapper. In the
          // full state its max-width lets it span the layout; in the shrunk
          // state the (removed) links let it collapse to a compact pill. The
          // max-width transition is what makes the WIDTH visibly animate.
          width: "100%",
          maxWidth: shrunk ? 440 : 1200,
          borderRadius: cssVar.radius.lg,
          background: `color-mix(in srgb, ${cssVar.color.bgBase} 68%, transparent)`,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          border: `1px solid ${cssVar.color.border}`,
          boxShadow: cssVar.shadow.md,
          padding: shrunk ? "0 18px" : "0 24px",
          transition: `max-width ${cssVar.duration.medium} ${cssVar.ease.out}, padding ${cssVar.duration.medium} ${cssVar.ease.out}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // Full: spread across the bar. Shrunk: sit close together so the
            // pill reads as compact rather than a stretched strip.
            justifyContent: shrunk ? "center" : "space-between",
            gap: shrunk ? 20 : 16,
            // height compaction — animated alongside width
            height: shrunk ? 54 : 72,
            transition: `height ${cssVar.duration.medium} ${cssVar.ease.out}, gap ${cssVar.duration.medium} ${cssVar.ease.out}`,
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
              flexShrink: 0,
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

          {/* Center links — collapse out of the layout when shrunk so the bar
              genuinely narrows. Fade is faster than the width change and, on
              expand, is delayed until the bar has widened (see CSS below) so it
              never looks like content is being clipped. Only rendered as a flex
              row on wide viewports. */}
          <nav
            className="mkt-nav-links"
            style={{
              display: "none",
              gap: 34,
              alignItems: "center",
              overflow: "hidden",
              maxWidth: shrunk ? 0 : 640,
              opacity: shrunk ? 0 : 1,
              pointerEvents: shrunk ? "none" : "auto",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
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
        /* Center links only exist on wider viewports. */
        @media (min-width: 900px) {
          .mkt-nav-links { display: flex !important; }
        }

        /* SHRINKING (scroll down): fade links out FAST and FIRST, then let the
           width/max-width collapse — so the bar narrows into content that has
           already faded, never clipping visible text. */
        .mkt-nav-links {
          transition:
            opacity ${cssVar.duration.base} ${cssVar.ease.out},
            max-width ${cssVar.duration.medium} ${cssVar.ease.out} ${cssVar.duration.fast};
        }

        /* EXPANDING (scroll to top): reverse — widen the bar FIRST, then fade
           the links back in after the width has opened up. */
        .mkt-nav[data-shrunk="false"] .mkt-nav-links {
          transition:
            opacity ${cssVar.duration.base} ${cssVar.ease.out} ${cssVar.duration.medium},
            max-width ${cssVar.duration.medium} ${cssVar.ease.out};
        }

        @media (prefers-reduced-motion: reduce) {
          .mkt-nav, .mkt-nav *, .mkt-nav-links { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
