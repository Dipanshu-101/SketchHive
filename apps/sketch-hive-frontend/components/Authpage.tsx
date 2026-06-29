"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    let W = 0, H = 0, raf = 0;

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
      pulses.current.push({ x: e.clientX, y: e.clientY, t: performance.now() / 1000 });
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now() / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      const { x: mx, y: my, active } = mouse.current;

      if (active && trail.current.length > 1) {
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
   Styled input component
───────────────────────────────────────── */
function GlassInput({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "rgba(180,210,255,0.5)",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: 11,
          fontSize: 14,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${focused ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.12)"}`,
          color: "#fff",
          outline: "none",
          boxShadow: focused
            ? "0 0 0 3px rgba(59,130,246,0.15), 0 1px 0 rgba(255,255,255,0.06) inset"
            : "0 1px 0 rgba(255,255,255,0.04) inset",
          transition: "border-color 0.15s, box-shadow 0.15s",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main AuthPage component
───────────────────────────────────────── */
export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── original logic, untouched ── */
  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/signup", {
        username,
        email,
        password,
      });
      console.log(response.data);
      router.push("/signin");
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/signin", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      router.push("/rooms");
      console.log(response.data);
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        cursor: "none",
        position: "relative",
      }}
    >
      <WaterRippleBg />

      {/* Glass card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
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
          padding: "44px 40px 40px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg,#2563eb,#4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 28px rgba(79,70,229,0.55), 0 1px 0 rgba(255,255,255,0.2) inset",
            }}
          >
            <Pencil size={22} color="#fff" />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            {isSignin ? "Welcome back" : "Create an account"}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(180,200,240,0.5)", lineHeight: 1.6 }}>
            {isSignin
              ? "Sign in to continue to SketchHive."
              : "Start collaborating with your team."}
          </p>
        </div>

        {/* Fields */}
        {!isSignin && (
          <GlassInput
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="John Doe"
          />
        )}
        <GlassInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <GlassInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 9,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 13,
              color: "rgba(252,165,165,0.9)",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          disabled={loading}
          onClick={() => (isSignin ? handleSignin() : handleSignup())}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 11,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            background: loading
              ? "rgba(79,70,229,0.4)"
              : "linear-gradient(135deg,#2563eb,#4f46e5)",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading
              ? "none"
              : "0 0 32px rgba(79,70,229,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
            transition: "box-shadow 0.15s, background 0.15s",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              {isSignin ? "Signing in…" : "Creating account…"}
            </>
          ) : isSignin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 20,
          }}
        />

        {/* Footer link */}
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(180,200,240,0.4)" }}>
          {isSignin ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: "#60a5fa",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(96,165,250,0.3)",
                  paddingBottom: 1,
                  transition: "border-color 0.15s",
                }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/signin"
                style={{
                  color: "#60a5fa",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(96,165,250,0.3)",
                  paddingBottom: 1,
                  transition: "border-color 0.15s",
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(180,200,240,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px rgba(15,20,40,0.95) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}