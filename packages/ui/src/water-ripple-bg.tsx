"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   Water-ripple canvas background
───────────────────────────────────────── */
export function WaterRippleBg() {
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
          const q = trail.current[i]!;
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
          const q = trail.current[i]!;
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
