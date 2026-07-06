/**
 * auth.service — all sign-up / sign-in business logic, independent of Express.
 *
 * Extracted from the previous fat route handlers so controllers stay thin and
 * the rules (uniqueness, credential check, token issuance) live in one testable
 * place. The external contract is unchanged: signup returns the new userId,
 * signin returns a signed JWT with a `{ userId }` payload.
 *
 * NOTE: passwords are compared/stored as-is here — that matches the EXISTING
 * behavior and is intentionally left untouched (hashing is out of scope for
 * this refactor and would be a separate, breaking data change).
 */
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "../prisma";
import { conflict, unauthorized } from "./http-error";

export interface SignupParams {
  email: string;
  password: string;
  username: string;
}

export interface SigninParams {
  email: string;
  password: string;
}

/** Create a new user. Throws 409 if the email is already registered. */
export async function registerUser(params: SignupParams): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) {
    throw conflict("User with this email already exists");
  }

  const user = await prisma.user.create({
    data: {
      email: params.email,
      password: params.password,
      name: params.username,
    },
  });

  return user.id;
}

/** Verify credentials and issue a JWT. Throws 401 on any credential mismatch. */
export async function authenticateUser(params: SigninParams): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  // Same generic message whether the email is unknown or the password is wrong,
  // so we don't leak which accounts exist.
  if (!user || user.password !== params.password) {
    throw unauthorized("Invalid credentials");
  }

  return jwt.sign({ userId: user.id }, JWT_SECRET);
}
