"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell, GlassPanel, Input, Button } from "@repo/ui";
import { signin, signup } from "@/features/auth/services/auth.service";

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
    <PageShell>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Glass card */}
        <GlassPanel style={{ width: "100%", maxWidth: 420, padding: "44px 40px 40px" }}>
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
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="John Doe"
          />
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Input
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
        <Button
          variant="primary"
          size="lg"
          loading={loading}
          onClick={() => (isSignin ? handleSignin() : handleSignup())}
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
        </GlassPanel>

        <style>{`* { box-sizing: border-box; }`}</style>
      </div>
    </PageShell>
  );
}