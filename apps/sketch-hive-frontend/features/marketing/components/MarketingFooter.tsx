"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { cssVar } from "@repo/ui/tokens";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Collaborate", href: "#collaborate" },
      { label: "Rooms", href: "/rooms" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/signin" },
      { label: "Sign up", href: "/signup" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${cssVar.color.border}`,
        background: cssVar.color.bgBase,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "48px 24px 32px",
        }}
      >
        <div className="mkt-footer-grid">
          {/* brand */}
          <div style={{ maxWidth: 280 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot/logo.svg"
                alt="SketchHive"
                width={80}
                height={80}
                draggable={false}
                style={{ display: "block", width: 80, height: 80 }}
              />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: cssVar.color.textPrimary,
                }}
              >
                SketchHive
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: cssVar.color.textMuted,
                margin: 0,
              }}
            >
              The real-time whiteboard where teams think out loud, together.
            </p>
          </div>

          {/* link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: cssVar.color.textMuted,
                  margin: "0 0 14px",
                }}
              >
                {col.heading}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{
                        fontSize: 14,
                        color: cssVar.color.textSecondary,
                        textDecoration: "none",
                        transition: `color ${cssVar.duration.base}`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = cssVar.color.textPrimary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          cssVar.color.textSecondary)
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: `1px solid ${cssVar.color.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: cssVar.color.textMuted, margin: 0 }}>
            © {new Date().getFullYear()} SketchHive. Built with Next.js,
            WebSockets &amp; Prisma.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{
              color: cssVar.color.textMuted,
              display: "inline-flex",
              transition: `color ${cssVar.duration.base}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = cssVar.color.textPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = cssVar.color.textMuted)
            }
          >
            <Code2 size={18} />
          </a>
        </div>
      </div>

      <style>{`
        .mkt-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 640px) {
          .mkt-footer-grid { grid-template-columns: 2fr 1fr 1fr; gap: 48px; }
        }
      `}</style>
    </footer>
  );
}
