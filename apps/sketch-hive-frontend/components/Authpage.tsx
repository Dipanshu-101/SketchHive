"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export function AuthPage({
  isSignin,
}: {
  isSignin: boolean;
}) {
const router = useRouter();
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSignup = async () => {
try {
    const response = await axios.post(
      "http://localhost:3001/signup",
      {
        username,
        email,
        password,
      }
    );

    console.log(response.data);
    router.push("/signin")
  } catch (error: any) {
    console.log(error.response?.data);
}
};

const handleSignin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3001/signin",
      {
        email,
        password,
      }
    );
    localStorage.setItem("token", response.data.token);
     router.push("/rooms");
    console.log(response.data);
  } catch (error: any) {
    console.log(error.response?.data);
  }
};


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

            {/* Username */}
            {!isSignin && (
            <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-foreground">
            Username
            </label>

            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            </div>
            )}

        {/* Email */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        

        {/* Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => {
                if (isSignin) {
                  handleSignin();
                } else {
                  handleSignup();
                }
              }}
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