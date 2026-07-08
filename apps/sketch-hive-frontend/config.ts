/**
 * Public runtime configuration for the frontend.
 *
 * These are the ONLY two backend endpoints the client talks to:
 *   - HTTP_BACKEND_URL -> Express HTTP backend  (auth, rooms, chat history)
 *   - WS_BACKEND_URL   -> WebSocket backend      (live drawing + chat)
 *
 * Both are sourced from `NEXT_PUBLIC_*` environment variables so the same build
 * can point at localhost in development and at the deployed Railway services in
 * production. `NEXT_PUBLIC_` is required for the value to be inlined into the
 * client bundle by Next.js — these are public URLs, never secrets.
 *
 * In production (Vercel) both variables MUST be set to the HTTPS/WSS URLs of the
 * Railway services. The localhost fallbacks exist only so `next dev` works with
 * zero configuration.
 */
export const HTTP_BACKEND_URL =
  process.env.NEXT_PUBLIC_HTTP_URL ?? "http://localhost:3001";

export const WS_BACKEND_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";
