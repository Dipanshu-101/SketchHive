"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@repo/ui/button";

export function AuthPage({
  isSignin,
}: {
  isSignin: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Pencil className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {isSignin ? "Welcome back" : "Create an account"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {isSignin
              ? "Sign in to continue to SketchHive."
              : "Start collaborating with your team."}
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => {}}
        >
          {isSignin ? "Sign In" : "Create Account"}
        </Button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignin ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}