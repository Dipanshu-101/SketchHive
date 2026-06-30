/**
 * Local-identity helpers.
 *
 * Sender identity is SERVER-AUTHORITATIVE: the ws-backend derives senderId and
 * senderName from the JWT, never from the client. The client still needs to
 * know its OWN userId for one purely-cosmetic reason — deciding which messages
 * align right ("You") vs left. We get that by decoding the JWT payload locally.
 *
 * This is decode-only (no signature verification) and is used solely for
 * presentation; it can never grant trust because the server re-derives identity
 * from the same token on every write.
 */

/** Decodes a JWT payload without verifying its signature. Returns null on any
 *  malformed input. Browser-safe base64url decode. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** The current auth token. Prefers a real logged-in token in localStorage and
 *  falls back to the project's existing dev token used by RoomCanvas, so chat
 *  works in the current pre-auth state without a separate code path. */
export function getAuthToken(): string {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("token");
    if (stored) return stored;
  }
  return DEV_FALLBACK_TOKEN;
}

/** Returns the local user's id from the JWT, or null if it can't be read. */
export function getLocalUserId(): string | null {
  const payload = decodeJwtPayload(getAuthToken());
  const id = payload?.["userId"];
  return typeof id === "string" ? id : null;
}

/**
 * The hardcoded dev token currently embedded in RoomCanvas. Centralized here so
 * there is ONE source of truth; when real auth lands, delete this constant and
 * getAuthToken() keeps working off localStorage.
 */
export const DEV_FALLBACK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNGU4YWU4Zi1jMDgwLTRmYTItYTEyMS0yYjhlNmI5YTY5MmQiLCJpYXQiOjE3ODIwNzg3NTN9.lOdn4sXCz3G5oayPj3sBhRYOJlaVka--BJN4RjdqkNU";
