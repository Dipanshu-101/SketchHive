/**
 * Shared backend configuration.
 *
 * JWT_SECRET signs tokens in the HTTP backend and verifies them in both the HTTP
 * and WebSocket backends, so the SAME value must be configured on every backend
 * service (Railway env var `JWT_SECRET`). It is a secret and must never be
 * hardcoded or shipped to the client.
 *
 * In development we fall back to a well-known value so `pnpm dev` works with zero
 * setup, but in production (`NODE_ENV=production`) a real secret is REQUIRED and
 * startup fails fast if it is missing — a missing/weak signing key is a security
 * hole, not a warning.
 */
const DEV_FALLBACK_SECRET = "dev-only-insecure-secret";

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret && secret.length > 0) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production. " +
        "Set it (identically) on every backend service before starting."
    );
  }

  console.warn(
    "[backend-common] JWT_SECRET not set — using an insecure development fallback. " +
      "Set JWT_SECRET before deploying to production."
  );
  return DEV_FALLBACK_SECRET;
}

export const JWT_SECRET: string = resolveJwtSecret();
