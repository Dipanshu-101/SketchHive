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

export const api = axios.create({
  baseURL: HTTP_BACKEND_URL,
});

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
