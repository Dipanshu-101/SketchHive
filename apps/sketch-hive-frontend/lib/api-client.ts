/**
 * api-client — the single axios instance for all HTTP calls (§9).
 *
 * This is the ONLY place base URL + auth-header wiring lives. Services import
 * `api` from here; components and hooks never call axios directly. If the
 * backend contract or host changes, it changes here — the backend itself is
 * untouched.
 */

import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import { RETURN_TO_KEY } from "./auth-guard";

export const api = axios.create({
  baseURL: HTTP_BACKEND_URL,
});

/** Auth endpoints must NOT trigger the 401-redirect (a failed sign-in is a
 *  normal, in-page error — not a session expiry). */
const AUTH_PATHS = ["/signin", "/signup"];

/**
 * Whether a request URL targets an auth endpoint. Matches the FULL request path
 * exactly, so a nested route whose last segment is "signin"/"signup" (e.g.
 * GET /rooms/code/signin) is NOT mistaken for the top-level sign-in call.
 * Services call `api.post("/signin", …)`, so `config.url` is exactly "/signin".
 */
function isAuthEndpoint(url: string): boolean {
  const path = url.split(/[?#]/)[0] ?? "";
  return AUTH_PATHS.includes(path);
}

/** Read the persisted auth token (browser-only). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/** Persist / clear the auth token. */
export function setToken(token: string): void {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function clearToken(): void {
  if (typeof window !== "undefined") localStorage.removeItem("token");
}

// Attach the auth token to every request. Matches the existing backend
// contract, which expects the raw token in the `Authorization` header.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = token;
  return config;
});

/**
 * Global 401 handling — an expired/invalid session on ANY protected call sends
 * the user to sign-in, remembering where they were so they return afterward
 * (§2, §4). The failed token is cleared so the app doesn't keep re-sending it.
 *
 * Excluded: the sign-in/sign-up calls themselves, whose 401 means "wrong
 * credentials" and must surface in-page. The redirect is a hard navigation
 * (`window.location`) because interceptors run outside React and have no router;
 * a hard nav is the safe, universal way to bounce to sign-in.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = isAuthEndpoint(url);

    if (status === 401 && !isAuthCall && typeof window !== "undefined") {
      clearToken();
      const current = window.location.pathname + window.location.search;
      // Root-relative, same-origin path only (guards against open-redirect).
      const safe =
        current.startsWith("/") && !current.startsWith("//") ? current : "";
      const alreadyOnSignin = window.location.pathname.startsWith("/signin");
      if (!alreadyOnSignin) {
        window.sessionStorage.setItem(RETURN_TO_KEY, safe);
        window.location.assign(
          safe ? `/signin?returnTo=${encodeURIComponent(safe)}` : "/signin",
        );
      }
    }
    return Promise.reject(error);
  },
);
