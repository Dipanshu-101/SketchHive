"use client";

import {
  PageShell,
  SiteNavbar,
  GlassPanel,
  Button,
  Card,
  CardIcon,
} from "@repo/ui";
import {
  Pencil,
  Users2,
  Share2,
  Download,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function App() {
  return (
    <PageShell>
      <div
        style={{
          color: "#fff",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >

        {/* ── Navbar ── */}
        <SiteNavbar
          actions={
            <>
              <Link href="/signin" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          }
        />

        {/* ── Hero ── */}
        <section
          style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
          }}
        >
          {/* Glass panel */}
          <GlassPanel
            style={{
              width: "min(600px, 100%)",
              padding: "52px 48px 48px",
              textAlign: "center",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(140,200,255,0.85)",
                border: "1px solid rgba(100,180,255,0.25)",
                background: "rgba(0,100,255,0.1)",
                padding: "5px 16px",
                borderRadius: 20,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  boxShadow: "0 0 6px #3b82f6",
                  display: "inline-block",
                }}
              />
              Collaborative Whiteboard
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              Draw ideas,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(110deg,#38bdf8 0%,#3b82f6 50%,#818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                together.
              </span>
            </h1>

            {/* Sub */}
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(190,210,240,0.6)",
                maxWidth: 420,
                margin: "0 auto 36px",
              }}
            >
              SketchHive is a collaborative whiteboard where teams brainstorm,
              design diagrams, and work together in real time.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
                marginBottom: 36,
              }}
            >
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={15} />}
                >
                  Start Drawing
                </Button>
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<BookOpen size={15} />}
                >
                  GitHub
                </Button>
              </a>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 28,
              }}
            />

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
              }}
            >
              {[
                { val: "12k+", lbl: "Teams" },
                { val: "98%", lbl: "Uptime" },
                { val: "4.9★", lbl: "Rating" },
              ].map(({ val, lbl }) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(180,200,230,0.4)",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {lbl}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: "0 24px 100px", maxWidth: 1120, margin: "0 auto" }}>
          {/* Section label */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(100,160,255,0.7)",
                marginBottom: 14,
              }}
            >
              <Zap size={12} />
              Everything you need
            </div>
            <h2
              style={{
                fontSize: "clamp(24px,4vw,36px)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.025em",
              }}
            >
              Built for how teams actually work
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: <Share2 size={18} />,
                title: "Realtime Sync",
                desc: "Everyone sees updates instantly — no refresh, no lag, no missed strokes.",
              },
              {
                icon: <Users2 size={18} />,
                title: "Multiplayer",
                desc: "Invite your whole team. Collaborate live with cursors showing who's where.",
              },
              {
                icon: <Pencil size={18} />,
                title: "Infinite Canvas",
                desc: "Pan, zoom, and keep drawing without hitting a wall. Space is unlimited.",
              },
              {
                icon: <Download size={18} />,
                title: "Export",
                desc: "Download your board as a crisp PNG or vector SVG in one click.",
              },
            ].map(({ icon, title, desc }) => (
              <Card key={title} variant="glass" style={{ cursor: "default" }}>
                <div style={{ marginBottom: 18 }}>
                  <CardIcon>{icon}</CardIcon>
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(180,200,230,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "28px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "rgba(180,200,230,0.35)",
                letterSpacing: "0.01em",
              }}
            >
              © {new Date().getFullYear()} SketchHive. Built with Next.js,
              WebSockets &amp; Prisma.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(180,200,230,0.35)",
                  transition: "color 0.15s",
                  display: "flex",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(180,200,230,0.35)")
                }
              >
                <BookOpen size={17} />
              </a>

              {[
                { href: "/signin", label: "Sign In" },
                { href: "/signup", label: "Sign Up" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: 13,
                    color: "rgba(180,200,230,0.35)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(180,200,230,0.35)")
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}