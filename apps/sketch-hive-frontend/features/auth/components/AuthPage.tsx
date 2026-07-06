"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { BeeMark } from "@repo/icons";
import { GlassPanel, Input, Button } from "@repo/ui";
import { cssVar } from "@repo/ui/tokens";
import { signin, signup } from "@/features/auth/services/auth.service";

/* ─────────────────────────────────────────
   Main AuthPage component

   Presentation-only redesign (Phase 2.2): the card now adopts the landing
   page's honey/dark design system and lives inside the (auth) split-screen
   shell. All auth logic — state, handlers, network calls, payload shapes,
   redirects, error/loading handling — is preserved exactly.
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

  // Single submit path — routes through the exact same handlers/payloads as the
  // original click handler; the <form> wrapper only adds Enter-to-submit.
  const submit = () => (isSignin ? handleSignin() : handleSignup());

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: "100%", maxWidth: 440 }}
    >
      <GlassPanel style={{ padding: "44px 40px 40px" }}>
        {/* Brand lockup — honey tile + BeeMark, matching the nav/footer/landing */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: cssVar.radius.md,
              background: cssVar.color.honey500,
              color: cssVar.color.textOnBrand,
              boxShadow: cssVar.shadow.sm,
            }}
          >
            <BeeMark size={26} />
          </span>
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: cssVar.color.textPrimary,
            }}
          >
            SketchHive
          </span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: cssVar.color.textPrimary,
              margin: "0 0 8px",
            }}
          >
            {isSignin ? "Welcome back" : "Create an account"}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: cssVar.color.textSecondary,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {isSignin
              ? "Sign in to continue to SketchHive."
              : "Start collaborating with your team."}
          </p>
        </div>

        {/* Fields */}
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
              placeholder="John Doe"
              name="username"
              autoComplete="username"
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
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            name="password"
            autoComplete={isSignin ? "current-password" : "new-password"}
            revealToggle
          />

          {/* Error */}
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

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: "100%", marginBottom: 24 }}
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

        {/* Divider */}
        <div
          style={{
            borderTop: `1px solid ${cssVar.color.border}`,
            marginBottom: 20,
          }}
        />

        {/* Footer link */}
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
              <Link href="/signup" style={authLinkStyle}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/signin" style={authLinkStyle}>
                Sign in
              </Link>
            </>
          )}
        </p>
      </GlassPanel>
    </motion.div>
  );
}

/* Honey-accented secondary link — matches the landing's link language. */
const authLinkStyle: React.CSSProperties = {
  color: cssVar.color.honey500,
  fontWeight: 600,
  textDecoration: "none",
  borderBottom: `1px solid color-mix(in srgb, ${cssVar.color.honey500} 35%, transparent)`,
  paddingBottom: 1,
  transition: `border-color ${cssVar.duration.base}`,
};
