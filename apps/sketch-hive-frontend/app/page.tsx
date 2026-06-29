"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
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
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   Water-ripple canvas background
───────────────────────────────────────── */
function WaterRippleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999, active: false });
  const trail = useRef<{ x: number; y: number; t: number }[]>([]);
  const pulses = useRef<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0,
      raf = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
      trail.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (trail.current.length > 90) trail.current.shift();
    };
    const onLeave = () => {
      mouse.current.active = false;
      trail.current = [];
    };
    const onClick = (e: MouseEvent) => {
      pulses.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now() / 1000,
      });
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now() / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      const { x: mx, y: my, active } = mouse.current;

      if (active && trail.current.length > 1) {
        // Glow blobs
        for (let i = 1; i < trail.current.length; i++) {
          const q = trail.current[i];
          const age = (performance.now() - q.t) / 1000;
          const alpha = Math.max(0, 1 - age / 0.55);
          const t = i / trail.current.length;
          const r = 8 + t * 22;
          const grd = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 4);
          grd.addColorStop(0, `rgba(0,140,255,${alpha * 0.6})`);
          grd.addColorStop(0.4, `rgba(0,70,200,${alpha * 0.2})`);
          grd.addColorStop(1, "rgba(0,10,60,0)");
          ctx.beginPath();
          ctx.arc(q.x, q.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
        // Bright core dots
        for (let i = 1; i < trail.current.length; i++) {
          const q = trail.current[i];
          const age = (performance.now() - q.t) / 1000;
          const alpha = Math.max(0, 1 - age / 0.3);
          const t = i / trail.current.length;
          const wob = Math.sin(now * 5 + i * 0.35) * 2.5;
          ctx.beginPath();
          ctx.arc(q.x + wob, q.y + wob * 0.5, 1.5 + t * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(130,210,255,${alpha * 0.95})`;
          ctx.fill();
        }
        // Cursor rings
        for (let r = 0; r < 3; r++) {
          const ph = now * 2.8 + r * ((Math.PI * 2) / 3);
          const rad = 16 + Math.sin(ph) * 7 + r * 11;
          const a = 0.1 + Math.sin(ph + r) * 0.07;
          ctx.beginPath();
          ctx.arc(mx, my, rad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(60,170,255,${a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Click pulses
      for (const p of pulses.current) {
        const age = now - p.t;
        if (age > 1.8) continue;
        const maxR = Math.min(W, H) * 0.45;
        for (let w = 0; w < 4; w++) {
          const wf = Math.max(0, age / 1.8 - 0.07 * w);
          const rr = wf * maxR;
          const a = Math.max(0, (1 - wf) * (0.28 - w * 0.06));
          ctx.beginPath();
          ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,140,255,${a})`;
          ctx.lineWidth = 1.5 - w * 0.3;
          ctx.stroke();
        }
        if (age < 0.3) {
          const fl = 1 - age / 0.3;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 70 * fl);
          grd.addColorStop(0, `rgba(0,180,255,${fl * 0.35})`);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, W, H);
        }
      }
      pulses.current = pulses.current.filter((p) => now - p.t < 1.8);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(document.body);
    resize();
    draw();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   Feature card — glassmorphism variant
───────────────────────────────────────── */
function GlassFeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "16px",
        padding: "28px 24px",
        boxShadow:
          "0 2px 0 0 rgba(255,255,255,0.10) inset, 0 12px 40px rgba(0,0,0,0.5)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(59,130,246,0.45)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 0 0 rgba(255,255,255,0.10) inset, 0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(59,130,246,0.15)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.14)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 0 0 rgba(255,255,255,0.10) inset, 0 12px 40px rgba(0,0,0,0.5)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          color: "#60a5fa",
        }}
      >
        {icon}
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
      <p style={{ fontSize: 13, color: "rgba(180,200,230,0.55)", lineHeight: 1.65 }}>
        {desc}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        cursor: "none",
        position: "relative",
      }}
    >
      {/* Canvas background */}
      <WaterRippleBg />

      {/* Everything above canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Navbar ── */}
        <header
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:'2px solid rgba(255,255,255,0.22)',
            borderRadius:         '22px',
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
            <Link
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
                  borderRadius: 9,
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(79,70,229,0.5)",
                }}
              >
                <Pencil size={16} color="#fff" />
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                SketchHive
              </span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/signin" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 500,
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(210,225,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(79,70,229,0.4)",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </header>

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
          <div
            style={{
              width: "min(600px, 100%)",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04),
                0 2px 0 0 rgba(255,255,255,0.18) inset,
                0 -1px 0 0 rgba(255,255,255,0.06) inset,
                0 32px 80px rgba(0,0,0,0.8),
                0 4px 20px rgba(0,0,0,0.5)
              `,
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
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    borderRadius: 11,
                    fontSize: 15,
                    fontWeight: 600,
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                    boxShadow:
                      "0 0 32px rgba(79,70,229,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
                  }}
                >
                  Start Drawing
                  <ArrowRight size={15} />
                </button>
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    borderRadius: 11,
                    fontSize: 15,
                    fontWeight: 500,
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(210,225,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    cursor: "pointer",
                  }}
                >
                  <BookOpen size={15} />
                  GitHub
                </button>
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
          </div>
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
            <GlassFeatureCard
              icon={<Share2 size={18} />}
              title="Realtime Sync"
              desc="Everyone sees updates instantly — no refresh, no lag, no missed strokes."
            />
            <GlassFeatureCard
              icon={<Users2 size={18} />}
              title="Multiplayer"
              desc="Invite your whole team. Collaborate live with cursors showing who's where."
            />
            <GlassFeatureCard
              icon={<Pencil size={18} />}
              title="Infinite Canvas"
              desc="Pan, zoom, and keep drawing without hitting a wall. Space is unlimited."
            />
            <GlassFeatureCard
              icon={<Download size={18} />}
              title="Export"
              desc="Download your board as a crisp PNG or vector SVG in one click."
            />
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
    </div>
  );
}