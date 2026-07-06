"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { Input, Button, FlightPath } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { FloatingBee } from "@/features/marketing/components";
import { signin, signup } from "@/features/auth/services/auth.service";

/* ─────────────────────────────────────────
   AuthPage — premium single-card auth surface (Phase 2.2).

   An almost-black empty page (from the layout) with one solid dark card as the
   sole focal point, flanked by exactly two gently-orbiting bees (top-left,
   bottom-right) reused from the landing page. All visual richness lives inside
   the card; the auth logic — state, handlers, network calls, payloads,
   redirects, error/loading — is preserved exactly.
───────────────────────────────────────── */
export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Behavior unchanged — network calls route through auth.service (§9). */
  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      await signup({ username, email, password });
      router.push("/signin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      await signin({ email, password }); // persists the token internally
      router.push("/rooms");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Single submit path — same handlers/payloads as before; the <form> wrapper
  // only adds Enter-to-submit.
  const submit = () => (isSignin ? handleSignin() : handleSignup());

  return (
    <motion.div
      // Card entrance: fade + rise + gentle scale, on a soft spring.
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
      style={{ position: "relative", width: "100%", maxWidth: 440 }}
    >
      {/* ── A single bee at the card's bottom-right, orbiting subtly. Reuses the
          landing FloatingBee (idle float + rotate + dashed trail) with an outer
          slow motion loop. pointer-events:none + high z-index so it paints over
          the card without ever intercepting form interaction. Hidden on small
          screens where there's no room beside the card.
          Bee art faces RIGHT by default (see landing Hero); flipped here so it
          faces left/inward toward the card center. The taller signup card sits
          lower, so lift the bee a touch there to keep it inside the frame. ── */}
      <FlankBee
        variant="lens"
        size={78}
        corner="bottom-right"
        delay={1.1}
        loopDuration={16}
        flip
        liftBy={isSignin ? 0 : 15}
        reduce={reduce ?? false}
        className="auth-bee auth-bee-br"
      />

      {/* ── The card ── */}
      <motion.div
        whileHover={reduce ? undefined : { y: -3 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          background: cssVar.color.bgElevated,
          border: `1px solid ${cssVar.color.border}`,
          borderRadius: 20,
          boxShadow: cssVar.shadow.lg,
          padding: "32px 36px 26px",
        }}
      >
        {/* Brand mark — the SketchHive logo (self-colored, no tile) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot/logo.svg"
            alt="SketchHive"
            width={80}
            height={80}
            style={{ display: "block", width: 80, height: 80 }}
            draggable={false}
          />
        </div>

        {/* Title only — no marketing copy */}
        <h1
          style={{
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textAlign: "center",
            color: cssVar.color.textPrimary,
            margin: "0 0 22px",
          }}
        >
          {isSignin ? "Sign In" : "Create Account"}
        </h1>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) submit();
          }}
        >
          {!isSignin && (
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="johndoe"
              name="username"
              autoComplete="username"
              leftIcon={<User size={17} />}
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            name="email"
            autoComplete="email"
            leftIcon={<Mail size={17} />}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            name="password"
            autoComplete={isSignin ? "current-password" : "new-password"}
            leftIcon={<Lock size={17} />}
            revealToggle
          />

          {/* Error — animated in */}
          {error && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              role="alert"
              style={{
                marginBottom: 18,
                padding: "10px 14px",
                borderRadius: cssVar.radius.md,
                background: `color-mix(in srgb, ${cssVar.color.danger} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${cssVar.color.danger} 30%, transparent)`,
                fontSize: 13,
                color: cssVar.color.danger,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Primary CTA */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginBottom: 20 }}
          >
            {loading
              ? isSignin
                ? "Signing in…"
                : "Creating account…"
              : isSignin
                ? "Sign In"
                : "Create Account"}
          </Button>
        </form>

        {/* Elegant divider */}
        <div
          style={{
            borderTop: `1px solid ${cssVar.color.border}`,
            marginBottom: 16,
          }}
        />

        {/* Footer switch link */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13.5,
            color: cssVar.color.textMuted,
            margin: 0,
          }}
        >
          {isSignin ? (
            <>
              Don&apos;t have an account?{" "}
              <AuthLink href="/signup">Sign Up</AuthLink>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <AuthLink href="/signin">Sign In</AuthLink>
            </>
          )}
        </p>
      </motion.div>

      <style>{`
        .auth-bee { display: none; }
        @media (min-width: 560px) {
          .auth-bee { display: block; }
        }
      `}</style>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FlankBee — a landing FloatingBee anchored to a card corner, with an extra
   slow orbit loop so it drifts gently around that corner (distinct timing per
   bee). Purely decorative; pointer-events are off via FloatingBee itself.
───────────────────────────────────────── */
function FlankBee({
  variant,
  size,
  corner,
  delay,
  loopDuration,
  flip,
  liftBy = 0,
  reduce,
  className,
}: {
  variant: string;
  size: number;
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay: number;
  loopDuration: number;
  flip?: boolean;
  /** Extra px pulled toward the vertical center (raises a bottom bee, lowers a
   *  top bee) — used to keep the bee in frame on taller cards like signup. */
  liftBy?: number;
  reduce: boolean;
  className?: string;
}) {
  // Position the wrapper just outside the card's corner so the bee hovers
  // beside the card, never over the fields. `liftBy` nudges it inward from
  // whichever vertical edge it's anchored to.
  const vEdge = -size * 0.55 + liftBy;
  const pos: Record<typeof corner, React.CSSProperties> = {
    "top-left": { top: vEdge, left: -size * 0.5 },
    "top-right": { top: vEdge, right: -size * 0.5 },
    "bottom-left": { bottom: vEdge, left: -size * 0.5 },
    "bottom-right": { bottom: vEdge, right: -size * 0.5 },
  };

  // Small looping path — a gentle rounded drift, alternating sense so bees
  // never move identically.
  const orbit =
    corner === "top-left" || corner === "bottom-right"
      ? { x: [0, 10, 4, -6, 0], y: [0, -6, 4, -2, 0] }
      : { x: [0, -8, -3, 7, 0], y: [0, 5, -4, 2, 0] };

  // The dashed flight path sits at the BOTTOM of the bee, at a low z-index so it
  // renders BEHIND the card (card is z-index 1 in this stacking context) but
  // ABOVE the page background. It's a static sibling of the animated bee, so the
  // bee flies over its own trail. Mirror it with the bee when flipped.
  const isRight = corner === "top-right" || corner === "bottom-right";
  const vSide = corner.startsWith("top") ? "top" : "bottom";
  // Offset the trail down toward the bee's foot: from the bee's anchored edge,
  // push it ~55% of the bee height further into the card.
  const pathVOffset = vEdge + size * 0.55;

  return (
    <>
      {/* Flight path — behind the card, above the background, at the bee's foot */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          [vSide]: pathVOffset,
          [isRight ? "right" : "left"]: -size * 0.5,
          zIndex: 0,
          pointerEvents: "none",
          transform: flip ? "scaleX(-1)" : undefined,
          transformOrigin: "center",
          opacity: 0.5,
        }}
      >
        <FlightPath width={size * 1.7} height={size * 0.6} strokeWidth={2} />
      </div>

      {/* Bee — on top of the card; no built-in trail (we render our own above) */}
      <motion.div
        aria-hidden="true"
        className={className}
        // High z-index so the bee paints ON TOP of the card; pointerEvents stays
        // off so it never intercepts clicks/typing on the form beneath it.
        style={{ position: "absolute", ...pos[corner], zIndex: 50, pointerEvents: "none" }}
        animate={reduce ? undefined : orbit}
        transition={
          reduce
            ? undefined
            : { duration: loopDuration, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        <FloatingBee
          variant={variant}
          size={size}
          delay={delay}
          flip={flip}
          showPath={false}
        />
      </motion.div>
    </>
  );
}

/* Honey-accented switch link with a hover underline transition. */
function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: cssVar.color.honey500,
        fontWeight: 600,
        textDecoration: "none",
        borderBottom: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 35%, transparent)`,
        paddingBottom: 1,
        transition: `border-color ${cssVar.duration.base}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottomColor = cssVar.color.honey400;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottomColor = `color-mix(in srgb, ${cssVar.color.honey500} 35%, transparent)`;
      }}
    >
      {children}
    </Link>
  );
}
