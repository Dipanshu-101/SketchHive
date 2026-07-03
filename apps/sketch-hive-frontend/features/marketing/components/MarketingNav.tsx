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

// Hysteresis thresholds: shrink once scrolled DOWN past SHRINK_AT, but only
// expand again once scrolled back UP past EXPAND_AT. The 40px dead zone between
// them stops the state flip-flopping when the scroll position jitters near the
// boundary — which happens because the nav is `position: sticky` in flow, so
// its own height change on shrink/expand nudges scrollY back across a single
// threshold and re-triggers the opposite state (a feedback loop).
const SHRINK_AT = 80; // scrolling down: shrink past here
const EXPAND_AT = 40; // scrolling up: expand only once back above here

// Full-state max width; the shrunk state is exactly 70% of this (see below).
const FULL_WIDTH = 1200;

export function MarketingNav() {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    let raf = 0;

    const evaluate = () => {
      raf = 0;
      const y = window.scrollY;
      // Functional update + hysteresis: only flip when clearly past the far
      // edge of the dead zone; inside [EXPAND_AT, SHRINK_AT] the state holds.
      setShrunk((prev) => {
        if (!prev && y > SHRINK_AT) return true;
        if (prev && y < EXPAND_AT) return false;
        return prev;
      });
    };

    const onScroll = () => {
      // Batch reads to a single rAF so rapid scroll events near the threshold
      // don't each trigger a state re-check.
      if (raf === 0) raf = requestAnimationFrame(evaluate);
    };

    evaluate(); // sync initial state (e.g. on reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
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
          // The bar is `width: 100%` capped by max-width and centered by the
          // wrapper. Full state spans the layout (FULL_WIDTH); shrunk state is
          // exactly 70% of that full width (NOT shrink-wrapped to content) — any
          // extra room over what the logo + buttons need distributes as space
          // within the bar. The max-width transition animates the WIDTH.
          width: "100%",
          maxWidth: shrunk ? FULL_WIDTH * 0.7 : FULL_WIDTH,
          borderRadius: cssVar.radius.lg,
          background: `color-mix(in srgb, ${cssVar.color.bgBase} 68%, transparent)`,
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
          border: `1px solid ${cssVar.color.border}`,
          boxShadow: cssVar.shadow.md,
          // Same horizontal padding in both states so the logo's left inset and
          // the actions' right inset match the original (full) bar exactly.
          padding: "0 24px",
          // Protect the rounded-pill shape if content ever exceeds the shrunk
          // max-width (e.g. localized labels). `clip` + a clip-margin keeps the
          // pill contained WITHOUT clipping the buttons' focus-ring / soft
          // shadow bleed (a plain `overflow: hidden` would eat the focus ring).
          overflow: "clip",
          overflowClipMargin: "10px",
          transition: `max-width ${cssVar.duration.medium} ${cssVar.ease.out}, padding ${cssVar.duration.medium} ${cssVar.ease.out}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // space-between in BOTH states: logo pinned to the left inner edge,
            // actions to the right inner edge — the extra room sits between them,
            // so the edge spacing matches the original (full) bar exactly.
            justifyContent: "space-between",
            // Zero gap when shrunk so the collapsed (zero-width) links element
            // contributes no gap footprint; space-between handles the spacing.
            gap: shrunk ? 0 : 16,
            // height compaction — animated alongside width. Scaled to ~80% of
            // the previous heights (72→58, 54→44) while preserving the
            // full-to-shrunk ratio.
            height: shrunk ? 44 : 58,
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
                width: shrunk ? 26 : 30,
                height: shrunk ? 26 : 30,
                borderRadius: cssVar.radius.md,
                background: cssVar.color.honey500,
                color: cssVar.color.textOnBrand,
                boxShadow: cssVar.shadow.sm,
                transition: `width ${cssVar.duration.medium} ${cssVar.ease.out}, height ${cssVar.duration.medium} ${cssVar.ease.out}`,
              }}
            >
              <BeeMark size={shrunk ? 15 : 18} />
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

        /* SHRINKING (scroll down): fade links out FIRST (over duration.base),
           and only start collapsing max-width AFTER that fade completes (delay
           = duration.base) — so the bar narrows into content that has already
           fully faded, never clipping visible text. */
        .mkt-nav-links {
          transition:
            opacity ${cssVar.duration.base} ${cssVar.ease.out},
            max-width ${cssVar.duration.medium} ${cssVar.ease.out} ${cssVar.duration.base};
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
