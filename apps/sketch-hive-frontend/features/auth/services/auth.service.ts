/**
 * auth.service — the only layer that knows the auth endpoint shapes (§9).
 *
 * Extracted verbatim from the inline axios calls previously in Authpage.tsx.
 * The backend contract is unchanged: POST /signup { username, email, password }
 * and POST /signin { email, password } returning { token }.
 */

import { api, setToken } from "@/lib/api-client";

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: string;
}

/** Register a new account. */
export async function signup(input: SignupInput): Promise<void> {
  await api.post("/signup", input);
}

/** Sign in and persist the returned token. Returns the token. */
export async function signin(input: SigninInput): Promise<string> {
  const res = await api.post<SigninResponse>("/signin", input);
  setToken(res.data.token);
  return res.data.token;
}
