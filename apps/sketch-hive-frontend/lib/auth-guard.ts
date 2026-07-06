/**
 * auth-guard — the "sign in, then return to where you were" flow (Figma/Notion
 * style invite links).
 *
 * When an unauthenticated user opens a protected page (e.g. a shared canvas
 * link), we remember their intended destination and send them to /signin. After
 * a successful sign-in, we send them back to that destination automatically —
 * they never have to re-enter a room code.
 *
 * The intended path is carried BOTH ways for robustness:
 *   - as a `?returnTo=` query param on /signin (survives a full page load), and
 *   - in sessionStorage (survives even if the param is stripped).
 * `consumeReturnTo` reads whichever is present and clears the stored copy.
 *
 * Security: `returnTo` is constrained to same-origin ABSOLUTE PATHS (must start
 * with a single "/") so it can never be used as an open-redirect to another
 * site or a `javascript:` URL.
 */

/** sessionStorage key holding the path to return to after sign-in. Exported so
 *  the api-client 401 interceptor writes the same key this module reads. */
export const RETURN_TO_KEY = "sketchhive:returnTo";
const SIGNIN_PATH = "/signin";

/** Only allow internal paths like "/canvas/42" — never "//evil.com" or a URL. */
function sanitizeReturnTo(path: string | null | undefined): string | null {
  if (!path) return null;
  // Must be a root-relative path and NOT protocol-relative ("//host").
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

/**
 * Build the /signin URL that will bring the user back to `intended` after login.
 * Pass the current path (e.g. `/canvas/42`) as `intended`.
 */
export function signinHrefWithReturn(intended: string): string {
  const safe = sanitizeReturnTo(intended);
  if (!safe) return SIGNIN_PATH;
  return `${SIGNIN_PATH}?returnTo=${encodeURIComponent(safe)}`;
}

/**
 * Redirect an unauthenticated user to sign-in, remembering where they were
 * headed. `navigate` is the caller's router.replace (so no extra history entry).
 */
export function redirectToSignin(
  intended: string,
  navigate: (href: string) => void,
): void {
  const safe = sanitizeReturnTo(intended);
  if (safe && typeof window !== "undefined") {
    window.sessionStorage.setItem(RETURN_TO_KEY, safe);
  }
  navigate(safe ? signinHrefWithReturnInternal(safe) : SIGNIN_PATH);
}

// Internal variant that trusts an already-sanitized path.
function signinHrefWithReturnInternal(safePath: string): string {
  return `${SIGNIN_PATH}?returnTo=${encodeURIComponent(safePath)}`;
}

/**
 * After a successful sign-in, resolve where to send the user. Prefers the
 * `?returnTo=` query param, falls back to the sessionStorage copy, and clears
 * the stored value. Returns `fallback` (default `/rooms`) when there's no valid
 * intended destination.
 */
export function consumeReturnTo(
  searchParamValue?: string | null,
  fallback = "/rooms",
): string {
  let target = sanitizeReturnTo(searchParamValue);

  if (!target && typeof window !== "undefined") {
    target = sanitizeReturnTo(window.sessionStorage.getItem(RETURN_TO_KEY));
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(RETURN_TO_KEY);
  }

  return target ?? fallback;
}
