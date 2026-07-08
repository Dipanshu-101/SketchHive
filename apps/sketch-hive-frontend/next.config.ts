import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared workspace packages export raw TypeScript/TSX source (see their
  // package.json "exports"), so Next.js must transpile them as part of the app
  // build rather than treating them as pre-compiled node_modules. Listing them
  // explicitly makes the monorepo build deterministic on Vercel.
  transpilePackages: ["@repo/ui", "@repo/chat-ui", "@repo/icons"],
};

export default nextConfig;
